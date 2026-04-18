import { useMemo, useState } from "react";
import { useLeaderDetails, type LeaderDetail } from "../services/leaderDetails";
import type { ReportRowFilter } from "../utils/report";

type Scope =
  | { kind: "row"; label: string; filter: ReportRowFilter; context?: string }
  | { kind: "directorate"; label: string; filters: ReportRowFilter[] };

type StatusFilter = "all" | "present" | "absent" | "confirmed";

const STATUS_LABEL: Record<StatusFilter, string> = {
  all: "All",
  present: "Present",
  absent: "Absent",
  confirmed: "Confirmed",
};

type SortKey =
  | "name"
  | "phone"
  | "department"
  | "role"
  | "gender"
  | "confirmed"
  | "present"
  | "markedat";

type SortDir = "asc" | "desc";

const SORT_COLUMNS: Array<{
  key: SortKey;
  label: string;
  align: "left" | "center";
}> = [
  { key: "name", label: "Name", align: "left" },
  { key: "phone", label: "Phone", align: "left" },
  { key: "department", label: "Department", align: "left" },
  { key: "role", label: "Role", align: "left" },
  { key: "gender", label: "Gender", align: "left" },
  { key: "confirmed", label: "Confirmed", align: "center" },
  { key: "present", label: "Present", align: "center" },
  { key: "markedat", label: "Marked at", align: "left" },
];

const getSortValue = (r: LeaderDetail, key: SortKey): string | number => {
  switch (key) {
    case "name":
      return `${r.lastname || ""} ${r.firstname || ""}`.trim().toLowerCase();
    case "phone":
      return (r.phonenumber || "").toLowerCase();
    case "department":
      return (r.department || "").toLowerCase();
    case "role":
      return (r.workerrole || "").toLowerCase();
    case "gender":
      return (r.gender || "").toLowerCase();
    case "confirmed":
      return r.isconfirmed ? 1 : 0;
    case "present":
      return r.ispresent ? 1 : 0;
    case "markedat":
      return r.updatedat ? new Date(r.updatedat).getTime() : 0;
  }
};

const compare = (a: string | number, b: string | number): number => {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
};

const SortArrow = ({
  active,
  dir,
}: {
  active: boolean;
  dir: SortDir;
}) => {
  if (!active) {
    return (
      <span aria-hidden="true" className="ml-1 text-gray-400">
        ⇅
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="ml-1 text-gray-800">
      {dir === "asc" ? "▲" : "▼"}
    </span>
  );
};

const TeamDetails = ({
  scope,
  onClose,
}: {
  scope: Scope;
  onClose: () => void;
}) => {
  const filters = scope.kind === "row" ? [scope.filter] : scope.filters;
  const { data, isLoading, isError, error } = useLeaderDetails(filters);

  const [department, setDepartment] = useState<string>("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const departmentOptions = useMemo(() => {
    if (!data) return [] as string[];
    const set = new Set<string>();
    for (const r of data) {
      if (r.department) set.add(r.department);
    }
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [] as LeaderDetail[];
    const rows = data.filter((r) => {
      if (department && r.department !== department) return false;
      if (status === "present" && r.ispresent !== true) return false;
      if (status === "absent" && r.ispresent === true) return false;
      if (status === "confirmed" && r.isconfirmed !== true) return false;
      if (search) {
        const needle = search.toLowerCase();
        const hay = `${r.firstname || ""} ${r.lastname || ""} ${r.phonenumber || ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    const dirMultiplier = sortDir === "asc" ? 1 : -1;
    return [...rows].sort(
      (a, b) =>
        compare(getSortValue(a, sortKey), getSortValue(b, sortKey)) *
        dirMultiplier
    );
  }, [data, department, status, search, sortKey, sortDir]);

  const counts = useMemo(() => {
    if (!data) return { total: 0, present: 0, absent: 0, confirmed: 0 };
    let present = 0;
    let confirmed = 0;
    for (const r of data) {
      if (r.ispresent === true) present++;
      if (r.isconfirmed === true) confirmed++;
    }
    return {
      total: data.length,
      present,
      absent: data.length - present,
      confirmed,
    };
  }, [data]);

  const formatTime = (iso: string | null) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            onClick={onClose}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to report
          </button>
          <h2 className="mt-1 text-xl font-bold text-gray-900">
            {scope.label}
          </h2>
          {scope.kind === "row" && scope.context && (
            <p className="text-sm text-gray-600">{scope.context}</p>
          )}
        </div>

        <div className="flex gap-2 text-xs">
          <div className="rounded bg-amber-100 px-2 py-1 font-semibold">
            Total {counts.total}
          </div>
          <div className="rounded bg-green-100 px-2 py-1 font-semibold">
            Present {counts.present}
          </div>
          <div className="rounded bg-red-100 px-2 py-1 font-semibold">
            Absent {counts.absent}
          </div>
          <div className="rounded bg-blue-100 px-2 py-1 font-semibold">
            Confirmed {counts.confirmed}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">All departments</option>
            {departmentOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            {(Object.keys(STATUS_LABEL) as StatusFilter[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Search</label>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or phone"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-200 bg-white">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-amber-50">
            <tr>
              {SORT_COLUMNS.map((col) => {
                const isActive = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={
                      isActive
                        ? sortDir === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    className={`border border-gray-300 px-3 py-2 select-none ${
                      col.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={`inline-flex items-center ${
                        col.align === "center" ? "justify-center" : ""
                      } w-full font-semibold text-gray-800 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded`}
                    >
                      {col.label}
                      <SortArrow active={isActive} dir={sortDir} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={SORT_COLUMNS.length}
                  className="border border-gray-300 px-3 py-4 text-center text-gray-500"
                >
                  Loading…
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={SORT_COLUMNS.length}
                  className="border border-gray-300 px-3 py-4 text-center text-red-600"
                >
                  Could not load workers
                  {error instanceof Error ? `: ${error.message}` : ""}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={SORT_COLUMNS.length}
                  className="border border-gray-300 px-3 py-4 text-center text-gray-500"
                >
                  No workers match the filters
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={String(r.id)} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 font-medium text-gray-900">
                    {r.firstname} {r.lastname}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700">
                    {r.phonenumber || "—"}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700">
                    {r.department || "—"}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700">
                    {r.workerrole || "—"}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700">
                    {r.gender || "—"}
                  </td>
                  <td
                    className={`border border-gray-300 px-3 py-2 text-center ${
                      r.isconfirmed ? "bg-blue-100" : "text-gray-400"
                    }`}
                  >
                    {r.isconfirmed ? "✓" : "—"}
                  </td>
                  <td
                    className={`border border-gray-300 px-3 py-2 text-center ${
                      r.ispresent ? "bg-green-100" : "bg-red-50 text-gray-500"
                    }`}
                  >
                    {r.ispresent ? "✓" : "—"}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-500">
                    {r.ispresent ? formatTime(r.updatedat) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Showing {filtered.length} of {data?.length ?? 0} workers. Tap any
        column header to sort; tap again to reverse.
      </p>
    </div>
  );
};

export default TeamDetails;

import { useMemo, useState } from "react";
import { useLeaderDetails } from "../services/leaderDetails";
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

const TeamDetails = ({
  scope,
  onClose,
}: {
  scope: Scope;
  onClose: () => void;
}) => {
  const filters =
    scope.kind === "row" ? [scope.filter] : scope.filters;
  const { data, isLoading, isError, error } = useLeaderDetails(filters);

  const [department, setDepartment] = useState<string>("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const departmentOptions = useMemo(() => {
    if (!data) return [] as string[];
    const set = new Set<string>();
    for (const r of data) {
      if (r.department) set.add(r.department);
    }
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((r) => {
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
  }, [data, department, status, search]);

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
              <th className="border border-gray-300 px-3 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Phone</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Department</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Role</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Gender</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Confirmed</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Present</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Marked at</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={8} className="border border-gray-300 px-3 py-4 text-center text-red-600">
                  Could not load workers
                  {error instanceof Error ? `: ${error.message}` : ""}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="border border-gray-300 px-3 py-4 text-center text-gray-500">
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
        Showing {filtered.length} of {data?.length ?? 0} workers.
      </p>
    </div>
  );
};

export default TeamDetails;

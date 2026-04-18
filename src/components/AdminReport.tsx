import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReportData } from "../services/report";
import { useMeetingTitle } from "../services/settings";
import type {
  DirectorateReport,
  ReportRowFilter,
} from "../utils/report";
import TeamDetails from "./TeamDetails";

type Selection =
  | {
      kind: "row";
      label: string;
      filter: ReportRowFilter;
      context?: string;
    }
  | { kind: "directorate"; label: string; filters: ReportRowFilter[] };

const formatPercent = (value: number) =>
  `${value.toFixed(2).replace(/\.00$/, ".00")}%`;

const Cell = ({
  children,
  className = "",
  colSpan,
  onClick,
  title,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
  onClick?: () => void;
  title?: string;
}) => (
  <td
    colSpan={colSpan}
    onClick={onClick}
    title={title}
    className={`border border-gray-300 px-3 py-2 text-sm text-gray-900 ${
      onClick ? "cursor-pointer hover:bg-opacity-80" : ""
    } ${className}`}
  >
    {children}
  </td>
);

const HeadCell = ({
  children,
  className = "",
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
}) => (
  <th
    colSpan={colSpan}
    className={`border border-gray-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-800 ${className}`}
  >
    {children}
  </th>
);

const DirectorateRows = ({
  directorate,
  onSelectDirectorate,
  onSelectRow,
}: {
  directorate: DirectorateReport;
  onSelectDirectorate: (dir: DirectorateReport) => void;
  onSelectRow: (dir: DirectorateReport, rowIdx: number) => void;
}) => {
  const rowCount = directorate.rows.length;
  return (
    <>
      {directorate.rows.map((row, idx) => (
        <tr key={`${directorate.label}-${row.label}`}>
          {idx === 0 && (
            <td
              rowSpan={rowCount}
              onClick={() => onSelectDirectorate(directorate)}
              title={`View all ${directorate.label} workers`}
              className={`border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 align-middle text-center cursor-pointer hover:brightness-110 ${directorate.colorClass}`}
            >
              {directorate.label}
            </td>
          )}
          <Cell
            className="font-medium text-blue-700 underline decoration-dotted"
            onClick={() => onSelectRow(directorate, idx)}
            title={`View ${row.label} workers`}
          >
            {row.label}
          </Cell>
          <Cell className="bg-amber-50 text-center font-semibold">
            {row.strength}
          </Cell>
          <Cell className="bg-blue-50 text-center font-semibold">
            {row.confirmed}
          </Cell>
          <Cell className="bg-blue-50 text-center">
            {row.confirmed ? formatPercent(row.percentConfirmedPresent) : "—"}
          </Cell>
          <Cell className="bg-green-100 text-center font-semibold">
            {row.present}
          </Cell>
          <Cell className="bg-green-100 text-center">
            {formatPercent(row.percentPresent)}
          </Cell>
          <Cell className="bg-red-100 text-center">{row.absent}</Cell>
        </tr>
      ))}
    </>
  );
};

const AdminReport = () => {
  const navigate = useNavigate();
  const { title } = useMeetingTitle();
  const { data, isLoading, isError, error, refetch, isFetching } =
    useReportData();
  const [selection, setSelection] = useState<Selection | null>(null);

  const selectDirectorate = (dir: DirectorateReport) => {
    setSelection({
      kind: "directorate",
      label: dir.label,
      filters: dir.rows.map((r) => r.row.filter),
    });
  };

  const selectRow = (dir: DirectorateReport, rowIdx: number) => {
    const row = dir.rows[rowIdx];
    setSelection({
      kind: "row",
      label: row.label,
      filter: row.row.filter,
      context: dir.label,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to attendance
          </button>
          {!selection && (
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              aria-disabled={isFetching}
              className={`rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isFetching
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isFetching ? "Refreshing…" : "Refresh"}
            </button>
          )}
        </div>

        {selection ? (
          <TeamDetails scope={selection} onClose={() => setSelection(null)} />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-200 bg-white">
              <table className="min-w-full border-collapse">
                <caption className="bg-orange-500 px-4 py-3 text-center text-lg font-bold uppercase tracking-wide text-white">
                  <span className="whitespace-pre-line">{title}</span>
                </caption>
                <thead className="bg-amber-50">
                  <tr>
                    <HeadCell>Directorate</HeadCell>
                    <HeadCell>Teams</HeadCell>
                    <HeadCell>Team Strength</HeadCell>
                    <HeadCell>Confirmed</HeadCell>
                    <HeadCell>% of Present</HeadCell>
                    <HeadCell>Present</HeadCell>
                    <HeadCell>% of Present</HeadCell>
                    <HeadCell>Absent</HeadCell>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <Cell className="text-center text-gray-500" colSpan={8}>
                        Loading…
                      </Cell>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <Cell className="text-center text-red-600" colSpan={8}>
                        Could not load report
                        {error instanceof Error ? `: ${error.message}` : ""}
                      </Cell>
                    </tr>
                  ) : (
                    data?.directorates.map((directorate) => (
                      <DirectorateRows
                        key={directorate.label}
                        directorate={directorate}
                        onSelectDirectorate={selectDirectorate}
                        onSelectRow={selectRow}
                      />
                    ))
                  )}

                  {data && (
                    <tr className="bg-amber-100 font-bold">
                      <td
                        colSpan={2}
                        className="border border-gray-300 px-3 py-2 text-right text-sm uppercase text-gray-900"
                      >
                        Total
                      </td>
                      <Cell className="text-center">{data.totals.strength}</Cell>
                      <Cell className="bg-blue-100 text-center">
                        {data.totals.confirmed}
                      </Cell>
                      <Cell className="bg-blue-100 text-center">
                        {data.totals.confirmed
                          ? formatPercent(data.totals.percentConfirmedPresent)
                          : "—"}
                      </Cell>
                      <Cell className="bg-green-200 text-center">
                        {data.totals.present}
                      </Cell>
                      <Cell className="bg-green-200 text-center">
                        {formatPercent(data.totals.percentPresent)}
                      </Cell>
                      <Cell className="bg-red-200 text-center">
                        {data.totals.absent}
                      </Cell>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Click a directorate name or a team name to view the workers in
              that group with their details. Numbers refresh when the page
              loads and when you tap Refresh.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReport;

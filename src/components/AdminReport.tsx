import { useNavigate } from "react-router-dom";
import { useReportData } from "../services/report";
import { useMeetingTitle } from "../services/settings";
import type { DirectorateReport } from "../utils/report";

const formatPercent = (value: number) =>
  `${value.toFixed(2).replace(/\.00$/, ".00")}%`;

const Cell = ({
  children,
  className = "",
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
}) => (
  <td
    colSpan={colSpan}
    className={`border border-gray-300 px-3 py-2 text-sm text-gray-900 ${className}`}
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

const DirectorateRows = ({ directorate }: { directorate: DirectorateReport }) => {
  const rowCount = directorate.rows.length;
  return (
    <>
      {directorate.rows.map((row, idx) => (
        <tr key={`${directorate.label}-${row.label}`}>
          {idx === 0 && (
            <td
              rowSpan={rowCount}
              className={`border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 align-middle text-center ${directorate.colorClass}`}
            >
              {directorate.label}
            </td>
          )}
          <Cell className="font-medium">{row.label}</Cell>
          <Cell className="bg-amber-50 text-center font-semibold">
            {row.strength}
          </Cell>
          <Cell className="text-center text-gray-400">—</Cell>
          <Cell className="text-center text-gray-400">—</Cell>
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to attendance
          </button>
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
        </div>

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
                  <Cell className="text-center text-gray-400">—</Cell>
                  <Cell className="text-center text-gray-400">—</Cell>
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
          Numbers update when the page loads and when you tap Refresh.
          “Confirmed” and the first “% of Present” column are placeholders
          until confirmation data is captured.
        </p>
      </div>
    </div>
  );
};

export default AdminReport;

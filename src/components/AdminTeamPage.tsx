import { useNavigate, useParams } from "react-router-dom";
import TeamDetails, { type ScopeStats } from "./TeamDetails";
import { directorates } from "../utils/report";
import { useReportData } from "../services/report";

const AdminTeamPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const decoded = slug ? decodeURIComponent(slug) : "";
  let match: {
    row: (typeof directorates)[number]["rows"][number];
    dir: (typeof directorates)[number];
  } | null = null;
  for (const dir of directorates) {
    for (const row of dir.rows) {
      if (row.label.toLowerCase() === decoded.toLowerCase()) {
        match = { row, dir };
        break;
      }
    }
    if (match) break;
  }

  const { data: report } = useReportData();

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate("/admin/summary")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to report
          </button>
          <div className="mt-6 rounded-lg bg-white p-8 shadow ring-1 ring-gray-200 text-center">
            <h1 className="text-xl font-bold text-gray-800">Team not found</h1>
            <p className="mt-2 text-sm text-gray-600">
              No team called “{decoded}”.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const reportedDirectorate = report?.directorates.find(
    (d) => d.label === match!.dir.label
  );
  const reportedRow = reportedDirectorate?.rows.find(
    (r) => r.label === match!.row.label
  );
  const stats: ScopeStats | undefined = reportedRow
    ? {
        strength: reportedRow.strength,
        confirmed: reportedRow.confirmed,
        present: reportedRow.present,
        absent: reportedRow.absent,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <TeamDetails
          scope={{
            kind: "row",
            label: match.row.label,
            filter: match.row.filter,
            context: match.dir.label,
          }}
          stats={stats}
          onClose={() => navigate("/admin/summary")}
        />
      </div>
    </div>
  );
};

export default AdminTeamPage;

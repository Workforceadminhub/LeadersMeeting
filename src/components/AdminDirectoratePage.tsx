import { useNavigate, useParams } from "react-router-dom";
import TeamDetails from "./TeamDetails";
import { directorates } from "../utils/report";

const AdminDirectoratePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const decoded = slug ? decodeURIComponent(slug) : "";
  const dir = directorates.find(
    (d) => d.label.toLowerCase() === decoded.toLowerCase()
  );

  if (!dir) {
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
            <h1 className="text-xl font-bold text-gray-800">
              Directorate not found
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              No directorate called “{decoded}”.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <TeamDetails
          scope={{
            kind: "directorate",
            label: dir.label,
            filters: dir.rows.map((r) => r.filter),
          }}
          onClose={() => navigate("/admin/summary")}
        />
      </div>
    </div>
  );
};

export default AdminDirectoratePage;

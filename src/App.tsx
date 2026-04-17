import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardPage from "./components/DashboardPage";
import DashboardPageByDepartment from "./components/DashboardPageByDepartment";
import Attendance from "./components/Attendance";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import OfflineBanner from "./components/OfflineBanner";
import UpdatePrompt from "./components/UpdatePrompt";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <OfflineBanner />
        <UpdatePrompt />
        <BrowserRouter>
          <SkeletonTheme baseColor="#e5e5e5" highlightColor="#d6d4d4">
            <Routes>
              <Route index element={<Attendance />} />
              <Route
                path="/admin/summary"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/department/summary"
                element={
                  <ProtectedRoute>
                    <DashboardPageByDepartment />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SkeletonTheme>
        </BrowserRouter>
        <ToastContainer
          hideProgressBar
          autoClose={5000}
          theme="colored"
          position="top-center"
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

const DashboardLayout = () => (
  <div className="flex min-h-screen w-full">
    <DashboardSidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <DashboardNavbar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;

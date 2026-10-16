import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Toaster } from "@/components/ui/toaster";

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto lg:pt-0 pt-14">
        <div className="h-full">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Toaster } from "@/components/ui/toaster";

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden max-w-[100vw]">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto overflow-x-hidden lg:pt-0 pt-14 min-w-0">
        <div className="h-full min-w-0">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

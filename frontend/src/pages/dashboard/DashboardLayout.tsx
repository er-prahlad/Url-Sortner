import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden max-w-[100vw]">
      <DashboardSidebar />
      {/* Main area: flex-col so footer sticks to bottom */}
      <main className="flex-1 flex flex-col overflow-auto overflow-x-hidden lg:pt-0 pt-14 min-w-0">
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
        <Footer />
      </main>
      <Toaster />
    </div>
  );
}

import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";

function DashboardFooter() {
  return (
    <footer className="border-t bg-background px-6 py-4 mt-auto shrink-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} LinkShortner. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms"   className="hover:text-primary transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden max-w-[100vw]">
      <DashboardSidebar />
      {/* Main area: flex-col so footer sticks to bottom */}
      <main className="flex-1 flex flex-col overflow-auto overflow-x-hidden lg:pt-0 pt-14 min-w-0">
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
        <DashboardFooter />
      </main>
      <Toaster />
    </div>
  );
}

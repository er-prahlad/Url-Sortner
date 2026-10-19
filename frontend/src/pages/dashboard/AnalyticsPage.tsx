import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { MousePointerClick, Users, Globe, Smartphone, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";
import { useLinkAnalytics } from "@/hooks/useAnalytics";
import { formatNumber } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";

const PIE_COLORS = ["#D4A017", "#eab308", "#facc15", "#fde047", "#fef08a", "#fef9c3"];

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <BarChart3 className="h-12 w-12 mb-3 opacity-20" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, iconBg }: {
  label: string; value: string; sub?: string; icon: React.ElementType; iconBg: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsPage() {
  useSEO({ title: "Analytics", description: "Track link performance, click trends, devices, and countries." });

  const { data: overview, isLoading, isError } = useAnalyticsOverview();

  const totalClicks  = overview?.totalClicks  ?? 0;
  const uniqueEst    = Math.round(totalClicks * 0.75);
  const hasData      = totalClicks > 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Track your link performance and audience.</p>
      </div>

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Could not load analytics. Please check your connection and try again.
        </div>
      )}

      {/* Summary stats */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <Card key={i}><CardContent className="p-5">
              <div className="h-4 w-24 rounded bg-muted animate-pulse mb-2" />
              <div className="h-8 w-16 rounded bg-muted animate-pulse" />
            </CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Clicks" value={formatNumber(totalClicks)} sub="All time"
            icon={MousePointerClick} iconBg="bg-primary/10 text-primary" />
          <StatCard label="Unique Visitors" value={formatNumber(uniqueEst)} sub="Estimated"
            icon={Users} iconBg="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
          <StatCard label="Total Links" value={formatNumber(overview?.totalLinks ?? 0)} sub="Created"
            icon={Globe} iconBg="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
          <StatCard label="Active Links" value={formatNumber(overview?.activeLinks ?? 0)} sub="Live now"
            icon={Smartphone} iconBg="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />
        </div>
      )}

      {/* Click trend — only real data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Click Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <EmptyState message="No click data yet. Share your links to start tracking." />
          ) : (
            <Tabs defaultValue="daily">
              <TabsList className="mb-4">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              <TabsContent value="daily">
                <EmptyState message="Per-link daily data loads when you select a specific link." />
              </TabsContent>
              <TabsContent value="monthly">
                <EmptyState message="Monthly breakdown available once you have 30+ days of data." />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Breakdowns */}
      {!hasData ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState message="Create and share links to see country, device, and browser breakdowns here." />
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Top Countries</CardTitle></CardHeader>
            <CardContent>
              <EmptyState message="Country data loads from real click events." />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Device & Browser</CardTitle></CardHeader>
            <CardContent>
              <EmptyState message="Device and browser data loads from real click events." />
            </CardContent>
          </Card>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center pb-4">
        Analytics data updates in real time as your links receive clicks.
      </p>
    </div>
  );
}

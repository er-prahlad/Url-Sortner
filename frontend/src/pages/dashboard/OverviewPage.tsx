import { Link } from "react-router-dom";
import {
  Link2,
  MousePointerClick,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";
import { useLinks } from "@/hooks/useLinks";
import { useClipboard } from "@/hooks/useClipboard";
import { formatNumber, formatDate, getStatusColor, truncateUrl } from "@/lib/utils";
import { ShortenForm } from "@/components/links/ShortenForm";
import type { ShortLink } from "@/types";

// Placeholder chart data shown when API is unavailable
const DEMO_CHART: { date: string; clicks: number }[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    clicks: Math.floor(Math.random() * 120) + 20,
  };
});

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  iconBg,
}: {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  iconBg: string;
}) {
  const positive = (change ?? 0) >= 0;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change !== undefined && (
              <p
                className={`flex items-center gap-1 text-xs mt-1.5 ${
                  positive ? "text-green-600" : "text-red-500"
                }`}
              >
                {positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(change)}% from last week
              </p>
            )}
          </div>
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentLinkRow({ link }: { link: ShortLink }) {
  const { copied, copy } = useClipboard();
  return (
    <tr className="border-b last:border-0 hover:bg-muted/30 transition-colors">
      <td className="py-3 px-4">
        <a
          href={link.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
          title={link.originalUrl}
        >
          {truncateUrl(link.originalUrl, 45)}
        </a>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-muted-foreground">{link.shortUrl}</span>
      </td>
      <td className="py-3 px-4 text-sm">{link.clicks.toLocaleString()}</td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(link.createdAt)}</td>
      <td className="py-3 px-4">
        <Badge className={getStatusColor(link.status)} variant="outline">
          {link.status}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copy(link.shortUrl)}>
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
            <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function OverviewPage() {
  const { data: overview, isError: overviewError } = useAnalyticsOverview();
  const { data: linksData } = useLinks({ limit: 5, sort: "newest" });

  const stats = overview
    ? [
        {
          label: "Total Links",
          value: formatNumber(overview.totalLinks),
          change: overview.totalLinksChange,
          icon: Link2,
          iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        },
        {
          label: "Total Clicks",
          value: formatNumber(overview.totalClicks),
          change: overview.totalClicksChange,
          icon: MousePointerClick,
          iconBg: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
        },
        {
          label: "Active Links",
          value: formatNumber(overview.activeLinks),
          change: overview.activeLinksChange,
          icon: TrendingUp,
          iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
        },
        {
          label: "Avg. Clicks / Link",
          value: formatNumber(overview.avgClicksPerLink),
          change: overview.avgClicksChange,
          icon: BarChart3,
          iconBg: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
        },
      ]
    : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Welcome back. Here's what's happening with your links.
        </p>
      </div>

      {/* Backend unavailable banner */}
      {overviewError && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/20 px-4 py-3 text-sm text-orange-800 dark:text-orange-300">
          Backend not connected — analytics data is unavailable. Connect your API to see live stats.
        </div>
      )}

      {/* Stat cards */}
      {stats ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {["Total Links", "Total Clicks", "Active Links", "Avg. Clicks / Link"].map((label) => (
            <Card key={label}>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">{label}</p>
                <div className="h-8 w-24 rounded bg-muted animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Click Activity</CardTitle>
            <p className="text-xs text-muted-foreground">Last 14 days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={DEMO_CHART} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#clicksGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
            {overviewError && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                Displaying demo data — connect backend for live analytics
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick shorten */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Create New Link</CardTitle>
            <p className="text-xs text-muted-foreground">Shorten and manage your links</p>
          </CardHeader>
          <CardContent>
            <ShortenForm compact />
          </CardContent>
        </Card>
      </div>

      {/* Recent links */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Recent Links</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/links">
              View all
              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {linksData?.data && linksData.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground">Original URL</th>
                    <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground">Short URL</th>
                    <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground">Clicks</th>
                    <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground">Created</th>
                    <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground">Status</th>
                    <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {linksData.data.map((link) => (
                    <RecentLinkRow key={link.id} link={link} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Link2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No links yet. Create your first short link above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

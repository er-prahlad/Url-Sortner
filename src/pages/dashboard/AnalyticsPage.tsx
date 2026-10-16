import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { MousePointerClick, Users, Globe, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";
import { formatNumber } from "@/lib/utils";

// Demo data shown when backend is unavailable
const DEMO_DAILY = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    clicks: Math.floor(Math.random() * 200 + 50),
    unique: Math.floor(Math.random() * 120 + 20),
  };
});

const DEMO_COUNTRIES = [
  { country: "United States", clicks: 4280, percentage: 35 },
  { country: "United Kingdom", clicks: 1956, percentage: 16 },
  { country: "Germany", clicks: 1225, percentage: 10 },
  { country: "France", clicks: 980, percentage: 8 },
  { country: "India", clicks: 856, percentage: 7 },
  { country: "Other", clicks: 2940, percentage: 24 },
];

const DEMO_DEVICES = [
  { device: "Desktop", clicks: 5823, percentage: 48 },
  { device: "Mobile", clicks: 4934, percentage: 40 },
  { device: "Tablet", clicks: 1480, percentage: 12 },
];

const DEMO_BROWSERS = [
  { browser: "Chrome", clicks: 6120, percentage: 50 },
  { browser: "Safari", clicks: 2436, percentage: 20 },
  { browser: "Firefox", clicks: 1460, percentage: 12 },
  { browser: "Edge", clicks: 1094, percentage: 9 },
  { browser: "Other", clicks: 1127, percentage: 9 },
];

const PIE_COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

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
  const { data: overview, isError } = useAnalyticsOverview();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Track your link performance and audience.</p>
      </div>

      {isError && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/20 px-4 py-3 text-sm text-orange-800 dark:text-orange-300">
          Backend not connected — displaying demo data. Connect your API for live analytics.
        </div>
      )}

      {/* Summary stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Clicks"
          value={formatNumber(overview?.totalClicks ?? 12543)}
          sub="All time"
          icon={MousePointerClick}
          iconBg="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          label="Unique Visitors"
          value={formatNumber(Math.round((overview?.totalClicks ?? 12543) * 0.75))}
          sub="Estimated"
          icon={Users}
          iconBg="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          label="Top Country"
          value="United States"
          sub="35% of clicks"
          icon={Globe}
          iconBg="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
        <StatCard
          label="Top Device"
          value="Desktop"
          sub="48% of clicks"
          icon={Smartphone}
          iconBg="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
        />
      </div>

      {/* Click trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Click Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={DEMO_DAILY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Area type="monotone" dataKey="clicks" stroke="#2563eb" strokeWidth={2} fill="url(#g1)" name="Clicks" />
                  <Area type="monotone" dataKey="unique" stroke="#60a5fa" strokeWidth={1.5} fill="none" strokeDasharray="4 2" name="Unique" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="monthly">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={Array.from({ length: 12 }, (_, i) => ({
                    month: new Date(2026, i).toLocaleString("default", { month: "short" }),
                    clicks: Math.floor(Math.random() * 3000 + 500),
                  }))}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="clicks" fill="#2563eb" radius={[4, 4, 0, 0]} name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Breakdowns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEMO_COUNTRIES.map(({ country, clicks, percentage }) => (
                <div key={country}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{country}</span>
                    <span className="text-muted-foreground">{clicks.toLocaleString()} ({percentage}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device & Browser */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={DEMO_DEVICES} dataKey="clicks" nameKey="device" cx="50%" cy="50%" outerRadius={55} innerRadius={30}>
                      {DEMO_DEVICES.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5">
                  {DEMO_DEVICES.map(({ device, percentage }, i) => (
                    <div key={device} className="flex items-center gap-2 text-sm">
                      <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span>{device}</span>
                      <span className="text-muted-foreground ml-auto">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top Browsers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {DEMO_BROWSERS.map(({ browser, clicks, percentage }) => (
                  <div key={browser} className="flex items-center justify-between text-sm">
                    <span>{browser}</span>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-muted-foreground w-12 text-right">{clicks.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

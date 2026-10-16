// ─── Auth ──────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ─── Links ─────────────────────────────────────────────────────────────────

export type LinkStatus = "active" | "expired" | "disabled";

export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  customAlias?: string;
  title?: string;
  clicks: number;
  status: LinkStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  password?: boolean;
  qrCodeUrl?: string;
}

export interface CreateLinkPayload {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string;
  password?: string;
}

export interface UpdateLinkPayload {
  customAlias?: string;
  expiresAt?: string;
  status?: LinkStatus;
  title?: string;
}

export interface LinksListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: LinkStatus | "all";
  sort?: "newest" | "oldest" | "most_clicks";
}

// ─── Analytics ─────────────────────────────────────────────────────────────

export interface AnalyticsOverview {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  avgClicksPerLink: number;
  totalLinksChange: number;
  totalClicksChange: number;
  activeLinksChange: number;
  avgClicksChange: number;
}

export interface ClickDataPoint {
  date: string;
  clicks: number;
}

export interface CountryData {
  country: string;
  countryCode: string;
  clicks: number;
  percentage: number;
}

export interface DeviceData {
  device: string;
  clicks: number;
  percentage: number;
}

export interface BrowserData {
  browser: string;
  clicks: number;
  percentage: number;
}

export interface ReferrerData {
  referrer: string;
  clicks: number;
  percentage: number;
}

export interface LinkAnalytics {
  totalClicks: number;
  uniqueClicks: number;
  clicksByDay: ClickDataPoint[];
  clicksByCountry: CountryData[];
  clicksByDevice: DeviceData[];
  clicksByBrowser: BrowserData[];
  clicksByReferrer: ReferrerData[];
}

// ─── API Responses ──────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// ─── QR Code ───────────────────────────────────────────────────────────────

export interface QRCodeOptions {
  size: number;
  foreground: string;
  background: string;
  format: "png" | "svg";
}

// ─── UTM ───────────────────────────────────────────────────────────────────

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

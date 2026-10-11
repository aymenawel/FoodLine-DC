export type Lang = 'en' | 'es';
export type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type Span = [string, string];

export type ResourceType =
  | 'grocery' | 'farmers_market' | 'mobile_market' | 'corner_store'
  | 'pantry' | 'free_market' | 'community_fridge' | 'meal_site' | 'produce_plus_site';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  address: string;
  zip: string;
  neighborhood: string | null;
  lat: number;
  lng: number;
  ward: number | null;
  east_of_river?: boolean;
  hours: Record<Day, Span[]> | null;
  schedule_note: string | null;
  season: { start: string; end: string } | null;
  free: boolean;
  snap: boolean | 'unknown';
  wic: boolean | 'unknown';
  eligibility: string;
  languages: string[];
  phone: string | null;
  website: string | null;
  source_url: string;
  last_verified: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface Place {
  kind: 'zip' | 'neighborhood' | 'intersection' | 'address';
  label: string;
  lat: number;
  lng: number;
  zip?: string | null;
}

export interface Places {
  zips: Record<string, { zip: string; lat: number; lng: number; eastShare: number }>;
  neighborhoods: { name: string; names: string[]; lat: number; lng: number; ward: number | null; east: boolean }[];
  intersections: { a: string; b: string; lat: number; lng: number; ward: number | null }[];
  // Ward 7/8 address points by street, e.g. "ALABAMA AVENUE SE": [[1535, lat, lng], ...] sorted by number
  addresses?: Record<string, [number, number, number][]>;
}

export type OpenState = 'open' | 'closed' | 'unknown' | 'out_of_season';
export interface OpenStatus {
  state: OpenState;
  closesAt?: string;
  opensAt?: string;
  opensDay?: Day;
  inDays?: number; // days until it opens (0 = later today)
}

export interface Ranked {
  resource: Resource;
  distanceMi: number;
  status: OpenStatus;
}

export type Need = 'any' | 'free' | 'open_now';

export interface ConvState {
  lang: Lang;
  langLocked: boolean;
  place: Place | null;
  freeOnly: boolean;
  openNow: boolean;
  offset: number;
  lastIds: string[];
}

export interface LogEntry {
  ts: string;
  zip: string | null;
  lat: number;
  lng: number;
  need: Need;
  lang: Lang;
  source: 'live' | 'sample' | 'sms';
}

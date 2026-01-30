// FotMob API types (only fields we use)

export interface FotMobTableRow {
  id: number;
  name: string;
  shortName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDifference: number;
  pts: number;
  idx: number;
  qualColor?: string;
}

export interface FotMobTableLegend {
  color: string;
  title: string;
}

export interface FotMobTable {
  all: FotMobTableRow[];
  legend?: FotMobTableLegend[];
}

export interface FotMobTopPlayer {
  id: number;
  name: string;
  goals?: number;
  assists?: number;
  rating?: string;
  teamId?: number;
}

export interface FotMobTopPlayersCategory {
  header: string;
  players: FotMobTopPlayer[];
}

export interface FotMobTeamFormEntry {
  result: number; // 0 = loss, 1 = draw, 3 = win
  resultString: string; // "W", "D", "L"
  score: string;
  opponent: { id: number; name: string };
}

export interface FotMobNextMatch {
  id: string;
  opponent: { id: number; name: string };
  home?: { id: number; name: string };
  away?: { id: number; name: string };
  notStarted: boolean;
  status?: { utcTime: string };
}

export interface FotMobLastMatch {
  id: string;
  opponent: { id: number; name: string };
  home?: { id: number; name: string; score: number };
  away?: { id: number; name: string; score: number };
}

export interface FotMobVenue {
  widget: {
    name: string;
    city: string;
    country: string;
    lat: number;
    long: number;
  };
  statPairs: Array<[{ value: string; title: string }, { value: string; title: string }]>;
}

export interface FotMobTeamStatEntry {
  teamName: string;
  teamId: number;
  value: string;
  rank: number;
}

export interface FotMobTeamStatCategory {
  header: string;
  localizedTitleId: string;
  teamValue: string;
  teamData: FotMobTeamStatEntry[];
}

export interface FotMobOverview {
  table?: FotMobTable[];
  topPlayers?: {
    byGoals?: FotMobTopPlayersCategory;
    byAssists?: FotMobTopPlayersCategory;
    byRating?: FotMobTopPlayersCategory;
  };
  teamForm?: FotMobTeamFormEntry[];
  nextMatch?: FotMobNextMatch;
  lastMatch?: FotMobLastMatch;
  venue?: FotMobVenue;
  teamColors?: {
    darkMode: string;
    lightMode: string;
    fontDarkMode: string;
    fontLightMode: string;
  };
}

export interface FotMobStats {
  teams?: FotMobTeamStatCategory[];
  players?: unknown[];
}

export interface FotMobTeamData {
  overview?: FotMobOverview;
  stats?: FotMobStats;
}

// Parsed types for components
export interface LeagueTableRow {
  id: number;
  name: string;
  shortName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDifference: number;
  pts: number;
  position: number;
  qualColor?: string;
}

export interface TopScorer {
  name: string;
  goals: number;
}

export interface LeagueRanking {
  label: string;
  translationKey: string;
  value: string;
  rank: number;
  totalTeams: number;
}

export interface VenueInfo {
  name: string;
  city: string;
  capacity?: string;
  surface?: string;
  yearOpened?: string;
}

export interface NextMatchInfo {
  opponentName: string;
  utcTime?: string;
  isHome: boolean;
}

// In-memory cache
let cachedData: FotMobTeamData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const NEA_SALAMINA_ID = 8590;
const API_URL = `https://www.fotmob.com/api/data/teams?id=${NEA_SALAMINA_ID}&ccode3=CYP`;

export async function fetchTeamData(): Promise<FotMobTeamData | null> {
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return cachedData;
  }

  try {
    const res = await fetch(API_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    });
    if (!res.ok) return null;
    const data: FotMobTeamData = await res.json();
    cachedData = data;
    cacheTimestamp = now;
    return data;
  } catch {
    return null;
  }
}

// Parsers

export function parseLeagueTable(data: FotMobTeamData): { rows: LeagueTableRow[]; legend: FotMobTableLegend[] } | null {
  const tables = data.overview?.table;
  if (!tables || tables.length === 0) return null;

  const table = tables[0];
  const rows: LeagueTableRow[] = (table.all || []).map((row) => ({
    id: row.id,
    name: row.name,
    shortName: row.shortName,
    played: row.played,
    wins: row.wins,
    draws: row.draws,
    losses: row.losses,
    goalDifference: row.goalDifference,
    pts: row.pts,
    position: row.idx,
    qualColor: row.qualColor,
  }));

  return { rows, legend: table.legend || [] };
}

export function parseTopScorers(data: FotMobTeamData): TopScorer[] {
  const players = data.overview?.topPlayers?.byGoals?.players;
  if (!players) return [];
  return players.slice(0, 3).map((p) => ({
    name: p.name,
    goals: p.goals ?? 0,
  }));
}

export function parseLeagueRankings(data: FotMobTeamData): LeagueRanking[] {
  const categories = data.stats?.teams;
  if (!categories) return [];

  const rankings: LeagueRanking[] = [];
  for (const cat of categories) {
    const entry = cat.teamData?.find((t) => t.teamId === NEA_SALAMINA_ID);
    if (entry) {
      rankings.push({
        label: cat.header,
        translationKey: cat.localizedTitleId || cat.header,
        value: entry.value || cat.teamValue,
        rank: entry.rank,
        totalTeams: cat.teamData.length,
      });
    }
  }
  return rankings;
}

export function parseVenueInfo(data: FotMobTeamData): VenueInfo | null {
  const venue = data.overview?.venue;
  if (!venue) return null;

  const info: VenueInfo = {
    name: venue.widget.name,
    city: venue.widget.city,
  };

  for (const pair of venue.statPairs || []) {
    for (const stat of pair) {
      const title = stat.title?.toLowerCase() || '';
      if (title.includes('capacity')) info.capacity = stat.value;
      if (title.includes('surface')) info.surface = stat.value;
      if (title.includes('year') || title.includes('opened')) info.yearOpened = stat.value;
    }
  }

  return info;
}

export function parseNextMatch(data: FotMobTeamData): NextMatchInfo | null {
  const next = data.overview?.nextMatch;
  if (!next) return null;

  const isHome = next.home?.id === NEA_SALAMINA_ID;
  const opponentName = isHome ? (next.away?.name || next.opponent?.name || '') : (next.home?.name || next.opponent?.name || '');

  return {
    opponentName,
    utcTime: next.status?.utcTime,
    isHome,
  };
}

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PATENTS_DATA } from '../data/researchData.js';
import { 
  PROFESSOR_PROFILE, 
  RESOURCE_PERSON_DATA, 
  FDP_TRAINING_DATA 
} from '../data/profileData.js';

// Local storage keys
export const STORAGE_KEY_SHEET_ID = "dr_farooq_google_sheet_id";
export const STORAGE_KEY_BIO_CACHE = "dr_farooq_bio_sheet_cache_v1";
export const STORAGE_KEY_LAST_BIO_SYNC = "dr_farooq_bio_last_sync_v1";

// Default/fallback Sheet ID (can be configured by Dr. Farooq via UI modal or input)
export const DEFAULT_SHEET_ID = "";

/**
 * Robust RFC 4180 compliant CSV parser that handles:
 * - Commas within quoted fields
 * - Escaped double quotes ("")
 * - Multiline rows
 * - Leading/trailing whitespace
 */
export function parseCSV(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = [];
  let row = [''];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push('');
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      if (row.length > 1 || row[0] !== '') {
        lines.push(row);
      }
      row = [''];
    } else {
      row[row.length - 1] += char;
    }
  }

  if (row.length > 1 || row[0] !== '') {
    lines.push(row);
  }

  if (lines.length < 2) return [];

  const rawHeaders = lines[0];
  const normalizedHeaders = rawHeaders.map(h => 
    h.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  );

  return lines.slice(1).map((line, rowIdx) => {
    const obj = { _rowIdx: rowIdx };
    normalizedHeaders.forEach((h, idx) => {
      if (h) {
        obj[h] = (line[idx] || '').trim();
      }
    });
    return obj;
  });
}

/**
 * Extracts a clean Google Sheet ID from any standard URL or raw ID.
 * Examples:
 * - "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing" -> "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
 * - "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms" -> "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
 */
export function extractSheetId(input) {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) return match[1];
  return trimmed;
}

// -------------------------------------------------------------
// TAB DATA MAPPERS & NORMALIZERS
// -------------------------------------------------------------

export function mapPatentsFromSheet(rows) {
  if (!rows || rows.length === 0) return null;
  return rows.map((r, idx) => {
    const patentNo = r.patentno || r.patentnumber || r.patent || `PAT-${idx + 1}`;
    const statusRaw = (r.status || 'Published').toLowerCase();
    const status = statusRaw.includes('grant') ? 'Granted' : 'Published';
    const kapilaRaw = (r.kapilascheme || r.kapila || '').toLowerCase();
    const kapilaScheme = kapilaRaw === 'true' || kapilaRaw === 'yes' || kapilaRaw === '1';

    return {
      id: `pat-sheet-${idx + 1}`,
      slNo: String(idx + 1),
      patentNo,
      status,
      type: r.type || 'Indian Patent (IP India)',
      title: r.title || 'Untitled Patent',
      faculty: r.faculty || 'Dr. Farooq Sunar Mahammad',
      filedDate: r.fileddate || r.filed || '',
      publishedDate: r.publisheddate || r.published || '',
      academicYear: r.academicyear || r.year || '',
      kapilaScheme,
      category: r.category || 'Artificial Intelligence & Engineering Innovation',
      highlight: r.highlight || (kapilaScheme ? 'Published under the Government of India KAPILA Scheme.' : ''),
      url: r.url || `https://patents.google.com/?q=${encodeURIComponent(patentNo)}`
    };
  });
}

export function mapAwardsFromSheet(rows) {
  if (!rows || rows.length === 0) return null;
  return rows.map((r, idx) => ({
    id: `award-sheet-${idx + 1}`,
    year: r.year || 'Recent',
    date: r.date || r.year || '',
    title: r.title || 'Academic Honor',
    organization: r.organization || r.org || 'Academic Organization',
    location: r.location || 'India',
    level: r.level || 'State Level',
    category: r.category || 'Faculty (CSE)',
    highlight: r.highlight || 'Recognized for meritorious academic, research, and institutional contributions.'
  }));
}

export function mapResourcePersonFromSheet(rows) {
  if (!rows || rows.length === 0) return null;
  return rows.map((r, idx) => ({
    id: `rp-sheet-${idx + 1}`,
    year: r.year || 'Recent',
    title: r.title || 'Technical Keynote / Guest Session',
    event: r.eventname || r.event || 'Academic Program / FDP',
    organization: r.organization || r.college || 'Higher Education Institution',
    role: r.role || 'Resource Person / Keynote Speaker',
    level: r.level || 'National / State Level',
    topic: r.topic || r.title || 'Emerging Technologies & AI',
    audience: r.audience || 'Faculty Members, Researchers & Students'
  }));
}

export function mapMembershipsFromSheet(rows) {
  if (!rows || rows.length === 0) return null;
  return rows.map((r, idx) => {
    const isLifeRaw = (r.islifemember || r.lifemember || r.role || '').toLowerCase();
    const isLifeMember = isLifeRaw === 'true' || isLifeRaw === 'yes' || isLifeRaw.includes('life');

    return {
      id: `mem-sheet-${idx + 1}`,
      name: r.societyname || r.name || 'Professional Engineering Society',
      short: r.shortform || r.short || 'Society',
      role: r.role || (isLifeMember ? 'Life Time Member' : 'Member'),
      membershipId: r.membershipid || r.id || 'Verified',
      isLifeMember,
      tier: r.tier || 'National',
      category: r.category || 'Professional Technical Body',
      description: r.description || 'Active member contributing to institutional technical chapters and scholarly growth.'
    };
  });
}

export function mapFdpsFromSheet(rows) {
  if (!rows || rows.length === 0) return null;
  return rows.map((r, idx) => {
    const isFlagshipRaw = (r.isflagship || r.flagship || '').toLowerCase();
    const isFlagship = isFlagshipRaw === 'true' || isFlagshipRaw === 'yes' || isFlagshipRaw === '1';

    return {
      id: `fdp-sheet-${idx + 1}`,
      title: r.titlecitation || r.title || 'Professional Development Program',
      category: r.category || 'Pedagogy & Digital Learning',
      year: r.year || 'Recent',
      mode: r.mode || 'Online / Virtual',
      isFlagship
    };
  });
}

// -------------------------------------------------------------
// GOOGLE SHEETS LIVE DATA FETCHER
// -------------------------------------------------------------

/**
 * Fetches a single tab from Google Sheets using public gviz endpoint
 */
export async function fetchGoogleSheetTab(sheetId, tabName) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Sheets responded with status ${response.status} for tab ${tabName}`);
  }

  const csvText = await response.text();
  
  // If the sheet is private, Google returns an HTML sign-in page instead of CSV
  if (csvText.includes('<!DOCTYPE html>') || csvText.includes('<html')) {
    throw new Error(`Permission Denied: Please set Google Sheet sharing to "Anyone with the link can view".`);
  }

  return parseCSV(csvText);
}

/**
 * Fetches all 5 bio tabs concurrently from Google Sheets with graceful per-tab fallback
 */
export async function fetchAllBioDataFromSheet(sheetId) {
  if (!sheetId) {
    return {
      success: false,
      error: 'No Sheet ID provided',
      patents: null,
      awards: null,
      resourcePerson: null,
      memberships: null,
      fdps: null
    };
  }

  const results = await Promise.allSettled([
    fetchGoogleSheetTab(sheetId, 'Patents'),
    fetchGoogleSheetTab(sheetId, 'Awards'),
    fetchGoogleSheetTab(sheetId, 'Resource_Person'),
    fetchGoogleSheetTab(sheetId, 'Memberships'),
    fetchGoogleSheetTab(sheetId, 'FDPs_Programs')
  ]);

  const [patentsRes, awardsRes, rpRes, memRes, fdpsRes] = results;

  const patents = patentsRes.status === 'fulfilled' ? mapPatentsFromSheet(patentsRes.value) : null;
  const awards = awardsRes.status === 'fulfilled' ? mapAwardsFromSheet(awardsRes.value) : null;
  const resourcePerson = rpRes.status === 'fulfilled' ? mapResourcePersonFromSheet(rpRes.value) : null;
  const memberships = memRes.status === 'fulfilled' ? mapMembershipsFromSheet(memRes.value) : null;
  const fdps = fdpsRes.status === 'fulfilled' ? mapFdpsFromSheet(fdpsRes.value) : null;

  const anySuccess = Boolean(patents || awards || resourcePerson || memberships || fdps);

  return {
    success: anySuccess,
    patents,
    awards,
    resourcePerson,
    memberships,
    fdps,
    fetchedAt: new Date().toISOString()
  };
}

// -------------------------------------------------------------
// REACT HOOK: useBioSync
// -------------------------------------------------------------

export function useBioSync() {
  const [sheetId, setSheetIdState] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_SHEET_ID);
      if (stored) return stored;
    }
    return DEFAULT_SHEET_ID;
  });

  const [cachedData, setCachedData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_BIO_CACHE);
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return null;
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_LAST_BIO_SYNC);
    }
    return null;
  });

  // Persistent Sheet ID setter
  const setSheetId = useCallback((newId) => {
    const cleanId = extractSheetId(newId);
    setSheetIdState(cleanId);
    if (typeof window !== 'undefined') {
      if (cleanId) {
        localStorage.setItem(STORAGE_KEY_SHEET_ID, cleanId);
      } else {
        localStorage.removeItem(STORAGE_KEY_SHEET_ID);
      }
    }
  }, []);

  // Fetch bio data from Google Sheets
  const refreshBioData = useCallback(async (customId = null, isBackground = false) => {
    const targetId = customId !== null ? extractSheetId(customId) : sheetId;
    if (!targetId) return;

    if (!isBackground) setIsSyncing(true);
    setSyncError(null);

    try {
      const res = await fetchAllBioDataFromSheet(targetId);
      if (res.success) {
        setCachedData(res);
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(nowStr);

        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_BIO_CACHE, JSON.stringify(res));
          localStorage.setItem(STORAGE_KEY_LAST_BIO_SYNC, nowStr);
        }

        if (!isBackground) {
          setSyncMessage('Successfully synchronized with your Google Sheet in Google Drive!');
        }
      } else {
        if (!isBackground) {
          setSyncError('Could not read Google Sheet. Verify sharing is set to "Anyone with the link can view".');
        }
      }
    } catch (err) {
      if (!isBackground) {
        setSyncError(err.message || 'Google Sheet sync notice: using verified offline catalog.');
      }
    } finally {
      if (!isBackground) setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  }, [sheetId]);

  // Initial background sync on mount if Sheet ID exists
  useEffect(() => {
    if (sheetId) {
      refreshBioData(sheetId, true);
    }
  }, [sheetId, refreshBioData]);

  // Active resolved datasets (Google Sheet live > cached > fallback baseline)
  const patents = useMemo(() => cachedData?.patents || PATENTS_DATA, [cachedData]);
  const awards = useMemo(() => cachedData?.awards || PROFESSOR_PROFILE.awards || [], [cachedData]);
  const resourcePerson = useMemo(() => cachedData?.resourcePerson || RESOURCE_PERSON_DATA, [cachedData]);
  const memberships = useMemo(() => cachedData?.memberships || PROFESSOR_PROFILE.memberships || [], [cachedData]);
  const fdps = useMemo(() => cachedData?.fdps || FDP_TRAINING_DATA, [cachedData]);

  // Dynamic calculated metrics reflecting live Sheet rows
  const dynamicBioMetrics = useMemo(() => {
    const patentsGranted = patents.filter(p => p.status === 'Granted').length;
    const patentsPublished = patents.filter(p => p.status === 'Published').length;
    const kapilaSchemePatents = patents.filter(p => p.kapilaScheme).length;

    return {
      patentsCount: patents.length,
      patentsDisplay: `${patents.length}`,
      patentsGranted,
      patentsPublished,
      kapilaSchemePatents,
      stateAwardsCount: awards.length,
      resourcePersonCount: resourcePerson.length,
      membershipsCount: memberships.length,
      fdpCount: fdps.length
    };
  }, [patents, awards, resourcePerson, memberships, fdps]);

  const isLiveConnected = Boolean(sheetId && cachedData?.success);

  return {
    patents,
    awards,
    resourcePerson,
    memberships,
    fdps,
    sheetId,
    setSheetId,
    isSyncing,
    syncMessage,
    syncError,
    lastSyncTime,
    isLiveConnected,
    refreshBioData,
    dynamicBioMetrics
  };
}

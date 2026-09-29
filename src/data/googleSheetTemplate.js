// Google Sheet Template & Seed Data for Dr. S. Md. Farooq's Portal Live Sync
// Enables 1-click export/copy into Google Sheets with zero manual data entry

import { PATENTS_DATA } from './researchData.js';
import { PROFESSOR_PROFILE, RESOURCE_PERSON_DATA, FDP_TRAINING_DATA } from './profileData.js';

function escapeCsvField(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function arrayToCsv(headers, rows) {
  const headerLine = headers.map(escapeCsvField).join(',');
  const rowLines = rows.map(r => r.map(escapeCsvField).join(','));
  return [headerLine, ...rowLines].join('\n');
}

export const GOOGLE_SHEET_TABS_SPEC = [
  {
    name: "Patents",
    description: "Your official portfolio of Granted & Published Patents (KAPILA Scheme & International)",
    columns: ["Patent No", "Title", "Status", "Type", "Faculty", "Filed Date", "Published Date", "Academic Year", "KAPILA Scheme", "Category", "Highlight", "URL"]
  },
  {
    name: "Awards",
    description: "State, National & Academic Faculty Honors & Accolades",
    columns: ["Year", "Date", "Title", "Organization", "Location", "Level", "Category", "Highlight"]
  },
  {
    name: "Resource_Person",
    description: "Keynote Addresses, Resource Person Talks & Guest Lectures",
    columns: ["Year", "Title", "Event Name", "Organization", "Role", "Level", "Topic", "Audience"]
  },
  {
    name: "Memberships",
    description: "Professional Body Memberships (IEEE, ISTE, CSI, IAENG, etc.)",
    columns: ["Society Name", "Short Form", "Role", "Membership ID", "Is Life Member", "Tier", "Category", "Description"]
  },
  {
    name: "FDPs_Programs",
    description: "Attended Faculty Development Programs, STTPs & Workshops",
    columns: ["Title / Citation", "Category", "Year", "Mode", "Is Flagship"]
  }
];

export function getPatentsCsv() {
  const headers = ["Patent No", "Title", "Status", "Type", "Faculty", "Filed Date", "Published Date", "Academic Year", "KAPILA Scheme", "Category", "Highlight", "URL"];
  const rows = PATENTS_DATA.map(p => [
    p.patentNo || '',
    p.title || '',
    p.status || 'Published',
    p.type || 'Indian Patent (IP India)',
    p.faculty || 'Dr. Farooq Sunar Mahammad',
    p.filedDate || '',
    p.publishedDate || '',
    p.academicYear || '',
    p.kapilaScheme ? 'TRUE' : 'FALSE',
    p.category || '',
    p.highlight || '',
    p.url || ''
  ]);
  return arrayToCsv(headers, rows);
}

export function getAwardsCsv() {
  const headers = ["Year", "Date", "Title", "Organization", "Location", "Level", "Category", "Highlight"];
  const rows = (PROFESSOR_PROFILE.awards || []).map(a => [
    a.year || '',
    a.date || '',
    a.title || '',
    a.organization || '',
    a.location || '',
    a.level || 'State Level',
    a.category || 'Faculty (CSE)',
    a.highlight || ''
  ]);
  return arrayToCsv(headers, rows);
}

export function getResourcePersonCsv() {
  const headers = ["Year", "Title", "Event Name", "Organization", "Role", "Level", "Topic", "Audience"];
  const rows = RESOURCE_PERSON_DATA.map(r => [
    r.year || '',
    r.title || '',
    r.event || '',
    r.organization || '',
    r.role || 'Resource Person',
    r.level || '',
    r.topic || '',
    r.audience || ''
  ]);
  return arrayToCsv(headers, rows);
}

export function getMembershipsCsv() {
  const headers = ["Society Name", "Short Form", "Role", "Membership ID", "Is Life Member", "Tier", "Category", "Description"];
  const rows = (PROFESSOR_PROFILE.memberships || []).map(m => [
    m.name || '',
    m.short || '',
    m.role || 'Member',
    m.membershipId || '',
    m.isLifeMember ? 'TRUE' : 'FALSE',
    m.tier || 'National',
    m.category || '',
    m.description || ''
  ]);
  return arrayToCsv(headers, rows);
}

export function getFdpsCsv() {
  const headers = ["Title / Citation", "Category", "Year", "Mode", "Is Flagship"];
  const rows = FDP_TRAINING_DATA.map(f => [
    f.title || '',
    f.category || 'Pedagogy & Digital Learning',
    f.year || '',
    f.mode || 'Online / Virtual',
    f.isFlagship ? 'TRUE' : 'FALSE'
  ]);
  return arrayToCsv(headers, rows);
}

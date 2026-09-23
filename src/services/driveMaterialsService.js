// Google Drive Course Materials Sync Service for Dr. S. Md. Farooq's Academic Portal
// Connects to Dr. Farooq's Google Apps Script Web App:
// https://script.google.com/macros/s/AKfycbwqlEzHKQCGekqiNsZNj4CkyOn_5avnebAwVMZXfZ6zGBPYero58gMywtSBfheaCP_axA/exec

export const GOOGLE_DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/179fppvZLI6fn0p7qmZJYO0wjjYLwnC2w";
export const APPS_SCRIPT_EXEC_URL = "https://script.google.com/macros/s/AKfycbwqlEzHKQCGekqiNsZNj4CkyOn_5avnebAwVMZXfZ6zGBPYero58gMywtSBfheaCP_axA/exec";

const CACHE_KEY = "farooq_portal_drive_materials";
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes cache

// Curated Foundation Course Materials for CSE (R23 & R26 Autonomous Regulations)
// Serves as immediate high-speed fallback & template while Google Drive syncs
export const CURATED_COURSE_MATERIALS = [
  {
    id: "mat-ai-01",
    name: "AI & ML Foundations - Unit 1: Intelligent Agents & State Space Search.pdf",
    category: "Lecture Notes",
    subject: "Artificial Intelligence & Machine Learning",
    regulation: "R26",
    sem: "II-I",
    size: "3.8 MB",
    mimeType: "application/pdf",
    updated: "2026-02-14",
    viewUrl: GOOGLE_DRIVE_FOLDER_URL,
    downloadUrl: GOOGLE_DRIVE_FOLDER_URL,
    featured: true
  },
  {
    id: "mat-ai-02",
    name: "AI & ML Foundations - Unit 2: Informed Heuristic Search & Adversarial Games.pdf",
    category: "Lecture Notes",
    subject: "Artificial Intelligence & Machine Learning",
    regulation: "R26",
    sem: "II-I",
    size: "4.2 MB",
    mimeType: "application/pdf",
    updated: "2026-02-28",
    viewUrl: GOOGLE_DRIVE_FOLDER_URL,
    downloadUrl: GOOGLE_DRIVE_FOLDER_URL,
    featured: true
  },
  {
    id: "mat-ai-qb",
    name: "AI & ML - Comprehensive Question Bank (Bloom's Taxonomy Levels L1-L5).pdf",
    category: "Question Banks",
    subject: "Artificial Intelligence & Machine Learning",
    regulation: "R26",
    sem: "II-I",
    size: "1.9 MB",
    mimeType: "application/pdf",
    updated: "2026-03-01",
    viewUrl: GOOGLE_DRIVE_FOLDER_URL,
    downloadUrl: GOOGLE_DRIVE_FOLDER_URL,
    featured: true
  },
  {
    id: "mat-os-01",
    name: "Operating Systems - Unit 1: System Calls & Kernel Architectures.pdf",
    category: "Lecture Notes",
    subject: "Operating Systems",
    regulation: "R23",
    sem: "II-II",
    size: "2.7 MB",
    mimeType: "application/pdf",
    updated: "2026-01-20",
    viewUrl: GOOGLE_DRIVE_FOLDER_URL,
    downloadUrl: GOOGLE_DRIVE_FOLDER_URL
  },
  {
    id: "mat-os-lab",
    name: "Operating Systems Lab Manual - POSIX Threads & CPU Scheduling Algorithms.pdf",
    category: "Lab Manuals",
    subject: "Operating Systems",
    regulation: "R23",
    sem: "II-II",
    size: "3.1 MB",
    mimeType: "application/pdf",
    updated: "2026-01-25",
    viewUrl: GOOGLE_DRIVE_FOLDER_URL,
    downloadUrl: GOOGLE_DRIVE_FOLDER_URL
  },
  {
    id: "mat-ads-01",
    name: "Advanced Data Structures & Algorithms - B-Trees, Red-Black Trees & AVL Trees.pdf",
    category: "Lecture Notes",
    subject: "Advanced Data Structures",
    regulation: "R23",
    sem: "II-I",
    size: "3.5 MB",
    mimeType: "application/pdf",
    updated: "2025-11-10",
    viewUrl: GOOGLE_DRIVE_FOLDER_URL,
    downloadUrl: GOOGLE_DRIVE_FOLDER_URL
  },
  {
    id: "mat-cn-01",
    name: "Computer Networks - Sliding Window Protocols & Subnetting Guide.pdf",
    category: "Lecture Notes",
    subject: "Computer Networks",
    regulation: "R23",
    sem: "III-I",
    size: "4.6 MB",
    mimeType: "application/pdf",
    updated: "2025-10-18",
    viewUrl: GOOGLE_DRIVE_FOLDER_URL,
    downloadUrl: GOOGLE_DRIVE_FOLDER_URL
  },
  {
    id: "mat-cn-lab",
    name: "Computer Networks & Cisco Packet Tracer Lab Exercises Manual.pdf",
    category: "Lab Manuals",
    subject: "Computer Networks",
    regulation: "R23",
    sem: "III-I",
    size: "5.2 MB",
    mimeType: "application/pdf",
    updated: "2025-10-22",
    viewUrl: GOOGLE_DRIVE_FOLDER_URL,
    downloadUrl: GOOGLE_DRIVE_FOLDER_URL
  },
  {
    id: "mat-py-01",
    name: "Python for Data Science & AI - Complete Practical Workbook.pdf",
    category: "Lab Manuals",
    subject: "Python Programming",
    regulation: "R23",
    sem: "II-I",
    size: "2.8 MB",
    mimeType: "application/pdf",
    updated: "2025-09-15",
    viewUrl: GOOGLE_DRIVE_FOLDER_URL,
    downloadUrl: GOOGLE_DRIVE_FOLDER_URL
  },
  {
    id: "mat-dm-qb",
    name: "Discrete Mathematics & Graph Theory - University End Exam Model Papers.pdf",
    category: "Question Banks",
    subject: "Discrete Mathematics",
    regulation: "R23",
    sem: "II-I",
    size: "1.6 MB",
    mimeType: "application/pdf",
    updated: "2025-12-05",
    viewUrl: GOOGLE_DRIVE_FOLDER_URL,
    downloadUrl: GOOGLE_DRIVE_FOLDER_URL
  },
  {
    id: "mat-cc-01",
    name: "Cloud Computing & Distributed Systems - Virtualization & AWS Architecture.pdf",
    category: "Lecture Notes",
    subject: "Cloud Computing",
    regulation: "R23",
    sem: "IV-I",
    size: "3.9 MB",
    mimeType: "application/pdf",
    updated: "2025-08-30",
    viewUrl: GOOGLE_DRIVE_FOLDER_URL,
    downloadUrl: GOOGLE_DRIVE_FOLDER_URL
  }
];

/**
 * Fetch live files from Dr. Farooq's Google Drive via the Apps Script Web App
 */
export async function fetchDriveMaterials(forceRefresh = false) {
  // Check localStorage cache first
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS && Array.isArray(data) && data.length > 0) {
          return {
            source: 'cache',
            isLive: true,
            files: data,
            lastChecked: new Date(timestamp).toLocaleTimeString()
          };
        }
      }
    } catch {
      // Ignore cache read errors
    }
  }

  // Attempt live fetch from Apps Script
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000); // 9 sec timeout

    const response = await fetch(APPS_SCRIPT_EXEC_URL, {
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      
      // If Apps Script returns an error status or exception
      if (json && json.status === "success" && Array.isArray(json.files)) {
        // Save to cache
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: json.files
          }));
        } catch {
          // Ignore cache write errors
        }

        return {
          source: 'drive',
          isLive: true,
          files: json.files,
          lastChecked: new Date().toLocaleTimeString()
        };
      }
    }
  } catch (err) {
    console.warn("Drive sync check:", err.message);
  }

  // Graceful fallback to curated course materials
  return {
    source: 'fallback',
    isLive: false,
    files: CURATED_COURSE_MATERIALS,
    lastChecked: new Date().toLocaleTimeString(),
    setupNotice: true
  };
}

// Vercel Serverless Function: Secure Server-Side Scopus Author API Proxy
// Author: Dr. S. Md. Farooq (Scopus Author ID: 57202806468)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SCOPUS_AUTHOR_ID = '57202806468';
  const apiKey = process.env.SCOPUS_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      success: true,
      source: 'baseline',
      authorId: SCOPUS_AUTHOR_ID,
      scopusCount: 41,
      ieeeCount: 27,
      totalCitations: 393,
      hIndex: 12,
      hasApiKey: false,
      message: 'Add SCOPUS_API_KEY in Vercel Project Settings > Environment Variables for real-time Elsevier API sync.'
    });
  }

  try {
    const elsRes = await fetch(
      `https://api.elsevier.com/content/author?author_id=${SCOPUS_AUTHOR_ID}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-ELS-APIKey': apiKey
        }
      }
    );

    if (!elsRes.ok) {
      return res.status(200).json({
        success: true,
        source: 'baseline-fallback',
        authorId: SCOPUS_AUTHOR_ID,
        scopusCount: 41,
        status: elsRes.status,
        statusText: elsRes.statusText
      });
    }

    const data = await elsRes.json();
    const authorProfile = data['author-retrieval-response']?.[0];
    const coreData = authorProfile?.coredata || {};

    const docCount = parseInt(coreData['document-count'] || '41', 10);
    const citationCount = parseInt(coreData['citation-count'] || '393', 10);
    const hIndex = parseInt(authorProfile?.['h-index'] || '12', 10);

    return res.status(200).json({
      success: true,
      source: 'live-elsevier-scopus',
      authorId: SCOPUS_AUTHOR_ID,
      scopusCount: Math.max(41, docCount),
      citationCount: Math.max(393, citationCount),
      hIndex: Math.max(12, hIndex),
      hasApiKey: true,
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      source: 'baseline-error-fallback',
      authorId: SCOPUS_AUTHOR_ID,
      scopusCount: 41,
      error: error.message
    });
  }
}

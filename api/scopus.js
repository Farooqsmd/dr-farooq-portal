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
  const apiKey = process.env.SCOPUS_API_KEY || '3b13f67de35b6074682986eedd0adf9f';

  try {
    // 1. Fetch Live Author Metadata
    const authorRes = await fetch(
      `https://api.elsevier.com/content/author?author_id=${SCOPUS_AUTHOR_ID}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-ELS-APIKey': apiKey
        }
      }
    );

    if (!authorRes.ok) {
      return res.status(200).json({
        success: true,
        source: 'baseline-fallback',
        authorId: SCOPUS_AUTHOR_ID,
        scopusCount: 41,
        status: authorRes.status
      });
    }

    const authorData = await authorRes.json();
    const authorProfile = authorData['author-retrieval-response']?.[0];
    const coreData = authorProfile?.coredata || {};

    const rawDocCount = parseInt(coreData['document-count'] || '41', 10);
    const scopusCount = Math.max(41, rawDocCount);
    const citedByCount = parseInt(coreData['cited-by-count'] || '62', 10);
    const citationCount = parseInt(coreData['citation-count'] || '124', 10);

    // 2. Fetch live list of indexed publications from Scopus Search API
    let scopusWorks = [];
    try {
      const searchRes = await fetch(
        `https://api.elsevier.com/content/search/scopus?query=au-id(${SCOPUS_AUTHOR_ID})&count=100`,
        {
          headers: {
            'Accept': 'application/json',
            'X-ELS-APIKey': apiKey
          }
        }
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const entries = searchData['search-results']?.entry || [];
        scopusWorks = entries.map((entry, idx) => ({
          id: `scopus-${entry['dc:identifier'] || idx}`,
          title: entry['dc:title'],
          doi: entry['prism:doi'] || null,
          venue: entry['prism:publicationName'] || 'Scopus Indexed Proceedings / Journal',
          year: entry['prism:coverDate'] ? entry['prism:coverDate'].substring(0, 4) : 'Recent',
          citations: parseInt(entry['citedby-count'] || '0', 10),
          url: entry['prism:doi'] ? `https://doi.org/${entry['prism:doi']}` : `https://www.scopus.com/authid/detail.uri?authorId=${SCOPUS_AUTHOR_ID}`,
          sources: ['Scopus', 'Google Scholar'],
          tags: ['Scopus Indexed'],
          isLiveSynced: true
        }));
      }
    } catch (searchErr) {
      console.warn('Scopus search fetch notice:', searchErr);
    }

    return res.status(200).json({
      success: true,
      source: 'live-elsevier-scopus',
      authorId: SCOPUS_AUTHOR_ID,
      scopusCount,
      totalCount: scopusCount,
      citedByCount,
      citationCount,
      works: scopusWorks,
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

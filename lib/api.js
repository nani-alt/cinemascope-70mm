const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const OMDB_URL = "https://www.omdbapi.com";
const PROXY = "https://api.allorigins.win/get?url="; // 🛡️ bypasses CORS & Vercel issues

function buildURL(url) {
  return `${PROXY}${encodeURIComponent(url)}`;
}

// ⚡ Fetch JSON safely even if HTML returned
async function safeFetch(url) {
  try {
    const res = await fetch(buildURL(url), { cache: "no-store" });
    const dataWrapper = await res.json();

    const data = JSON.parse(dataWrapper.contents);

    if (data.Response === "False") {
      console.warn("❗ OMDb Error:", data.Error);
    }
    return data;
  } catch (err) {
    console.error("❌ Proxy Fetch Error:", err);
    return null;
  }
}

// 🎞️ Trending Movies (Manual Search List)
export async function fetchTrending() {
  const trendingTerms = ["Inception", "RRR", "Batman", "KGF", "Interstellar"];
  let movies = [];

  for (const q of trendingTerms) {
    const url = `${OMDB_URL}/?apikey=${API_KEY}&s=${q}`;
    const data = await safeFetch(url);
    if (data?.Search) movies.push(...data.Search);
  }

  // Remove duplicates
  const unique = Array.from(new Map(movies.map(m => [m.imdbID, m])).values());
  return { results: unique.slice(0, 20) };
}

// 🔍 Search Movies
export async function searchMovies(query) {
  const url = `${OMDB_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
  const data = await safeFetch(url);
  return { results: data?.Search || [] };
}

// 🎬 Get Full Movie Details
export async function getMovieById(imdbID) {
  const url = `${OMDB_URL}/?apikey=${API_KEY}&i=${imdbID}&plot=full`;
  return await safeFetch(url);
}

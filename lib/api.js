const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const OMDB_URL = "https://www.omdbapi.com";
const PROXY = "https://api.allorigins.win/get?url=";

/**
 * Build proxy-safe URL
 */
function buildProxyUrl(url) {
  return `${PROXY}${encodeURIComponent(url)}`;
}

/**
 * Safe fetch that works on Vercel + avoids HTML crashes
 */
async function fetchOMDb(url) {
  try {
    const res = await fetch(buildProxyUrl(url), { cache: "no-store" });
    const wrapper = await res.json();

    if (!wrapper?.contents) return null;

    const data = JSON.parse(wrapper.contents);

    if (data.Response === "False") {
      console.warn("OMDb:", data.Error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("OMDb fetch error:", err);
    return null;
  }
}

/**
 * 🔥 TRENDING MOVIES
 * OMDb has NO real "trending" endpoint.
 * We simulate trending by searching many popular keywords.
 */
export async function fetchTrending() {
  const keywords = [
    "2024",
    "2023",
    "Action",
    "Avengers",
    "Batman",
    "Spider",
    "Mission",
    "Fast",
    "Star",
    "Marvel",
    "DC",
  ];

  let movies = [];

  for (const key of keywords) {
    const data = await fetchOMDb(
      `${OMDB_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(key)}&type=movie&page=1`
    );
    if (data?.Search) movies.push(...data.Search);
  }

  // remove duplicates
  const unique = Array.from(
    new Map(movies.map((m) => [m.imdbID, m])).values()
  );

  return { results: unique.slice(0, 40) };
}

/**
 * 🔍 SEARCH MOVIES (THIS FIXES PUSHPA ISSUE)
 */
export async function searchMovies(query) {
  if (!query || query.trim().length < 2) {
    return { results: [] };
  }

  const data = await fetchOMDb(
    `${OMDB_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`
  );

  return { results: data?.Search || [] };
}

/**
 * 🎬 MOVIE DETAILS
 */
export async function getMovieById(imdbID) {
  if (!imdbID) return null;

  const data = await fetchOMDb(
    `${OMDB_URL}/?apikey=${API_KEY}&i=${imdbID}&plot=full`
  );

  return data;
}

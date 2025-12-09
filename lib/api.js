const API_KEY = process.env.NEXT_PUBLIC_OMDB_KEY;
const OMDB = "https://www.omdbapi.com/";
const PROXY = "https://api.allorigins.win/get?url=";

async function fetchViaProxy(url) {
  try {
    const proxied = PROXY + encodeURIComponent(url);
    const res = await fetch(proxied, { cache: "no-store" });
    const data = await res.json();

    // `allorigins` wraps OMDB JSON inside `contents`
    return JSON.parse(data.contents);
  } catch (error) {
    console.error("Proxy Fetch Error:", error);
    return null;
  }
}

export async function searchMovies(query) {
  const url = `${OMDB}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
  const data = await fetchViaProxy(url);
  return { results: data?.Search || [] };
}

export async function getMovieById(imdbID) {
  const url = `${OMDB}?apikey=${API_KEY}&i=${imdbID}`;
  const data = await fetchViaProxy(url);
  return data || null;
}

export async function fetchTrending() {
  const trendingTitles = ["Inception", "Batman", "Avengers", "RRR", "Interstellar"];
  const results = [];

  for (const title of trendingTitles) {
    const url = `${OMDB}?apikey=${API_KEY}&s=${encodeURIComponent(title)}`;
    const data = await fetchViaProxy(url);
    if (data?.Search) results.push(...data.Search);
  }

  // Remove duplicates by imdbID
  const unique = Array.from(new Map(results.map(m => [m.imdbID, m])).values());
  return { results: unique.slice(0, 20) };
}

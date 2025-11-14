const API_KEY = process.env.NEXT_PUBLIC_OMDB_KEY;
const BASE_URL = "https://www.omdbapi.com";


console.log("OMDb API Key loaded:", API_KEY);


async function safeFetch(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await res.text();

    
    if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
      console.error("❌ OMDb returned HTML instead of JSON. URL:", url);
      return null;
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("❌ Fetch failed:", error);
    return null;
  }
}

export async function fetchTrending() {
  try {
    const queries = ["Inception", "Batman", "Avengers", "Interstellar", "Matrix"];
    const results = [];

    for (const q of queries) {
      const url = `${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(q)}`;
      const data = await safeFetch(url);
      if (data?.Search) results.push(...data.Search);
    }

    const unique = Array.from(new Map(results.map(m => [m.imdbID, m])).values());

    return { results: unique.slice(0, 20) };
  } catch (error) {
    console.error("❌ Error fetching trending:", error);
    return { results: [] };
  }
}
export async function searchMovies(query) {
  try {
    const url = `${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
    const data = await safeFetch(url);

    return { results: data?.Search || [] };
  } catch (error) {
    console.error("❌ Error searching:", error);
    return { results: [] };
  }
}

export async function getMovieById(imdbID) {
  try {
    const url = `${BASE_URL}/?apikey=${API_KEY}&i=${imdbID}&plot=full`;
    const data = await safeFetch(url);

    return data || null;
  } catch (error) {
    console.error("❌ Error fetching movie details:", error);
    return null;
  }
}

import MovieDetailClient from "./MovieDetailClient";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { imdbID } = await params; // ⬅️ FIX: unwrap promise
  return <MovieDetailClient imdbID={imdbID} />;
}

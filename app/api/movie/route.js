import { getMovieById } from "@/lib/api";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const movie = await getMovieById(id);
  return Response.json(movie);
}

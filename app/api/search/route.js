import { searchMovies } from "@/lib/api";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const data = await searchMovies(query);
    return Response.json(data);
  } catch (error) {
    console.error("Error in /api/search:", error);
    return Response.json({ results: [] }, { status: 500 });
  }
}

import { fetchTrending } from "@/lib/api";

export async function GET() {
  try {
    const data = await fetchTrending();
    return Response.json(data);
  } catch (error) {
    console.error("Error in /api/trending:", error);
    return Response.json({ results: [] }, { status: 500 });
  }
}

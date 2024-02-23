import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const bearerToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzhjNzNlZmJiZTNhMzc0MzM0NWQ2ZjQzNDM3MTIzYyIsInN1YiI6IjY1YTk0YWM1MGU1YWJhMDEzMjdkZjlhYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ec__noV-OUy1tp7k22oB2EwSZovUoALysF62Hz2CD94";
  const response = await fetch(
    "https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&vote_count.gte=3500&page=1&with_original_language=en&with_genres=16",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return NextResponse.json(
    { data },
    {
      status: 200,
    }
  );
}

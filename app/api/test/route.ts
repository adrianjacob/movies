import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

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
  const data2 = await response.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data, error } = await supabase
    .from("countries")
    .upsert({ id: "3242342", title: "Albania", year: "1999" })
    .select();
  // console.log(data2);
  return NextResponse.json(data2);
}

// change ID to number in supabase and use upsert as request
export async function POST(request: Request) {
  // const res = await request.json();
  // const { movie } = await request.json();
  // const cookieStore = cookies();
  // const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  // const { data } = await supabase.from("movies").insert({ movie }).select();
  // return NextResponse.json(data);
  return NextResponse.json({ foo: "bar" });
}

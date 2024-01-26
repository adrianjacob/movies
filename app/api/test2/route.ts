import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    // code to hit API end point for TMDB
    // below is a test
    await supabase
      .from("movies")
      .upsert([
        {
          id: Math.floor(1000 + Math.random() * 9000).toString(),
          title: "hello world",
          year: 1999,
        },
      ])
      .select();

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

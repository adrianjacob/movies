import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Header from "@/app/components/header";
import Toggle from "@/app/components/toggle";

import type { Database } from "@/lib/database.types";

export default async function List({
  params: { id },
}: {
  params: { id: number };
}) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: movies, error } = await supabase
    .from("associations")
    .select(
      `
        *,
        movies (*)
      `
    )
    .eq("listId", id)
    .order("rank", { ascending: true });

  const { data: watched } = await supabase
    .from("watched")
    .select("*")
    .eq("user", user?.id);

  //console.log(movies[0]);
  // console.log(watched);
  // console.log(user?.id);

  return (
    <>
      <main>
        {user && (
          <>
            <div className="highlight">{user?.email}</div>
            <div>
              <img
                className="w-16 h-16 rounded-full"
                src={user?.user_metadata?.avatar_url}
                referrerPolicy="no-referrer"
              />
            </div>
          </>
        )}

        <Header />
        <Link href="/">Home</Link>
        <div className="relative">
          <div className="bg-gradient-to-t from-slate-950 to-transparent absolute w-full h-full"></div>
          <div className="absolute w-full h-full flex items-center justify-center font-semibold text-5xl">
            TOP 100 XXXXXX
          </div>
          <img
            src={`https://image.tmdb.org/t/p/original/${movies[0].movies.backdropPath}`}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies?.map(({ movieId, rank, movies }, index) => {
            const isWatched = watched?.find((w) => w.movie === movieId);
            const movieWatchedId = isWatched ? isWatched.id : null;
            return (
              <div key={index}>
                <div>{rank}</div>
                <div>{movieId}</div>
                <div>{movies?.title}</div>
                <div>
                  <img
                    src={`https://image.tmdb.org/t/p/original/${movies?.posterPath}`}
                  />
                </div>
                <div>
                  <img
                    src={`https://image.tmdb.org/t/p/original/${movies?.backdropPath}`}
                  />
                </div>
                <div>xxxxx</div>
                <div>{isWatched && "WATCHED"}</div>
                <div>
                  <Toggle {...{ movieId, user, id: movieWatchedId }} />
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

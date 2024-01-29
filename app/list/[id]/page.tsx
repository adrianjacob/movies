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
    .eq("listId", id);

  const { data: watched } = await supabase
    .from("watched")
    .select("*")
    .eq("user", user?.id);

  // console.log(movies);
  console.log(watched);
  // console.log(user?.id);

  return (
    <>
      <main className="p-24">
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
        <div className="grid grid-cols-4 gap-4">
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

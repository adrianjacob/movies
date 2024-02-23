import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
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

  const { data: lists } = await supabase.from("lists").select().eq("id", id);

  return (
    <>
      <main>
        <div className="flex">
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
          <Link href="/">Home</Link>
          <Header />
        </div>

        <div className="relative max-h-[66vh] overflow-hidden">
          <div className="bg-gradient-to-t from-slate-950 to-transparent absolute w-full h-full"></div>
          <div className="absolute w-full h-full flex items-center justify-center text-center text-4xl [text-shadow:_0_3px_3px_rgb(0_0_0_/_50%)]">
            {/* TOP 100 {lists[0].title} */}
            <div>
              <div>TOP 100</div>
              <div className="uppercase font-bold text-8xl font-semibold my-2 ">
                {lists[0].title}
              </div>
              <div>FILMS</div>
              <div className="text-sm mt-10 opacity-40">
                (Last updated:{" "}
                {new Date(lists[0].created_at).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                )
              </div>
            </div>
          </div>
          <img
            src={`https://image.tmdb.org/t/p/w1280/${movies[0].movies.backdropPath}`}
            loading="eager"
            fetchPriority="high"
            className="w-full h-auto object-cover max-h-[66vh]"
            width="1280"
            height="720"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8 p-10">
          {movies?.map(({ movieId, rank, movies }, index) => {
            const isWatched = watched?.find((w) => w.movie === movieId);
            const movieWatchedId = isWatched ? isWatched.id : null;
            return (
              <div
                key={index}
                className="border-solid border-2 border-slate-800 rounded-lg overflow-hidden relative transition-all hover:transform hover:translate-y-[-2px] hover:border-slate-500"
              >
                <div className="relative overflow-hidden">
                  <div className="bg-gradient-to-t from-slate-950 to-transparent absolute w-full h-32 absolute bottom-0"></div>
                  <Toggle {...{ movieId, user, id: movieWatchedId }} />
                  <img
                    src={`https://image.tmdb.org/t/p/w780/${movies?.posterPath}`}
                    loading="lazy"
                    width="780"
                    height="1170"
                    className={`${!isWatched && "blur"}`}
                  />
                  <div
                    className={`absolute w-full h-full flex items-center justify-center inset-0 text-center p-4 opacity-90 ${!isWatched && "bg-zinc-400"}`}
                  ></div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between">
                    <div className="text-slate-500 text-sm">#{rank}</div>
                    <div className="text-slate-500 text-sm">
                      {movies?.voteAverage}/10
                    </div>
                  </div>
                  <div className="text-balance font-semibold my-1">
                    {movies?.title}
                  </div>
                  <div className="text-slate-500 text-sm">({movies?.year})</div>
                  <div></div>
                  {/* <div>{isWatched && "WATCHED"}</div> */}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

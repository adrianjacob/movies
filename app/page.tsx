import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Header from "@/app/components/header";
import Add from "@/app/components/add";

import type { Database } from "@/lib/database.types";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get all the lists
  const { data: lists } = await supabase.from("lists").select();

  // Get details (image) of the top ranked moveie in each category
  const { data: associations } = await supabase
    .from("associations")
    .select(`listId, movies (backdropPath)`)
    .eq("rank", 1);

  // Get all movies - can then double check if movieId of watched is in list
  const { data: all } = await supabase
    .from("associations")
    .select(`listId, movieId`);

  // Get watched movie IDs based on the userId
  const { data: watched } = await supabase
    .from("watched")
    .select(`movie`)
    .eq("user", user?.id);

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

          <Header />
        </div>
        <div className="grid grid-cols-4 gap-8 text-center p-10">
          {lists?.map((item, index) => {
            const filteredFoo = all
              ?.filter((movie) => movie.listId === item.id)
              ?.filter((obj) =>
                watched?.some((item) => obj.movieId === item.movie)
              );

            return (
              <Link
                key={index}
                className="border-solid border-2 border-slate-800 rounded-lg overflow-hidden transition-all hover:border-slate-500"
                href={`/list/${item.id}`}
              >
                <div className="relative">
                  <div className="bg-gradient-to-t from-slate-950 to-transparent absolute w-full h-full"></div>
                  <div className="absolute w-full h-full flex items-center justify-center [text-shadow:_0_3px_3px_rgb(0_0_0_/_30%)]">
                    <div>
                      <div>TOP 100</div>
                      <div className="uppercase font-bold text-4xl">
                        {item.title}
                      </div>
                      <div>FILMS</div>
                    </div>
                  </div>

                  <img
                    src={`https://image.tmdb.org/t/p/w780/${associations.find((obj) => obj.listId === item.id)?.movies?.backdropPath}`}
                    loading="lazy"
                    width="780"
                    height="439"
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between text-sm text-slate-300 mb-1">
                    <div>PROGRESS</div>
                    <div>{filteredFoo?.length}%</div>
                  </div>

                  <div className="border-solid border-2 border-slate-800 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  flex justify-end">
                    <div
                      className="h-3 w-12 bg-slate-950"
                      style={{ width: 100 - filteredFoo?.length + "%" }}
                    ></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {/* <br />
        <br />
        <Add /> */}
      </main>
    </>
  );
}

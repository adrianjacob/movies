import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Header from "@/app/components/header";

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

  console.log(movies);

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
        <div>list page {id}</div>
        {movies?.map(({ movieId, rank, movies }, index) => {
          return (
            <div>
              {movieId},{movies.title},{rank}
            </div>
          );
        })}
      </main>
    </>
  );
}

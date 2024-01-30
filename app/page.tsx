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

  const { data: lists } = await supabase.from("lists").select();
  const { data: associations } = await supabase
    .from("associations")
    .select(`listId, movies (backdropPath)`)
    .eq("rank", 1);

  console.log(associations);

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
        <div className="grid grid-cols-4 gap-4 text-center">
          {lists?.map((item, index) => {
            console.log(item);
            return (
              <Link
                key={index}
                className="p-12 border-solid border-2 border-slate-700 rounded-md"
                href={`/list/${item.id}`}
              >
                <div>TOP 100</div>
                <div className="uppercase font-semibold text-2xl">
                  {item.title}
                </div>
                <div>FILMS</div>
                <img
                  src={`https://image.tmdb.org/t/p/original/${associations.find((obj) => obj.listId === item.id)?.movies?.backdropPath}`}
                />
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

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Header from "@/app/components/header";

import type { Database } from "@/lib/database.types";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: lists, error } = await supabase.from("lists").select();

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
        <div>complete imdb</div>
        {lists?.map((item, index) => {
          return (
            <Link
              key={index}
              className="p-4 border-solid border-2 border-slate-500 inline-flex"
              href={`/list/${item.id}`}
            >
              {item.title}
            </Link>
          );
        })}
      </main>
    </>
  );
}

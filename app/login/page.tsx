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

  return (
    <>
      <main>
        <div>LOGIN</div>
        <Header />
      </main>
    </>
  );
}

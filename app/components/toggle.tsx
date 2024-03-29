"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import type { Database } from "@/lib/database.types";

interface ToggleProps {
  movieId: string;
  user: Record<string, any> | null;
  id: number | null;
}

export default function Toggle({ movieId, user, id }: ToggleProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  // console.log(movieId, user, id);

  const handleToggle = async () => {
    if (id) {
      const { error } = await supabase.from("watched").delete().eq("id", id);
    } else {
      const { error } = await supabase.from("watched").insert({
        user: user?.id,
        movie: movieId,
      });
    }

    router.refresh();
    // better to use revalidatePath()?
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className="underline absolute z-10 w-full h-full"
        title={id ? "Mark as unwatched" : "Mark as watched"}
      >
        {/* {id ? "UNMARK AS WATCHED" : "MARK AS WATCHED"} */}
      </button>
    </>
  );
}

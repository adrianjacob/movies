"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import type { Database } from "@/lib/database.types";

export default function Toggle({ movieId, user, id }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleToggle = async () => {
    if (id) {
      const { error } = await supabase.from("watched").delete().eq("id", id);
    } else {
      const { error } = await supabase.from("watched").insert({
        user: user.id,
        movie: movieId,
      });
    }

    router.refresh();
  };

  return (
    <>
      <button onClick={handleToggle}>Toggle</button>
    </>
  );
}

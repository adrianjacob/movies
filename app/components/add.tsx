"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import type { Database } from "@/lib/database.types";

export default function Add() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleAdd = async () => {
    const { data, error } = await supabase
      .from("movies")
      .upsert([{ id: "45435345", title: "hello world", year: 1999 }]) //use upsert when doing for real
      .select();

    //router.refresh();
    // better to use revalidatePath()?
  };

  return (
    <>
      <button onClick={handleAdd} className="p-4 bg-yellow-600">
        Add film (test)
      </button>
    </>
  );
}

"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import type { Database } from "@/lib/database.types";

// GENRE IDS
// MOVIE
// Action          28
// Adventure       12
// Animation       16
// Comedy          35
// Crime           80
// Documentary     99
// Drama           18
// Family          10751
// Fantasy         14
// History         36
// Horror          27
// Music           10402
// Mystery         9648
// Romance         10749
// Science Fiction 878
// TV Movie        10770
// Thriller        53
// War             10752
// Western         37

const genres = {
  action: 28,
  adventure: 12,
  animation: 16,
};

export default function Add() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  //router.refresh();
  // better to use revalidatePath()?

  const handleAdd = async () => {
    const bearerToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzhjNzNlZmJiZTNhMzc0MzM0NWQ2ZjQzNDM3MTIzYyIsInN1YiI6IjY1YTk0YWM1MGU1YWJhMDEzMjdkZjlhYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ec__noV-OUy1tp7k22oB2EwSZovUoALysF62Hz2CD94";

    const foo = async (genre, genreId, i) => {
      const response = await fetch(
        `https://api.themoviedb.org/4/discover/movie?sort_by=vote_average.desc&vote_count.gte=3500&page=${i}&with_original_language=en&with_genres=${genreId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      const extractedData = data.results.map(
        ({
          id,
          release_date,
          title,
          vote_average,
          backdrop_path,
          poster_path,
          overview,
        }) => {
          return {
            id: id,
            year: parseInt(release_date.split("-")[0]),
            title: title,
            voteAverage: vote_average,
            backdropPath: backdrop_path,
            posterPath: poster_path,
            overview: overview,
          };
        }
      );

      const extractedData2 = data.results.map(({ id }, index) => {
        return {
          movieId: id,
          listId: genreId,
          rank: data.page === 1 ? index + 1 : data.page * 10 + index + 1,
        };
      });

      // add to movies
      await supabase.from("movies").upsert(extractedData).select();

      // add to lists
      await supabase
        .from("lists")
        .upsert({
          title: genre,
          id: genreId,
          created_at: new Date().toISOString(),
        })
        .select();

      // TODO add to association
      await supabase.from("associations").upsert(extractedData2).select();
    };

    // Create an array to hold all the promises
    const promises = [];

    // Object.entries(genres).map(([genre, id]) => {
    //   for (let i = 1; i <= 2; i++) {
    //     promises.push(foo(genre, id, i));
    //   }
    // });

    await supabase.from("associations").delete().neq("id", 0); // delete all rows as order may have changed

    Object.entries(genres).map(async ([genre, id]) => {
      for (let i = 1; i <= 2; i++) {
        await foo(genre, id, i);
      }
    });

    await Promise.all(promises);
  };

  return (
    <>
      <button onClick={handleAdd} className="p-4 bg-yellow-600">
        Add film (test)
      </button>
    </>
  );
}

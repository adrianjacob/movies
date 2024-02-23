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
  // ab: {
  //   id: 1, // Not a tmdb list but using it for top of all time
  //   vote_count_min: 3000,
  // },
  action: {
    id: 28,
    vote_count_min: 3000,
  },
  adventure: {
    id: 12,
    vote_count_min: 3000,
  },
  animation: {
    id: 16,
    vote_count_min: 3000,
  },
  comedy: {
    id: 35,
    vote_count_min: 3000,
  },
  crime: {
    id: 80,
    vote_count_min: 3000,
  },
  documentary: {
    id: 99,
    vote_count_min: 300,
  },
  drama: {
    id: 18,
    vote_count_min: 3000,
  },
  family: {
    id: 10751,
    vote_count_min: 3000,
  },
  fantasy: {
    id: 14,
    vote_count_min: 3000,
  },
  history: {
    id: 36,
    vote_count_min: 1750,
  },
  horror: {
    id: 27,
    vote_count_min: 3000,
  },
  music: {
    id: 10402,
    vote_count_min: 750,
  },
  mystery: {
    id: 9648,
    vote_count_min: 3000,
  },
  romance: {
    id: 10749,
    vote_count_min: 3500,
  },
  "sci-fi": {
    id: 878,
    vote_count_min: 3500,
  },
  thriller: {
    id: 53,
    vote_count_min: 3500,
  },
  war: {
    id: 10752,
    vote_count_min: 1000,
  },
  western: {
    id: 37,
    vote_count_min: 350,
  },
};

export default function Add() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  //router.refresh();
  // better to use revalidatePath()?

  const handleAdd = async () => {
    const bearerToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzhjNzNlZmJiZTNhMzc0MzM0NWQ2ZjQzNDM3MTIzYyIsInN1YiI6IjY1YTk0YWM1MGU1YWJhMDEzMjdkZjlhYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ec__noV-OUy1tp7k22oB2EwSZovUoALysF62Hz2CD94";

    const foo = async (genre, genreId, genreVotes, i) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&vote_count.gte=${genreVotes}&page=${i}&with_original_language=en&with_genres=${genreId}`,
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

    // 20 per 'page'
    Object.entries(genres).map(async ([genre, genreData]) => {
      for (let i = 1; i <= 2; i++) {
        await foo(genre, genreData.id, genreData.vote_count_min, i);
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

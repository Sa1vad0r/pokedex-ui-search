"use client";
import { useState } from "react";
import { fetchPokemon } from "./api/pokeApi";
import { PokemonApiResponse } from "./types/pokemon";

function App() {
  // State variables
  const [query, setQuery] = useState<string>("");
  const [pokemon, setPokemon] = useState<PokemonApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  //searches for pokemon after submit
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPokemon(null);

    //catches pottential errors
    try {
      const data = await fetchPokemon(query);
      setPokemon(data);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div>
      <div className=" flex p-4 bg-red-100 shadow-md">
        <h1 className="flex my-auto font-bold w-1/3 text-3xl">
          Pokémon Search
        </h1>
        <form
          className="flex w-1/3 bg-white rounded-lg shadow-md p-2"
          onSubmit={handleSearch}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Pokémon name"
            className="flex-1 p-2 outline-none"
          />
          <button
            className="bg-red-400 px-5 py-3 rounded-lg ml-auto"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>

      {error && <p>{error}</p>}

      {pokemon && (
        <div className="flex flex-row space-x-7 p-4 h-screen bg-gray-100 shadow-md mt-4">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="w-64 bg-gray-200 h-64 object-contain"
          />
          <div className="flex flex-col">
            <h2 className="font-bold text-4xl mb-5">
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h2>

            <p className="ml-7">
              <strong>Types:</strong>{" "}
              {pokemon.types.map((t) => t.type.name).join(", ")}
            </p>
            <p className="ml-7">
              <strong>Height:</strong> {pokemon.height} decimetres
            </p>
            <p className="ml-7">
              <strong>Weight:</strong> {pokemon.weight} hectograms
            </p>
            <p className="ml-7 ">
              <strong>Stats:</strong>{" "}
              {pokemon.stats
                .map((s) => `${s.stat.name}: ${s.base_stat}`)
                .join(", ")}
            </p>
            <p className="ml-7">
              <strong>Abilities:</strong>{" "}
              {pokemon.abilities.map((a) => a.ability.name).join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

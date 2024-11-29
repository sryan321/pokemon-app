"use client";

import { useState, useEffect } from "react";
import PokemonCard from "../components/PokemonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(false); // New state for search mode

  const fetchPokemon = async (page = 1) => {
    if (searchMode) return; // Skip default fetch in search mode

    setLoading(true);
    const limit = 12;
    const offset = (page - 1) * limit;
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );

      setPokemonData(pokemonDetails);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchPokemon = async () => {
    if (!searchTerm.trim()) return; // Do nothing if search term is empty

    setLoading(true);
    setSearchMode(true); // Activate search mode
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error("Pokémon not found");
      }

      const data = await response.json();
      setPokemonData([data]); // Wrap the result in an array for consistency
    } catch (error) {
      console.error("Error searching Pokémon:", error);
      setPokemonData([]); // Clear the results if no Pokémon is found
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchMode) {
      fetchPokemon(page);
    }
  }, [page, searchMode]);

  return (
    <div className="">
      {/* Header - Landing Section */}
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold">Pokémon Browser</h1>
        <p className="text-lg font-bold text-gray-500">Search and find Pokémon</p>
        <hr className="border-t border-gray-300 mt-14" />
      </header>

      {/* Main Body */}
      <div className="mx-32">
        {/* Search Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl">Explore Pokémon</h2>
          <div className="flex space-x-2">
            <Input
              placeholder="Find Pokémon"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!e.target.value.trim()) setSearchMode(false); // Reset search mode if input is cleared
              }}
              className="w-64"
            />
            <Button onClick={searchPokemon}>Search</Button>
          </div>
        </div>

        {/* Pokémon Grid or Loading Spinner */}
        <div className="grid grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-4 flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-600"></div>
            </div>
          ) : pokemonData.length > 0 ? (
            pokemonData.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-600">
              No Pokémon found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {!searchMode && (
          <div className="flex justify-center gap-4 mt-6">
            {/* Back Button */}
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className={`flex items-center ${
                page === 1 ? "bg-gray-800 cursor-not-allowed" : "text-white"
              }`}
              disabled={page === 1}
            >
              ← Back
            </Button>

            {/* Next Button */}
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              className="flex items-center"
            >
              Next →
            </Button>
          </div>
        )}
      </div>
      {/* End of main body. */}

      {/* Footer */}
      <hr className="border-t border-gray-300 mt-12" />
      <footer className="text-center mt-24">
        <p className="font-bold mb-16">Thank you for using the Pokémon Browser!</p>
      </footer>
    </div>
  );
}

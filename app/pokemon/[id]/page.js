"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PokemonDetail({ params }) {
  const [pokemon, setPokemon] = useState(null);
  const [description, setDescription] = useState("");
  const [ability, setAbility] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);  // State for weaknesses
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);

  useEffect(() => {
    // Resolve params and extract `id`
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    // Fetch Pokémon details and species description
    async function fetchPokemon() {
      setLoading(true);
      try {
        // Fetch Pokémon details
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        setPokemon(data);

        // Fetch Pokémon species for the description
        const speciesResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );
        const speciesData = await speciesResponse.json();

        const englishDescription = speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        setDescription(
          englishDescription
            ? englishDescription.flavor_text.replace(/\f/g, " ")
            : "No description available."
        );

        // Fetch the ability details
        if (data.abilities && data.abilities[0]) {
          const abilityUrl = data.abilities[0].ability.url;
          const abilityResponse = await fetch(abilityUrl);
          const abilityData = await abilityResponse.json();
          setAbility(abilityData);
        }

        // Fetch weaknesses based on types
        const fetchedWeaknesses = await getWeaknessesFromTypes(data.types);
        setWeaknesses(fetchedWeaknesses);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon();
  }, [id]);

  // Function to fetch weaknesses based on types
  const getWeaknessesFromTypes = async (types) => {
    const weaknesses = [];

    // Loop through each type and fetch its damage relations
    for (const type of types) {
      const response = await fetch(type.type.url);
      const typeData = await response.json();

      // Get weaknesses from 'damage_relations'
      const typeWeaknesses = typeData.damage_relations.double_damage_from;
      typeWeaknesses.forEach((weakness) => {
        if (!weaknesses.includes(weakness.name)) {
          weaknesses.push(weakness.name);
        }
      });
    }

    return weaknesses;
  };

  // Display loading spinner
  if (loading)
    return (
      <div className="col-span-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-600"></div>
      </div>
    );

  if (!pokemon) return <p className="text-center mt-8">Pokémon not found!</p>;

  const formattedId = id.toString().padStart(4, "0");
  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  return (
    <div>
      {/* Header */}
      <header className="text-left">
        <h1 className="text-2xl font-bold my-6 ml-14">Pokémon Browser</h1>
        <div className="relative bg-neutral-300 h-40 w-full mb-36">
          <div className="absolute top-[125%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-100 w-44 h-44 mx-auto rounded-full flex justify-center items-center border border-neutral-50 border-4">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-36 h-36"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Pokémon Header */}
        <div className="text-center mt-20">
          <div className="flex justify-center items-center gap-4">
            <h2 className="text-3xl font-bold capitalize">{pokemon.name}</h2>
            <p className="text-zinc-500 text-3xl font-bold">#{formattedId}</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-neutral-100 rounded-lg shadow-md p-4 mt-6 flex items-center">
          {/* Pokeball image */}
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="Pokéball"
            className="w-16 h-16 mr-2"
          />
          {/* Description text */}
          <p className="text-center">{description}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {/* Column 1: Details on the Left */}
          <div className="col-span-1 border border-gray-300 rounded-lg px-10 py-8 space-y-4">
            {/* Height */}
            <div>
              <p className="font-bold">Height</p>
              <p className="text-sm">{pokemon.height / 10}m</p>
            </div>

            {/* Category */}
            <div>
              <p className="font-bold">Category</p>
              <p className="text-sm">{description.category || "N/A"}</p>
            </div>

            {/* Weight */}
            <div>
              <p className="font-bold">Weight</p>
              <p className="text-sm">{pokemon.weight / 10}kg</p>
            </div>

            {/* Gender */}
            <div>
              <p className="font-bold">Gender</p>
              <p className="text-sm">Male / Female</p>
            </div>
          </div>

          {/* Column 2 and 3: Type and Weaknesses & Ability */}
          <div className="col-span-2 space-y-4">
            {/* Row 1: Type and Weaknesses */}
            <div className="grid grid-cols-2 gap-4">
              {/* Type and Weakness Section */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-4">Type</h3>
                <div className="flex gap-2 mt-2">
                  {pokemon.types.map((type) => (
                    <div
                      key={type.type.name}
                      className="bg-gray-800 text-white rounded-full px-3 py-1 text-sm font-semibold capitalize"
                    >
                      {type.type.name}
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold mt-6 mb-4">Weaknesses</h3>
                <div className="flex flex-wrap gap-2 mt-2 mb-12">
                
                  {weaknesses.map((weakness) => (
                    <div
                      key={weakness}
                      className="bg-gray-300 text-black rounded-full px-3 py-1 text-sm font-semibold capitalize"
                      aria-label={`Weakness: ${weakness}`}
                    >
                      {weakness}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ability Section */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-4">Ability</h3>
                {ability ? (
                  <>
                    <p className="font-bold capitalize">{ability.name}</p>
                    <p>{ability.effect_entries?.find((entry) => entry.language.name === "en")?.effect || "No description available."}</p>
                  </>
                ) : (
                  <p>Loading ability...</p>
                )}
              </div>
            </div>

            {/* Row 2: Stats Section */}
            <div className="border border-gray-300 rounded-lg p-8 mt-6 font-bold">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="mb-4 flex items-center gap-4">
                  <p className="capitalize w-52">{stat.stat.name}</p>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full"
                      style={{ width: `${stat.base_stat}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Return Home */}
        <div className="text-left mt-8">
          <Link
            href="/"
            className="bg-neutral-800 text-white py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            ← Return Home
          </Link>
        </div>
      </main>

      <hr className="border-t border-gray-300 mt-12" />

      {/* Footer */}
      <footer className="text-center mt-24">
        <p className="font-bold mb-16">Thank you for using the Pokémon Browser!</p>
      </footer>
    </div>
  );
}
// components/PokemonCard.js
"use client"

import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function PokemonCard({ pokemon }) {

    // Format index with leading zeros (e.g., #0001)
    const formattedId = pokemon.id.toString().padStart(4, '0');

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <Card className="flex flex-col items-start text-left hover:shadow-lg transition-shadow">
        {/* Pokémon Image with a light grey background */}
        <div className="bg-gray-100 w-full h-32 flex justify-center items-center rounded-t-lg">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-32 h-32 object-contain"/>
        </div>
        
        {/* Pokemon Name */}
        <h3 className="font-bold capitalize mx-4 mt-2">{pokemon.name}</h3>
        
        {/* Pokemon Index */}
        <p className="mx-4 text-neutral-500 text-xs font-bold">#{formattedId}</p>
        
        {/* Pokemon Types */}
        <div className="flex flex-wrap gap-2 mx-4 my-5">
          {pokemon.types.map((type) => (
            <div key={type.type.name} className="bg-neutral-600 text-white rounded-lg px-2 py-1 text-xs font-semibold capitalize">
              {type.type.name}
          </div>
          ))}
        </div>
      </Card>
    </Link>
  );
}
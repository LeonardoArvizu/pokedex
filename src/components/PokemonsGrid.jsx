import React, { useEffect, useState, useRef } from "react";
import { getPokemonsAxios, getPokemonsNextUrl } from "../services/pokemons";

const PokemonsGrid = () => {
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);
  const observer = useRef();

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const data = await getPokemonsAxios();
        if (!data) return;
        setPokemons(data[0]);
        setNextUrl(data[1]);
        setError(null);
      } catch (error) {
        setError("Failed to fetch Pokémon data. Please try again later.");
      }
    };
    fetchPokemons();
  }, []);


  useEffect(() => {
    if (!nextUrl) return;

		const loadMorePokemons = async () => {
			try {
				const data = await getPokemonsNextUrl(nextUrl);
				if (!data) return;
				const newPokemonsList = [...pokemons, ...data[0]];
				setPokemons(newPokemonsList);
				setNextUrl(data[1]);
				setError(null);
			} catch (error) {
				setError("Failed to load more Pokémon. Please try again later.");
			}
		};

    const lastElement = document.querySelector("#loadMore");
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextUrl) {
        loadMorePokemons();
      }
    });

    if (lastElement) observer.current.observe(lastElement);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextUrl]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Imagen</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Nombre</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {pokemons.map((pokemon) => (
            <tr key={pokemon.data.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {pokemon.data.id}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <img
                  src={pokemon.data.sprites.front_default}
                  alt={pokemon.data.name}
                />
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {pokemon.data.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {pokemon.data.types
                  .map((typeInfo) => typeInfo.type.name)
                  .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div id="loadMore" style={{ height: "20px" }}></div>
    </>
  );
};

export default PokemonsGrid;

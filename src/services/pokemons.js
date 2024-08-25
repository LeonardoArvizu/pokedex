import axios from "axios";

export const getPokemonsFetch = async () => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Para crear un api, en ves de poner axios.get seria api.get seguido de la ruta despues de la url.
// Ejemplo: baseURL = 'http://api.com/api/'
// api.get('/pokemons')
//   const api = axios.create({
//     baseURL: BASE_URL,
//     timeout: 10000, // Puedes ajustar el tiempo de espera según tus necesidades
//   });

export const getPokemonsAxios = async () => {
  try {
    const response = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=20"
    );
    const pokemonDetails = await Promise.all(
      response.data.results.map((pokemon) => axios.get(pokemon.url))
    );
    const arrayResult = [pokemonDetails, response.data.next];
    return arrayResult;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getPokemonsNextUrl = async (nextUrl) => {
  try {
    const response = await axios.get(nextUrl);
    const pokemonDetails = await Promise.all(
      response.data.results.map((pokemon) => axios.get(pokemon.url))
    );
    const arrayResult = [pokemonDetails, response.data.next];
    return arrayResult;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

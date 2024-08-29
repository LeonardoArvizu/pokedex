import React, { useEffect, useState, useRef } from "react";
import { getPokemonsAxios, getPokemonsNextUrl } from "../services/pokemons";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
  Box,
  CircularProgress,
} from "@mui/material";

//CSS
// eslint-disable-next-line no-unused-vars
import cssModule from "./PokemonGrid.module.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const PokemonsGrid = () => {
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const fetchPokemons = async () => {
      // Simulamos el loading con un timeout
      setTimeout(async () => {
        try {
          const data = await getPokemonsAxios();
          if (!data) return;
          setPokemons(data[0]);
          setNextUrl(data[1]);
          setError(null);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setError("Failed to fetch Pokémon data. Please try again later.");
        }
      }, 2000);
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

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple-table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                ID
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Imagen
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Nombre
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Tipo
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pokemons.map((pokemon, index) => {
              return (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{pokemon.data.id}</TableCell>
                  <TableCell align="center">
                    <img
                      src={pokemon.data.sprites.front_default}
                      alt={pokemon.data.name}
                    />
                  </TableCell>
                  <TableCell align="center">{pokemon.data.name}</TableCell>
                  <TableCell align="center">
                    {pokemon.data.types
                      .map((typeInfo) => typeInfo.type.name)
                      .join(", ")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div id="loadMore" style={{ height: "20px" }}></div>
    </ThemeProvider>
  );
};

export default PokemonsGrid;

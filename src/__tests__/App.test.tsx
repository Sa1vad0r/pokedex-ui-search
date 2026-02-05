import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "../app/page";
import { fetchPokemon } from "../app/api/pokeApi";

import userEvent from "@testing-library/user-event";

jest.mock("../app/api/pokeApi", () => ({
  fetchPokemon: jest.fn(),
}));

const mockedFetchPokemon = fetchPokemon as jest.Mock;

test("shows the main screen with title and search controls", () => {
  render(<App />);

  expect(screen.getByText(/Pokémon Search/i)).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText(/Enter Pokémon name/i),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
});

test("returns and displays the searched pokemon", async () => {
  mockedFetchPokemon.mockResolvedValueOnce({
    name: "pikachu",
    height: 4,
    weight: 60,
    types: [{ type: { name: "electric" } }],
    abilities: [{ ability: { name: "static" } }],
    stats: [{ stat: { name: "hp" }, base_stat: 35 }],
    sprites: {
      other: {
        "official-artwork": {
          front_default: "pikachu.png",
        },
      },
    },
  });

  render(<App />);

  await userEvent.type(
    screen.getByPlaceholderText(/enter pokémon name/i),
    "pikachu",
  );

  await userEvent.click(screen.getByRole("button", { name: /search/i }));

  expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
});

test("shows an error when pokemon is not found", async () => {
  mockedFetchPokemon.mockRejectedValueOnce(new Error("Pokemon not found"));

  render(<App />);

  await userEvent.type(
    screen.getByPlaceholderText(/enter pokémon name/i),
    "notapokemon",
  );

  await userEvent.click(screen.getByRole("button", { name: /search/i }));

  expect(await screen.findByText(/pokemon not found/i)).toBeInTheDocument();
});

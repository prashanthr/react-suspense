// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import React from 'react'
import { PokemonDataView, ErrorBoundary } from '../utils'
import fetchPokemon from '../fetch-pokemon'


// By default, all fetches are mocked so we can control the time easily.
// You can adjust the fetch time with this:
// window.FETCH_TIME = 3000
// If you want to make an actual network call for the pokemon
// then uncomment the following line
// window.fetch.restoreOriginalFetch()
// Note that by doing this, the FETCH_TIME will no longer be considered
// and if you want to slow things down you should use the Network tab


const pokemonName = 'pikachu'

let pokemonPromise, pokemonError, pokemon

pokemonPromise = fetchPokemon(pokemonName).then((
  pokemonData => {
    pokemon = pokemonData
  }), 
  errorData => {
    pokemonError = errorData
  })

const Fallback = () => (
  <div>
    Looking for Pokemon...
  </div>
)

function PokemonInfo(props) {
  if (pokemonError)  {
    throw pokemonError
  }

  if (!pokemon) {
    throw pokemonPromise
  }
  
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  return (
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        <ErrorBoundary>
          <React.Suspense fallback={<Fallback />}>
            <PokemonInfo />
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

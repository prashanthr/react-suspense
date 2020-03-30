// useTransition for improved loading states
// http://localhost:3000/isolated/exercise/03.js

import React from 'react'
import fetchPokemon from '../fetch-pokemon'
import {
  ErrorBoundary,
  createResource,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
} from '../utils'

function PokemonInfo({ pokemonResource }) {
  const pokemon = pokemonResource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

// try a few of these fetch times:
// shows busy indicator
// window.FETCH_TIME = 450

// shows busy indicator, then suspense fallback
// window.FETCH_TIME = 5000

// shows busy indicator for a split second
// 💯 this is what the extra credit improves
window.FETCH_TIME = 400

// 🐨 create a SUSPENSE_CONFIG variable right here and configure timeoutMs to
// whatever feels right to you, then try it out and tweek it until you're happy
// with the experience.

const SUSPENSE_CONFIG = { 
  timeoutMs: 5000,
  busyDelayMs: 300, // Don't leave pending state until this time, should be slightly shorter than css transition ms
  busyMinDurationMs: 700, //
}

function createPokemonResource(pokemonName) {
  return createResource(() => fetchPokemon(pokemonName))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState(null)
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
    startTransition(() => {
      // setPokemonName(newPokemonName)
      setPokemonResource(createPokemonResource(newPokemonName))
    })
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending && 'pokemon-loading'}`}>
        {pokemonResource ? (
          <ErrorBoundary>
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </ErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App

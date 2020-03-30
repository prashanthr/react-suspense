// Coordinate Suspending components with SuspenseList
// http://localhost:3000/isolated/exercise/07.js

import React from 'react'
import '../suspense-list/style-overrides.css'
import * as cn from '../suspense-list/app.module.css'
import Spinner from '../suspense-list/spinner'
import {createResource, ErrorBoundary, PokemonForm} from '../utils'
import {fetchUser} from '../fetch-pokemon'

// 💰 this delay function just allows us to make a promise take longer to resolve
// so we can easily play around with the loading time of our code.
const delay = time => promiseResult =>
  new Promise(resolve => setTimeout(() => resolve(promiseResult), time))

// 🐨 feel free to play around with the delay timings.
const NavBar = React.lazy(() =>
  import('../suspense-list/nav-bar').then(delay(500)),
)
const LeftNav = React.lazy(() =>
  import('../suspense-list/left-nav').then(delay(2000)),
)
const MainContent = React.lazy(() =>
  import('../suspense-list/main-content').then(delay(1500)),
)
const RightNav = React.lazy(() =>
  import('../suspense-list/right-nav').then(delay(1000)),
)

const fallback = (
  <div className={cn.spinnerContainer}>
    <Spinner />
  </div>
)
const SUSPENSE_CONFIG = {timeoutMs: 4000}

const SuspenseInception = ({ items, revealOrder }) => (
  <React.SuspenseList revealOrder={revealOrder}>
  {items.map((item, idx) => (
    <React.Suspense key={idx} fallback={item.fallback || fallback}>
      {item.component}
    </React.Suspense>
  ))}
  </React.SuspenseList>  
)

function App() {
  const [startTransition] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  function handleSubmit(pokemonName) {
    startTransition(() => {
      setPokemonResource(createResource(() => fetchUser(pokemonName)))
    })
  }

  if (!pokemonResource) {
    return (
      <div className="pokemon-info-app">
        <div
          className={`${cn.root} totally-centered`}
          style={{height: '100vh'}}
        >
          <PokemonForm onSubmit={handleSubmit} />
        </div>
      </div>
    )
  }

  // 🐨 Use React.SuspenseList throughout these Suspending components to make
  // them load in a way that is not jaring to the user.
  // 💰 there's not really a specifically "right" answer for this.
  const suspenseInnerNavItems = [{
    component: <LeftNav />
  }, {
    component: <RightNav pokemonResource={pokemonResource} />
  }]

  const suspenseFinalItems = [{
    component: (
      <SuspenseInception 
        revealOrder={'together'}
        items={suspenseInnerNavItems}
      />
    )
  }, {
    component: (
      <MainContent pokemonResource={pokemonResource} />
    )
  }]

  const suspenseRootItems = [{
    component: <NavBar pokemonResource={pokemonResource} />
  }, {
    component: (
      <div className={cn.mainContentArea}>
        <SuspenseInception 
          items={suspenseFinalItems}
          revealOrder={'forwards'}
        />
      </div>
    )
  }]

  return (
    <div className="pokemon-info-app">
      <div className={cn.root}>
        <ErrorBoundary>
          <SuspenseInception 
            items={suspenseRootItems} 
            revealOrder={'forwards'} 
          />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

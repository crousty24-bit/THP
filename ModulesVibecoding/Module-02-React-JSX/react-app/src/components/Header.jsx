function Header({ title }) {
  return (
    <header className="app-header">
      <p className="section-label">First React app with AI assistance</p>
      <h1>{title}</h1>
      <p>
        A small React exercise using components, props, state, hooks, events,
        and a public JSON API.
      </p>
    </header>
  )
}

export default Header

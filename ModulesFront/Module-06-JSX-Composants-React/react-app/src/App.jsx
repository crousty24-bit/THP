import Customers from './components/Customers'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="page-heading">
        <p className="section-label">Merchant contact</p>
        <h1>Customer directory</h1>
        <p>
          A React exercise that renders one hundred generated customer profiles
          with Faker.js, Bootstrap cards, and reusable components.
        </p>
      </section>

      <Customers />
    </main>
  )
}

export default App

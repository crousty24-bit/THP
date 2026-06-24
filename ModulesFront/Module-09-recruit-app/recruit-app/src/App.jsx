import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Profile from './pages/Profile'
import './styles/main.scss'

const routerBasename =
  new URL(import.meta.env.BASE_URL, window.location.href).pathname.replace(/\/$/, '') ||
  '/'

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

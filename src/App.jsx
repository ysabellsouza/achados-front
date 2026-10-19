import { Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Home from "./pages/Home"
import Detalhe from "./pages/Detalhe"
import Formulario from "./pages/Formulario"

export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<Detalhe />} />
          <Route path="/novo" element={<Formulario />} />
          <Route path="/editar/:id" element={<Formulario />} />
        </Routes>
      </main>
    </>
  )
}
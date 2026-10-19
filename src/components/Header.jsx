import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

export default function Header() {
  const [dono, setDono] = useState(null)

  useEffect(() => {
    async function carregar() {
      try {
        const r = await api.get("/eu")
        setDono(r.data)
      } catch (e) {
        setDono(null)
      }
    }
    carregar()
  }, [])

  return (
    <header className="topo">
      <Link to="/" className="logo">Achados e Perdidos IFRN</Link>
      <div className="usuario">
        {dono && <span className="avatar">{dono.nome[0]}</span>}
        <span>{dono ? `Olá, ${dono.nome}` : "Olá"}</span>
      </div>
    </header>
  )
}
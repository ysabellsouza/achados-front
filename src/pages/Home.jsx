import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { msgErro } from "../services/erro"

// as listas podem vir como texto ou como objeto; isso cobre os dois casos
const rotulo = (x) => (typeof x === "string" ? x : x.nome)

export default function Home() {
  const [itens, setItens] = useState([])
  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])
  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")
  const [categoria, setCategoria] = useState("")
  const [local, setLocal] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregarListas() {
      try {
        const c = await api.get("/categorias")
        const l = await api.get("/locais")
        setCategorias(c.data)
        setLocais(l.data)
      } catch (e) {
        setErro(msgErro(e))
      }
    }
    carregarListas()
  }, [])

  useEffect(() => {
    async function carregarItens() {
      setCarregando(true)
      setErro("")
      try {
        const params = {}
        if (busca) params.busca = busca
        if (status) params.status = status
        if (categoria) params.categoria = categoria
        if (local) params.local = local
        const r = await api.get("/itens", { params })
        setItens(r.data)
      } catch (e) {
        setErro(msgErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregarItens()
  }, [busca, status, categoria, local])

  return (
    <div>
      <div className="linha">
        <h1>Itens encontrados</h1>
        <Link to="/novo" className="botao">+ Novo item</Link>
      </div>

      <input
        placeholder="Buscar por nome ou descrição..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="filtros">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Status</option>
          <option value="aguardando">Aguardando</option>
          <option value="devolvido">Devolvido</option>
        </select>

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Categoria</option>
          {categorias.map((c) => (
            <option key={rotulo(c)} value={rotulo(c)}>{rotulo(c)}</option>
          ))}
        </select>

        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">Local</option>
          {locais.map((l) => (
            <option key={rotulo(l)} value={rotulo(l)}>{rotulo(l)}</option>
          ))}
        </select>
      </div>

      {carregando && <p>Carregando itens...</p>}
      {erro && <p className="erro">{erro}</p>}
      {!carregando && !erro && itens.length === 0 && <p>Nenhum item encontrado.</p>}

      <div className="lista">
        {itens.map((item) => (
          <Link to={`/item/${item.id}`} key={item.id} className="card">
            <strong>{item.nome}</strong>
            <span>{item.categoria} · {item.local}</span>
            <span className={`status ${item.status}`}>{item.status}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
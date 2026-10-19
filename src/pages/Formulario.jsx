import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../services/api"
import { msgErro } from "../services/erro"

const rotulo = (x) => (typeof x === "string" ? x : x.nome)

export default function Formulario() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    local: "",
    data_encontrado: ""
  })
  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        const c = await api.get("/categorias")
        const l = await api.get("/locais")
        setCategorias(c.data)
        setLocais(l.data)
        if (editando) {
          const r = await api.get(`/itens/${id}`)
          const { nome, descricao, categoria, local, data_encontrado } = r.data
          setForm({ nome, descricao, categoria, local, data_encontrado })
        }
      } catch (e) {
        setErro(msgErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  function mudar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function salvar(e) {
    e.preventDefault()
    setErro("")
    setSucesso("")
    try {
      if (editando) {
        await api.put(`/itens/${id}`, form)
      } else {
        await api.post("/itens", form)
      }
      setSucesso("Item salvo com sucesso!")
      setTimeout(() => navigate("/"), 800)
    } catch (e) {
      setErro(msgErro(e))
    }
  }

  if (carregando) return <p>Carregando...</p>

  return (
    <form onSubmit={salvar} className="formulario">
      <h1>{editando ? "Editar item" : "Novo item"}</h1>

      <label>Nome</label>
      <input name="nome" value={form.nome} onChange={mudar} />

      <label>Descrição</label>
      <textarea name="descricao" value={form.descricao} onChange={mudar} />

      <label>Categoria</label>
      <select name="categoria" value={form.categoria} onChange={mudar}>
        <option value="">Selecione</option>
        {categorias.map((c) => (
          <option key={rotulo(c)} value={rotulo(c)}>{rotulo(c)}</option>
        ))}
      </select>

      <label>Local</label>
      <select name="local" value={form.local} onChange={mudar}>
        <option value="">Selecione</option>
        {locais.map((l) => (
          <option key={rotulo(l)} value={rotulo(l)}>{rotulo(l)}</option>
        ))}
      </select>

      <label>Data em que foi encontrado</label>
      <input type="date" name="data_encontrado" value={form.data_encontrado} onChange={mudar} />

      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p className="sucesso">{sucesso}</p>}

      <div className="linha">
        <button type="submit">Salvar</button>
        <button type="button" onClick={() => navigate("/")}>Cancelar</button>
      </div>
    </form>
  )
}
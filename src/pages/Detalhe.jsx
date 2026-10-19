import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../services/api"
import { msgErro } from "../services/erro"

export default function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [mostrarDevolver, setMostrarDevolver] = useState(false)
  const [devolvidoPara, setDevolvidoPara] = useState("")
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)

  async function carregar() {
    setCarregando(true)
    setErro("")
    try {
      const r = await api.get(`/itens/${id}`)
      setItem(r.data)
    } catch (e) {
      setErro(msgErro(e))
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [id])

  async function devolver() {
    setErro("")
    try {
      await api.patch(`/itens/${id}/devolver`, { devolvido_para: devolvidoPara })
      setMostrarDevolver(false)
      setDevolvidoPara("")
      await carregar()
    } catch (e) {
      setErro(msgErro(e))
    }
  }

  async function excluir() {
    try {
      await api.delete(`/itens/${id}`)
      navigate("/")
    } catch (e) {
      setErro(msgErro(e))
      setConfirmarExclusao(false)
    }
  }

  if (carregando) return <p>Carregando...</p>

  return (
    <div>
      <Link to="/">← Voltar</Link>
      {erro && <p className="erro">{erro}</p>}

      {item && (
        <div className="detalhe">
          <h1>{item.nome}</h1>
          <span className={`status ${item.status}`}>{item.status}</span>
          <p><b>Descrição:</b> {item.descricao}</p>
          <p><b>Categoria:</b> {item.categoria}</p>
          <p><b>Local:</b> {item.local}</p>
          <p><b>Encontrado em:</b> {item.data_encontrado}</p>
          {item.status === "devolvido" && (
            <>
              <p><b>Devolvido para:</b> {item.devolvido_para}</p>
              <p><b>Data da devolução:</b> {item.data_devolucao}</p>
            </>
          )}

          <div className="linha">
            <Link to={`/editar/${item.id}`} className="botao">Editar</Link>
            <button className="perigo" onClick={() => setConfirmarExclusao(true)}>Excluir</button>
          </div>

          {item.status === "aguardando" && (
            <div>
              {!mostrarDevolver ? (
                <button onClick={() => setMostrarDevolver(true)}>Marcar como devolvido</button>
              ) : (
                <div className="linha">
                  <input
                    placeholder="Nome de quem recebeu"
                    value={devolvidoPara}
                    onChange={(e) => setDevolvidoPara(e.target.value)}
                  />
                  <button onClick={devolver}>Confirmar</button>
                </div>
              )}
            </div>
          )}

          {confirmarExclusao && (
            <div className="confirmacao">
              <p>Tem certeza que deseja excluir?</p>
              <button className="perigo" onClick={excluir}>Excluir</button>
              <button onClick={() => setConfirmarExclusao(false)}>Cancelar</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
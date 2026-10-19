export function msgErro(e) {
  if (!e.response) return "Não foi possível conectar à API."
  if (e.response.status === 401) return "Chave inválida ou ausente. Verifique seu .env."
  if (e.response.status === 404) return "Item não encontrado."
  const d = e.response.data?.detail
  if (typeof d === "string") return d
  if (Array.isArray(d)) return d.map((x) => x.msg).join(", ")
  return "Erro inesperado."
}
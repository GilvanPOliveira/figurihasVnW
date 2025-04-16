import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "https://figurihasvnw-api.onrender.com/api/alunos";
const GITHUB_API = "https://figurihasvnw-api.onrender.com/api/github";

export default function CadastroRapido() {
  const [username, setUsername] = useState("");
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(
        () => setMensagem({ texto: "", tipo: "" }),
        4000
      );
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const buscarGitHubCompleto = async () => {
    if (!username.trim()) {
      setMensagem({ texto: "Digite um nome de usuário.", tipo: "erro" });
      return;
    }

    setCarregando(true);

    try {
      const res = await axios.get(`${GITHUB_API}/${username}`);
      const { usuario, repos, seguidores } = res.data;

      const todos = [
        {
          nome: usuario.name || usuario.login,
          descricao: usuario.bio || "Sem descrição",
          perfil_url: usuario.avatar_url,
          github_url: usuario.html_url,
          portfolio_url: usuario.blog || "",
          linkedin_url: "",
          projetos: repos.slice(0, 3).map((r) => ({
            titulo: r.name,
            descricao: r.description || "Sem descrição",
            imagem_url: `https://opengraph.githubassets.com/1/${usuario.login}/${r.name}`,
            link:
              r.homepage && r.homepage.trim() !== "" ? r.homepage : r.html_url,
          })),
        },
        ...seguidores.map((seg) => ({
          nome: seg.usuario.login,
          descricao: "Seguidor de " + usuario.login,
          perfil_url: seg.usuario.avatar_url,
          github_url: `https://github.com/${seg.usuario.login}`,
          portfolio_url: "",
          linkedin_url: "",
          projetos: seg.repos.slice(0, 3).map((r) => ({
            titulo: r.name,
            descricao: r.description || "Sem descrição",
            imagem_url: `https://opengraph.githubassets.com/1/${seg.usuario.login}/${r.name}`,
            link:
              r.homepage && r.homepage.trim() !== "" ? r.homepage : r.html_url,
          })),
        })),
      ];

      setDados(todos);
      setMensagem({ texto: "Perfis carregados com sucesso!", tipo: "sucesso" });
    } catch (err) {
      console.error(err);
      setMensagem({ texto: "Erro ao buscar dados no GitHub.", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  };

  const cadastrarTodos = async () => {
    if (dados.length === 0) {
      setMensagem({ texto: "Nenhum dado para cadastrar.", tipo: "erro" });
      return;
    }

    try {
      for (const aluno of dados) {
        await axios.post(API, aluno);
      }

      setMensagem({
        texto: "Todos os cadastros foram realizados!",
        tipo: "sucesso",
      });
      setDados([]);
      setUsername("");
    } catch (err) {
      console.error(err);
      setMensagem({ texto: "Erro ao cadastrar os alunos.", tipo: "erro" });
    }
  };

  return (
    <section className="form-section cadastro-rapido">
      <h2>🚀 Cadastro Rápido via GitHub</h2>

      <input
        type="text"
        placeholder="Usuário do GitHub"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={buscarGitHubCompleto} disabled={carregando}>
        {carregando ? "Buscando..." : "Buscar"}
      </button>

      {mensagem.texto && (
        <div
          style={{
            padding: "10px",
            borderRadius: "8px",
            fontWeight: "bold",
            backgroundColor: mensagem.tipo === "erro" ? "#fee2e2" : "#dcfce7",
            color: mensagem.tipo === "erro" ? "#991b1b" : "#166534",
            border: `1px solid ${
              mensagem.tipo === "erro" ? "#fca5a5" : "#86efac"
            }`,
          }}
        >
          {mensagem.texto}
        </div>
      )}

      {dados.length > 0 && (
        <>
          <div style={{marginTop: "10px" }}>
            <button onClick={cadastrarTodos}>Cadastrar Todos</button>
          </div>
          <ul className="lista-usuarios">
            {dados.map((aluno, i) => (
              <li key={i} className="usuario-card">
                <img src={aluno.perfil_url} alt={aluno.nome} />
                <div>
                  <strong>{aluno.nome}</strong>
                  <p>{aluno.descricao}</p>
                  <a href={aluno.github_url} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

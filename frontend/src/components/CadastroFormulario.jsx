import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "https://figurihasvnw-api.onrender.com/api/alunos";

export default function CadastroFormulario() {
  const [form, setForm] = useState({
    id: "",
    nome: "",
    descricao: "",
    perfil_url: "",
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
  });
  const [repos, setRepos] = useState([]);
  const [reposSelecionados, setReposSelecionados] = useState([]);
  const [mostrarRepos, setMostrarRepos] = useState(false);
  const [username, setUsername] = useState("");
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

  const resetarFormulario = () => {
    setForm({
      id: "",
      nome: "",
      descricao: "",
      perfil_url: "",
      github_url: "",
      linkedin_url: "",
      portfolio_url: "",
    });
    setReposSelecionados([]);
    setUsername("");
    setMostrarRepos(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buscarGitHub = async () => {
    if (!username) {
      setMensagem({ texto: "Digite o nome de usuário.", tipo: "erro" });
      return;
    }
    try {
      const userRes = await axios.get(
        `https://api.github.com/users/${username}`
      );
      const user = userRes.data;

      setForm((prev) => ({
        ...prev,
        nome: user.name || username,
        descricao: user.bio || "",
        perfil_url: user.avatar_url,
        github_url: user.html_url,
        portfolio_url: user.blog || "",
      }));

      const reposRes = await axios.get(
        `https://api.github.com/users/${username}/repos`
      );
      setRepos(reposRes.data);
      setMostrarRepos(true);
      setMensagem({
        texto: "Usuário encontrado com sucesso!",
        tipo: "sucesso",
      });
    } catch {
      setMensagem({ texto: "Erro ao buscar no GitHub.", tipo: "erro" });
    }
  };

  const toggleRepositorio = (index) => {
    const jaSelecionado = reposSelecionados.find(
      (r) => r.titulo === repos[index].name
    );

    if (jaSelecionado) {
      setReposSelecionados((prev) =>
        prev.filter((r) => r.titulo !== repos[index].name)
      );
    } else if (reposSelecionados.length < 3) {
      const r = repos[index];
      const novoProjeto = {
        titulo: r.name,
        descricao: r.description || "Sem descrição",
        imagem_url: `https://opengraph.githubassets.com/1/${username}/${r.name}`,
        link: r.homepage && r.homepage.trim() !== "" ? r.homepage : r.html_url,
      };
      setReposSelecionados((prev) => [...prev, novoProjeto]);
    } else {
      setMensagem({
        texto: "Você só pode selecionar até 3 repositórios.",
        tipo: "erro",
      });
    }
  };

  const cadastrarAluno = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.descricao || !form.perfil_url) {
      setMensagem({
        texto: "Preencha todos os campos obrigatórios.",
        tipo: "erro",
      });
      return;
    }

    try {
      const body = {
        nome: form.nome,
        descricao: form.descricao,
        perfil_url: form.perfil_url,
        github_url: form.github_url,
        linkedin_url: form.linkedin_url,
        portfolio_url: form.portfolio_url,
        projetos: reposSelecionados,
      };

      if (form.id) {
        await axios.patch(`${API}/${form.id}`, body);
        setMensagem({
          texto: "Aluno atualizado com sucesso!",
          tipo: "sucesso",
        });
      } else {
        await axios.post(API, body);
        setMensagem({
          texto: "Aluno cadastrado com sucesso!",
          tipo: "sucesso",
        });
      }

      resetarFormulario();
    } catch {
      setMensagem({ texto: "Erro ao salvar aluno.", tipo: "erro" });
    }
  };

  return (
    <section className="form-section">
      <h2>🔍 Buscar dados no GitHub</h2>
      <input
        type="text"
        placeholder="Usuário do GitHub"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="button" onClick={buscarGitHub}>
        Buscar
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

      {mostrarRepos && (
        <>
          <h3>📦 Selecione até 3 repositórios:</h3>
          <div className="repos-container">
            {repos.map((repo, i) => {
              const selecionado = reposSelecionados.some(
                (r) => r.titulo === repo.name
              );
              const desativado = !selecionado && reposSelecionados.length >= 3;

              return (
                <div key={repo.id} className="repo-item">
                  <input
                    type="checkbox"
                    checked={selecionado}
                    onChange={() => toggleRepositorio(i)}
                    disabled={desativado}
                  />
                  <label>
                    <strong>{repo.name}</strong>:{" "}
                    {repo.description || "Sem descrição"}
                  </label>
                </div>
              );
            })}
          </div>
        </>
      )}

      <h2>📝 Cadastro Manual</h2>
      <form onSubmit={cadastrarAluno}>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Seu nome"
          required
        />
        <textarea
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Sobre você"
          required
        />
        <input
          name="perfil_url"
          value={form.perfil_url}
          onChange={handleChange}
          placeholder="URL da foto de perfil"
          required
        />
        <input
          name="github_url"
          value={form.github_url}
          onChange={handleChange}
          placeholder="URL do GitHub"
        />
        <input
          name="linkedin_url"
          value={form.linkedin_url}
          onChange={handleChange}
          placeholder="URL do LinkedIn"
        />
        <input
          name="portfolio_url"
          value={form.portfolio_url}
          onChange={handleChange}
          placeholder="URL do Portfólio"
        />

        <h3>📌 Projetos Selecionados</h3>
        {reposSelecionados.map((p, i) => (
          <div key={i} className="projeto-bloco">
            <div className="projeto-header">
              <h4>Projeto {i + 1}</h4>
              <button
                type="button"
                onClick={() =>
                  setReposSelecionados(
                    reposSelecionados.filter((_, idx) => idx !== i)
                  )
                }
              >
                X
              </button>
            </div>
            <input value={p.titulo} disabled />
            <textarea value={p.descricao} disabled />
            <input value={p.imagem_url} disabled />
            <input value={p.link} disabled />
          </div>
        ))}

        <div className="button-group">
          <button type="submit">Cadastrar Aluno</button>
        </div>
      </form>
    </section>
  );
}

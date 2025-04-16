import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "https://figurihasvnw-api.onrender.com/api/alunos";

export default function EditarAluno() {
  const [idBusca, setIdBusca] = useState("");
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [alunoEncontrado, setAlunoEncontrado] = useState(false);
  const [form, setForm] = useState({
    nome: "", 
    descricao: "",
    perfil_url: "",
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
  });
  const [repos, setRepos] = useState([]);
  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => setMensagem({ texto: "", tipo: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const buscarAluno = async () => {
    setMensagem({ texto: "", tipo: "" });

    if (!idBusca) {
      setMensagem({ texto: "⚠️ Informe o ID do aluno.", tipo: "erro" });
      return;
    }

    try {
      const res = await axios.get(`${API}/${idBusca}`);
      const aluno = res.data;

      setForm({
        nome: aluno.nome,
        descricao: aluno.descricao,
        perfil_url: aluno.perfil_url,
        github_url: aluno.github_url,
        linkedin_url: aluno.linkedin_url,
        portfolio_url: aluno.portfolio_url,
      });

      setProjetos(aluno.projetos || []);
      setAlunoEncontrado(true);
      setMensagem({ texto: "✅ Aluno encontrado com sucesso!", tipo: "sucesso" });

      if (aluno.github_url) {
        const username = aluno.github_url.split("github.com/")[1];
        const reposRes = await axios.get(`https://api.github.com/users/${username}/repos`);
        setRepos(reposRes.data);
      }
    } catch {
      setMensagem({ texto: "❌ Aluno não encontrado.", tipo: "erro" });
      setAlunoEncontrado(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjetoChange = (index, campo, valor) => {
    const novos = [...projetos];
    novos[index][campo] = valor;
    setProjetos(novos);
  };

  const removerProjeto = (index) => {
    const novos = [...projetos];
    novos.splice(index, 1);
    setProjetos(novos);
  };

  const toggleRepositorio = (index) => {
    const jaCadastrado = projetos.find((p) => p.titulo === repos[index].name);
    if (jaCadastrado) {
      setProjetos((prev) => prev.filter((p) => p.titulo !== repos[index].name));
    } else if (projetos.length < 3) {
      const r = repos[index];
      const novo = {
        titulo: r.name,
        descricao: r.description || "Sem descrição",
        imagem_url: `https://opengraph.githubassets.com/1/${form.github_url.split("github.com/")[1]}/${r.name}`,
        link: r.homepage && r.homepage.trim() !== "" ? r.homepage : r.html_url,
      };
      setProjetos((prev) => [...prev, novo]);
    } else {
      setMensagem({ texto: "⚠️ Máximo de 3 projetos.", tipo: "erro" });
    }
  };

  const atualizarAluno = async (e) => {
    e.preventDefault();

    if (!form.nome || !form.descricao || !form.perfil_url) {
      setMensagem({ texto: "⚠️ Preencha todos os campos obrigatórios.", tipo: "erro" });
      return;
    }

    try {
      await axios.patch(`${API}/${idBusca}`, { ...form, projetos });
      setMensagem({ texto: "✅ Aluno atualizado com sucesso!", tipo: "sucesso" });
      setIdBusca("");
      setAlunoEncontrado(false);
      setForm({
        nome: "",
        descricao: "",
        perfil_url: "",
        github_url: "",
        linkedin_url: "",
        portfolio_url: "",
      });
      setProjetos([]);
      setRepos([]);
    } catch {
      setMensagem({ texto: "❌ Erro ao atualizar aluno.", tipo: "erro" });
    }
  };

  return (
    <section className="form-section">
      <h2>✏️ Editar Aluno</h2>

      <input
        type="number"
        placeholder="Digite o ID do aluno"
        value={idBusca}
        onChange={(e) => setIdBusca(e.target.value)}
      />
      <button type="button" onClick={buscarAluno}>Buscar Aluno</button>

      {mensagem.texto && (
        <div
          style={{
            padding: "10px",
            borderRadius: "8px",
            fontWeight: "bold",
            backgroundColor: mensagem.tipo === "erro" ? "#fee2e2" : "#dcfce7",
            color: mensagem.tipo === "erro" ? "#991b1b" : "#166534",
            border: `1px solid ${mensagem.tipo === "erro" ? "#fca5a5" : "#86efac"}`
          }}
        >
          {mensagem.texto}
        </div>
      )}

      {alunoEncontrado && (
        <form onSubmit={atualizarAluno}>
          <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" required />
          <textarea name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descrição" required />
          <input name="perfil_url" value={form.perfil_url} onChange={handleChange} placeholder="URL da imagem de perfil" required />
          <input name="github_url" value={form.github_url} onChange={handleChange} placeholder="URL do GitHub" />
          <input name="linkedin_url" value={form.linkedin_url} onChange={handleChange} placeholder="URL do LinkedIn" />
          <input name="portfolio_url" value={form.portfolio_url} onChange={handleChange} placeholder="URL do Portfólio" />

          {repos.length > 0 && (
            <>
              <h3>🔄 Selecione até 3 repositórios</h3>
              <div className="repos-container">
                {repos.map((repo, i) => {
                  const selecionado = projetos.some((p) => p.titulo === repo.name);
                  const desativado = !selecionado && projetos.length >= 3;
                  return (
                    <div className="repo-item" key={repo.id}>
                      <input
                        type="checkbox"
                        checked={selecionado}
                        onChange={() => toggleRepositorio(i)}
                        disabled={desativado}
                      />
                      <label>
                        <strong>{repo.name}</strong>: {repo.description || "Sem descrição"}
                      </label>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <h3>📦 Projetos Editáveis</h3>
          {projetos.map((p, i) => (
            <div className="projeto-bloco" key={i}>
              <div className="projeto-header">
                <h4>Projeto {i + 1}</h4>
                <button type="button" onClick={() => removerProjeto(i)}>X</button>
              </div>
              <input value={p.titulo} onChange={(e) => handleProjetoChange(i, "titulo", e.target.value)} placeholder="Título" required />
              <textarea value={p.descricao} onChange={(e) => handleProjetoChange(i, "descricao", e.target.value)} placeholder="Descrição" required />
              <input value={p.imagem_url} onChange={(e) => handleProjetoChange(i, "imagem_url", e.target.value)} placeholder="URL da imagem" />
              <input value={p.link} onChange={(e) => handleProjetoChange(i, "link", e.target.value)} placeholder="Link do projeto" />
            </div>
          ))}

          <div className="button-group">
            <button type="submit">Salvar Alterações</button>
          </div>
        </form>
      )}
    </section>
  );
}

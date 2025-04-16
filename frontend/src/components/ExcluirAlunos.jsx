import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "https://figurihasvnw-api.onrender.com/api/alunos";
const RESET_API = "https://figurihasvnw-api.onrender.com/resetdb";

export default function ExcluirAlunos({ setAlunos, resetarFormulario }) {
  const [busca, setBusca] = useState("");
  const [alunosEncontrados, setAlunosEncontrados] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [confirmandoReset, setConfirmandoReset] = useState(false);
  const [contador, setContador] = useState(10);

  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(
        () => setMensagem({ texto: "", tipo: "" }),
        4000
      );
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const limparMensagens = () => setMensagem({ texto: "", tipo: "" });

  const handleBuscar = async () => {
    limparMensagens();
    setAlunosEncontrados([]);

    if (!busca.trim()) {
      setMensagem({ texto: "⚠️ Digite um ID ou nome.", tipo: "erro" });
      return;
    }

    try {
      if (/^\d+$/.test(busca)) {
        const res = await axios.get(`${API}/${busca}`);
        setAlunosEncontrados([res.data]);
        setMensagem({
          texto: `✅ Aluno encontrado: ${res.data.nome}`,
          tipo: "sucesso",
        });
        setBusca("");
      } else {
        const res = await axios.get(API);
        const filtrados = res.data.filter((a) =>
          a.nome.toLowerCase().includes(busca.toLowerCase())
        );
        if (filtrados.length) {
          setAlunosEncontrados(filtrados);
          setMensagem({
            texto: `✅ ${filtrados.length} aluno(s) encontrado(s).`,
            tipo: "sucesso",
          });
          setBusca("");
        } else {
          setMensagem({
            texto: "❌ Nenhum aluno encontrado com esse nome.",
            tipo: "erro",
          });
        }
      }
    } catch {
      setMensagem({ texto: "❌ Erro ao buscar aluno.", tipo: "erro" });
    }
  };

  const excluirAluno = async (aluno) => {
    limparMensagens();

    try {
      await axios.delete(`${API}/${aluno.id}`);
      setAlunosEncontrados((prev) => prev.filter((a) => a.id !== aluno.id));
      setAlunos((prev) => prev.filter((a) => a.id !== aluno.id));
      resetarFormulario();
      setMensagem({
        texto: `❌ Erro ao excluir ${aluno.nome} (ID ${aluno.id}).`,
        tipo: "erro",
      });
    } catch {
      setMensagem({
        texto: `✅ ${aluno.nome} (ID ${aluno.id}) foi excluído com sucesso!`,
        tipo: "sucesso",
      });
    }
  };

  const iniciarContagemReset = () => {
    limparMensagens();
    setConfirmandoReset(true);
    setContador(10);
  };

  const cancelarReset = () => setConfirmandoReset(false);

  useEffect(() => {
    let intervalo;

    if (confirmandoReset && contador > 0) {
      intervalo = setInterval(() => setContador((c) => c - 1), 1000);
    } else if (confirmandoReset && contador === 0) {
      (async () => {
        try {
          await axios.post(RESET_API);
          setAlunos([]);
          resetarFormulario();
          setMensagem({
            texto: "❌ Erro ao resetar banco de dados.",
            tipo: "erro",
          });
        } catch {
          setMensagem({
            texto: "✅ Banco de dados resetado com sucesso!",
            tipo: "sucesso",
          });
        } finally {
          setConfirmandoReset(false);
        }
      })();
    }

    return () => clearInterval(intervalo);
  }, [confirmandoReset, contador, setAlunos, resetarFormulario]);

  return (
    <section className="form-section">
      <h2>🗑️ Excluir Aluno</h2>

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
            marginBottom: "15px",
          }}
        >
          {mensagem.texto}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Digite o ID ou nome"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button onClick={handleBuscar}>Buscar</button>
      </div>

      {alunosEncontrados.length > 0 && (
        <ul className="lista-usuarios">
          {alunosEncontrados.map((aluno) => (
            <li key={aluno.id} className="usuario-card">
              <img src={aluno.perfil_url} alt={aluno.nome} />
              <div>
                <strong>{aluno.nome}</strong>
                <p>{aluno.descricao}</p>
                <button
                  onClick={() => excluirAluno(aluno)}
                  style={{ marginTop: "6px" }}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="resetarBd">
        {confirmandoReset ? (
          <>
            <button className="btn-resetar disabled" disabled>
              Resetando em {contador}s...
            </button>
            <button className="btn-cancelar" onClick={cancelarReset}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="btn-resetar" onClick={iniciarContagemReset}>
            Resetar Banco de Dados
          </button>
        )}
        <p>⚠️ Isso irá excluir todos os alunos cadastrados.</p>
      </div>
    </section>
  );
}

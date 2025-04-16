import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API = "https://figurihasvnw-api.onrender.com/api/alunos";

export default function ListarAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    axios.get(API).then((res) => {
      const ordenados = res.data.sort((a, b) => a.id - b.id);
      setAlunos(ordenados);
    });
  }, []);

  const avancar = () => {
    setIndex((prev) => (prev + 1) % alunos.length);
  };

  const voltar = () => {
    setIndex((prev) => (prev - 1 + alunos.length) % alunos.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    if (deltaX > 75) {
      voltar();
      touchStartX.current = null;
    } else if (deltaX < -75) {
      avancar();
      touchStartX.current = null;
    }
  };

  return (
    <section className="list-section">
      <h2>📋 Alunos Cadastrados</h2>

      {alunos.length === 0 ? (
        <p>Nenhum aluno cadastrado ainda.</p>
      ) : (
        <div
          className="aluno-carrossel-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div
            className="aluno-carrossel"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {alunos.map((a) => (
              <div className="aluno-card" key={a.id}>
                <div className="aluno-info">
                  <img
                    src={a.perfil_url}
                    alt={a.nome}
                    className="aluno-avatar"
                  />
                  <div>
                    <p>
                      <strong>ID:</strong> {a.id}
                    </p>
                    <p>
                      <strong>Nome:</strong> {a.nome}
                    </p>
                    <p>
                      <strong>GitHub:</strong>{" "}
                      <a href={a.github_url}>{a.github_url}</a>
                    </p>
                    <p>
                      <strong>Portfólio:</strong>{" "}
                      <a href={a.portfolio_url}>{a.portfolio_url}</a>
                    </p>
                    <p>
                      <strong>LinkedIn:</strong>{" "}
                      <a href={a.linkedin_url}>{a.linkedin_url}</a>
                    </p>
                    <p>
                      <strong>Descrição:</strong> {a.descricao}
                    </p>
                  </div>
                </div>

                {a.projetos.length > 0 && (
                  <>
                    <h4 style={{ marginTop: "10px" }}>📌 Projetos</h4>
                    <div className="projetos-container">
                      {a.projetos.map((p, j) => (
                        <div className="projeto-card" key={j}>
                          <h5>{p.titulo}</h5>
                          <p>{p.descricao}</p>
                          {p.imagem_url && (
                            <img src={p.imagem_url} alt={p.titulo} />
                          )}
                          <a href={p.link} target="_blank" rel="noreferrer">
                            🔗 Ver projeto
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="carrossel-controles">
            <button onClick={voltar}>←</button>
            <span>
              Aluno {index + 1} de {alunos.length}
            </span>
            <button onClick={avancar}>→</button>
          </div>
        </div>
      )}
    </section>
  );
}

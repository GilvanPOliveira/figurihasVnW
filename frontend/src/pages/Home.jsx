import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.scss";

const API = "https://figurihasvnw-api.onrender.com/api/alunos";

export default function Home() {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [busca, setBusca] = useState("");
 
  useEffect(() => {
    axios.get(API).then((res) => setAlunos(res.data));
  }, []);

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="home">
      <div className="homeBg">
        <div className="menuBg">
          <div className="logoBg">
            <div className="logo">
              <h1>FIGURINHAS</h1>
              <h2>VAI NA WEB</h2>
            </div>
          </div>
          <div className="buscador">
            <a href="/cadastro" className="cadastrar">
              Cadastrar
            </a>
            <input
              type="text"
              placeholder="Buscar"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div></div>
        </div>

        <div className="grid">
          {alunosFiltrados.map((aluno) => (
            <div
              key={aluno.id}
              className="figurinha"
              onClick={() => setAlunoSelecionado(aluno)}
            >
              <img src={aluno.perfil_url} alt={aluno.nome} />
              <div className="info">
                <strong>{aluno.nome}</strong>
                <p>{aluno.descricao}</p>
              </div>
            </div>
          ))}
        </div>

        {alunoSelecionado && (
          <div className="modal-bg" onClick={() => setAlunoSelecionado(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="fechar"
                onClick={() => setAlunoSelecionado(null)}
              >
                ✖
              </button>
              <div className="titulo">
                <h2>{alunoSelecionado.nome}</h2>
              </div>
              <div className="conteudo">
                <div className="perfil">
                  <img
                    src={alunoSelecionado.perfil_url}
                    alt={alunoSelecionado.nome}
                  />
                  <p>{alunoSelecionado.descricao}</p>
                </div>
                <div className="projetos">
                  {alunoSelecionado.projetos.map((p, i) => (
                    <a
                      key={i}
                      className="mini-projeto"
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      title={p.titulo}
                    >
                      {p.imagem_url && (
                        <img src={p.imagem_url} alt={p.titulo} />
                      )}
                      <h4>{p.titulo}</h4>
                    </a>
                  ))}
                </div>
                <div className="links">
                  <a
                    href={alunoSelecionado.github_url}
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub"
                    className={`github link-btn ${
                      alunoSelecionado.github_url ? "" : "disabled"
                    }`}
                    onClick={(e) =>
                      !alunoSelecionado.github_url && e.preventDefault()
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 30 30"
                      width="24"
                      fill="currentColor"
                    >
                      <path
                        d="M19,30h-3.996h-4c0,0,0.011-2.372,0-4c-5.473,1.178-7-3-7-3c-1-2-2-3-2-3c-2-1.188,0-1,0-1c2,0,3,2,3,2
          c1.755,2.981,4.878,2.501,6,2c0-1,0.438-2.512,1-3C7.636,19.508,4,17,4,12s1.004-6,2.004-7C5.802,4.507,4.965,2.685,
          6.035,0C6.035,0,8,0,10,3c0.991-0.991,4-1,5.001-1C16,2,19.009,2.009,20,3c2-3,3.969-3,3.969-3c1.07,2.685,0.233,
          4.507,0.031,5c1,1,2,2,2,7s-3.632,7.508-8,8c0.562,0.488,1,2.21,1,3V30z"
                      />
                    </svg>
                    Github
                  </a>

                  <a
                    href={alunoSelecionado.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn"
                    className={`linkedin link-btn ${
                      alunoSelecionado.linkedin_url ? "" : "disabled"
                    }`}
                    onClick={(e) =>
                      !alunoSelecionado.linkedin_url && e.preventDefault()
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M23.994 24v-.001H24v-8.802c0-4.306-.927-7.623-5.961-7.623
        -2.42 0-4.044 1.328-4.707 2.587h-.07V7.976H8.489v16.023h4.97v-7.934
        c0-2.089.396-4.109 2.983-4.109c2.549 0 2.587 2.384 2.587 4.243V24zM.396
        7.977h4.976V24H.396zM2.882 0C1.291 0 0 1.291 0 2.882s1.291 2.909
        2.882 2.909s2.882-1.318 2.882-2.909A2.884 2.884 0 002.882 0z"
                      />
                    </svg>
                    Linkedin
                  </a>

                  <a
                    href={alunoSelecionado.portfolio_url}
                    target="_blank"
                    rel="noreferrer"
                    title="Portfólio"
                    className={`portifolio link-btn ${
                      alunoSelecionado.portfolio_url ? "" : "disabled"
                    }`}
                    onClick={(e) =>
                      !alunoSelecionado.portfolio_url && e.preventDefault()
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M10 4H4c-1.1 0-2 .9-2 2v2h20V6c0-1.1-.9-2-2-2h-6l-2-2h-4l-2 2zm10 4H2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8z" />
                    </svg>
                    Portifólio
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

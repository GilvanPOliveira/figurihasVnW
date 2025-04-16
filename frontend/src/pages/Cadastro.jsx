import React, { useState } from "react";
import CadastroForm from "../components/CadastroFormulario";
import CadastroRapido from "../components/CadastroRapido";
import EditarAlunos from "../components/EditarAlunos";
import ExcluirAlunos from "../components/ExcluirAlunos";
import ListarAlunos from "../components/ListarAlunos";
import "../styles/Cadastro.scss";

export default function Cadastro() {
  const [abaAtiva, setAbaAtiva] = useState("cadastro"); 

  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case "cadastro":
        return <CadastroForm />;
      case "cadastroRapido":
        return <CadastroRapido />;
      case "listar":
        return <ListarAlunos />;
      case "editar":
        return <EditarAlunos />;
      case "excluir":
        return <ExcluirAlunos />;
      default:
        return null;
    }
  };

  return (
    <div className="cadastro">
      <div className="container">
        <h1>Figurinhas - Vai na Web</h1>

        <div className="abas">
          <button
            className={abaAtiva === "cadastro" ? "ativo" : ""}
            onClick={() => setAbaAtiva("cadastro")}
          >
            Cadastro
          </button>
          <button
            className={abaAtiva === "cadastroRapido" ? "ativo" : ""}
            onClick={() => setAbaAtiva("cadastroRapido")}
          >
            Cadastro Rápido
          </button>
          <button
            className={abaAtiva === "listar" ? "ativo" : ""}
            onClick={() => setAbaAtiva("listar")}
          >
            Listar
          </button>
          <button
            className={abaAtiva === "editar" ? "ativo" : ""}
            onClick={() => setAbaAtiva("editar")}
          >
            Editar
          </button>
          <button
            className={abaAtiva === "excluir" ? "ativo" : ""}
            onClick={() => setAbaAtiva("excluir")}
          >
            Excluir
          </button>
        </div>

        {renderizarConteudo()}

        <div className="footer">
          <a href="/" className="home-button">
            Voltar para Home
          </a>
        </div>
      </div>
    </div>
  );
}

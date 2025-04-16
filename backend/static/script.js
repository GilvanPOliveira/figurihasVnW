let contadorProjetos = 0;
const maxProjetos = 3;

function adicionarProjeto(titulo = "", descricao = "", imagem = "", link = "") {
  if (contadorProjetos >= maxProjetos) return;

  contadorProjetos++;
  const container = document.getElementById("projetos-container");

  const div = document.createElement("div");
  div.classList.add("projeto-bloco");
  div.innerHTML = `
    <div class="projeto-header">
      <h4>Projeto ${contadorProjetos}</h4>
      <button type="button" class="remover-projeto" onclick="removerProjeto(this)">❌</button>
    </div>
    <input type="text" name="projeto_titulo[]" placeholder="Título do projeto" value="${titulo}">
    <textarea name="projeto_descricao[]" placeholder="Descrição do projeto">${descricao}</textarea>
    <input type="url" name="projeto_imagem_url[]" placeholder="Imagem do projeto" value="${imagem}">
    <input type="url" name="projeto_link[]" placeholder="Link do projeto" value="${link}">
  `;
  container.appendChild(div);
}

function removerProjeto(botao) {
  const divProjeto = botao.closest(".projeto-bloco");
  divProjeto.remove();
  contadorProjetos--;
}

async function buscarAluno() {
  const id = document.getElementById("buscar-id").value;
  if (!id) return alert("Informe o ID do aluno");

  try {
    const response = await fetch(`/api/alunos/${id}`);
    if (!response.ok) throw new Error("Aluno não encontrado");

    const data = await response.json();

    document.querySelector("input[name='id']").value = data.id;
    document.querySelector("input[name='nome']").value = data.nome;
    document.querySelector("textarea[name='descricao']").value = data.descricao;
    document.querySelector("input[name='perfil_url']").value = data.perfil_url;
    document.querySelector("input[name='github_url']").value = data.github_url;
    document.querySelector("input[name='linkedin_url']").value =
      data.linkedin_url;
    document.querySelector("input[name='portfolio_url']").value =
      data.portfolio_url;

    document.getElementById("projetos-container").innerHTML = "";
    contadorProjetos = 0;
    data.projetos.forEach((p) =>
      adicionarProjeto(p.titulo, p.descricao, p.imagem_url, p.link)
    );

    const botaoCadastro = document.querySelector(
      "form[action='/cadastro'] button[type='submit']"
    );
    if (botaoCadastro) {
      botaoCadastro.textContent = "Salvar Alterações";
    }

    alert(
      "Aluno carregado! Agora edite os dados e clique em 'Salvar Alterações'."
    );
  } catch (err) {
    alert("Erro: " + err.message);
  }
}


const carrosselIndex = {};

function avancar(id) {
  const carrossel = document.getElementById(`carrossel-${id}`);
  const total = carrossel.children.length;
  if (!carrosselIndex[id]) carrosselIndex[id] = 0;

  carrosselIndex[id] = (carrosselIndex[id] + 1) % total;
  atualizarCarrossel(carrossel, carrosselIndex[id]);
}

function voltar(id) {
  const carrossel = document.getElementById(`carrossel-${id}`);
  const total = carrossel.children.length;
  if (!carrosselIndex[id]) carrosselIndex[id] = 0;

  carrosselIndex[id] = (carrosselIndex[id] - 1 + total) % total;
  atualizarCarrossel(carrossel, carrosselIndex[id]);
}

function atualizarCarrossel(container, index) {
  const largura = container.clientWidth;
  container.style.transform = `translateX(-${index * largura}px)`;
}


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".carrossel-btn.avancar").forEach((btn) => {
    const id = btn.dataset.id;
    btn.addEventListener("click", () => avancar(id));
  });

  document.querySelectorAll(".carrossel-btn.voltar").forEach((btn) => {
    const id = btn.dataset.id;
    btn.addEventListener("click", () => voltar(id));
  });

  const botaoCadastro = document.querySelector(
    "form[action='/cadastro'] button[type='submit']"
  );
  if (botaoCadastro) {
    botaoCadastro.textContent = "Cadastrar Aluno(a)";
  }
});


async function buscarGitHub() {
  const username = document.getElementById("github-username").value.trim();
  if (!username) return alert("Digite o nome de usuário do GitHub.");

  try {
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`
    );
    if (!userResponse.ok) throw new Error("Usuário não encontrado");

    const userData = await userResponse.json();

    document.querySelector("input[name='nome']").value =
      userData.name || username;
    document.querySelector("textarea[name='descricao']").value =
      userData.bio || "";
    document.querySelector("input[name='perfil_url']").value =
      userData.avatar_url;
    document.querySelector("input[name='github_url']").value =
      userData.html_url;
    document.querySelector("input[name='portfolio_url']").value =
      userData.blog || "";

    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const repos = await reposResponse.json();

    if (!Array.isArray(repos))
      throw new Error("Erro ao carregar repositórios.");

    const reposDiv = document.getElementById("repositorios-lista");
    const container = document.getElementById("repos-container");
    reposDiv.style.display = "block";
    container.innerHTML = "";

    repos.forEach((repo, index) => {
      const item = document.createElement("div");
      item.classList.add("repo-item");

      item.innerHTML = `
        <input type="checkbox" id="repo-${index}" name="repos" value="${index}">
        <label for="repo-${index}">
          <strong>${repo.name}</strong>: ${repo.description || "Sem descrição"}
        </label>
      `;

      container.appendChild(item);
    });

    window.__reposDisponiveis = repos;
    window.__githubUsername = username;
  } catch (err) {
    console.error(err);
    alert("Erro ao buscar usuário: " + err.message);
  }
}

document
  .getElementById("btn-adicionar-projetos")
  .addEventListener("click", () => {
    const selecionados = Array.from(
      document.querySelectorAll('input[name="repos"]:checked')
    );
    if (selecionados.length === 0 || selecionados.length > 3) {
      return alert("Selecione entre 1 a 3 repositórios.");
    }

    document.getElementById("projetos-container").innerHTML = "";
    contadorProjetos = 0;

    selecionados.forEach((checkbox) => {
      const index = checkbox.value;
      const repo = window.__reposDisponiveis[index];
      const username = window.__githubUsername;

      const linkProjeto =
        repo.homepage && repo.homepage.trim() !== ""
          ? repo.homepage
          : repo.html_url;

      const imagemURL = `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
      const img = new Image();
      img.src = imagemURL;

      img.onload = () => {
        adicionarProjeto(
          repo.name,
          repo.description || "Sem descrição",
          imagemURL,
          linkProjeto
        );
      };

      img.onerror = () => {
        adicionarProjeto(
          repo.name,
          repo.description || "Sem descrição",
          "",
          linkProjeto
        );
      };
    });

    document.getElementById("repositorios-lista").style.display = "none";
  });

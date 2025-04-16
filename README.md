<div align="center"><img src="https://github.com/user-attachments/assets/bc7c6790-e362-4270-a35d-07a5404962f6" width="15%" /></div>


# Figurinhas Vai na Web 🎓 

Projeto completo com Backend (Flask + PostgreSQL) e Frontend (Vite + React + Sass), com objetivo de registrar, visualizar, atualizar e excluir dados de alunos e seus projetos.

---

## 🌐 Deploys
- Figurinhas - Vnw: [Acesse aqui!](https://figurihas-vnw.vercel.app/)

---

## 📌 Funcionalidades

- Cadastro de alunos com descrição, links e imagem.
- Integração com API do GitHub para preencher automaticamente dados.
- Seleção de até 3 repositórios como projetos.
- Carrossel de projetos com imagem e link.
- Atualização e exclusão de alunos.
- Interface Web para interações com a API.

---

## 🚀 Tecnologias

- Backend: Python + Flask + SQLAlchemy
- Banco: PostgreSQL (Render Cloud)
- Frontend: Vite + React + Sass
- Integração: GitHub API
- Hospedagem: Render (PostgreSQL)
- Segurança: `.env` para variáveis sensíveis

---

## ⚙️ Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/figurinhas-vai-na-web.git
cd figurinhas-vai-na-web
```

### 2. Crie um ambiente virtual (opcional)

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate   # Windows
```

### 3. Instale as dependências

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure o `.env`

Crie um arquivo `.env` com:

```
DATABASE_URL=postgresql://usuario:senha@host:porta/database
```

### 5. Execute a aplicação

```bash
python app.py
```

Acesse [http://127.0.0.1:5000/cadastro](http://127.0.0.1:5000/cadastro)

---

## 🧑‍💻 Frontend (Vite + React + Sass)

### Criar estrutura inicial

```bash
cd frontend
npm create vite@latest . -- --template react
npm install
npm install sass
npm run dev
```

### Consuma a API em `/backend` usando fetch ou axios.

---

## 🔐 Segurança

- As credenciais do banco estão protegidas no `.env`.
- O `.env` está incluído no `.gitignore`, garantindo que ele **não será enviado para o GitHub**.

---

## 🤝 Contribuição

Quer contribuir com este projeto? Ótimo!  

Confira o nosso [Guia de Contribuição](CONTRIBUTING.md) para entender as regras e diretrizes.

Obrigado por querer colaborar! 💙

---

## 📄 Licença

Este projeto está licenciado sob os termos da [Licença MIT](LICENSE).  
Você pode usar, modificar e distribuir conforme os termos descritos.

Sinta-se à vontade para explorar, reutilizar e compartilhar! 🚀

---

## 🛠 Tecnologias Utilizadas

[![My Skills](https://skillicons.dev/icons?i=html,css,sass,javascript,react,vite,python,flask,postgresql,git,github,stackoverflow,vercel,remix,vscode&perline=10)](https://figurihas-vnw.vercel.app/)

---

## 📬 Contato

Se tiver dúvidas ou sugestões, fique à vontade para entrar em contato:
- E-mail: gilvanoliveira06@gmail.com
- Portifólio: [Gilvan Oliveira](https://gilvanpoliveira.github.io/)



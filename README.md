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

Olá! Obrigado por querer contribuir com o projeto **Figurinhas Vai na Web** 🎉

## 🛠 Passo a passo para contribuir
1. Faça um fork do repositório
2. Clone o fork
```bash
git clone https://github.com/GilvanPOliveira/figurihasVnW
```
3. Crie uma branch com sua funcionalidade
```bash
git checkout -b minha-nova-funcionalidade
```
4. Faça suas alterações e envie um Pull Request ✨

## ✅ Regras de contribuição
- Use mensagens de commit claras e descritivas
- Mantenha o padrão de código do projeto
- Teste antes de enviar seu PR

---

Com sua ajuda, este projeto pode crescer e impactar ainda mais estudantes da tecnologia! 🚀

---

## 📄 Licença

MIT License

Copyright (c) 2025 Gilvan Oliveira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


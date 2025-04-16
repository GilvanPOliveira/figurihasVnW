import os
import requests
import logging
import subprocess
from flask import Blueprint, jsonify, request, render_template, redirect, url_for
from models import db, Aluno, Projeto
from dotenv import load_dotenv
from flask_cors import cross_origin

# Carregar variáveis de ambiente
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

# Ativa logs no Render ou local
logging.basicConfig(level=logging.INFO)

# Cria o Blueprint (apenas 1 vez!)
routes = Blueprint('routes', __name__)


# Formulário de Cadastro
@routes.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        aluno_id = request.form.get('id')

        if aluno_id:
            aluno = Aluno.query.get_or_404(aluno_id)
            aluno.nome = request.form['nome']
            aluno.descricao = request.form['descricao']
            aluno.perfil_url = request.form['perfil_url']
            aluno.github_url = request.form['github_url']
            aluno.linkedin_url = request.form['linkedin_url']
            aluno.portfolio_url = request.form['portfolio_url']
            Projeto.query.filter_by(aluno_id=aluno.id).delete()
            db.session.commit()
        else:
            aluno = Aluno(
                nome=request.form['nome'],
                descricao=request.form['descricao'],
                perfil_url=request.form['perfil_url'],
                github_url=request.form['github_url'],
                linkedin_url=request.form['linkedin_url'],
                portfolio_url=request.form['portfolio_url']
            )
            db.session.add(aluno)
            db.session.commit()

        # Salvar projetos
        titulos = request.form.getlist('projeto_titulo[]')
        descricoes = request.form.getlist('projeto_descricao[]')
        imagens = request.form.getlist('projeto_imagem_url[]')
        links = request.form.getlist('projeto_link[]')

        for titulo, descricao, imagem_url, link in zip(titulos, descricoes, imagens, links):
            projeto = Projeto(
                aluno_id=aluno.id,
                titulo=titulo,
                descricao=descricao,
                imagem_url=imagem_url,
                link=link
            )
            db.session.add(projeto)
        db.session.commit()

        return redirect(url_for('routes.cadastro'))

    alunos = Aluno.query.all()
    return render_template('cadastro.html', alunos=alunos)



# Criar aluno
@routes.route('/api/alunos', methods=['POST'])
def criar_aluno():
    data = request.json
    aluno = Aluno(
        nome=data['nome'],
        descricao=data['descricao'],
        perfil_url=data['perfil_url'],
        github_url=data['github_url'],
        linkedin_url=data['linkedin_url'],
        portfolio_url=data['portfolio_url']
    )
    db.session.add(aluno)
    db.session.commit()

    for projeto in data.get('projetos', []):
        db.session.add(Projeto(
            aluno_id=aluno.id,
            titulo=projeto['titulo'],
            descricao=projeto['descricao'],
            imagem_url=projeto['imagem_url'],
            link=projeto['link']
        ))
    db.session.commit()

    return jsonify({'id': aluno.id}), 201



# Listar alunos
@routes.route('/api/alunos', methods=['GET'])
def listar_alunos():
    alunos = Aluno.query.all()
    return jsonify([
        {
            'id': a.id,
            'nome': a.nome,
            'descricao': a.descricao,
            'perfil_url': a.perfil_url,
            'github_url': a.github_url,
            'linkedin_url': a.linkedin_url,
            'portfolio_url': a.portfolio_url,
            'created_at': a.created_at.isoformat(),
            'projetos': [
                {
                    'titulo': p.titulo,
                    'descricao': p.descricao,
                    'imagem_url': p.imagem_url,
                    'link': p.link,
                    'created_at': p.created_at.isoformat()
                } for p in a.projetos
            ]
        } for a in alunos
    ])



# Buscar aluno por ID
@routes.route('/api/alunos/<int:id>', methods=['GET'])
def aluno_por_id(id):
    a = Aluno.query.get_or_404(id)
    return jsonify({
        'id': a.id,
        'nome': a.nome,
        'descricao': a.descricao,
        'perfil_url': a.perfil_url,
        'github_url': a.github_url,
        'linkedin_url': a.linkedin_url,
        'portfolio_url': a.portfolio_url,
        'created_at': a.created_at.isoformat(),
        'projetos': [
            {
                'titulo': p.titulo,
                'descricao': p.descricao,
                'imagem_url': p.imagem_url,
                'link': p.link,
                'created_at': p.created_at.isoformat()
            } for p in a.projetos
        ]
    })



# Atualizar aluno
@routes.route('/api/alunos/<int:id>', methods=['PATCH'])
def atualizar_aluno(id):
    aluno = Aluno.query.get_or_404(id)
    data = request.json
    for campo in ['nome', 'descricao', 'perfil_url', 'github_url', 'linkedin_url', 'portfolio_url']:
        if campo in data:
            setattr(aluno, campo, data[campo])
    db.session.commit()
    return jsonify({'mensagem': 'Atualizado com sucesso'})



# Deletar aluno (com cross_origin)
@routes.route('/api/alunos/<int:id>', methods=['DELETE'])
@cross_origin()
def deletar_aluno(id):
    try:
        aluno = Aluno.query.get(id)
        if not aluno:
            return jsonify({"erro": f"Aluno ID {id} não encontrado"}), 404

        db.session.delete(aluno)
        db.session.commit()
        return jsonify({"mensagem": "Deletado com sucesso!"}), 200

    except Exception as e:
        logging.error(f"Erro ao deletar aluno ID {id}: {str(e)}")
        return jsonify({"erro": "Erro interno ao deletar aluno."}), 500



# Buscar dados GitHub com token
@routes.route('/api/github/<username>', methods=['GET'])
def buscar_github(username):
    if not GITHUB_TOKEN:
        return jsonify({"erro": "Token GitHub não configurado"}), 500

    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    try:
        user_res = requests.get(f"https://api.github.com/users/{username}", headers=headers)
        if user_res.status_code != 200:
            return jsonify({"erro": "Usuário não encontrado"}), 404
        user = user_res.json()

        repos_res = requests.get(f"https://api.github.com/users/{username}/repos", headers=headers)
        repos = repos_res.json()[:3]

        seguidores = []
        page = 1
        max_seguidores = 50  # Limite de seguidores a serem buscados
        while len(seguidores) < max_seguidores:
            followers_res = requests.get(
                f"https://api.github.com/users/{username}/followers?per_page=100&page={page}",
                headers=headers
            )
            followers_page = followers_res.json()
            if not followers_page:
                break

            for seguidor in followers_page:
                if len(seguidores) >= max_seguidores:
                    break
                seg_username = seguidor["login"]

                seg_user_res = requests.get(f"https://api.github.com/users/{seg_username}", headers=headers)
                seg_user = seg_user_res.json() if seg_user_res.status_code == 200 else {}

                seg_repos_res = requests.get(f"https://api.github.com/users/{seg_username}/repos", headers=headers)
                seg_repos = seg_repos_res.json()[:3] if seg_repos_res.status_code == 200 else []

                seguidores.append({
                    "usuario": {
                        "login": seg_user.get("login"),
                        "avatar_url": seg_user.get("avatar_url"),
                        "name": seg_user.get("name"),
                        "bio": seg_user.get("bio"),
                        "html_url": seg_user.get("html_url"),
                        "blog": seg_user.get("blog")
                    },
                    "repos": seg_repos
                })
            page += 1

        return jsonify({
            "usuario": user,
            "repos": repos,
            "seguidores": seguidores
        })

    except Exception as e:
        logging.error(f"Erro ao buscar dados do GitHub: {str(e)}")
        return jsonify({"erro": "Erro ao consultar GitHub"}), 500



#  Testar Token
@routes.route("/testar-token-github", methods=["GET"])
def testar_token_github():
    if not GITHUB_TOKEN:
        return jsonify({"erro": "Token GitHub não configurado"}), 500

    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    response = requests.get("https://api.github.com/user", headers=headers)
    return response.json(), response.status_code



# Resetar Banco
@routes.route('/resetdb', methods=['POST'])
@cross_origin()
def reset_db():
    try:
        subprocess.run(['python', 'reset_db.py'], check=True)
        return jsonify({"mensagem": "Banco de dados resetado com sucesso!"}), 200
    except subprocess.CalledProcessError as e:
        logging.error(f"Erro ao resetar DB: {str(e)}")
        return jsonify({"erro": "Falha ao resetar o banco de dados.", "detalhes": str(e)}), 500

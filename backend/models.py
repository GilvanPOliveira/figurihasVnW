from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone


db = SQLAlchemy()

class Aluno(db.Model):
    __tablename__ = 'alunos'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    descricao = db.Column(db.Text)
    perfil_url = db.Column(db.Text)
    github_url = db.Column(db.Text)
    linkedin_url = db.Column(db.Text)
    portfolio_url = db.Column(db.Text)
    projetos = db.relationship('Projeto', backref='aluno', cascade='all, delete')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<Aluno {self.nome}>'


class Projeto(db.Model):
    __tablename__ = 'projetos'
    id = db.Column(db.Integer, primary_key=True)
    aluno_id = db.Column(db.Integer, db.ForeignKey('alunos.id'))
    titulo = db.Column(db.String(120), nullable=False)
    descricao = db.Column(db.Text)
    imagem_url = db.Column(db.Text)
    link = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<Projeto {self.titulo}>'


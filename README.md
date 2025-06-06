# Finanzen - Sistema de Gerenciamento Financeiro

Um sistema moderno de gerenciamento financeiro desenvolvido com FastAPI (Backend) e React (Frontend).

## Estrutura do Projeto

```
finanzen/
├── backend/           # API FastAPI
└── frontend/         # Aplicação React
```

## Pré-requisitos

- Python 3.9+
- Node.js 18+
- MySQL 8.0+
- Git

## Configuração do Ambiente

### 1. Banco de Dados

1. Instale o MySQL e MySQL Workbench
2. No MySQL Workbench, execute:
   ```sql
   CREATE DATABASE finanzen;
   CREATE USER 'finanzen_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
   GRANT ALL PRIVILEGES ON finanzen.* TO 'finanzen_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### 2. Backend (FastAPI)

1. Configure o ambiente virtual Python:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   # ou
   .\venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   ```

2. Configure o arquivo `.env` em `backend/core/.env`:
   ```env
   DATABASE_URL="mysql+pymysql://finanzen_user:sua_senha_segura@localhost:3306/finanzen"
   ```

3. Inicie o servidor:
   ```bash
   uvicorn backend.main:app --reload --app-dir ./
   ```

O backend estará disponível em: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 3. Frontend (React)

1. Instale as dependências:
   ```bash
   cd frontend
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

Frontend disponível em: http://localhost:5173

## API Endpoints

### Autenticação

- `POST /auth/register` - Registro de usuário
- `POST /auth/verify-email` - Verificação de email
- `POST /auth/login` - Login de usuário

### Transações

- `GET /transactions` - Lista transações
- `POST /transactions` - Cria nova transação
- `GET /transactions/{id}` - Detalhes da transação
- `PUT /transactions/{id}` - Atualiza transação
- `DELETE /transactions/{id}` - Remove transação

## Desenvolvimento

### Estrutura do Backend

```
backend/
├── controllers/      # Endpoints da API
├── core/            # Configurações
├── crud/            # Operações do BD
├── services/        # Lógica de negócios
└── tests/           # Testes
```

### Estrutura do Frontend

```
frontend/src/
├── components/      # Componentes React
├── hooks/          # Custom hooks
├── layouts/        # Layouts
├── screens/        # Páginas
├── services/       # Serviços API
└── utils/          # Utilitários
```

## Testes

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## Segurança

- Implementado HTTPS em produção
- Rate limiting configurado
- CORS configurado para domínios específicos
- Senhas hasheadas com bcrypt
- Autenticação via JWT
- Variáveis de ambiente seguras
- Logs sanitizados

## Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.

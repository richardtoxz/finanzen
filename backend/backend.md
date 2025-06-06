## Documentação do Backend - Projeto Finanzen

Este documento descreve a configuração, execução e funcionalidade do backend do projeto Finanzen.

### 1. Visão Geral

O backend é uma API construída com FastAPI em Python, projetada para gerenciar a autenticação de usuários e, potencialmente, outras funcionalidades financeiras. Ele utiliza SQLAlchemy para interação com o banco de dados e Pydantic para validação e serialização de dados.

**Principais Tecnologias:**

*   **Python**: Linguagem de programação principal.
*   **FastAPI**: Framework web para construção de APIs.
*   **Uvicorn**: Servidor ASGI para rodar a aplicação FastAPI.
*   **SQLAlchemy**: ORM para interagir com o banco de dados SQL.
*   **Pydantic**: Para validação de dados e gerenciamento de schemas.
*   **MySQL**: Banco de dados relacional utilizado em desenvolvimento/produção (configurado via `.env`).
*   **SQLite**: Banco de dados em memória utilizado para testes automatizados.
*   **Pytest**: Framework para testes automatizados.
*   **python-dotenv**: Para carregar variáveis de ambiente de um arquivo `.env`.

### 2. Estrutura do Projeto Backend

O backend está localizado na pasta backend e segue uma estrutura modular:

```
backend/
├── database.py           # Configuração da conexão com o banco de dados e sessão.
├── main.py               # Ponto de entrada da aplicação FastAPI, define rotas principais.
├── models.py             # Definições dos modelos SQLAlchemy (tabelas do banco de dados).
├── requirements.txt      # Lista de dependências Python do projeto.
├── schemas.py            # Definições dos schemas Pydantic (validação de dados de entrada/saída).
├── controllers/          # Lógica dos endpoints da API (rotas).
│   └── auth_controller.py  # Endpoints relacionados à autenticação.
├── core/                 # Configurações centrais e utilitários.
│   ├── config.py         # Carregamento de configurações (ex: variáveis de ambiente).
│   └── security.py       # Funções relacionadas à segurança (ex: geração de códigos).
├── crud/                 # Operações de Create, Read, Update, Delete no banco de dados.
│   ├── user_crud.py      # CRUD para usuários e credenciais.
│   └── verification_crud.py # CRUD para códigos de verificação.
├── services/             # Lógica de negócios, orquestrando operações CRUD e outras.
│   └── auth_service.py   # Serviços relacionados à autenticação.
└── tests/                # Testes automatizados.
    ├── conftest.py       # Configurações e fixtures para Pytest.
    └── test_auth_controller.py # Testes para o auth_controller.
```

### 3. Instalação e Configuração

**Pré-requisitos:**

*   Python 3.9 ou superior.
*   `pip` (gerenciador de pacotes Python).
*   Um servidor MySQL em execução (para desenvolvimento/produção).

**Passos para Instalação:**

1.  **Clonar o Repositório (se aplicável):**
    Se o projeto estiver em um sistema de controle de versão, clone-o.

2.  **Navegar até a Raiz do Projeto:**
    Abra o terminal e navegue até a pasta principal do projeto (ex: finanzen).

3.  **Criar e Ativar um Ambiente Virtual (Recomendado):**
    É uma boa prática usar ambientes virtuais para isolar as dependências do projeto.

    ```bash
    python -m venv backend/venv
    ```
    Para ativar o ambiente virtual:
    *   **Windows (cmd.exe):**
        ```cmd
        S:\codes\faculdade\finanzen\backend\venv\Scripts\activate
        ```
    *   **Windows (PowerShell):**
        ```powershell
        S:\codes\faculdade\finanzen\backend\venv\Scripts\Activate.ps1
        ```
    *   **Linux/macOS:**
        ```bash
        source backend/venv/bin/activate
        ```
    Você verá `(venv)` no início do prompt do seu terminal quando o ambiente estiver ativo.

4.  **Instalar as Dependências:**
    Com o ambiente virtual ativo, instale as bibliotecas Python listadas em requirements.txt:

    ```bash
    pip install -r backend/requirements.txt
    ```
    Isso instalará FastAPI, Uvicorn, SQLAlchemy, Pydantic, PyMySQL (driver MySQL), python-dotenv, pytest, etc.

5.  **Configurar Variáveis de Ambiente:**
    *   Crie um arquivo chamado `.env` dentro da pasta core.
    *   Adicione a URL de conexão do seu banco de dados MySQL a este arquivo:

        ```properties
        # backend/core/.env
        DATABASE_URL="mysql+pymysql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO"
        ```
        Substitua `USUARIO`, `SENHA`, `HOST`, `PORTA`, e `NOME_DO_BANCO` pelos seus dados. Com base nas interações anteriores, o seu é:
        ```properties
        DATABASE_URL="mysql+pymysql://root:Megasql1@localhost:3306/finanzen"
        ```

6.  **Criar as Tabelas no Banco de Dados:**
    A aplicação está configurada para criar as tabelas automaticamente quando iniciada, devido à linha `Base.metadata.create_all(bind=engine)` em main.py. Certifique-se de que o banco de dados (`finanzen` no seu caso) exista no servidor MySQL.

### 4. Executando a Aplicação

1.  **Ative o Ambiente Virtual** (se ainda não estiver ativo):
    ```cmd
    S:\codes\faculdade\finanzen\backend\venv\Scripts\activate
    ```

2.  **Inicie o Servidor Uvicorn:**
    A partir da pasta raiz do projeto (finanzen), execute o seguinte comando:

    ```bash
    uvicorn backend.main:app --reload --app-dir ./
    ```
    *   `backend.main:app`: Indica ao Uvicorn para encontrar o objeto app (sua instância FastAPI) no módulo `backend.main`.
    *   `--reload`: Faz com que o servidor reinicie automaticamente quando detectar alterações nos arquivos Python. Útil para desenvolvimento.
    *   `--app-dir ./`: Define o diretório raiz da aplicação como o diretório atual. Isso ajuda o Python a resolver os imports relativos corretamente (como `from backend.controllers ...`).

3.  **Acessando a API:**
    Após iniciar, o Uvicorn geralmente disponibiliza a API em `http://127.0.0.1:8000`.
    *   **Documentação Interativa (Swagger UI):** `http://127.0.0.1:8000/docs`
    *   **Documentação Alternativa (ReDoc):** `http://127.0.0.1:8000/redoc`

### 5. Executando os Testes

Os testes automatizados são escritos usando Pytest e estão localizados na pasta tests. Eles utilizam um banco de dados SQLite em memória para isolamento e rapidez.

1.  **Ative o Ambiente Virtual** (se ainda não estiver ativo).

2.  **Execute o Pytest:**
    A partir da pasta raiz do projeto (finanzen), execute:

    ```bash
    pytest
    ```
    O Pytest descobrirá e executará automaticamente os testes nos arquivos que seguem suas convenções de nomenclatura (ex: `test_*.py`).

    **Resultado Esperado dos Testes (após as correções que fizemos):**
    Todos os testes devem passar, e você verá um resumo indicando o número de testes passados. Quaisquer warnings devem ser investigados e corrigidos, como fizemos com o warning do Pydantic.

### 6. Funcionalidades Implementadas (com base no código)

*   **Registro de Usuário (`POST /auth/register`):**
    *   **Dados de Entrada:** `nomeUsuario`, `email`, `senha`, `objetivoPreferencias` (opcional), `rendaMensalPreferencias` (opcional).
    *   **Lógica:**
        *   Verifica se um usuário já existe com o mesmo e-mail e já está verificado. Se sim, retorna erro (esta lógica foi ajustada nos testes para permitir o reenvio do código se não verificado).
        *   Cria um novo usuário no banco de dados com `is_verified = False`.
        *   Cria as preferências do usuário se fornecidas.
        *   Gera um código de verificação de 6 dígitos.
        *   Salva o código de verificação no banco de dados associado ao e-mail.
        *   **ATENÇÃO:** Retorna o código de verificação na resposta da API para fins de teste acadêmico. **Isto é inseguro e não deve ser feito em produção.**
    *   **Resultado Esperado (Sucesso):** Status `201 Created`. Resposta JSON contendo uma mensagem, o e-mail do usuário e o `verification_code_for_testing`.
        ```json
        {
          "message": "Código de verificação enviado com sucesso. Verifique seu e-mail (simulado).",
          "email": "usuario@exemplo.com",
          "verification_code_for_testing": "123456"
        }
        ```

*   **Verificação de E-mail (`POST /auth/verify-email`):**
    *   **Dados de Entrada:** `email`, `codigo_Verificacao`.
    *   **Lógica:**
        *   Busca um código de verificação válido (não expirado, não usado) para o e-mail e código fornecidos.
        *   Se o código for inválido, retorna erro `400`.
        *   Atualiza o status do usuário para `is_verified = True`.
        *   Marca o código de verificação como usado.
    *   **Resultado Esperado (Sucesso):** Status `200 OK`. Resposta JSON com os dados do usuário (sem a senha), incluindo `is_verified = true`.
        ```json
        {
          "idUsuario": 1,
          "nomeUsuario": "Nome do Usuario",
          "email": "usuario@exemplo.com",
          "is_verified": true,
          "objetivoPreferencias": "Economizar",
          "rendaMensalPreferencias": "R$ 5000"
        }
        ```

*   **Login de Usuário (`POST /auth/login`):**
    *   **Dados de Entrada:** `email`, `senha`.
    *   **Lógica:**
        *   Busca as credenciais do usuário pelo e-mail.
        *   Se o e-mail não for encontrado, retorna erro `401`.
        *   Se a conta não estiver verificada (`is_verified = False`), retorna erro `403`.
        *   Compara a senha fornecida com a senha armazenada no banco de dados (atualmente em **TEXTO PLANO**, o que é **EXTREMAMENTE INSEGURO**).
        *   Se a senha estiver incorreta, retorna erro `401`.
    *   **Resultado Esperado (Sucesso):** Status `200 OK`. Resposta JSON com uma mensagem de sucesso e os dados do usuário (sem a senha).
        ```json
        {
          "message": "Login successful",
          "user": {
            "idUsuario": 1,
            "nomeUsuario": "Nome do Usuario",
            "email": "usuario@exemplo.com",
            "is_verified": true,
            "objetivoPreferencias": "Economizar",
            "rendaMensalPreferencias": "R$ 5000"
          }
        }
        ```

*   **Endpoint Raiz (`GET /`):**
    *   **Resultado Esperado:** Status `200 OK`. Mensagem de boas-vindas.
        ```json
        {
          "message": "Bem vindo ao Finanzen API - Backend!"
        }
        ```

### 7. Dados Envolvidos

*   **Usuário (`Usuario` model):** `idUsuario`, `nomeUsuario`, `is_verified`.
*   **Credenciais (`Credenciais` model):** `idCredencial`, `email`, `senha` (texto plano), `usuario_id` (chave estrangeira para `Usuario`).
*   **Preferências do Usuário (`PreferenciasUsuario` model):** `idPreferencia`, `objetivoPreferencias`, `rendaMensalPreferencias`, `usuario_id` (chave estrangeira para `Usuario`).
*   **Código de Verificação (`CodigoVerificacao` model):** `idCodigo`, `email`, `codigo`, `dataCriacao`, `dataExpiracao`, `usado`.

### 8. Considerações de Segurança (Importante!)

Conforme destacado no código e na documentação da API:

*   **Senhas em Texto Plano:** O projeto armazena senhas em texto plano. Isso é **extremamente inseguro** e **NÃO DEVE SER UTILIZADO EM AMBIENTES DE PRODUÇÃO**. Em um sistema real, as senhas devem ser "hasheadas" usando algoritmos fortes (ex: bcrypt, Argon2).
*   **Retorno do Código de Verificação na API:** O código de verificação de e-mail é retornado diretamente na resposta da API durante o registro. Isso é feito apenas para simplificar os testes em um contexto acadêmico e **NÃO DEVE SER FEITO EM PRODUÇÃO**. Em um sistema real, o código seria enviado para o e-mail do usuário.

Este documento deve fornecer uma boa base para entender e trabalhar com o backend do projeto Finanzen.
### README.md Reformulado

# Finanzen - Backend

Este é o guia de configuração e execução para o backend do projeto Finanzen, desenvolvido em Python com o framework FastAPI.

## 1\. Pré-requisitos

Antes de começar, garanta que você tenha os seguintes programas instalados:

  * **Python 3.9+**: Você pode baixar em [python.org](https://www.python.org/). Durante a instalação no Windows, marque a opção "Add Python to PATH".
  * **MySQL Server e MySQL Workbench**: Recomendamos o pacote de instalação oficial do site do MySQL.
  * **Git**: Para controle de versão do código.

## 2\. Configuração do Banco de Dados (MySQL)

1.  Abra o **MySQL Workbench** e conecte-se ao seu servidor de banco de dados local.

2.  Execute os seguintes comandos SQL para criar o banco de dados e um usuário específico para o projeto:

    ```sql
    -- Cria o banco de dados se ele não existir
    CREATE SCHEMA IF NOT EXISTS finanzen;
    ```

## 3\. Configuração e Execução do Backend

Siga estes passos dentro da pasta raiz do projeto (`finanzen/`).

#### Passo 1: Clone o Repositório

Se ainda não tiver o projeto, clone-o do repositório.

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd finanzen
```

#### Passo 2: Navegue até a Pasta do Backend

```bash
cd backend
```

#### Passo 3: Crie e Ative o Ambiente Virtual

Este passo isola as dependências do projeto. Execute estes comandos uma vez para configurar.

```bash
# Cria uma pasta 'venv' com uma instalação isolada do Python
python -m venv venv

# Ativa o ambiente virtual (você deve fazer isso toda vez que for trabalhar no projeto)
.\venv\Scripts\activate
```

*Após ativar, seu terminal deve mostrar `(venv)` no início da linha.*

#### Passo 4: Instale as Dependências

Com o ambiente virtual ativo, instale todas as bibliotecas necessárias.

```bash
pip install -r requirements.txt
```

#### Passo 5: Configure as Variáveis de Ambiente

1.  Na pasta `backend/core`, crie um novo arquivo de texto e salve-o com o nome de `.env` (exatamente ".env", sem nome antes do ponto).

2.  Abra o arquivo `.env` e cole o conteúdo abaixo, **substituindo pela senha que você definiu no MySQL**:

    ```env
    # URL de conexão para o banco de dados MySQL
    DATABASE_URL="mysql+pymysql://finanzen_user:uma_senha_forte_aqui@localhost:3306/finanzen"

    ```

#### Passo 6: Crie as Tabelas no Banco de Dados

O SQLAlchemy pode criar as tabelas para você. Com o ambiente virtual ativo, execute:

```bash
# Este comando usa o models.py para criar as tabelas no seu MySQL
python -c "import models; from database import Base, engine; Base.metadata.create_all(bind=engine)"
```

*Se você já criou as tabelas manualmente com o script SQL, pode pular este passo.*

#### Passo 7: Inicie o Servidor da API

Agora, vamos iniciar o servidor de desenvolvimento.

```bash
uvicorn main:app --reload
```

*A opção `--reload` faz o servidor reiniciar automaticamente quando você salva alterações no código.*

Se tudo deu certo, você verá uma mensagem indicando que o servidor está rodando em `http://127.0.0.1:8000`.

## 4\. Verificando a API

Com o servidor rodando, abra seu navegador e acesse a documentação interativa da API para testar os endpoints:

  * **Documentação Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
  * **Documentação ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

No Swagger, você pode usar o botão "Authorize" e inserir o ID de um usuário (ex: `1`) para testar os endpoints protegidos.

## 5\. Executando os Testes Automatizados

Para garantir que tudo está funcionando como esperado, você pode rodar a suíte de testes automatizados. Estes testes usam um banco de dados em memória e **não** afetam seu banco de dados MySQL.

1.  Abra um **novo terminal** na pasta raiz (`finanzen/`).
2.  Navegue até a pasta `backend` e ative o ambiente virtual:
    ```bash
    cd backend
    .\venv\Scripts\activate
    ```
3.  Execute o Pytest:
    ```bash
    pytest
    ```

Isso executará todos os testes nos arquivos `tests/` e mostrará um relatório dos resultados.

-----
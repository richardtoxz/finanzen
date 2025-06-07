@echo off
echo Iniciando processo de deploy para GitHub Pages...

:: Verificar se git está instalado
where git > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Git não foi encontrado. Por favor, instale o Git.
    exit /b 1
)

:: Construir o projeto
echo Construindo o projeto...
cd frontend
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Falha ao construir o projeto.
    exit /b 1
)

:: Criar branch temporário com os arquivos de build
echo Preparando arquivos para deploy...
cd dist
git init
git add .
git commit -m "Deploy para GitHub Pages"

:: Forçar push para o branch gh-pages
echo Enviando para o branch gh-pages...
git push -f https://github.com/richardtoxz/finanzen.git master:gh-pages

:: Limpar
echo Limpando arquivos temporários...
rmdir /s /q .git
cd ..
cd ..

echo Deploy concluído com sucesso! Seu site estará disponível em https://richardtoxz.github.io/finanzen/

*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${input_email}                   name:email
${input_senha}                   name:password
${botton_entrar}                 //button[@type='submit']
${botton_gerenciar_categoria}    xpath=//span[contains(.,'Gerenciar Categorias')]
${icon_editar}                   xpath=//button[@title='Editar']
${botton_salvar_edicao}          xpath=//button[@title='Salvar']
${input_nome_categoria}          xpath=//input[contains(@type,'text')]

*** Keywords ***
Dado que o usuário acessa a "Tela Inicial"
    Open Browser      https://richardtoxz.github.io/finanzen/    chrome
    Input Text        ${input_email}    marialuiza.barbosa.ux@gmail.com
    Input Password    ${input_senha}    Teste123!
    Click Button      ${botton_entrar}
    Sleep             5s
Quando o usuário seleciona a opção de gerenciar categoria no menu e o sistema retorna com um pop-up
    Click Element     ${botton_gerenciar_categoria} 
E o usuário aciona o botão com ícone de caneta para "Editar Categoria" 
    Click Element    ${icon_editar}
E o usuário editar no campo “Nome” o nome da categoria de "Mercado" para "Compras Semanais"
    Input Text       ${input_nome_categoria}    Compras semanais
Então o usuário aciona o botão “Salvar categoria” e o sistema valida e edita a categoria na conta do usuário.
    Click Element    ${botton_salvar_edicao}
*** Test Cases ***
Cenário 002: Editar Categoria
    Dado que o usuário acessa a "Tela Inicial" 
    Quando o usuário seleciona a opção de gerenciar categoria no menu e o sistema retorna com um pop-up 
    E o usuário aciona o botão com ícone de caneta para "Editar Categoria" 
    E o usuário editar no campo “Nome” o nome da categoria de "Mercado" para "Compras Semanais"
    Então o usuário aciona o botão “Salvar categoria” e o sistema valida e edita a categoria na conta do usuário. 


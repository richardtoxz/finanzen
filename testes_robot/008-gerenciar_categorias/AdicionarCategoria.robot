*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${input_email}                   name:email
${input_senha}                   name:password
${botton_entrar}                 //button[@type='submit']
${botton_gerenciar_categoria}    xpath=//span[contains(.,'Gerenciar Categorias')]
${input_nome_categoria}          xpath=//input[contains(@type,'text')]
${botton_adicionar_categora}     xpath=//button[contains(.,'Adicionar')]

*** Keywords ***
Dado que o usuário acessa a “Tela Inicial” 
    Open Browser      https://richardtoxz.github.io/finanzen/    chrome
    Input Text        ${input_email}    marialuiza.barbosa.ux@gmail.com
    Input Password    ${input_senha}    Teste123!
    Click Button      ${botton_entrar}
    Sleep             5s
Quando o usuário seleciona a opção de gerenciar categoria no menu e o sistema retorna com um pop-up 
    Click Element     ${botton_gerenciar_categoria} 

E o usuário inseri no campo “Nome” o nome da categoria “Mercado”
    Input Text        ${input_nome_categoria}    Salário
Então o usuário aciona o botão “Adicionar” e a categoria é salva no sistema 
    Click Element     ${botton_adicionar_categora}

*** Test Cases ***
Cenário 001: Adicionar categoria
    Dado que o usuário acessa a “Tela Inicial” 
    Quando o usuário seleciona a opção de gerenciar categoria no menu e o sistema retorna com um pop-up  
    E o usuário inseri no campo “Nome” o nome da categoria “Mercado” 
    Então o usuário aciona o botão “Adicionar” e a categoria é salva no sistema 
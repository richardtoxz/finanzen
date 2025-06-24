*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${input_email}                   name:email
${input_senha}                   name:password
${botton_entrar}                 //button[@type='submit']
${botton_gerenciar_categoria}    xpath=//span[contains(.,'Gerenciar Categorias')]
${icon_excluir}                  xpath=//button[@title='Excluir']
${button_confirmar_excluir}      xpath=//button[contains(.,'Excluir')]

*** Keywords ***
Dado que o usuário acessa a "Tela Inicial"
    Sleep             2s
    Open Browser      https://richardtoxz.github.io/finanzen/    chrome
    Input Text        ${input_email}    marialuiza.barbosa.ux@gmail.com
    Input Password    ${input_senha}    Teste123!
    Click Button      ${botton_entrar}
    Sleep             5s
Quando o usuário seleciona a opção de gerenciar categoria no menu e o sistema retorna com um pop-up
    Click Element     ${botton_gerenciar_categoria} 
E o usuário aciona o botão com ícone de caneta para "Excluir Categoria" e o sistema retorna um pop-up para que o usuário confirme a requisição
    Click Element     ${icon_excluir}
Então o usuário aciona o botão “Excluir” e o sistema válida a requisição de excluir a categoria na conta do usuário. 
    Click Button      ${button_confirmar_excluir}
*** Test Cases ***
Cenário 001: Excluir Categoria
    Dado que o usuário acessa a "Tela Inicial"
    Quando o usuário seleciona a opção de gerenciar categoria no menu e o sistema retorna com um pop-up 
    E o usuário aciona o botão com ícone de caneta para "Excluir Categoria" e o sistema retorna um pop-up para que o usuário confirme a requisição 
    Então o usuário aciona o botão “Excluir” e o sistema válida a requisição de excluir a categoria na conta do usuário. 
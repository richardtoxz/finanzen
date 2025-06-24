*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${input_email}                     name:email
${input_senha}                     name:password
${botton_entrar}                   //button[@type='submit']
${botton_orcamento}                xpath=//span[contains(.,'Orçamentos')]
${excluir_orcamento}              xpath=//button[@title="Excluir orçamento"]
${botton_confimar_excluir}        xpath=//button[contains(.,'Excluir')]

*** Keywords ***
Dado que o usuário acessa a página “Tela Inicial” acionando a opção no menu
    Sleep             4s
    Open Browser      https://richardtoxz.github.io/finanzen/    chrome
    Set Window Size  1280    800
    Input Text        ${input_email}    marialuiza.barbosa.ux@gmail.com
    Input Password    ${input_senha}    Teste123!
    Click Button      ${botton_entrar}
    Sleep             2s

Quando o usuário seleciona a opção de “Orçamentos” no menu e o sistema direciona o usuário a “Tela de Orçamentos” 
    Click Element     ${botton_orcamento}
E aciona o botão de “Excluir Orçamento” disposto no card da meta como um ícone de lixeira e o sistema retorna um pop-up 
    Sleep             2s
    Click Element     ${excluir_orcamento}
Então o usuário aciona o botão “Excluir” disposto no pop-up e o sistema válida a requisição e exclui o orçamento na conta do usuário
    Click Button      ${botton_confimar_excluir}
*** Test Cases ***
Cenário: Excluir Orçamento
    Dado que o usuário acessa a página “Tela Inicial” acionando a opção no menu 
    Quando o usuário seleciona a opção de “Orçamentos” no menu e o sistema direciona o usuário a “Tela de Orçamentos” 
    E aciona o botão de “Excluir Orçamento” disposto no card da meta como um ícone de lixeira e o sistema retorna um pop-up 
    Então o usuário aciona o botão “Excluir” disposto no pop-up e o sistema válida a requisição e exclui o orçamento na conta do usuário  
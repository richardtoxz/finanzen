*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${input_email}          name:email
${input_senha}          name:password
${botton_entrar}        //button[@type='submit']
${botton_relatorios}    //span[@class='text-sm'][contains(.,'Relatórios')]

*** Keywords ***
Dado que o usuário acessa a página de relatórios 
    Open Browser      https://richardtoxz.github.io/finanzen/    chrome
    Input Text        ${input_email}    marialuiza.barbosa.ux@gmail.com
    Input Password    ${input_senha}    Teste123!
    Click Button      ${botton_entrar}
    Click Element     ${botton_relatorios} 
#Quando aciona na transação deseja o botão “Excluir”

#E o usuário confirma a requisição acionando o botão

#Então o sistema valida aquela requisição e excluir permanentemente a transação direcionando o usuário de volta a tela de relatórios.

*** Test Cases ***
Cenário 001: Excluir Transação
    Dado que o usuário acessa a página de relatórios 
#    Quando aciona na transação deseja o botão “Excluir” 
#    E o usuário confirma a requisição acionando o botão 
#    Então o sistema valida aquela requisição e excluir permanentemente a transação direcionando o usuário de volta a tela de relatórios. 

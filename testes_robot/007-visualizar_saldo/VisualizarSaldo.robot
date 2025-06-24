*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${input_email}                name:email
${input_senha}                name:password
${botton_entrar}              //button[@type='submit']
${botton_relatorios}          xpath=//span[contains(.,'Relatórios')]
${opcao_periodo_mes_atual}    xpath=(//select[contains(@class,'block w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 appearance-none cursor-pointer')])[1]
${opcao_categoria}            xpath=(//select[contains(@class,'block w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 appearance-none cursor-pointer')])[2]


*** Keywords ***
Dado que o usuário acessa a “Tela Inicial” 
    Open Browser      https://richardtoxz.github.io/finanzen/    chrome
    Input Text        ${input_email}    marialuiza.barbosa.ux@gmail.com
    Input Password    ${input_senha}    Teste123!
    Click Button      ${botton_entrar}
    Sleep             5s
 
Quando o usuário seleciona a opção “Relatórios” no menu e o sistema direciona o usuário a “Tela Relatórios” 
    Click Element     ${botton_relatorios}
 E o usuário aciona o dropdown “Período” e escolhe uma das opções
    Get Selected List Value    ${opcao_periodo_mes_atual}

Então o usuário aciona o dropdown “Categoria” e escolhe uma das opções e o sitema retorna os dados corretos 
    Get Selected List Label    ${opcao_categoria}

*** Test Cases ***
Cenário 001: Visualizar Saldo
    Dado que o usuário acessa a “Tela Inicial” 
    Quando o usuário seleciona a opção “Relatórios” no menu e o sistema direciona o usuário a “Tela Relatórios” 
    E o usuário aciona o dropdown “Período” e escolhe uma das opções 
    Então o usuário aciona o dropdown “Categoria” e escolhe uma das opções e o sitema retorna os dados corretos 
*** Settings ***
Library    SeleniumLibrary
*** Variables ***
${input_email}                   name:email
${input_senha}                   name:password
${botton_entrar}                 //button[@type='submit']
${botton_metas}                  xpath=//span[contains(.,'Metas')]
${card_meta}                     xpath=//p[contains(@class,'font-medium')]
${excluir_meta}                  xpath=//button[@title="Excluir meta"]
${botton_confirmar_excluir}      xpath=//button[contains(.,'Excluir')]

*** Keywords ***
Dado que o usuário acessa a página de “Metas” acionando a opção no menu 
    Sleep             2s
    Open Browser      https://richardtoxz.github.io/finanzen/    chrome
    Input Text        ${input_email}    marialuiza.barbosa.ux@gmail.com
    Input Password    ${input_senha}    Teste123!
    Click Button      ${botton_entrar}
    Sleep             2s
    Click Element     ${botton_metas}
    Sleep             2s

Quando o usuário seleciona na meta desejada a opção de excluir 
    Mouse Over       ${card_meta}
    Click Button     ${excluir_meta}
E o sistema mostra na tela do usuário um pop-up para confirmar aquela ação
    Sleep            2s
Então o usuário aciona o botão “Excluir” e o sistema valida e exclui a meta desejada na conta do usuário. 
    Click Button     ${botton_confirmar_excluir}
*** Test Cases ***
Cenário: Excluir meta
    Dado que o usuário acessa a página de “Metas” acionando a opção no menu 
    Quando o usuário seleciona na meta desejada a opção de excluir 
    E o sistema mostra na tela do usuário um pop-up para confirmar aquela ação 
    Então o usuário aciona o botão “Excluir” e o sistema valida e exclui a meta desejada na conta do usuário. 

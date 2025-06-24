*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${input_email}                   name:email
${input_senha}                   name:password
${botton_entrar}                 //button[@type='submit']
${botton_metas}                  xpath=//span[contains(.,'Metas')]
${botton_nova_meta}              xpath=//button[contains(.,'Nova Meta')]
${input_nome_meta}               xpath=//input[@placeholder='Ex: Reserva de emergência']
${input_valor_meta}              xpath=//input[@placeholder='Ex: Reserva de emergência']
${input_descricao_meta}          xpath=//input[@placeholder='(opcional)']
${botton_salvar}                 xpath=//input[@placeholder='(opcional)']

*** Keywords ***
Dado que o usuário acessa a página de “Metas” acionando a opção no menu
    Sleep             2s
    Open Browser      https://richardtoxz.github.io/finanzen/    chrome
    Set Window Size  1280    800
    Input Text        ${input_email}    marialuiza.barbosa.ux@gmail.com
    Input Password    ${input_senha}    Teste123!
    Click Button      ${botton_entrar}
    Sleep             2s
    Click Element    ${botton_metas}
Quando o usuário seleciona a opção de adicionar meta 
    Click Element    ${botton_nova_meta}
E inseri no campo “Nome da meta” o nome 
    Input Text       ${input_nome_meta}         Viagem Rio de Janeiro
E inseri no campo “Valor da meta” o valor da meta
    Input Text       ${input_valor_meta}        2000
E inseri a descrição (opcional)
    Input Text       ${input_descricao_meta}    Dinheiro para viagem ao Rio de Janeiro em Julho de 2026.
Então aciona o botão salvar e o sistema valida e adicionar uma nova meta na conta do usuário.
    Click Element    ${botton_salvar}
*** Test Cases ***
Cenário 001: Adicionar Meta
    Dado que o usuário acessa a página de “Metas” acionando a opção no menu 
    Quando o usuário seleciona a opção de adicionar meta
    E inseri no campo “Nome da meta” o nome  
    E inseri no campo “Valor da meta” o valor da meta   
    E inseri a descrição (opcional)
    Então aciona o botão salvar e o sistema valida e adicionar uma nova meta na conta do usuário.
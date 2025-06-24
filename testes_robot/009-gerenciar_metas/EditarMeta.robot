*** Settings ***
Library    SeleniumLibrary
*** Variables ***
${input_email}                   name:email
${input_senha}                   name:password
${botton_entrar}                 //button[@type='submit']
${botton_metas}                  xpath=//span[contains(.,'Metas')]
${editar_meta}                   xpath=//button[@title="Editar meta"]
${input_nome_meta}               xpath=//input[@placeholder='Ex: Reserva de emergência']
${input_valor_meta}              xpath=//input[@placeholder='Ex: Reserva de emergência']
${input_descricao_meta}          xpath=//input[@placeholder='(opcional)']
${botton_salvar}                 xpath=//button[contains(.,'Salvar')]
${card_meta}                     xpath=//p[contains(@class,'font-medium')]

*** Keywords ***
Dado que o usuário acessa a página de “Metas” acionando a opção no menu 
    Sleep             2s
    Open Browser      https://richardtoxz.github.io/finanzen/    chrome
    Set Window Size  1280    800
    Input Text        ${input_email}    marialuiza.barbosa.ux@gmail.com
    Input Password    ${input_senha}    Teste123!
    Click Button      ${botton_entrar}
    Sleep             2s
    Click Element     ${botton_metas}
    Sleep             2s
Quando o usuário seleciona na meta desejada a opção de editar “ícone de caneta”
    Mouse Over       ${card_meta}
    Click Button     ${editar_meta}
E edita o “Nome da meta”
    Input Text        ${input_nome_meta}         Viagem ano novo
E edita no campo “Valor da meta” o valor da meta
    Input Text        ${input_valor_meta}        2500 
E edita a descrição (opcional)
    Input Text        ${input_descricao_meta}    Viagem para o ano novo

Então o usuário aciona o botão salvar sistema valida e edita os dados da meta na conta do usuário. 
    Click Element     ${botton_salvar} 
*** Test Cases ***
Cenário: Editar Meta
    Dado que o usuário acessa a página de “Metas” acionando a opção no menu 
    Quando o usuário seleciona na meta desejada a opção de editar “ícone de caneta” 
    E edita o “Nome da meta” 
    E edita no campo “Valor da meta” o valor da meta 
    E edita a descrição (opcional) 
    Então o usuário aciona o botão salvar sistema valida e edita os dados da meta na conta do usuário. 
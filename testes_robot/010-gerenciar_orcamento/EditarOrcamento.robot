*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${input_email}                     name:email
${input_senha}                     name:password
${botton_entrar}                   //button[@type='submit']
${botton_orcamento}                xpath=//span[contains(.,'Orçamentos')]
${editar_orcamento}                xpath=//button[@title="Editar orçamento"]
${dropdown_categoria_opcao}        xpath=//select[contains(@class, 'w-full') and contains(@class, 'bg-white')]
${input_valor_orcamento}           xpath=//input[contains(@type,'text')]
${botton_salvar_alteracoes}        xpath=//button[contains(.,'Salvar Alterações')]

*** Keywords ***
Dado que o usuário acessa a página “Tela Inicial” acionando a opção no menu 
    Sleep             4s
    Open Browser      https://richardtoxz.github.io/finanzen/    chrome
    Input Text        ${input_email}    marialuiza.barbosa.ux@gmail.com
    Input Password    ${input_senha}    Teste123!
    Click Button      ${botton_entrar}
    Sleep             2s
Quando o usuário seleciona a opção de “Orçamentos” no menu e o sistema direciona o usuário a “Tela de Orçamentos”
    Click Element                  ${botton_orcamento}
E aciona o botão de “Editar Orçamento” disposto no card da meta como um ícone de caneta e o sistema retorna um pop-up
    Sleep                         2s
    Click Element                 ${editar_orcamento}
E edita no campo “Categoria” a categoria que deseja relacionar 
    Select From List By Value     ${dropdown_categoria_opcao}    Salário
E edita no campo “Valor do orçamento” o valor do orçamento
    Input Text                    ${input_valor_orcamento}       500
Então o usuário aciona o botão "Salvar Alterações" e o sistema valida e adicionar um novo orçamento na conta do usuário. 
    Click Element                 ${botton_salvar_alteracoes}

*** Test Cases ***
Cenário: Editar Orçamento
    Dado que o usuário acessa a página “Tela Inicial” acionando a opção no menu 
    Quando o usuário seleciona a opção de “Orçamentos” no menu e o sistema direciona o usuário a “Tela de Orçamentos” 
    E aciona o botão de “Editar Orçamento” disposto no card da meta como um ícone de caneta e o sistema retorna um pop-up
    E edita no campo “Categoria” a categoria que deseja relacionar 
    E edita no campo “Valor do orçamento” o valor do orçamento
    Então o usuário aciona o botão "Salvar Alterações" e o sistema valida e adicionar um novo orçamento na conta do usuário. 
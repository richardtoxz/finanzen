*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${input_email}                     name:email
${input_senha}                     name:password
${botton_entrar}                   //button[@type='submit']
${botton_orcamento}                xpath=//span[contains(.,'Orçamentos')]
${botton_novo_orcamento}           xpath=//span[@class='text-sm'][contains(.,'Orçamentos')]
${dropdown_categoria_opcao}        xpath=//select[contains(@class, 'w-full') and contains(@class, 'bg-white')]
${input_valor_orcamento}           xpath=//input[contains(@type,'text')]
${botton_criar_orcamento}          xpath=//button[contains(.,'Criar Orçamento')]

*** Keywords ***
Dado que o usuário acessa a página “Tela Inicial” 
    Sleep             4s
    Open Browser      https://richardtoxz.github.io/finanzen/    chrome
    Input Text        ${input_email}    marialuiza.barbosa.ux@gmail.com
    Input Password    ${input_senha}    Teste123!
    Click Button      ${botton_entrar}
    Sleep             2s
Quando o usuário seleciona a opção de “Orçamentos” no menu e o sistema direciona o usuário a “Tela de Orçamentos”
    Sleep             2s
    Click Element      ${botton_orcamento}
E aciona o botão “Novo Orçamento” e o sistema retorna um pop-up
    Click Element      ${botton_novo_orcamento}
    Sleep              2s
E escolhe no dropdown “Categoria” a categoria que deseja relacionar
    Select From List By Value     ${dropdown_categoria_opcao}    Mercado    
E inseri no campo “Valor do orçamento” o valor do orçamento 
    Input Text        ${input_valor_orcamento}    2000
    Sleep             2s
Então o usuário aciona o botão de “Criar Orçamento” e o sistema valida e adicionar um novo orçamento na conta do usuário.
    Click Button      ${botton_criar_orcamento}
*** Test Cases ***
Cenário: Adicionar Orçamento
    Dado que o usuário acessa a página “Tela Inicial”  
    Quando o usuário seleciona a opção de “Orçamentos” no menu e o sistema direciona o usuário a “Tela de Orçamentos” 
    E aciona o botão “Novo Orçamento” e o sistema retorna um pop-up 
    E escolhe no dropdown “Categoria” a categoria que deseja relacionar 
    E inseri no campo “Valor do orçamento” o valor do orçamento  
    Então o usuário aciona o botão de “Criar Orçamento” e o sistema valida e adicionar um novo orçamento na conta do usuário. 
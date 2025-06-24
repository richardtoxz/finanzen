*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Teste de receita completa
    Set Selenium Speed    0.1s
    Abrir a pagina do finanzen
    Digitar email valido
    Digitar senha valida
    Clicar no botao entrar
    Esperar botão aparecer
    Clicar no botao nova transação
    Adicionar Valor
    Adicionar Data
    Clicar na categoria
    Selecionar categoria
    Adicionar Descrição
    Clicar no botao salvar transação

*** Keywords ***
Abrir a pagina do finanzen
   Open Browser    https://richardtoxz.github.io/finanzen/    chrome 
Digitar email valido
    Input Text    xpath=//input[@type='email']  testerobot@gmal.com
Digitar senha valida
    Input Text    xpath=//input[@name='password']    Robot123*
Clicar no botao entrar
    Click Button    xpath=//button[@type='submit']
Esperar botão aparecer
    Wait Until Element Is Visible   xpath=//button[contains(.,'Nova Transação')]     timeout=10s
Clicar no botao nova transação
    Click Button    xpath=//button[contains(.,'Nova Transação')]
Adicionar Valor
    Input Text    xpath=//input[@name='valor']    1000
Adicionar Data
    Press Keys       xpath=//input[@name='date']    06
    Sleep            0.2s
    Press Keys       xpath=//input[@name='date']    2
    Sleep            0.3s
    Press Keys       xpath=//input[@name='date']    3
    Sleep            0.2s
    Press Keys       xpath=//input[@name='date']    2025
    Sleep            0.2s
Clicar na categoria
    Click Element    xpath=//select[@name='category']
Selecionar categoria
    Select From List By Value    xpath=//select[contains(@class, 'block w-full px-3')]    Viagem
Adicionar Descrição
    Input Text    xpath=//input[@name='description']    criando primeira receita
Clicar no botao salvar transação
    Click Button    xpath=//button[contains(@class,'bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 flex items-center justify-center gap-2 w-full py-3 ')] 




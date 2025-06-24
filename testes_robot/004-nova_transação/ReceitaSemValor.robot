*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Teste de receita sem valor
    Set Selenium Speed    0.1s
    Abrir a pagina do finanzen
    Digitar email valido
    Digitar senha valida
    Clicar no botao entrar
    Esperar botão Sair aparecer
    Clicar no botao nova transação
    Adicionar Valor
    Adicionar Data
    Adicionar Descrição
    Clicar no botao salvar transação
    Verificar Mensagem de erro



*** Keywords ***
Abrir a pagina do finanzen
   Open Browser    https://richardtoxz.github.io/finanzen/    chrome 
Digitar email valido
    Input Text    xpath=//input[@type='email']  testerobot@gmal.com
Digitar senha valida
    Input Text    xpath=//input[@name='password']    Robot123*
Clicar no botao entrar
    Click Button    xpath=//button[@type='submit']
Esperar botão Sair aparecer
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
Adicionar Descrição
    Input Text    xpath=//input[@name='description']    criando primeira receita
Clicar no botao salvar transação
    Click Button    xpath=//button[contains(@class,'bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 flex items-center justify-center gap-2 w-full py-3 ')] 
    FOR    ${index}    IN RANGE    10
        ${resultado}=    Run Keyword And Ignore Error    Handle Alert
        Run Keyword If    '${resultado[0]}' == 'PASS'    Exit For Loop
        Sleep    0.5s
    END
    Should Be Equal As Strings    ${resultado[0]}    PASS
    ${mensagem}=    Set Variable    ${resultado[1]}
    [Return]    ${mensagem}
    Set Suite Variable    ${mensagem}
Verificar Mensagem de erro
    Should Contain    ${mensagem}    Por favor, preencha todos os campos obrigatórios.
    




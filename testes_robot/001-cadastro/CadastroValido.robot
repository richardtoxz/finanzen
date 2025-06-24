*** Settings ***

Library    SeleniumLibrary
Library    Telnet
Resource    ../002-login/LoginSenhaInvalida.robot
Resource    ../002-login/LoginEmailInvalido.robot

*** Test Cases ***
Teste de cadastro valido
    Set Selenium Speed     0.3s
    Abrir a pagina do finanzen
    Clicar em criar conta
    Digitar nome
    Digitar email valido
    Digitar senha valida
    Confirmar senha valida
    Clicar no botao criar conta
    Copiar codigo
    Codigo de verificação
    Botão Verificar
    Escolher objetivo
    Escolher renda
    Clicar no botao proximo

*** Keywords ***
Abrir a pagina do finanzen
    Open Browser    https://richardtoxz.github.io/finanzen/    chrome  
Clicar em criar conta
    Click Button    xpath=//button[contains(@class,'text-blue-600 hover:underline')]
Digitar nome
    Input Text    xpath=//input[@name='name']    Criando Conta
Digitar email valido
    Input Text    xpath = //input[@name='email']    criandoconta14@gmail.com
Digitar senha valida
    Input Password    xpath=//input[@name='password']    Robotconta123*
Confirmar senha valida
    Input Password    xpath=//input[@name='confirmPassword']   Robotconta123*
Clicar no botao criar conta
    Click Button    xpath=//button[@type='submit']
Copiar codigo
    ${alert_text}=    Handle Alert    action=ACCEPT
    Log    O texto do alert é: ${alert_text}
    ${codigo}=    Evaluate     "${alert_text}[-6:]"
    Log    Código extraído: ${codigo}
    Set Suite Variable    ${codigo}
Codigo de verificação
    Input Text    xpath=//input[@type='text']    ${codigo}
Botão Verificar
    Click Button    xpath=//button[@type='submit']
Escolher objetivo
    Wait Until Element Is Visible    xpath=//p[@class='text-sm font-medium text-gray-800 pr-6'][contains(.,'Quitar minhas dívidas')]
    Click Element    xpath=//p[@class='text-sm font-medium text-gray-800 pr-6'][contains(.,'Quitar minhas dívidas')]
Escolher renda 
    Wait Until Element Is Visible    xpath=//p[contains(.,'Prefiro não responder')]
    Click Element    xpath=//p[contains(.,'Prefiro não responder')]
Clicar no botao proximo
    Click Button    xpath=//button[contains(.,'Próximo')]
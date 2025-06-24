*** Settings ***

Library    SeleniumLibrary
Resource    ../002-login/LoginSenhaInvalida.robot
Resource    ../002-login/LoginEmailInvalido.robot

*** Test Cases ***
Teste de cadastro senha invalida
    Abrir a pagina do finanzen
    Clicar em criar conta
    Digitar nome
    Digitar email valido
    Digitar senha invalida
    Confirmar senha invalida
    Clicar no botao criar conta
    Verificar Mensagem de erro


*** Keywords ***
Abrir a pagina do finanzen
    Open Browser    https://richardtoxz.github.io/finanzen/    chrome
Clicar em criar conta
    Click Button    xpath=//button[contains(@class,'text-blue-600 hover:underline')]
Digitar nome
    Input Text    xpath=//input[@name='name']    Criando Conta
Digitar email valido
    Input Text    xpath = //input[@name='email']    criandoconta@gmail.com
Digitar senha invalida
    Input Password    xpath=//input[@name='password']    senha
Confirmar senha invalida
    Input Password    xpath=//input[@name='confirmPassword']   senha1
Clicar no botao criar conta
    Click Button    //button[@type='submit']
Verificar Mensagem de erro
    ${msg1}=    Run Keyword And Return Status    Page Should Contain Element    xpath=//p[@class='mt-1 text-xs text-red-600'][contains(.,'Senha deve ter: mínimo 8 caracteres, 1 letra maiúscula, 1 caractere especial, 1 número')]
    ${msg2}=    Run Keyword And Return Status    Page Should Contain Element    xpath=//p[@class='mt-1 text-xs text-red-600'][contains(.,'Senhas não coincidem')]
    IF    ${msg1} or ${msg2}
        Log    Uma das mensagens de erro apareceu corretamente.
    ELSE
        Fail    Nenhuma das mensagens esperadas foi exibida.
    END



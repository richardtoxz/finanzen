*** Settings ***

Library    SeleniumLibrary
Resource    ../002-login/LoginSenhaInvalida.robot
Resource    ../002-login/LoginEmailInvalido.robot

*** Test Cases ***
Teste de cadastro valido
    Abrir a pagina do finanzen
    Clicar em criar conta
    Digitar nome
    Digitar email valido
    Digitar senha valida
    Confirmar senha valida
    Clicar no botao criar conta
    Sleep   3s


*** Keywords ***
Abrir a pagina do finanzen
    Open Browser    https://richardtoxz.github.io/finanzen/    chrome
Clicar em criar conta
    Click Button    xpath=//button[contains(@class,'text-blue-600 hover:underline')]
Digitar nome
    Input Text    xpath=//input[@name='name']    Criando Conta
Digitar email valido
    Input Text    xpath = //input[@name='email']    criandoconta@gmail.com
Digitar senha valida
    Input Password    xpath=//input[@name='password']    Robotconta123*
Confirmar senha valida
    Input Password    xpath=//input[@name='confirmPassword']   Robotconta123*
Clicar no botao criar conta
    Click Button    //button[@type='submit']
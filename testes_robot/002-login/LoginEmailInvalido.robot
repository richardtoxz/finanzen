*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Teste de login email invalido
    Abrir a pagina do finanzen
    Digitar email invalido
    Digitar senha valida
    Clicar no botao entrar
    Sleep    5s

*** Keywords ***
Abrir a pagina do finanzen
   Open Browser    https://richardtoxz.github.io/finanzen/    chrome 
Digitar email invalido
    Input Text    xpath=//input[@type='email']  emailinvalido@gmail.com
Digitar senha valida
    Input Password   xpath=//input[@name='password']    Robot123*
Clicar no botao entrar
    Click Button    xpath=//button[@type='submit']
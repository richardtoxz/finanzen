*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Teste de login
    Abrir a pagina do finanzen
    Digitar email valido
    Digitar senha valida
    Clicar no botao entrar
    Sleep    5s

*** Keywords ***
Abrir a pagina do finanzen
   Open Browser    https://richardtoxz.github.io/finanzen/    chrome 
Digitar email valido
    Input Text    xpath=//input[@type='email']  testerobot@gmal.com
Digitar senha valida
    Input Text    xpath=//input[@name='password']    Robot123*
Clicar no botao entrar
    Click Button    xpath=//button[@type='submit']
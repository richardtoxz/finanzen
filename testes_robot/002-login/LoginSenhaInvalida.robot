*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Teste de login senha invalido
    Abrir a pagina do finanzen
    Digitar email valido
    Digitar senha invalida
    Clicar no botao entrar
    Sleep    5s

*** Keywords ***
Abrir a pagina do finanzen
   Open Browser    https://richardtoxz.github.io/finanzen/    chrome
Digitar email valido
    Input Text    xpath=//input[@type='email']  testerobot@gmal.com
Digitar senha invalida
    Input Password   xpath=//input[@name='password']    robot123*
Clicar no botao entrar
    Click Button    xpath=//button[@type='submit']
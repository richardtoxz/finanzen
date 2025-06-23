*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Teste de login email invalido
    Abrir a pagina do finanzen
    Digitar email invalido
    Digitar senha valida
    Clicar no botao entrar
    Verificar Mensagem de erro
    Sleep    2s

*** Keywords ***
Abrir a pagina do finanzen
   Open Browser    https://richardtoxz.github.io/finanzen/    chrome 
Digitar email invalido
    Input Text    xpath=//input[@type='email']  emailinvalido@gmail.com
Digitar senha valida
    Input Password   xpath=//input[@name='password']    Robot123*
Clicar no botao entrar
    Click Button    xpath=//button[@type='submit']  
Verificar Mensagem de erro
    Wait Until Element Is Visible    xpath=//*[contains(text(), 'e-mail não está cadastrado')]    5s
    Element Should Be Visible        xpath=//*[contains(text(), 'e-mail não está cadastrado')]  
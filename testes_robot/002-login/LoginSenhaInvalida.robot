*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Teste de login senha invalido
    Abrir a pagina do finanzen
    Digitar email valido
    Digitar senha invalida
    Clicar no botao entrar
    Verificar Mensagem de erro
    Sleep    2s

*** Keywords ***
Abrir a pagina do finanzen
   Open Browser    https://richardtoxz.github.io/finanzen/    chrome
Digitar email valido
    Input Text    xpath=//input[@type='email']  testerobot@gmal.com
Digitar senha invalida
    Input Password   xpath=//input[@name='password']    robot123*
Clicar no botao entrar
    Click Button    xpath=//button[@type='submit']
Verificar Mensagem de erro
    Wait Until Element Is Visible    xpath=//*[contains(text(), 'Senha incorreta')]    5s
    Element Should Be Visible        xpath=//*[contains(text(), 'Senha incorreta')]  
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Editar transação
    Set Selenium Speed     0.3s
    Abrir a pagina do finanzen
    Digitar email valido
    Digitar senha valida
    Clicar no botao entrar
    Esperar transações aparecer  
    Clicar na transação
    Editar transação

*** Keywords ***
Abrir a pagina do finanzen
   Open Browser    https://richardtoxz.github.io/finanzen/    chrome 
Digitar email valido
    Input Text    xpath=//input[@type='email']  testerobot@gmal.com
Digitar senha valida
    Input Text    xpath=//input[@name='password']    Robot123*
Clicar no botao entrar
    Click Button    xpath=//button[@type='submit']
Esperar transações aparecer  
    Wait Until Element Is Visible   xpath=//p[@class='font-medium'][contains(.,'Viagem')]    timeout=10s    
Clicar na transação
    Click Element   xpath=//p[@class='font-medium'][contains(.,'Viagem')]
Editar transação
    Click Button   xpath=//span[@class='text-sm'][contains(.,'Editar')]
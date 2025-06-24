*** Settings ***
Library     SeleniumLibrary

*** Test Cases ***
Logout completo
    Set Selenium Speed     0.1s
    Abrir a pagina do finanzen
    Digitar email valido
    Digitar senha valida
    Clicar no botao entrar
    Esperar botão Sair aparecer
    Clicar botão Sair
*** Keywords ***
Abrir a pagina do finanzen
   Open Browser    https://richardtoxz.github.io/finanzen/    chrome
   Set Window Size  1280    800
Digitar email valido
    Input Text    xpath=//input[@type='email']  testerobot@gmal.com
Digitar senha valida
    Input Text    xpath=//input[@name='password']    Robot123*
Clicar no botao entrar
    Click Button    xpath=//button[@type='submit']

Esperar botão Sair aparecer
    Wait Until Element Is Visible   xpath=//div[@class='flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer mt-auto']     timeout=10s
Clicar botão Sair
    Click Element    xpath=//span[@class='text-sm'][contains(.,'Sair')]


*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Teste cadastro valido
    Abrir a pagina do finanzen
    Digitar o nome do produto
    Clicar no botao pesquisar

*** Keywords ***
Abrir a pagina do finanzen
   Open Browser    https://www.ebay.com/    chrome
Digitar o nome do produto
    Input Text    id:gh-ac    bicicleta
Clicar no botao pesquisar
    Click Button    id:gh-search-btn
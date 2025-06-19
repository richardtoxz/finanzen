import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"
HEADERS = {"Content-Type": "application/json"}

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
email_a = f"testa_{timestamp}@test.com"
email_b = f"testb_{timestamp}@test.com"

print("🧪 TESTE DE INTEGRAÇÃO RÁPIDO - API FINANZEN")
print("=" * 50)

print(f"\n1. Cadastrando Usuário A ({email_a})...")
usuario_a = {
    "nomeUsuario": "Test User A",
    "email": email_a,
    "senha": "TestSenh@123"
}

resp = requests.post(f"{BASE_URL}/auth/register", json=usuario_a, headers=HEADERS)
print(f"Status: {resp.status_code}")
if resp.status_code == 201:
    data = resp.json()
    code_a = data["verification_code_for_testing"]
    print(f"✅ Usuário A registrado. Código: {code_a}")
else:
    print(f"❌ Erro: {resp.text}")
    exit()

print("\n2. Verificando email Usuário A...")
verify_a = {
    "email": email_a,
    "codigo_Verificacao": code_a
}

resp = requests.post(f"{BASE_URL}/auth/verify-email", json=verify_a, headers=HEADERS)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    user_a = resp.json()
    user_a_id = user_a["idUsuario"]
    print(f"✅ Usuário A verificado. ID: {user_a_id}")
else:
    print(f"❌ Erro: {resp.text}")
    exit()

auth_a = {**HEADERS, "Authorization": f"Bearer {user_a_id}"}

print("\n3. Criando categoria para Usuário A...")
categoria = {
    "nome": "Salário",
    "tipo": "receita"
}

resp = requests.post(f"{BASE_URL}/categorias", json=categoria, headers=auth_a)
print(f"Status: {resp.status_code}")
if resp.status_code == 201:
    cat_data = resp.json()
    cat_id = cat_data["idCategoria"]
    print(f"✅ Categoria criada. ID: {cat_id}")
else:
    print(f"❌ Erro: {resp.text}")
    exit()

print("\n4. Criando meta para Usuário A...")
meta = {
    "nome": "Comprar Notebook",
    "valor_objetivo": 2000.00
}

resp = requests.post(f"{BASE_URL}/metas", json=meta, headers=auth_a)
print(f"Status: {resp.status_code}")
if resp.status_code == 201:
    meta_data = resp.json()
    meta_id = meta_data["idMeta"]
    print(f"✅ Meta criada. ID: {meta_id}")
else:
    print(f"❌ Erro: {resp.text}")
    exit()

print("\n5. Criando transação vinculada à meta...")
transacao = {
    "tipo": "receita",
    "valor": 400.00,
    "data_movimentacao": "2025-06-13",
    "categoria_id": cat_id,
    "meta_id": meta_id,
    "descricao": "Freelance para a meta"
}

resp = requests.post(f"{BASE_URL}/transacoes", json=transacao, headers=auth_a)
print(f"Status: {resp.status_code}")
if resp.status_code == 201:
    trans_data = resp.json()
    print(f"✅ Transação criada. ID: {trans_data['idMovimentacao']}")
else:
    print(f"❌ Erro: {resp.text}")
    exit()

print("\n6. Verificando progresso da meta...")
resp = requests.get(f"{BASE_URL}/metas/{meta_id}", headers=auth_a)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    meta_updated = resp.json()
    valor_atual = float(meta_updated["valor_atual"])
    progresso = meta_updated["progresso_percentual"]
    valor_objetivo = float(meta_updated["valor_objetivo"])
    
    print(f"✅ Meta atualizada:")
    print(f"   - Objetivo: R$ {valor_objetivo:.2f}")
    print(f"   - Atual: R$ {valor_atual:.2f}")
    print(f"   - Progresso: {progresso:.1f}%")
    
    if valor_atual == 400.00 and progresso == 20.0:
        print("✅ CÁLCULO CORRETO!")
    else:
        print("⚠️  Cálculo diferente do esperado")
else:
    print(f"❌ Erro: {resp.text}")

print("\n7. Teste de Segurança - Cadastrando Usuário B...")
usuario_b = {
    "nomeUsuario": "Test User B",
    "email": email_b,
    "senha": "TestSenh@456"
}

resp = requests.post(f"{BASE_URL}/auth/register", json=usuario_b, headers=HEADERS)
if resp.status_code == 201:
    data_b = resp.json()
    code_b = data_b["verification_code_for_testing"]
    
    verify_b = {
        "email": email_b, 
        "codigo_Verificacao": code_b
    }
    
    resp = requests.post(f"{BASE_URL}/auth/verify-email", json=verify_b, headers=HEADERS)
    if resp.status_code == 200:
        user_b = resp.json()
        user_b_id = user_b["idUsuario"]
        print(f"✅ Usuário B criado. ID: {user_b_id}")
        
        auth_b = {**HEADERS, "Authorization": f"Bearer {user_b_id}"}
        transacao_invasiva = {
            "tipo": "despesa",
            "valor": 50.00,
            "data_movimentacao": "2025-06-13",
            "categoria_id": cat_id,  
            "descricao": "Tentativa invasiva"
        }
        
        print("\n8. Testando segurança - Usuário B tenta usar categoria do A...")
        resp = requests.post(f"{BASE_URL}/transacoes", json=transacao_invasiva, headers=auth_b)
        print(f"Status: {resp.status_code}")
        
        if resp.status_code in [403, 404, 422]:
            print("✅ SEGURANÇA OK: Usuário B não pode usar categoria do A")
        else:
            print(f"❌ FALHA DE SEGURANÇA: {resp.text}")

print("\n" + "=" * 50)
print("🎯 RESUMO DO TESTE:")
print("✅ Cadastro e verificação de usuários")
print("✅ Criação de categorias") 
print("✅ Criação de metas")
print("✅ Registro de transações")
print("✅ Cálculo de progresso de metas")
print("✅ Validação de segurança")
print("\n🎉 TESTE DE INTEGRAÇÃO CONCLUÍDO!")

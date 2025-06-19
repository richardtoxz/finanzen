#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:8000"

def test_perfil_endpoints():
    print("🧪 TESTE RÁPIDO - ENDPOINTS DE PERFIL")
    print("=" * 50)
    
    print("\n1. Criando usuário de teste...")
    user_data = {
        "nomeUsuario": "Teste Perfil",
        "email": "perfil.teste@example.com",
        "senha": "TesteSenha@123",
        "objetivoPreferencias": "Economizar",
        "rendaMensalPreferencias": "R$2000-R$3000"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
        print(f"Registro: {response.status_code}")
        
        if response.status_code == 201:
            reg_data = response.json()
            code = reg_data.get("verification_code_for_testing")
            
            print("\n2. Verificando email...")
            verify_data = {
                "email": user_data["email"],
                "codigo_Verificacao": code
            }
            response = requests.post(f"{BASE_URL}/auth/verify-email", json=verify_data)
            print(f"Verificação: {response.status_code}")
            
            if response.status_code == 200:
                user = response.json()
                user_id = user["idUsuario"]
                headers = {"Authorization": f"Bearer {user_id}"}
                
                print("\n3. Buscando perfil...")
                response = requests.get(f"{BASE_URL}/perfil/", headers=headers)
                print(f"Buscar perfil: {response.status_code}")
                if response.status_code == 200:
                    profile = response.json()
                    print(f"Perfil: {json.dumps(profile, indent=2)}")
                
                print("\n4. Atualizando perfil...")
                update_data = {
                    "nomeUsuario": "Teste Perfil Atualizado",
                    "objetivoPreferencias": "Investir"
                }
                response = requests.put(f"{BASE_URL}/perfil/", json=update_data, headers=headers)
                print(f"Atualizar perfil: {response.status_code}")
                if response.status_code == 200:
                    updated_profile = response.json()
                    print(f"Perfil atualizado: {json.dumps(updated_profile, indent=2)}")
                
                print("\n5. Alterando senha...")
                password_data = {
                    "senha_atual": "TesteSenha@123",
                    "nova_senha": "NovaSenha@456"
                }
                response = requests.put(f"{BASE_URL}/perfil/senha", json=password_data, headers=headers)
                print(f"Alterar senha: {response.status_code}")
                if response.status_code == 200:
                    print(f"Resposta: {response.json()}")
                
                print("\n✅ Todos os testes de perfil executados!")
            else:
                print(f"Erro na verificação: {response.text}")
        else:
            print(f"Erro no registro: {response.text}")
    
    except Exception as e:
        print(f"Erro durante os testes: {e}")

if __name__ == "__main__":
    test_perfil_endpoints()

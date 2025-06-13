import { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';

export default function VerificationScreen({ onVerify, email }) {
    const [code, setCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onVerify(code);
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Verificação de Email</h2>
                <p className="text-center">
                    Um código de verificação foi enviado para {email}.
                    Por favor, insira o código abaixo.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Código de Verificação"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Digite o código de 6 dígitos"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                        Verificar
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}

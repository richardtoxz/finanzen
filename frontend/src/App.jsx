import { useState, useEffect } from 'react';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import FinanceApp from './screens/FinanceApp';
import VerificationScreen from './screens/VerificationScreen';
import { api } from './services/api';

export default function App() {
  const [screen, setScreen] = useState('loading');
  const [user, setUser] = useState(null);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState(null);
  useEffect(() => {
    const checkAuthState = () => {
      const storedUserId = localStorage.getItem('user_id');
      const storedUser = localStorage.getItem('user_data');

      console.log('🔍 Verificando estado de autenticação:', {
        hasUserId: !!storedUserId,
        hasUserData: !!storedUser,
        userId: storedUserId
      });

      if (storedUserId && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          if (parsedUser.idUsuario && parsedUser.idUsuario.toString() !== storedUserId) {
            console.warn('⚠️ Inconsistência detectada entre user_id e userData');
            localStorage.setItem('user_id', parsedUser.idUsuario.toString());
          }

          setUser(parsedUser);
          setScreen('app');
          console.log('🔄 Sessão restaurada para user_id:', storedUserId);
        } catch (error) {
          console.error('❌ Erro ao restaurar sessão:', error);
          api.logout();
          setScreen('login');
        }
      } else if (storedUserId || storedUser) {
        console.warn('⚠️ Dados de autenticação incompletos, limpando localStorage');
        api.logout();
        setScreen('login');
      } else {
        setScreen('login');
      }
    };

    checkAuthState();
  }, []);
  const handlers = {
    login: async (credentials) => {
      try {
        const loginData = {
          email: credentials.email,
          senha: credentials.senha || credentials.password
        };

        const response = await api.login(loginData);

        localStorage.setItem('user_data', JSON.stringify(response.user));

        setUser(response.user);
        setScreen('app');
        console.log('✅ Login realizado e dados persistidos para:', response.user.email);
      } catch (error) {
        const errorMessage = error.message || 'Erro ao fazer login';
        alert(errorMessage);
      }
    },

    signup: async (userData) => {
      try {
        const response = await api.register(userData);
        setVerificationEmail(response.email);
        setVerificationPending(true);
        alert(`Código de verificação (apenas para teste): ${response.verification_code_for_testing}`);
      } catch (error) {
        alert(error.message);
      }
    }, verifyEmail: async (code) => {
      try {
        const response = await api.verifyEmail(verificationEmail, code);

        localStorage.setItem('user_data', JSON.stringify(response));

        if (response.idUsuario) {
          localStorage.setItem('user_id', response.idUsuario.toString());
          console.log('✅ user_id definido após verificação:', response.idUsuario);
        }

        setUser(response);
        setVerificationPending(false);
        setScreen('onboarding');
      } catch (error) {
        alert(error.message);
      }
    }, onboardingComplete: async (updatedUserData) => {
      const updatedUser = { ...user, ...updatedUserData };

      localStorage.setItem('user_data', JSON.stringify(updatedUser));

      if (updatedUser.idUsuario && !localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', updatedUser.idUsuario.toString());
        console.log('✅ user_id mantido após onboarding:', updatedUser.idUsuario);
      }

      setUser(updatedUser);
      setScreen('app');
    }, logout: () => {
      api.logout();
      localStorage.removeItem('user_data');
      setUser(null);
      setScreen('login');
      console.log('🚪 Logout realizado, todos os dados limpos');
    },

    switchToLogin: () => setScreen('login'),
    switchToSignup: () => setScreen('signup')
  };
  const renderScreen = () => {
    switch (screen) {
      case 'loading':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Verificando autenticação...</p>
            </div>
          </div>
        );
      case 'login':
        return <LoginScreen onLogin={handlers.login} onSwitchToSignup={handlers.switchToSignup} />;
      case 'signup':
        return verificationPending ?
          <VerificationScreen onVerify={handlers.verifyEmail} email={verificationEmail} /> :
          <SignupScreen onSignup={handlers.signup} onSwitchToLogin={handlers.switchToLogin} />;
      case 'onboarding':
        return user ? <OnboardingScreen user={user} onComplete={handlers.onboardingComplete} /> :
          <LoginScreen onLogin={handlers.login} onSwitchToSignup={handlers.switchToSignup} />;
      case 'app':
        return user ? <FinanceApp user={user} onLogout={handlers.logout} /> :
          <LoginScreen onLogin={handlers.login} onSwitchToSignup={handlers.switchToSignup} />;
      default:
        return <LoginScreen onLogin={handlers.login} onSwitchToSignup={handlers.switchToSignup} />;
    }
  };

  return renderScreen();
}
import { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import FinanceApp from './screens/FinanceApp';
import VerificationScreen from './screens/VerificationScreen';
import { api } from './services/api';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState(null);

  const handlers = {
    login: async (credentials) => {
      try {
        const loginData = {
          email: credentials.email,
          senha: credentials.senha || credentials.password
        };
        
        const response = await api.login(loginData);
        setUser(response.user);
        setScreen('app');
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
    },

    verifyEmail: async (code) => {
      try {
        const response = await api.verifyEmail(verificationEmail, code);
        setUser(response);
        setVerificationPending(false);
        setScreen('onboarding');
      } catch (error) {
        alert(error.message);
      }
    },

    onboardingComplete: async (updatedUserData) => {
      setUser({ ...user, ...updatedUserData });
      setScreen('app');
    },

    logout: () => {
      setUser(null);
      setScreen('login');
    },

    switchToLogin: () => setScreen('login'),
    switchToSignup: () => setScreen('signup')
  };

  const renderScreen = () => {
    switch (screen) {
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
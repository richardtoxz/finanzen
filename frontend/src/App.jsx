import { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import FinanceApp from './screens/FinanceApp';

export default function App() {
  const [screen, setScreen] = useState('login'); // Default to 'login'
  const [user, setUser] = useState(null);

  const handlers = {
    login: userData => {
      setUser(userData);
      // Simple check: if user has a name, assume onboarding was done.
      // In a real app, this would be a flag from the backend or more robust check.
      if (TEST_CREDENTIALS.find(cred => cred.email === userData.email && cred.name === userData.name)) {
         setScreen('app');
      } else {
         setScreen('onboarding'); // Should ideally not happen if login implies full user data
      }
    },
    signup: userData => { // userData here usually just contains email from signup form
      setUser(userData);
      setScreen('onboarding');
    },
    onboardingComplete: updatedUserData => {
      setUser(updatedUserData);
      setScreen('app');
    },
    logout: () => {
      setUser(null);
      setScreen('login');
    },
    switchToLogin: () => setScreen('login'),
    switchToSignup: () => setScreen('signup')
  };

  // This is just for the login check logic, ideally user data structure would be more consistent
  const TEST_CREDENTIALS = [
    { name: 'Enzo Silva', email: 'enzo@teste.com' },
    { name: 'Maria Santos', email: 'maria@demo.com' },
    { name: 'João Costa', email: 'joao@exemplo.com' }
  ];


  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return <LoginScreen onLogin={handlers.login} onSwitchToSignup={handlers.switchToSignup} />;
      case 'signup':
        return <SignupScreen onSignup={handlers.signup} onSwitchToLogin={handlers.switchToLogin} />;
      case 'onboarding':
        return user ? <OnboardingScreen user={user} onComplete={handlers.onboardingComplete} /> : <LoginScreen onLogin={handlers.login} onSwitchToSignup={handlers.switchToSignup} />; // Fallback to login if no user
      case 'app':
        return user ? <FinanceApp user={user} onLogout={handlers.logout} /> : <LoginScreen onLogin={handlers.login} onSwitchToSignup={handlers.switchToSignup} />; // Fallback to login if no user
      default:
        return <LoginScreen onLogin={handlers.login} onSwitchToSignup={handlers.switchToSignup} />;
    }
  };

  return renderScreen();
}
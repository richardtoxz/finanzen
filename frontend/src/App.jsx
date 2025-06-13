import {useState} from 'react'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import FinanceApp from './screens/FinanceApp'
import VerificationScreen from './screens/VerificationScreen'
import {api} from './services/api'

export default function App(){
  const [screen,setScreen]=useState('login'),
        [user,setUser]=useState(null),
        [email,setEmail]=useState(''),
        [pending,setPending]=useState(false)

  const handleLogin=async({email,senha,password})=>{
    try{
      const res=await api.login({email,senha:senha||password})
      setUser(res.user)
      setScreen('app')
    }catch(e){alert(e.message||'Erro ao fazer login')}
  }

  const handleSignup=async data=>{
    try{
      const res=await api.register(data)
      setEmail(res.email)
      setPending(true)
      alert(`Código (teste): ${res.verification_code_for_testing}`)
    }catch(e){alert(e.message)}
  }

  const handleVerify=async code=>{
    try{
      const res=await api.verifyEmail(email,code)
      setUser(res)
      setPending(false)
      setScreen('onboarding')
    }catch(e){alert(e.message)}
  }

  const handleOnboard=info=>{setUser(u=>({...u,...info}));setScreen('app')}
  const handleLogout=()=>{setUser(null);setScreen('login')}

  const screens={
    login:<LoginScreen onLogin={handleLogin} onSwitchToSignup={()=>setScreen('signup')} />,
    signup:pending
      ?<VerificationScreen onVerify={handleVerify} email={email}/>
      :<SignupScreen onSignup={handleSignup} onSwitchToLogin={()=>setScreen('login')} />,    
    onboarding:user && <OnboardingScreen user={user} onComplete={handleOnboard}/>,
    app:user && <FinanceApp user={user} onLogout={handleLogout}/>
  }

  return screens[screen]||screens.login
}

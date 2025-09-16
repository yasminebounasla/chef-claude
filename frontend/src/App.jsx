import './App.css'
import { Header } from './components/Header.jsx';
import { useState } from 'react';
import { Main } from './components/Main.jsx';
import { List } from './components/List.jsx';
import { LoginForm } from './components/loginForm.jsx';
import { RegisterForm } from './components/registerForm.jsx';
import { AuthProvider } from './contexts/authContext.jsx';

function App() {
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true); 
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleLogin = () => {
    setShowLoginForm(true);
    setShowFavorites(false);
    setShowHistory(false);
    setShowRegisterForm(false);
  }

  const handleRegister = () => {
    setShowRegisterForm(true);
    setShowFavorites(false);
    setShowLoginForm(false);
    setShowFavorites(false);
  }

  const handleFavorites = () => {
    setShowFavorites(true);
    setShowHistory(false);
    setShowLoginForm(false);
    setShowRegisterForm(false);
  }

  const handleHistory = () => {
    setShowHistory(true);
    setShowFavorites(false);
    setShowLoginForm(false);
    setShowRegisterForm(false);
  }

  const close = () => {
    setShowFavorites(false);
    setShowHistory(false);
    setShowLoginForm(false);
    setShowRegisterForm(false);
  }

  return (
    <AuthProvider>
      <div className="app">
        <Header 
          handleFavorites={handleFavorites} 
          handleHistory={handleHistory} 
          handleLogin={handleLogin}
          handleRegister={handleRegister}
        />
        <Main />
        {showLoginForm && <LoginForm onClose={close} handleRegister={handleRegister}/>}
        {showHistory && <List type="history" onClose={close}/>}
        {showFavorites && <List type="favorites" onClose={close}/>}
        {showRegisterForm && <RegisterForm onClose={close} handleLogin={handleLogin} />}
      </div>
    </AuthProvider>
  )
}

export default App;
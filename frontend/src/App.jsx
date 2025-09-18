import './App.css'
import { Header } from './components/Header.jsx';
import { useState, useContext, useEffect } from 'react';
import { Main } from './components/Main.jsx';
import { List } from './components/List.jsx';
import { LoginForm } from './components/loginForm.jsx';
import { RegisterForm } from './components/registerForm.jsx';
import { AuthContext } from './context/authContext.jsx';
import { Recipe } from './components/Recipe.jsx';
import { Profile } from './components/Profile.jsx';
import { ChangePassword } from './components/changePassword.jsx';

function App() {
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false); 
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null); 
  const [showProfile, setShowProfile] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginForm(false);
      setShowRegisterForm(false);
    } else {
      setShowLoginForm(true);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setShowLoginForm(true);
    setShowFavorites(false);
    setShowHistory(false);
    setShowRegisterForm(false);
    setShowProfile(false);
    setShowPasswordForm(false);
  };

  const handleRegister = () => {
    setShowRegisterForm(true);
    setShowFavorites(false);
    setShowLoginForm(false);
    setShowHistory(false);
    setShowProfile(false);
    setShowPasswordForm(false);
  };

  const handleFavorites = () => {
    setShowFavorites(true);
    setShowHistory(false);
    setShowLoginForm(false);
    setShowRegisterForm(false);
    setShowProfile(false);
    setShowPasswordForm(false);
  };

  const handleHistory = () => {
    setShowHistory(true);
    setShowFavorites(false);
    setShowLoginForm(false);
    setShowRegisterForm(false);
    setShowProfile(false);
    setShowPasswordForm(false);
  };

  const close = () => {
    setShowFavorites(false);
    setShowHistory(false);
    setShowLoginForm(false);
    setShowRegisterForm(false);
    setShowProfile(false);
  };

  const closePasswordForm = () => {
    setShowPasswordForm(false);
  }

  const handleProfile = () => {
    setShowProfile(true);
    setShowFavorites(false);
    setShowHistory(false);
    setShowLoginForm(false);
    setShowRegisterForm(false);
    setShowPasswordForm(false);
  }
  
  const handlePasswordForm = () => {
    setShowPasswordForm(true);
    setShowProfile(true);
    setShowFavorites(false);
    setShowHistory(false);
    setShowLoginForm(false);
    setShowRegisterForm(false);
  }

  return (
    <div className="app">
      <Header 
        handleFavorites={handleFavorites} 
        handleHistory={handleHistory} 
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleProfile={handleProfile}
      />
      <Main handleLogin={handleLogin}/>

      {showProfile && <Profile onClose={close} onChangePassword={handlePasswordForm}/> }
      {showLoginForm && <LoginForm onClose={close} handleRegister={handleRegister}/>}
      {showHistory && <List type="history" onClose={close} onRecipeClick={setSelectedRecipe}/>}
      {showFavorites && <List type="favorite" onClose={close} onRecipeClick={setSelectedRecipe}/>} 
      {showRegisterForm && <RegisterForm onClose={close} handleLogin={handleLogin} />}
      {selectedRecipe && <Recipe recipe={selectedRecipe} closeRecipe={() => setSelectedRecipe(null)}/>}
      {showPasswordForm && <ChangePassword onClose={closePasswordForm}/> }
    </div>
  )
}

export default App;

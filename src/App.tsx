import { useState, useEffect } from 'react';
import ChatPage from './pages/ChatPage';
import { CometChatProvider } from './providers/CometChatProvider';
import './App.css';

function App() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uidParam = params.get('uid');
    if (uidParam) {
      setUid(uidParam);
    }
  }, []);

  if (!uid) {
    return (
      <div className="login-container">
        <h1 className="login-title">Select a User to Login</h1>
        <div className="login-button-group">
          <button 
            className="login-button"
            onClick={() => {
              window.history.pushState({}, '', '?uid=cometchat-uid-1');
              setUid('cometchat-uid-1');
            }}
          >
            Login as User 1
          </button>
          
          <button 
            className="login-button"
            onClick={() => {
              window.history.pushState({}, '', '?uid=cometchat-uid-2');
              setUid('cometchat-uid-2');
            }}
          >
            Login as User 2
          </button>
        </div>
      </div>
    );
  }

  return (
    <CometChatProvider uid={uid}>
      <div className="app-container">
        <ChatPage />
      </div>
    </CometChatProvider>
  )
}

export default App

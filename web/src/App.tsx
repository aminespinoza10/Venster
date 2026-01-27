import { useState } from 'react';
import SideMenu from './shared/components/SideMenu'
import { ChatPage } from './features/chat'
import { SettingsPage } from './features/settings'
import { RAGPage } from './features/rag'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState<string>('home');

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'chats':
        return <ChatPage />;
      case 'home':
        return (
          <div className="content-wrapper">
            <h1>Welcome to Venster</h1>
            <p className="subtitle">your AI Agents window</p>
            
            <div className="feature-cards">
              <div className="feature-card" onClick={() => setActiveSection('chats')}>
                <div className="feature-icon">💬</div>
                <h3>Start Chatting</h3>
                <p>Chat with AI assistants</p>
              </div>
              
              <div className="feature-card" onClick={() => setActiveSection('localdocs')}>
                <div className="feature-icon">📄</div>
                <h3>RAG</h3>
                <p>Chat with your local documents</p>
              </div>
              
              <div className="feature-card" onClick={() => setActiveSection('settings')}>
                <div className="feature-icon">⚙️</div>
                <h3>Settings</h3>
                <p>Configure your preferences</p>
              </div>
            </div>
          </div>
        );
      case 'localdocs':
        return <RAGPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <div className="content-wrapper">
            <h1>Welcome to Venster</h1>
            <p className="subtitle">your AI Agents window</p>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <SideMenu activeSection={activeSection} onNavigate={handleNavigation} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App
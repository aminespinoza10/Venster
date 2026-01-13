import React, { useState, useEffect } from 'react';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const [ollamaUrl, setOllamaUrl] = useState<string>('http://127.0.0.1:11434');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Load saved URL on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('ollamaUrl');
    if (savedUrl) {
      setOllamaUrl(savedUrl);
    }
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOllamaUrl(e.target.value);
    setConnectionStatus('idle');
  };

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    try {
      const response = await fetch(`${ollamaUrl}/api/tags`);
      if (response.ok) {
        setConnectionStatus('success');
        setTimeout(() => setConnectionStatus('idle'), 3000);
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
    }
  };

  const handleSave = () => {
    localStorage.setItem('ollamaUrl', ollamaUrl);
    alert('Settings saved! Your chat will now use this Ollama server.');
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Settings</h1>
        <p className="subtitle">Configure your preferences</p>
        
        <div className="settings-section">
          <h2>Ollama Server</h2>
          <p className="section-description">Configure your local Ollama server connection</p>
          
          <div className="form-group">
            <label htmlFor="ollama-url">Server URL</label>
            <input
              id="ollama-url"
              type="text"
              value={ollamaUrl}
              onChange={handleUrlChange}
              placeholder="http://localhost:11434"
              className="url-input"
            />
            <span className="input-hint">Default: http://localhost:11434</span>
          </div>
          
          <div className="button-group">
            <button 
              className="test-button" 
              onClick={handleTestConnection}
              disabled={connectionStatus === 'testing'}
            >
              {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
            <button className="save-button" onClick={handleSave}>
              Save Settings
            </button>
          </div>

          {connectionStatus === 'success' && (
            <div className="status-message success">
              ✓ Successfully connected to Ollama server
            </div>
          )}
          {connectionStatus === 'error' && (
            <div className="status-message error">
              ✗ Failed to connect. Make sure Ollama is running at this URL.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

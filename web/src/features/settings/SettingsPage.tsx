import React, { useState } from 'react';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const [ollamaUrl, setOllamaUrl] = useState<string>('http://localhost:11434');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOllamaUrl(e.target.value);
  };

  const handleSave = () => {
    // TODO: Save to localStorage or backend
    localStorage.setItem('ollamaUrl', ollamaUrl);
    alert('Settings saved!');
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
          
          <button className="save-button" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

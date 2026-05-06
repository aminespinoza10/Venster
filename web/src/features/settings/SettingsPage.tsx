import React, { useState, useEffect } from 'react';
import './SettingsPage.css';
import { ollamaService } from '../chat/services/ollamaService';

const SettingsPage: React.FC = () => {
  const [ollamaUrl, setOllamaUrl] = useState<string>('http://localhost:8080');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [chatModels, setChatModels] = useState<string[]>([]);
  const [embeddingModels, setEmbeddingModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('llama3.2');
  const [selectedEmbeddingModel, setSelectedEmbeddingModel] = useState<string>('nomic-embed-text:latest');
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);

  // Load saved URL and model on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('ollamaUrl');
    if (savedUrl) {
      setOllamaUrl(savedUrl);
    }
    const savedModel = localStorage.getItem('selectedModel');
    if (savedModel) {
      setSelectedModel(savedModel);
    }
    const savedEmbeddingModel = localStorage.getItem('selectedEmbeddingModel');
    if (savedEmbeddingModel) {
      setSelectedEmbeddingModel(savedEmbeddingModel);
    }
  }, []);

  // Fetch available models
  const fetchModels = async () => {
    setIsLoadingModels(true);
    try {
      const [chat, embedding] = await Promise.all([
        ollamaService.listChatModels(),
        ollamaService.listEmbeddingModels(),
      ]);

      setChatModels(chat);
      setEmbeddingModels(embedding);

      if (chat.length > 0 && !chat.includes(selectedModel)) {
        setSelectedModel(chat[0]);
      }
      if (embedding.length > 0 && !embedding.includes(selectedEmbeddingModel)) {
        setSelectedEmbeddingModel(embedding[0]);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOllamaUrl(e.target.value);
    setConnectionStatus('idle');
  };

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    // Update localStorage with current URL so ollamaService uses it
    localStorage.setItem('ollamaUrl', ollamaUrl);
    try {
      const response = await fetch(`${ollamaUrl}/api/tags`);
      if (response.ok) {
        setConnectionStatus('success');
        // Fetch models after successful connection
        await fetchModels();
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
    localStorage.setItem('selectedModel', selectedModel);
    localStorage.setItem('selectedEmbeddingModel', selectedEmbeddingModel);
    alert('Settings saved! Your chat will now use this Ollama server and selected model.');
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
            <span className="input-hint">Default: http://localhost:8080</span>
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

        <div className="settings-section">
          <h2>Model Selection</h2>
          <p className="section-description">Choose chat and embedding models from your API endpoints</p>
          
          <div className="form-group">
            <label>Chat Models (GET /api/chatModels)</label>
            <div className="model-list-container">
              {isLoadingModels ? (
                <div className="model-list-empty">Loading models...</div>
              ) : chatModels.length === 0 ? (
                <div className="model-list-empty">No chat-capable models found</div>
              ) : (
                <div className="model-list">
                  {chatModels.map(model => (
                    <label key={model} className="model-item">
                      <input
                        type="radio"
                        name="chat-model"
                        value={model}
                        checked={selectedModel === model}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="model-radio"
                      />
                      <span className="model-name">{model}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <span className="input-hint">
              {isLoadingModels ? 'Loading models...' : 
               chatModels.length > 0 ? `${chatModels.length} chat model(s) available` : 
               'Refresh models to load chat models'}
            </span>
          </div>

          <div className="form-group">
            <label>Embedding Models (GET /api/embedding)</label>
            <div className="model-list-container">
              {isLoadingModels ? (
                <div className="model-list-empty">Loading models...</div>
              ) : embeddingModels.length === 0 ? (
                <div className="model-list-empty">No embedding-capable models found</div>
              ) : (
                <div className="model-list">
                  {embeddingModels.map(model => (
                    <label key={model} className="model-item">
                      <input
                        type="radio"
                        name="embedding-model"
                        value={model}
                        checked={selectedEmbeddingModel === model}
                        onChange={(e) => setSelectedEmbeddingModel(e.target.value)}
                        className="model-radio"
                      />
                      <span className="model-name">{model}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <span className="input-hint">
              {isLoadingModels ? 'Loading models...' :
               embeddingModels.length > 0 ? `${embeddingModels.length} embedding model(s) available` :
               'Refresh models to load embedding models'}
            </span>
          </div>

          <button 
            className="refresh-button" 
            onClick={fetchModels}
            disabled={isLoadingModels}
          >
            {isLoadingModels ? 'Loading...' : 'Refresh Models'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

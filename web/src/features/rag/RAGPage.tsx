import React, { useState, useRef } from 'react';
import './RAGPage.css';

const RAGPage: React.FC = () => {
  const [documentsPath, setDocumentsPath] = useState<string>('');
  const [chunkSize, setChunkSize] = useState<number>(512);
  const [chunkOverlap, setChunkOverlap] = useState<number>(50);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentsPath(e.target.value);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDirectorySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const firstFile = files[0];
      const fullPath = firstFile.webkitRelativePath || firstFile.name;
      const dirPath = fullPath.split('/')[0];
      setDocumentsPath(dirPath || fullPath);
    }
  };

  const handleChunkSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChunkSize(Number(e.target.value));
  };

  const handleChunkOverlapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChunkOverlap(Number(e.target.value));
  };

  const handleIndexDocuments = () => {
    alert('Document indexing will be implemented soon!');
  };

  const handleSave = () => {
    localStorage.setItem('documentsPath', documentsPath);
    localStorage.setItem('chunkSize', chunkSize.toString());
    localStorage.setItem('chunkOverlap', chunkOverlap.toString());
    alert('RAG settings saved!');
  };

  return (
    <div className="rag-page">
      <div className="rag-container">
        <h1>RAG</h1>
        <p className="subtitle">Chat with your local documents</p>
        
        <div className="rag-section">
          <h2>Document Collection</h2>
          <p className="section-description">Configure your local document collection for retrieval-augmented generation</p>
          
          <div className="form-group">
            <label htmlFor="documents-path">Documents Path</label>
            <div className="input-with-button">
              <input
                id="documents-path"
                type="text"
                value={documentsPath}
                onChange={handlePathChange}
                placeholder="/path/to/your/documents"
                className="path-input"
              />
              <button 
                type="button"
                className="browse-button"
                onClick={handleBrowseClick}
              >
                Browse
              </button>
              <input
                ref={fileInputRef}
                type="file"
                /* @ts-ignore - webkitdirectory is not in standard types */
                webkitdirectory="true"
                directory="true"
                multiple
                onChange={handleDirectorySelect}
                style={{ display: 'none' }}
              />
            </div>
            <span className="input-hint">Specify the folder containing your documents</span>
          </div>
          
          <div className="button-group">
            <button 
              className="index-button" 
              onClick={handleIndexDocuments}
              disabled={!documentsPath}
            >
              Index Documents
            </button>
          </div>
        </div>

        <div className="rag-section">
          <h2>Chunking Settings</h2>
          <p className="section-description">Configure how documents are split for processing</p>
          
          <div className="form-group">
            <label htmlFor="chunk-size">Chunk Size</label>
            <input
              id="chunk-size"
              type="number"
              value={chunkSize}
              onChange={handleChunkSizeChange}
              min="128"
              max="2048"
              className="number-input"
            />
            <span className="input-hint">Number of tokens per chunk (128-2048)</span>
          </div>

          <div className="form-group">
            <label htmlFor="chunk-overlap">Chunk Overlap</label>
            <input
              id="chunk-overlap"
              type="number"
              value={chunkOverlap}
              onChange={handleChunkOverlapChange}
              min="0"
              max="256"
              className="number-input"
            />
            <span className="input-hint">Number of overlapping tokens between chunks (0-256)</span>
          </div>
        </div>

        <div className="save-section">
          <button className="save-button" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default RAGPage;

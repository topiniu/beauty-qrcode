import React, { useState } from 'react';
import QRCodeComponent from './QRCodeComponent';
import './App.css';

function App() {
  const [url, setUrl] = useState('https://example.com');
  const [renderer, setRenderer] = useState('dom');

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleRendererChange = (event) => {
    setRenderer(event.target.value);
  };

  return (
    <div className="App">
      <div className="App-panel">
        <h1>beauty-qrcode</h1>
        <p>Generate animated QR codes with DOM or SVG rendering.</p>
        <label className="App-field">
          <span>QR content</span>
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter URL for QR code"
          />
        </label>
        <label className="App-field">
          <span>Renderer</span>
          <div className="App-choiceGroup" role="radiogroup" aria-label="Renderer">
            <label className={`App-choice${renderer === 'dom' ? ' is-active' : ''}`}>
              <input
                type="radio"
                name="renderer"
                value="dom"
                checked={renderer === 'dom'}
                onChange={handleRendererChange}
              />
              <span>DOM Grid</span>
            </label>
            <label className={`App-choice${renderer === 'svg' ? ' is-active' : ''}`}>
              <input
                type="radio"
                name="renderer"
                value="svg"
                checked={renderer === 'svg'}
                onChange={handleRendererChange}
              />
              <span>SVG</span>
            </label>
          </div>
        </label>
      </div>
      <QRCodeComponent url={url} renderer={renderer} />
    </div>
  );
}

export default App;

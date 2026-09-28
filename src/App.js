import React, { useState } from 'react';
import QRCodeComponent from './QRCodeComponent';
import './App.css';

function App() {
  const [url, setUrl] = useState('https://example.com');
  const [renderer, setRenderer] = useState('dom');
  const [replay, setReplay] = useState(0);
  const [animate, setAnimate] = useState(
    () => !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  return (
    <main className="App">
      <header className="App-header">
        <a href="https://github.com/topiniu/beauty-qrcode">topiniu / beauty-qrcode</a>
        <span>React component · MIT</span>
      </header>
      <section className="App-workspace">
        <div className="App-panel">
          <p className="App-eyebrow">A SMALL INTERACTION STUDY</p>
          <h1>一格一格，<br />让链接显形。</h1>
          <p className="App-intro">把一段文字变成二维码。方块从中心依次展开，DOM 与 SVG 两种渲染方式，共用一个组件。</p>
          <label className="App-field">
            <span>QR content</span>
            <input type="text" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="输入链接或文字" />
          </label>
          <fieldset className="App-field App-renderers">
            <legend>Renderer</legend>
            <div className="App-choiceGroup" role="radiogroup" aria-label="Renderer">
              {['dom', 'svg'].map((value) => (
                <label key={value} className={`App-choice${renderer === value ? ' is-active' : ''}`}>
                  <input type="radio" name="renderer" value={value} checked={renderer === value} onChange={() => setRenderer(value)} />
                  <span>{value === 'dom' ? 'DOM Grid' : 'SVG'}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="App-motion">
            <input type="checkbox" checked={animate} onChange={(event) => setAnimate(event.target.checked)} />
            播放展开动画
          </label>
        </div>
        <div className="App-specimen">
          <div className="App-specimenLabel"><span>01 / LIVE PREVIEW</span><span>{renderer.toUpperCase()}</span></div>
          <div className="App-codeStage">
            {url ? <QRCodeComponent key={replay} url={url} renderer={renderer} animate={animate} moduleSize={7} /> : <p className="App-empty">输入一段文字，生成二维码。</p>}
          </div>
          <button className="App-replay" onClick={() => setReplay((value) => value + 1)} disabled={!url || !animate}>↻ 重新播放</button>
          <p className="App-caption">试着切换渲染方式，或用手机扫一扫。</p>
        </div>
      </section>
      <footer className="App-footer"><span>beauty-qrcode</span><span>文字 → 矩阵 → 动画</span><a href="https://github.com/topiniu/beauty-qrcode#readme">使用文档 ↗</a></footer>
    </main>
  );
}

export default App;

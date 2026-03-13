import { useEffect, useMemo, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import QRCode from 'qrcode';

const containerBaseStyle = {
  margin: '20px auto',
  padding: '12px',
  borderRadius: '10px',
  transition: 'box-shadow 0.5s ease-in-out',
};

const moduleBaseStyle = {
  width: '100%',
  height: '100%',
};

function createQRCodeData(url, errorCorrectionLevel) {
  try {
    const qr = QRCode.create(url || '', { errorCorrectionLevel });
    const qrMatrix = qr.modules;

    if (!qrMatrix) {
      return null;
    }

    const qrSize = qrMatrix.size;
    const center = Math.floor(qrSize / 2);
    const blackModules = [];

    for (let row = 0; row < qrSize; row += 1) {
      for (let col = 0; col < qrSize; col += 1) {
        if (qrMatrix.get(col, row)) {
          blackModules.push({
            row,
            col,
            distance: Math.hypot(row - center, col - center),
          });
        }
      }
    }

    return {
      qrMatrix,
      qrSize,
      center,
      blackModules,
    };
  } catch (error) {
    console.error('Failed to create QR code', error);
    return null;
  }
}

function animateModules({
  animate: shouldAnimate,
  moduleTargets,
  shadowTarget,
}) {
  if (!shouldAnimate || !moduleTargets.length || !shadowTarget) {
    return undefined;
  }

  const delays = moduleTargets.map((node) => {
    const distance = Number.parseFloat(node.dataset.distance || '0');
    return Number.isFinite(distance) ? distance * 30 : 0;
  });
  const maxDelay = delays.length ? Math.max(...delays) : 0;

  const moduleAnimation = anime({
    targets: moduleTargets,
    scale: [0, 1],
    opacity: [0, 1],
    delay: (_, index) => delays[index] ?? 0,
    easing: 'cubicBezier(.34,1.56,.81,1.38)',
    duration: 320,
  });

  const shadowAnimation = anime({
    targets: shadowTarget,
    boxShadow: [
      '0px 0px 0px 0px rgba(99, 99, 99, 0)',
      '3px 3px 9px 9px rgba(99, 99, 99, 0.5)',
      '0px 2px 8px 0px rgba(99, 99, 99, 0.2)',
    ],
    easing: 'cubicBezier(.34,1.56,.81,1.38)',
    duration: 240,
    delay: maxDelay + 120,
  });

  return () => {
    if (moduleAnimation && typeof moduleAnimation.pause === 'function') {
      moduleAnimation.pause();
    }
    if (shadowAnimation && typeof shadowAnimation.pause === 'function') {
      shadowAnimation.pause();
    }
  };
}

function QRCodeComponent({
  url = '',
  errorCorrectionLevel = 'H',
  moduleSize = 10,
  className = '',
  moduleClassName = '',
  animate = true,
  renderer = 'dom',
}) {
  const containerRef = useRef(null);
  const domGridRef = useRef(null);
  const svgRef = useRef(null);

  const qrData = useMemo(
    () => createQRCodeData(url, errorCorrectionLevel),
    [url, errorCorrectionLevel]
  );

  const qrSize = qrData?.qrSize ?? 0;
  const dimension = qrSize * moduleSize;

  useEffect(() => {
    if (renderer !== 'dom') {
      return undefined;
    }

    const container = domGridRef.current;
    if (!container || !qrData) {
      return undefined;
    }

    container.innerHTML = '';

    Object.assign(container.style, {
      display: 'grid',
      gridTemplateColumns: `repeat(${qrData.qrSize}, 1fr)`,
      width: `${dimension}px`,
      height: `${dimension}px`,
    });

    const nodes = [];
    for (let row = 0; row < qrData.qrSize; row += 1) {
      for (let col = 0; col < qrData.qrSize; col += 1) {
        const module = document.createElement('div');
        module.className = `qr-module${moduleClassName ? ` ${moduleClassName}` : ''}`;
        Object.assign(module.style, moduleBaseStyle);
        module.style.backgroundColor = qrData.qrMatrix.get(col, row) ? 'black' : 'white';
        module.dataset.row = String(row);
        module.dataset.col = String(col);
        module.dataset.distance = String(Math.hypot(row - qrData.center, col - qrData.center));
        container.appendChild(module);
        nodes.push(module);
      }
    }

    const cleanupAnimations = animateModules({
      animate,
      moduleTargets: nodes,
      shadowTarget: containerRef.current,
    });

    return () => {
      if (cleanupAnimations) {
        cleanupAnimations();
      }
      container.innerHTML = '';
    };
  }, [animate, dimension, moduleClassName, qrData, renderer]);

  useEffect(() => {
    if (renderer !== 'svg') {
      return undefined;
    }

    const svg = svgRef.current;
    if (!svg || !qrData) {
      return undefined;
    }

    const nodes = Array.from(svg.querySelectorAll('.qr-module'));

    return animateModules({
      animate,
      moduleTargets: nodes,
      shadowTarget: containerRef.current,
    });
  }, [animate, qrData, renderer]);

  const containerClasses = ['qr-container'];
  if (className) {
    containerClasses.push(className);
  }

  const containerStyle = {
    ...containerBaseStyle,
    width: '290px',
  };

  return (
    <div
      ref={containerRef}
      className={containerClasses.join(' ')}
      style={containerStyle}
      data-renderer={renderer}
    >
      {renderer === 'svg' && qrData ? (
        <svg
          ref={svgRef}
          className="qr-svg"
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          role="img"
          aria-label="QR code"
        >
          <rect width={dimension} height={dimension} fill="white" />
          {qrData.blackModules.map(({ row, col, distance }) => (
            <rect
              key={`${row}-${col}`}
              className={`qr-module${moduleClassName ? ` ${moduleClassName}` : ''}`}
              x={col * moduleSize}
              y={row * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill="black"
              data-row={row}
              data-col={col}
              data-distance={distance}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
              }}
            />
          ))}
        </svg>
      ) : (
        <div ref={domGridRef} className="qr-grid" aria-label="QR code" />
      )}
    </div>
  );
}

export default QRCodeComponent;

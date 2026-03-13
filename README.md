# beauty-qrcode

`beauty-qrcode` is a React QR code component with two rendering backends:

- `dom`: animated grid-based rendering for highly stylized effects
- `svg`: lighter markup with the same component API

The library is built for React 18+ and published as a named-export package.

## Features

- One component API for both DOM and SVG QR rendering
- Center-out entrance animation powered by `animejs`
- High error-correction QR generation through `qrcode`
- Styling hooks for both the container and individual modules
- TypeScript declarations included in the published package

## Installation

```bash
npm install beauty-qrcode
```

Peer dependencies:

- `react >= 18`
- `react-dom >= 18`

## Usage

Named export only:

```jsx
import { QRCodeComponent } from 'beauty-qrcode';

export function Example() {
  return (
    <QRCodeComponent
      url="https://example.com/signup"
      renderer="dom"
      moduleSize={12}
      errorCorrectionLevel="H"
    />
  );
}
```

### SVG Renderer

```jsx
import { QRCodeComponent } from 'beauty-qrcode';

export function SvgExample() {
  return (
    <QRCodeComponent
      url="https://example.com/signup"
      renderer="svg"
      moduleSize={12}
      className="qr-card"
      moduleClassName="qr-pixel"
    />
  );
}
```

## API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `string` | `""` | Value encoded into the QR code. |
| `errorCorrectionLevel` | `'L' \| 'M' \| 'Q' \| 'H'` | `'H'` | QR resiliency level. |
| `moduleSize` | `number` | `10` | Pixel size of each QR module. |
| `className` | `string` | `''` | Extra class applied to the outer container. |
| `moduleClassName` | `string` | `''` | Extra class applied to each QR module node. In SVG mode this is applied to each `<rect>`. |
| `renderer` | `'dom' \| 'svg'` | `'dom'` | Rendering backend. |
| `animate` | `boolean` | `true` | Enables the entrance animation. |

## Styling

The component exposes two styling hooks:

- `className` for the outer QR container
- `moduleClassName` for individual QR modules

Example:

```css
.qr-card {
  background: radial-gradient(circle, #fff 0%, #f4f4f5 100%);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.16);
}

.qr-pixel {
  border-radius: 2px;
}
```

## Renderer Notes

### DOM renderer

- Renders a full module grid using HTML elements
- Best when per-module animation and visual experimentation matter most
- Heavier in DOM size than SVG

### SVG renderer

- Renders only dark modules as `<rect>` elements
- Better for leaner markup and scalable output
- Shares the same API and animation flag

## Caveats

- QR generation happens on the client after mount. The component is safe to import in React apps, but the visual QR output is not pre-rendered on the server.
- The DOM renderer intentionally creates more nodes to support richer animation effects.
- Large QR payloads with animation enabled will cost more in layout and paint work than the SVG renderer.

## Development

```bash
npm install
npm run test:ci
npm run build:lib
```

## Release Checklist

- `npm run test:ci`
- `npm run build:lib`
- `npm run pack:check`

## License

MIT

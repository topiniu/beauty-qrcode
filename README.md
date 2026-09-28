# beauty-qrcode

一个带展开动画的 React 二维码组件。DOM Grid 与 SVG 共用一套 API，可以逐格调整样式，也可以关闭动画。

![beauty-qrcode 本地演示：输入内容、切换 DOM / SVG、重播动画](docs/media/demo.png)

<details>
<summary>看一段真实运行的动画</summary>

![SVG 二维码从中心展开的录屏](docs/media/animation.gif)

本地浏览器实录，示例内容为 `https://example.com`。GIF 来自浏览器捕获帧，帧率受采集限制。
</details>

### 这个组件在解决什么

二维码通常只是一个静态结果。这个小项目把生成过程变成可观察的交互：根据每个方块到中心的距离安排出场时间，同时提供两种渲染方式，便于比较动画控制与节点数量之间的取舍。

### 运行演示

```bash
npm ci
npm start
```

演示页支持输入、渲染切换、动画开关与重播；初始动画设置尊重系统的减少动态效果偏好。只使用本地输入，不依赖后端服务。`.env.development` 将本地资源路径设为 `/`，避免 npm 包的 GitHub 主页地址影响开发服务器。

---

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

## Manual Release

Authenticate with npm if needed:

```bash
npm login
```

Then release with a single command:

```bash
npm run release -- patch
```

The release command will:

1. bump the version with `npm version`
2. run `npm run test:ci`
3. run `npm run build:lib`
4. run `npm run pack:check`
5. publish to npm

Supported targets:

- `npm run release -- patch`
- `npm run release -- minor`
- `npm run release -- major`
- `npm run release -- 0.2.1`

## License

MIT

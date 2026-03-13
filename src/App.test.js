import { fireEvent, render, screen } from '@testing-library/react';
import QRCodeComponent from './QRCodeComponent';
import App from './App';

jest.mock('animejs/lib/anime.es.js', () => {
  const animeMock = jest.fn(() => ({ pause: jest.fn() }));
  animeMock.stagger = jest.fn(() => 0);
  return animeMock;
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('App demo', () => {
  test('renders the URL input and renderer switcher', () => {
    render(<App />);

    expect(screen.getByLabelText(/QR content/i)).toHaveValue('https://example.com');
    expect(screen.getByRole('radio', { name: /DOM Grid/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /SVG/i })).not.toBeChecked();
  });

  test('switches the demo to SVG mode', () => {
    const { container } = render(<App />);

    fireEvent.click(screen.getByRole('radio', { name: /SVG/i }));

    expect(container.querySelector('.qr-container')).toHaveAttribute('data-renderer', 'svg');
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('QRCodeComponent', () => {
  test('renders DOM mode by default', () => {
    const { container } = render(<QRCodeComponent url="https://example.com" animate={false} />);

    expect(container.querySelector('.qr-container')).toHaveAttribute('data-renderer', 'dom');
    expect(container.querySelector('.qr-grid')).toBeInTheDocument();
    expect(container.querySelectorAll('.qr-module').length).toBeGreaterThan(0);
  });

  test('renders SVG mode with custom classes', () => {
    const { container } = render(
      <QRCodeComponent
        url="https://example.com"
        renderer="svg"
        className="custom-container"
        moduleClassName="custom-module"
        animate={false}
      />
    );

    expect(container.querySelector('.qr-container')).toHaveClass('custom-container');
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('rect.custom-module')).toBeInTheDocument();
    expect(container.querySelector('rect.custom-module')).toHaveAttribute('width', '10');
  });

  test('does not trigger animations when animate is false', () => {
    const anime = require('animejs/lib/anime.es.js');

    render(<QRCodeComponent url="https://example.com" renderer="svg" animate={false} />);

    expect(anime).not.toHaveBeenCalled();
  });

  test('updates the rendered output when renderer changes', () => {
    const { container, rerender } = render(
      <QRCodeComponent url="https://example.com" animate={false} />
    );

    expect(container.querySelector('.qr-grid')).toBeInTheDocument();

    rerender(<QRCodeComponent url="https://example.com" renderer="svg" animate={false} />);

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('.qr-grid')).not.toBeInTheDocument();
  });
});

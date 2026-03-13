import React from 'react';

export interface QRCodeComponentProps {
  /**
   * The URL or text to encode in the QR code
   */
  url?: string;

  /**
   * Error correction level: 'L', 'M', 'Q', 'H'
   * @default 'H'
   */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';

  /**
   * Size of each module in pixels
   * @default 10
   */
  moduleSize?: number;

  /**
   * Additional CSS class for the container
   */
  className?: string;

  /**
   * Additional CSS class for individual QR modules
   */
  moduleClassName?: string;

  /**
   * Rendering strategy for the QR code output
   * @default 'dom'
   */
  renderer?: 'dom' | 'svg';

  /**
   * Enable/disable animation
   * @default true
   */
  animate?: boolean;
}

declare const QRCodeComponent: React.FC<QRCodeComponentProps>;

export { QRCodeComponent };

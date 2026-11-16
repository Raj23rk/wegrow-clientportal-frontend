import React, { useMemo, useRef } from 'react';
import { Qrcodegen } from '../../utils/qrcodegen';

interface QRCodeViewProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  border?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 220,
  fgColor = '#0C1D36',
  bgColor = '#FFFFFF',
  border = 3,
  className,
  style
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { path, viewBoxSize } = useMemo(() => {
    try {
      const qr = Qrcodegen.QrCode.encodeText(value, 'M');
      return qr.toSvgPath(border);
    } catch (e) {
      console.error('Failed to generate QR code', e);
      return { path: '', viewBoxSize: 25 };
    }
  }, [value, border]);

  // Method to download high-res PNG (300dpi / 1000px)
  const downloadPng = (fileName = 'feedback-qr-code.png') => {
    try {
      const qr = Qrcodegen.QrCode.encodeText(value, 'M');
      const canvas = document.createElement('canvas');
      const exportSize = 1000;
      canvas.width = exportSize;
      canvas.height = exportSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, exportSize, exportSize);

      // Draw QR modules
      const totalModules = qr.size + border * 2;
      const scale = exportSize / totalModules;

      ctx.fillStyle = fgColor;
      for (let y = 0; y < qr.size; y++) {
        for (let x = 0; x < qr.size; x++) {
          if (qr.getModule(x, y)) {
            ctx.fillRect((x + border) * scale, (y + border) * scale, scale + 0.5, scale + 0.5);
          }
        }
      }

      const a = document.createElement('a');
      a.download = fileName;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch (err) {
      console.error('Download QR PNG failed', err);
    }
  };

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        padding: 12,
        borderRadius: 16,
        boxShadow: '0 8px 30px rgba(12, 29, 54, 0.08)',
        border: '1px solid rgba(12, 29, 54, 0.1)',
        ...style
      }}
    >
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        width={size}
        height={size}
        style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        shapeRendering="crispEdges"
      >
        <rect width={viewBoxSize} height={viewBoxSize} fill={bgColor} />
        <path d={path} fill={fgColor} />
      </svg>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

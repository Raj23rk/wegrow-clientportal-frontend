import React, { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink, Download, Printer, X, Sparkles, Smartphone } from 'lucide-react';
import { QRCodeView } from '../common/QRCodeView';
import { Qrcodegen } from '../../utils/qrcodegen';

interface FeedbackQrModalProps {
  onClose: () => void;
}

export const FeedbackQrModal: React.FC<FeedbackQrModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  // Production official domain or current host
  const isProd = window.location.hostname.includes('wegrowbschool.in');
  const targetUrl = isProd
    ? `${window.location.origin}/feedback-form`
    : `https://tag.wegrowbschool.in/feedback-form`;

  const liveUrl = `${window.location.origin}/feedback-form`;

  const [activeUrl, setActiveUrl] = useState<string>(targetUrl);

  const handleCopy = () => {
    navigator.clipboard?.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    try {
      const qr = Qrcodegen.QrCode.encodeText(activeUrl, 'M');
      const canvas = document.createElement('canvas');
      const exportSize = 1200;
      canvas.width = exportSize;
      canvas.height = exportSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Pure white canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportSize, exportSize);

      const border = 4;
      const totalModules = qr.size + border * 2;
      const scale = exportSize / totalModules;

      // Dark blue modules
      ctx.fillStyle = '#0C1D36';
      for (let y = 0; y < qr.size; y++) {
        for (let x = 0; x < qr.size; x++) {
          if (qr.getModule(x, y)) {
            ctx.fillRect((x + border) * scale, (y + border) * scale, scale + 0.4, scale + 0.4);
          }
        }
      }

      const a = document.createElement('a');
      a.download = 'WeGrow-LEAD-360-Feedback-QR.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch (err) {
      console.error('Download QR failed', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(12, 29, 54, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 22,
          maxWidth: 480,
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(12, 29, 54, 0.3)',
          border: '1px solid rgba(12, 29, 54, 0.1)',
          animation: 'fadeInUp 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(12px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @media print {
            body * { visibility: hidden; }
            .printable-qr-card, .printable-qr-card * { visibility: visible; }
            .printable-qr-card {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              border: none !important;
              box-shadow: none !important;
            }
            .no-print { display: none !important; }
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0C1D36 0%, #1A2F50 100%)',
            color: '#FFFFFF',
            padding: '20px 24px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #E86014 0%, #FF8A3D 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(232, 96, 20, 0.4)'
              }}
            >
              <QrCode size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: '0.6px',
                    textTransform: 'uppercase',
                    color: '#FBD38D'
                  }}
                >
                  LEAD 360° PROGRAMME
                </span>
                <Sparkles size={11} color="#FBD38D" />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>
                Participant Feedback Form
              </h3>
            </div>
          </div>

          <button
            type="button"
            className="no-print"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Printable QR Card */}
        <div className="printable-qr-card" style={{ padding: '24px 24px 20px', textAlign: 'center' }}>
          {/* Instructions */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFF1E8',
              color: '#C05621',
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 16
            }}
          >
            <Smartphone size={14} /> Scan with phone camera to open form
          </div>

          {/* QR Code Container */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 16px' }}>
            <QRCodeView
              value={activeUrl}
              size={230}
              fgColor="#0C1D36"
              bgColor="#FFFFFF"
              border={3}
            />
          </div>

          {/* URL Box */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              marginBottom: 12
            }}
          >
            <div style={{ textAlign: 'left', overflow: 'hidden' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Direct Web URL
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#0C1D36',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {activeUrl}
              </div>
            </div>

            <button
              type="button"
              className="no-print"
              onClick={handleCopy}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: copied ? '#16A34A' : '#0C1D36',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          {/* Domain Selector Pill */}
          <div
            className="no-print"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 11.5,
              color: '#64748B',
              marginBottom: 18
            }}
          >
            <span>Target:</span>
            <button
              type="button"
              onClick={() => setActiveUrl(targetUrl)}
              style={{
                background: activeUrl === targetUrl ? '#E86014' : 'transparent',
                color: activeUrl === targetUrl ? '#FFFFFF' : '#475569',
                border: '1px solid ' + (activeUrl === targetUrl ? '#E86014' : '#CBD5E1'),
                borderRadius: 6,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Production (tag.wegrowbschool.in)
            </button>
            <button
              type="button"
              onClick={() => setActiveUrl(liveUrl)}
              style={{
                background: activeUrl === liveUrl ? '#0C1D36' : 'transparent',
                color: activeUrl === liveUrl ? '#FFFFFF' : '#475569',
                border: '1px solid ' + (activeUrl === liveUrl ? '#0C1D36' : '#CBD5E1'),
                borderRadius: 6,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Current Host ({window.location.host})
            </button>
          </div>

          {/* Actions */}
          <div
            className="no-print"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 8
            }}
          >
            <a
              href={activeUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: '#E86014',
                color: '#FFFFFF',
                borderRadius: 10,
                padding: '10px 12px',
                fontSize: 12.5,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(232, 96, 20, 0.25)'
              }}
            >
              <ExternalLink size={14} /> Open Form
            </a>

            <button
              type="button"
              onClick={handleDownload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: '#0C1D36',
                color: '#FFFFFF',
                borderRadius: 10,
                border: 'none',
                padding: '10px 12px',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Download size={14} /> Download QR
            </button>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: '#F1F5F9',
                color: '#0F172A',
                borderRadius: 10,
                border: '1px solid #CBD5E1',
                padding: '10px 12px',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Printer size={14} /> Print Flyer
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div
          className="no-print"
          style={{
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            padding: '10px 24px',
            fontSize: 11.5,
            color: '#64748B',
            textAlign: 'center'
          }}
        >
          🔒 Interactive evaluation coordinated by <b>WeGrow B School</b>.
        </div>
      </div>
    </div>
  );
};

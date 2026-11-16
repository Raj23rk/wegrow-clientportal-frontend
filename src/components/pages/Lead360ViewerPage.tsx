import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, RefreshCw, BookOpen, ChevronRight, ShieldCheck, Share2 } from 'lucide-react';

export const Lead360ViewerPage: React.FC = () => {
  const [viewerMode, setViewerMode] = useState<'google' | 'native'>('google');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const pdfUrl = '/lead-360-workbook.pdf';
  const fullPublicPdfUrl = 'https://tag.wegrowbschool.in/lead-360-workbook.pdf';
  const googleViewerUrl = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(fullPublicPdfUrl)}`;

  // Auto-detect: Android Chrome handles Google Docs embed best without forcing download
  useEffect(() => {
    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);
    if (isAndroid) {
      setViewerMode('google');
    }
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LEAD 360 – Leadership Implementation Workbook',
          text: 'Anaamalais Toyota 30-Day Leadership Implementation Workbook',
          url: window.location.href,
        });
        return;
      } catch (err) {
        // user cancelled or share failed, fallback to copy
      }
    }
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#0C1D36',
      color: '#FFFFFF',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Top Navigation Bar */}
      <header style={{
        height: '62px',
        backgroundColor: '#071224',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        flexShrink: 0
      }}>
        {/* Left Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #E86014 0%, #FF8A3D 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(232, 96, 20, 0.35)',
            flexShrink: 0
          }}>
            <BookOpen size={20} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.2px', color: '#FFFFFF' }}>
                LEAD 360 Workbook
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                backgroundColor: '#E86014',
                color: '#FFFFFF',
                padding: '2px 6px',
                borderRadius: '4px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Anaamalais Toyota
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.65)' }}>
              30-Day Leadership Implementation • 45 Pages
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Mode toggle button */}
          <button
            onClick={() => {
              setLoading(true);
              setViewerMode(m => m === 'google' ? 'native' : 'google');
            }}
            title="Switch reader engine"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.85)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline" style={{ display: 'inline' }}>
              {viewerMode === 'google' ? 'Reader view' : 'Native view'}
            </span>
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            title="Share or Copy Link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.85)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Share2 size={13} />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Download button */}
          <a
            href={pdfUrl}
            download="Anaamalais_Toyota_LEAD_360_Workbook.pdf"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: '#E86014',
              borderRadius: '8px',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(232, 96, 20, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            <Download size={14} />
            <span>Download</span>
          </a>
        </div>
      </header>

      {/* Main PDF Viewer Container */}
      <main style={{
        flex: 1,
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 62px)',
        backgroundColor: '#1E293B',
        overflow: 'hidden'
      }}>
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0C1D36',
            zIndex: 10,
            gap: '12px'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '3px solid rgba(232, 96, 20, 0.25)',
              borderTopColor: '#E86014',
              animation: 'spin 0.8s linear infinite'
            }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
              Opening LEAD 360 Workbook…
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
              Anaamalais Toyota Leadership Development Program
            </div>
          </div>
        )}

        {viewerMode === 'google' ? (
          <iframe
            src={googleViewerUrl}
            title="LEAD 360 Leadership Implementation Workbook"
            onLoad={() => setLoading(false)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
            allowFullScreen
          />
        ) : (
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            title="LEAD 360 Leadership Implementation Workbook"
            onLoad={() => setLoading(false)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
          />
        )}
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

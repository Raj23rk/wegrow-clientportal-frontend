import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  scrollToHero?: () => void;
  scrollToAbout?: () => void;
  scrollToOverview?: () => void;
  scrollToGoals?: () => void;
  scrollToCarousel?: () => void;
  scrollToVenue?: () => void;
  scrollToRegister?: () => void;
  scrollToWhoCanJoin?: () => void;
  scrollToEvents?: () => void;
  scrollToCourses?: () => void;
  scrollToMissionVision?: () => void;
  scrollToGallery?: () => void;
  scrollToSeminars?: () => void;
  scrollToVisits?: () => void;
  scrollToRewards?: () => void;
  scrollToResources?: (tab?: string) => void;
  scrollToMentors?: () => void;
  scrollToEnterprices?: () => void;
  scrollToStories?: () => void;
  scrollToContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  scrollToHero = () => {},
  scrollToAbout,
  scrollToOverview = () => {},
  scrollToGoals = () => {},
  scrollToCarousel = () => {},
  scrollToVenue = () => {},
  scrollToRegister = () => {},
  scrollToWhoCanJoin = () => {},
  scrollToEvents = () => {},
  scrollToCourses = () => {},
  scrollToMissionVision = () => {},
  scrollToGallery = () => {},
  scrollToSeminars = () => {},
  scrollToVisits = () => {},
  scrollToRewards = () => {},
  scrollToResources = () => {},
  scrollToMentors = () => {},
  scrollToEnterprices = () => {},
  scrollToStories = () => {},
  scrollToContact = () => {}
}) => {
  const navigate = useNavigate();
  const [activeBranch, setActiveBranch] = useState<'sivakasi' | 'srivilliputtur'>('sivakasi');

  // BRANCH DATA
  const branchData = {
    sivakasi: {
      address: 'WeGrow B-School, 193/1A, Ground Floor, Ayyapan Kovil Opp. Police Station Road, Sivakasi – 626 123',
      oldAddress: '100A/5, 1st Floor, Thiruthangal Road, Opposite Bell Hotel, Sivakasi – 626123',
      phone: '+91 93443 37331',
      email: 'wegrowskillcampus@gmail.com',
      hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3935.5323!2d77.7984786!3d9.456045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cefba12a6f25%3A0x74020b3129888e1a!2sBell%20Hotels!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
    },
    srivilliputtur: {
      address: '129, North Car Street, Opposite Bombay Textiles, Upstairs Pathras Kids & Gift Shop, Srivilliputtur – 626125',
      oldAddress: '',
      phone: '+91 93633 37331',
      email: 'wegrowskillcampus@gmail.com',
      hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.3214!2d77.6318684!3d9.5104499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMzAnMzcuNiJOIDc3wrAzNzU0LjcuIkU!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
    }
  };

  const currentBranch = branchData[activeBranch];

  // Event Landing Page Navigation Links (matches Navbar)
  const programmeNavLinks = [
    { name: 'Overview', action: () => scrollToHero?.() },
    { name: 'About WeGrow', action: () => (scrollToAbout ? scrollToAbout() : scrollToOverview ? scrollToOverview() : scrollToWhoCanJoin?.()) },
    { name: 'Campus Moments', action: () => (scrollToCarousel ? scrollToCarousel() : scrollToGallery ? scrollToGallery() : scrollToEvents?.()) },
    { name: 'Venue & Timing', action: () => (scrollToVenue ? scrollToVenue() : scrollToVisits ? scrollToVisits() : scrollToContact?.()) },
    { name: 'Nominate Participant', action: () => (scrollToRegister ? scrollToRegister() : scrollToResources?.()), highlight: true }
  ];

  // Quick Access & Event Actions
  const quickAccessLinks = [
    { name: 'Reserve Seat Now →', action: () => (scrollToRegister ? scrollToRegister() : scrollToResources?.()), highlight: true },
    { name: 'About WeGrow Consultancy', action: () => (scrollToAbout ? scrollToAbout() : scrollToOverview?.()) },
    {
      name: 'Add to Calendar',
      action: () => {
        const title = encodeURIComponent('Leadership in Action - TAG Group Programme');
        const details = encodeURIComponent(
          'Practical Leadership Development Programme for TAG Group middle-management team.\nVenue: TAG Knowledge Centre, Amathur\nDate: 18 November 2026\nDaily Timing: 9:30 AM – 5:30 PM\nContact: +91 93443 37331'
        );
        const location = encodeURIComponent('TAG Knowledge Centre, Amathur');
        window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261118T040000Z/20261118T120000Z&details=${details}&location=${location}`, '_blank');
      }
    },
    {
      name: 'WhatsApp Coordinator',
      action: () => window.open('https://wa.me/919344337331?text=Hello%20WeGrow%20Team!%20I%20have%20an%20inquiry%20regarding%20the%20Leadership%20in%20Action%20Programme.', '_blank')
    },
    {
      name: 'Call: +91 93443 37331',
      action: () => { window.location.href = 'tel:+919344337331'; }
    },
    {
      name: 'Client Portal Login',
      action: () => navigate('/login')
    }
  ];

  return (
    <footer className="wg-main-footer">
      <style>{`
        .wg-main-footer {
          position: relative;
          color: #FFFFFF;
          border-top: 4px solid #f3a812;
          background-color: #104288;
          box-shadow: 0 -10px 40px rgba(16, 66, 136, 0.3);
          overflow: hidden;
          padding: 56px 0 28px;
          font-family: 'Manrope', system-ui, -apple-system, sans-serif;
        }

        .wg-footer-bg-accent {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(30, 58, 138, 0.3), transparent, rgba(15, 23, 42, 0.6));
          pointer-events: none;
        }

        .wg-footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 10;
        }

        .wg-footer-grid {
          display: grid;
          grid-template-columns: 3.5fr 2fr 2fr 3.2fr 2.5fr;
          gap: 32px;
          padding-bottom: 44px;
          border-bottom: 1px solid rgba(30, 64, 175, 0.6);
        }

        .wg-footer-brand-box {
          text-align: left;
        }

        .wg-footer-logo-wrap {
          background: rgba(255, 255, 255, 0.95);
          padding: 6px 14px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          border: 1px solid rgba(255, 255, 255, 0.5);
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          margin-bottom: 16px;
        }

        .wg-footer-logo-wrap img {
          width: 150px;
          height: 42px;
          object-fit: contain;
          display: block;
        }

        .wg-footer-desc {
          font-size: 12.5px;
          font-weight: 600;
          line-height: 1.65;
          color: rgba(219, 234, 254, 0.9);
          margin: 0 0 20px;
          max-width: 340px;
        }

        .wg-footer-sec-title {
          font-size: 11.5px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #f3a812;
          margin: 0 0 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .wg-social-icons {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wg-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
          color: #104288;
          transition: all 0.25s ease;
          text-decoration: none;
          box-shadow: 0 3px 8px rgba(0,0,0,0.15);
        }

        .wg-social-btn:hover {
          transform: translateY(-2px);
          background: #f3a812;
          color: #FFFFFF;
        }

        .wg-social-btn.wa:hover {
          background: #25D366;
        }

        .wg-social-btn.li:hover {
          background: #0A66C2;
        }

        .wg-footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .wg-footer-link-btn {
          background: transparent;
          border: none;
          padding: 3px 0;
          font-size: 13px;
          font-weight: 600;
          color: #DBEAFE;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          line-height: 1.4;
        }

        .wg-footer-link-btn:hover {
          color: #f3a812;
          transform: translateX(4px);
        }

        .wg-footer-link-btn span.arr {
          color: #f3a812;
          font-size: 11px;
          transition: transform 0.2s ease;
        }

        .wg-footer-link-btn:hover span.arr {
          transform: translateX(2px);
        }

        .wg-footer-link-highlight {
          color: #FBD38D !important;
          font-weight: 800 !important;
        }

        .wg-footer-link-highlight:hover {
          color: #FFFFFF !important;
        }

        /* Branch Toggle Buttons */
        .wg-branch-toggle {
          padding: 3px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(29, 78, 216, 0.6);
          margin-bottom: 14px;
        }

        .wg-branch-tab-btn {
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 900;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .wg-branch-tab-btn.active {
          background: #f3a812;
          color: #104288;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .wg-branch-tab-btn.inactive {
          background: transparent;
          color: #FFFFFF;
        }

        .wg-branch-tab-btn.inactive:hover {
          color: #f3a812;
        }

        .wg-branch-info-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 12px;
          font-weight: 600;
          color: #DBEAFE;
        }

        .wg-branch-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.5;
        }

        .wg-branch-row-label {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #f3a812;
          margin-bottom: 2px;
        }

        .wg-map-box {
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid rgba(29, 78, 216, 0.6);
          height: 150px;
          width: 100%;
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
          background: #0F172A;
        }

        .wg-footer-copy {
          padding-top: 28px;
          text-align: center;
          font-size: 12.5px;
          font-weight: 700;
          color: #BFDBFE;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1100px) {
          .wg-footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 36px;
          }
        }

        @media (max-width: 640px) {
          .wg-footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .wg-main-footer {
            padding: 40px 0 24px;
          }
        }
      `}</style>

      {/* BACKGROUND ACCENT PATTERN */}
      <div className="wg-footer-bg-accent"></div>

      <div className="wg-footer-container">
        {/* MAIN FOOTER GRID */}
        <div className="wg-footer-grid">

          {/* BRAND & ABOUT */}
          <div className="wg-footer-brand-box">
            <div className="wg-footer-logo-wrap" onClick={scrollToHero}>
              <img
                src="/images/logo.webp"
                alt="WeGrow B School"
              />
            </div>

            <p className="wg-footer-desc">
              WeGrow B School provides industry-focused Business and IT training in Business Management, Entrepreneurship, Digital Marketing, Data Analytics, Software Development, and placement-oriented skill programs in Sivakasi & Srivilliputhur.
            </p>

            <div>
              <p className="wg-footer-sec-title">Connect With Us</p>
              <div className="wg-social-icons">
                {/* FACEBOOK */}
                <a
                  href="https://www.facebook.com/share/18xhrEHChh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="wg-social-btn"
                >
                  <svg style={{ width: 16, height: 16, fill: 'currentColor' }} viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* INSTAGRAM */}
                <a
                  href="https://www.instagram.com/wegrowskillcampus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="wg-social-btn"
                >
                  <svg style={{ width: 16, height: 16, fill: 'currentColor' }} viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* WHATSAPP */}
                <a
                  href="https://wa.me/919363337331"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="wg-social-btn wa"
                >
                  <svg style={{ width: 16, height: 16, fill: 'currentColor' }} viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>

                {/* LINKEDIN */}
                <a
                  href="https://www.linkedin.com/company/wegrow-skill-campus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="wg-social-btn li"
                >
                  <svg style={{ width: 16, height: 16, fill: 'currentColor' }} viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* PROGRAMME NAVIGATION (EVENT LANDING NAVBAR LINKS) */}
          <div>
            <p className="wg-footer-sec-title">
              <span style={{ color: '#f3a812' }}>◈</span> Programme Navigation
            </p>
            <ul className="wg-footer-links-list">
              {programmeNavLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => link.action()}
                    className={`wg-footer-link-btn ${link.highlight ? 'wg-footer-link-highlight' : ''}`}
                  >
                    <span className="arr">→</span>
                    <span>{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK ACCESS & EVENT SUPPORT */}
          <div>
            <p className="wg-footer-sec-title">
              <span style={{ color: '#f3a812' }}>◈</span> Quick Access
            </p>
            <ul className="wg-footer-links-list">
              {quickAccessLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => link.action()}
                    className={`wg-footer-link-btn ${link.highlight ? 'wg-footer-link-highlight' : ''}`}
                  >
                    <span className="arr">→</span>
                    <span>{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT DETAILS WITH BRANCH TOGGLE */}
          <div>
            <p className="wg-footer-sec-title">
              <span style={{ color: '#f3a812' }}>◈</span> Contact Us
            </p>

            {/* TAB TOGGLE BUTTONS */}
            <div className="wg-branch-toggle">
              <button
                onClick={() => setActiveBranch('sivakasi')}
                className={`wg-branch-tab-btn ${activeBranch === 'sivakasi' ? 'active' : 'inactive'}`}
              >
                Sivakasi
              </button>
              <button
                onClick={() => setActiveBranch('srivilliputtur')}
                className={`wg-branch-tab-btn ${activeBranch === 'srivilliputtur' ? 'active' : 'inactive'}`}
              >
                Srivilliputhur
              </button>
            </div>

            {/* ADDRESS DETAILS */}
            <div className="wg-branch-info-stack">
              <div className="wg-branch-row">
                <span style={{ fontSize: 14 }}>📍</span>
                <div>
                  <p className="wg-branch-row-label">Address</p>
                  <span>{currentBranch.address}</span>
                </div>
              </div>

              {activeBranch === 'sivakasi' && currentBranch.oldAddress && (
                <div className="wg-branch-row">
                  <span style={{ fontSize: 14 }}>🏢</span>
                  <div>
                    <p className="wg-branch-row-label" style={{ color: '#93C5FD' }}>Old Campus</p>
                    <span style={{ color: '#BFDBFE' }}>{currentBranch.oldAddress}</span>
                  </div>
                </div>
              )}

              <div className="wg-branch-row" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>📞</span>
                <span>{currentBranch.phone}</span>
              </div>

              <div className="wg-branch-row" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>✉️</span>
                <span style={{ wordBreak: 'break-all' }}>{currentBranch.email}</span>
              </div>

              <div className="wg-branch-row">
                <span style={{ fontSize: 14 }}>⏰</span>
                <span>{currentBranch.hours}</span>
              </div>
            </div>
          </div>

          {/* FIND US / MAP */}
          <div>
            <p className="wg-footer-sec-title">
              <span style={{ color: '#f3a812' }}>◈</span> Find Us
            </p>

            <div className="wg-map-box">
              <iframe
                key={activeBranch}
                title="Branch Google Map"
                src={currentBranch.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="wg-footer-copy">
          <p>
            © {new Date().getFullYear()} WeGrow B School | Business & IT Skill Training & Placement Campus. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
export default Footer;


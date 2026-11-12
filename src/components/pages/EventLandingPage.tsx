import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  Building2,
  TrendingUp,
  Users,
  Target,
  ExternalLink,
  MessageCircle,
  LogIn,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield,
  MessageSquare,
  Compass,
  FileText,
  Menu,
  X,
  Award,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../layout/Footer';
import { api } from '../../services/api';

interface RegistrationData {
  id: string;
  fullName: string;
  phone: string;
  companyName: string;
  designation: string;
  department?: string;
  experience?: string;
  registeredAt: string;
  passCode?: string;
}

const CAROUSEL_SLIDES = [
  {
    src: '/images/gallery-growth-plan.jpg',
    tag: 'EXECUTIVE MASTERCLASS',
    title: 'The WeGrow Growth Plan Workshop',
    desc: 'Intensive strategic execution, operational systems, and management frameworks in the smart boardroom.'
  },
  // {
  //   src: '/images/gallery-mentors.jpg',
  //   tag: 'STRATEGY LEADERS',
  //   title: 'Interactive Strategy & Growth Masterclass',
  //   desc: 'Hands-on mentorship guiding middle managers and business leaders into structured leadership.'
  // },
  {
    src: '/images/gallery-session.jpg',
    tag: 'WORKPLACE SCENARIOS',
    title: 'Business. Her Rules. Her Growth.',
    desc: 'Actionable discussion on team accountability, delegation SOPs, and cross-vertical collaboration.'
  },
  {
    src: '/images/gallery-group.jpg',
    tag: 'EXECUTIVE COHORT',
    title: 'Women Entrepreneur Leadership Cohort',
    desc: 'Empowering future leaders with practical people-leadership tools and performance habits.'
  },
  {
    src: '/images/gallery-founders.jpg',
    tag: 'CAMPUS MILESTONES',
    title: 'WeGrow B School Bussiness Meetup',
    desc: 'Committed to practical, owner-independent business growth: People • Process • Technology.'
  }
];

export const EventLandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Countdown Timer to 18 November 2026, 09:30 AM IST
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-11-18T09:30:00+05:30').getTime();

    const calculateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Registration form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    companyName: 'TAG Group',
    designation: '',
    department: 'Operations',
    experience: '3 – 5 Years'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<RegistrationData | null>(null);

  // Automatic Carousel slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel smoothly every 4 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter nominee name';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter WhatsApp / Mobile number';
    } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Please enter group / company vertical';
    }
    if (!formData.designation.trim()) {
      newErrors.designation = 'Please enter current designation';
    }
    if (!formData.experience) {
      newErrors.experience = 'Please select total work experience';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await api.attendance.register({
        fullName: formData.fullName,
        phone: formData.phone,
        companyName: formData.companyName,
        designation: formData.designation,
        department: formData.department,
        experience: formData.experience
      });

      if (response && response.attendee) {
        const att = response.attendee;
        const record: RegistrationData = {
          id: att.id || att._id || 'reg_' + Date.now(),
          fullName: att.fullName,
          phone: att.phone,
          companyName: att.companyName,
          designation: att.designation,
          department: att.department,
          experience: att.experience || formData.experience,
          registeredAt: att.registeredAt,
          passCode: att.passCode || 'WG-LDP-001'
        };

        // Cache locally as well
        try {
          const existingStr = localStorage.getItem('wg_event_registrations');
          const list: RegistrationData[] = existingStr ? JSON.parse(existingStr) : [];
          list.push(record);
          localStorage.setItem('wg_event_registrations', JSON.stringify(list));
        } catch {}

        setIsSubmitting(false);
        setSubmittedData(record);
        scrollTo('register');
        return;
      }
    } catch (apiErr) {
      console.warn('API call failed, falling back to local generation', apiErr);
    }

    // Fallback: Generate WG-LDP-xxx locally if backend is temporarily unreachable
    let fallbackCode = 'WG-LDP-001';
    try {
      const existingStr = localStorage.getItem('wg_event_registrations');
      const list: RegistrationData[] = existingStr ? JSON.parse(existingStr) : [];
      const nextNum = list.length + 1;
      fallbackCode = `WG-LDP-${String(nextNum).padStart(3, '0')}`;
      const record: RegistrationData = {
        id: 'reg_' + Date.now(),
        ...formData,
        passCode: fallbackCode,
        registeredAt: new Date().toISOString()
      };
      list.push(record);
      localStorage.setItem('wg_event_registrations', JSON.stringify(list));
      setSubmittedData(record);
    } catch (err) {
      console.warn('Could not save to localStorage', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      scrollTo('register');
    }, 450);
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      companyName: 'TAG Group',
      designation: '',
      department: 'Operations',
      experience: '3 – 5 Years'
    });
    setSubmittedData(null);
  };

  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent('Leadership in Action - TAG Group Programme');
    const details = encodeURIComponent(
      'Practical Leadership Development Programme for TAG Group middle-management team.\nVenue: TAG Knowledge Centre, Amathur\nDate: 18 November 2026\nTiming: 9:30 AM – 5:30 PM\nContact: +91 93443 37331'
    );
    const location = encodeURIComponent('TAG Knowledge Centre, Amathur');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261118T040000Z/20261118T120000Z&details=${details}&location=${location}`;
  };

  const getWhatsAppMessageUrl = () => {
    const code = submittedData?.passCode ? `\nPasscode: ${submittedData.passCode}` : '';
    const exp = submittedData?.experience ? `\nExperience: ${submittedData.experience}` : (formData.experience ? `\nExperience: ${formData.experience}` : '');
    const message = encodeURIComponent(
      `Hello WeGrow Team! I have registered for the Leadership in Action Programme (TAG Group) scheduled for 18 November 2026 at TAG Knowledge Centre, Amathur.\nName: ${submittedData?.fullName || formData.fullName}\nGroup: ${submittedData?.companyName || formData.companyName}\nDesignation: ${submittedData?.designation || formData.designation}${exp}${code}`
    );
    return `https://wa.me/919344337331?text=${message}`;
  };

  return (
    <div className="lp-root">
      {/* Self-contained Executive Styling */}
      <style>{`
        :root {
          --lp-primary: #0C1D36;
          --lp-primary-light: #182C4E;
          --lp-accent: #E86014;
          --lp-accent-hover: #D0520E;
          --lp-accent-soft: #FFF1E8;
          --lp-bg: #FAF8F5;
          --lp-surface: #FFFFFF;
          --lp-surface-muted: #F3EFE8;
          --lp-text-head: #0C1D36;
          --lp-text-body: #4A5568;
          --lp-text-muted: #718096;
          --lp-border: #E8E2D7;
          --lp-border-light: #F0EBE2;
          --lp-shadow-sm: 0 2px 8px rgba(12, 29, 54, 0.04);
          --lp-shadow-md: 0 10px 25px -5px rgba(12, 29, 54, 0.08);
          --lp-shadow-lg: 0 22px 50px -12px rgba(12, 29, 54, 0.14);
        }

        .lp-root {
          min-height: 100vh;
          background-color: var(--lp-bg);
          color: var(--lp-text-head);
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .lp-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Top Bar */
        .lp-top-bar {
          background: #0C1D36;
          color: #E2E8F0;
          font-size: 12.5px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .lp-top-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .lp-top-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #FBD38D;
          font-weight: 700;
          letter-spacing: 0.03em;
        }

        /* Header Navbar */
        .lp-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(250, 248, 245, 0.96);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--lp-border);
          transition: all 0.2s ease;
        }

        .lp-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 76px;
          gap: 24px;
        }

        .lp-brand-area {
          display: flex;
          align-items: center;
          cursor: pointer;
          flex-shrink: 0;
          margin-right: 12px;
        }

        .lp-brand-logo {
          height: 40px;
          width: auto;
          object-fit: contain;
          display: block;
        }

        .lp-desktop-nav-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
        }

        .lp-desktop-nav {
          display: flex;
          align-items: center;
          gap: 28px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .lp-desktop-nav a {
          font-size: 14px;
          font-weight: 600;
          color: var(--lp-text-body);
          text-decoration: none;
          transition: color 0.15s ease;
          position: relative;
          padding: 6px 0;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }

        .lp-desktop-nav a:hover {
          color: var(--lp-accent);
        }

        .lp-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .lp-phone-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 700;
          color: var(--lp-text-head);
          background: var(--lp-surface-muted);
          padding: 8px 14px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.15s ease;
          border: 1px solid var(--lp-border);
          white-space: nowrap;
        }

        .lp-phone-pill:hover {
          background: #EAE4D9;
        }

        .lp-btn-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          background: var(--lp-accent);
          color: #FFFFFF !important;
          font-weight: 700;
          font-size: 13.5px;
          padding: 9px 20px;
          border-radius: 9999px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(232, 96, 20, 0.28);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .lp-btn-cta:hover {
          background: var(--lp-accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(232, 96, 20, 0.38);
        }

        .lp-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: transparent;
          color: var(--lp-text-head) !important;
          font-weight: 700;
          font-size: 14px;
          padding: 9px 22px;
          border-radius: 9999px;
          text-decoration: none;
          border: 1.5px solid var(--lp-text-head);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lp-btn-secondary:hover {
          background: var(--lp-text-head);
          color: #FFFFFF !important;
        }

        .lp-btn-login {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #FFFFFF;
          color: var(--lp-primary);
          font-weight: 700;
          font-size: 13.5px;
          padding: 8px 16px;
          border-radius: 9999px;
          border: 1.5px solid var(--lp-border);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          text-decoration: none;
          box-shadow: 0 1px 3px rgba(12, 29, 54, 0.04);
        }

        .lp-btn-login:hover {
          background: var(--lp-primary);
          color: #FFFFFF !important;
          border-color: var(--lp-primary);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(12, 29, 54, 0.12);
        }

        .lp-btn-login:active {
          transform: translateY(0);
        }

        .lp-mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--lp-text-head);
          cursor: pointer;
          padding: 6px;
        }

        /* Mobile Drawer */
        .lp-mobile-drawer {
          position: fixed;
          top: 78px;
          left: 0;
          right: 0;
          bottom: 0;
          background: #FAF8F5;
          z-index: 99;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .lp-mobile-drawer a {
          font-size: 17px;
          font-weight: 700;
          color: var(--lp-text-head);
          text-decoration: none;
          padding: 12px 0;
          border-bottom: 1px solid var(--lp-border-light);
        }

        /* ================= HERO SECTION ================= */
        .lp-hero-section {
          padding: 48px 0 64px;
          position: relative;
        }

        .lp-hero-grid {
          display: grid;
          grid-template-columns: 1.28fr 0.72fr;
          gap: 40px;
          align-items: center;
        }

        .lp-hero-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .lp-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--lp-primary);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 9999px;
          margin-bottom: 22px;
          box-shadow: var(--lp-shadow-sm);
        }

        .lp-pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--lp-accent);
          box-shadow: 0 0 10px var(--lp-accent);
        }

        .lp-hero-title {
          font-size: clamp(40px, 4.6vw, 64px);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--lp-primary);
          margin: 0 0 16px;
        }

        .lp-text-accent {
          color: var(--lp-accent);
        }

        .lp-hero-subtitle {
          font-size: 17.5px;
          line-height: 1.6;
          color: var(--lp-text-body);
          margin: 0 0 28px;
          max-width: 560px;
        }

        /* Hero 4 Stats Grid */
        .lp-hero-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          width: 100%;
          max-width: 580px;
          margin-bottom: 32px;
        }

        .lp-stat-card {
          background: var(--lp-surface);
          border: 1px solid var(--lp-border);
          border-radius: 16px;
          padding: 14px 16px;
          box-shadow: var(--lp-shadow-sm);
          transition: transform 0.2s ease;
        }

        .lp-stat-card:hover {
          transform: translateY(-2px);
          border-color: var(--lp-accent);
        }

        .lp-stat-val {
          font-size: 20px;
          font-weight: 800;
          color: var(--lp-primary);
          line-height: 1.2;
          margin-bottom: 2px;
        }

        .lp-stat-lbl {
          font-size: 12px;
          color: var(--lp-text-muted);
          font-weight: 600;
          line-height: 1.3;
        }

        .lp-hero-actions-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }

        .lp-hero-schedule-bar {
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding: 10px 18px;
          background: #FFFFFF;
          border: 1px solid var(--lp-border);
          border-radius: 18px;
          box-shadow: 0 10px 28px -6px rgba(12, 29, 54, 0.07), 0 2px 6px rgba(12, 29, 54, 0.03);
          max-width: 100%;
          margin-top: 8px;
          box-sizing: border-box;
          flex-wrap: nowrap;
        }

        .lp-sched-block {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 16px;
        }

        .lp-sched-block:first-child {
          padding-left: 0;
        }

        .lp-sched-block:last-child {
          padding-right: 0;
        }

        .lp-sched-block:not(:last-child) {
          border-right: 1px solid var(--lp-border);
        }

        .lp-sched-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--lp-accent-soft);
          color: var(--lp-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .lp-hero-schedule-bar:hover .lp-sched-icon-box {
          transform: scale(1.05);
        }

        .lp-sched-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }

        .lp-sched-label {
          font-size: 10px;
          font-weight: 800;
          color: var(--lp-text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .lp-sched-value {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--lp-primary);
          white-space: nowrap;
        }

        .lp-sched-sep {
          display: none;
        }

        /* Mascot Card */
        .lp-hero-right {
          display: flex;
          justify-content: center;
          position: relative;
        }

        .lp-mascot-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          background: var(--lp-surface);
          border-radius: 28px;
          padding: 24px 20px 0;
          box-shadow: var(--lp-shadow-lg);
          border: 1px solid rgba(232, 226, 215, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .lp-mascot-card:hover {
          transform: translateY(-4px);
        }

        .lp-mascot-bubble {
          position: absolute;
          top: 24px;
          left: 28px;
          background: #FFFFFF;
          border: 1.5px solid var(--lp-primary);
          color: var(--lp-primary);
          font-size: 13px;
          font-weight: 800;
          padding: 7px 16px;
          border-radius: 9999px;
          box-shadow: var(--lp-shadow-sm);
          z-index: 2;
        }

        .lp-mascot-tag {
          position: absolute;
          top: 24px;
          right: 28px;
          background: var(--lp-accent-soft);
          color: var(--lp-accent);
          font-size: 11.5px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 9999px;
          border: 1px solid rgba(232, 96, 20, 0.25);
          z-index: 2;
        }

        .lp-mascot-img {
          width: 100%;
          max-width: 380px;
          height: auto;
          display: block;
          object-fit: contain;
          filter: drop-shadow(0 14px 22px rgba(12, 29, 54, 0.12));
        }

        /* ================= PROGRAMME OVERVIEW (Image 3) ================= */
        .lp-section {
          padding: 88px 0;
        }

        .lp-section-header {
          text-align: center;
          max-width: 780px;
          margin: 0 auto 52px;
        }

        .lp-section-title {
          font-size: clamp(30px, 3.6vw, 42px);
          font-weight: 800;
          letter-spacing: -0.025em;
          color: var(--lp-primary);
          margin: 14px 0 16px;
          line-height: 1.2;
        }

        .lp-section-subtitle {
          font-size: 16.5px;
          line-height: 1.6;
          color: var(--lp-text-body);
          margin: 0;
        }

        /* ================= HERO LIVE COUNTDOWN TIMER ================= */
        .lp-countdown-card {
          display: inline-flex;
          flex-direction: column;
          background: linear-gradient(135deg, #0C1D36 0%, #152B4D 100%);
          color: #FFFFFF;
          padding: 14px 22px;
          border-radius: 18px;
          box-shadow: 0 10px 24px -4px rgba(12, 29, 54, 0.22);
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          max-width: 440px;
        }

        .lp-countdown-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #FBD38D;
          margin-bottom: 10px;
        }

        .lp-countdown-target {
          margin-left: auto;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          font-size: 11px;
          letter-spacing: normal;
          text-transform: none;
        }

        .lp-countdown-timer {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .lp-countdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 44px;
        }

        .lp-countdown-num {
          font-size: 26px;
          font-weight: 900;
          color: #FFFFFF;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .lp-countdown-lbl {
          font-size: 9.5px;
          font-weight: 700;
          color: #94A3B8;
          letter-spacing: 0.08em;
          margin-top: 5px;
        }

        .lp-countdown-sep {
          font-size: 20px;
          font-weight: 800;
          color: #E86014;
          margin-top: -10px;
          opacity: 0.9;
        }

        /* ================= ABOUT WEGROW B-SCHOOL SECTION ================= */
        .lp-about-intro-card {
          background: #FFFFFF;
          border: 1px solid var(--lp-border);
          border-radius: 24px;
          padding: 38px 42px;
          margin-bottom: 32px;
          box-shadow: var(--lp-shadow-sm);
          display: grid;
          grid-template-columns: 1.35fr 0.85fr;
          gap: 36px;
          align-items: center;
        }

        .lp-about-intro-left h3 {
          font-size: 24px;
          font-weight: 800;
          color: var(--lp-primary);
          line-height: 1.35;
          margin: 0 0 16px;
        }

        .lp-about-intro-left p {
          font-size: 15.5px;
          line-height: 1.7;
          color: var(--lp-text-body);
          margin: 0 0 14px;
        }

        .lp-about-metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .lp-metric-tile {
          background: #FAF7F2;
          border: 1px solid #EAE4D8;
          border-radius: 16px;
          padding: 20px 18px;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .lp-metric-tile:hover {
          transform: translateY(-2px);
          border-color: var(--lp-accent);
        }

        .lp-metric-num {
          font-size: 28px;
          font-weight: 900;
          color: var(--lp-accent);
          line-height: 1;
          margin-bottom: 6px;
        }

        .lp-metric-label {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--lp-primary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Vision & Mission 2-Column Grid */
        .lp-vm-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 36px;
        }

        .lp-vm-card {
          background: #FFFFFF;
          border: 1px solid var(--lp-border);
          border-radius: 22px;
          padding: 34px 32px;
          box-shadow: var(--lp-shadow-sm);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .lp-vm-card:hover {
          transform: translateY(-4px);
          border-color: var(--lp-accent);
          box-shadow: var(--lp-shadow-md);
        }

        .lp-vm-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #E86014, #FBD38D);
        }

        .lp-vm-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .lp-vm-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--lp-accent-soft);
          color: var(--lp-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lp-vm-title-wrap h3 {
          font-size: 20px;
          font-weight: 800;
          color: var(--lp-primary);
          margin: 0;
        }

        .lp-vm-title-wrap span {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--lp-accent);
        }

        .lp-vm-statement {
          font-size: 15px;
          line-height: 1.7;
          color: var(--lp-text-body);
          margin: 0 0 20px;
        }

        .lp-vm-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .lp-vm-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: var(--lp-primary);
          font-weight: 600;
          line-height: 1.45;
        }

        .lp-vm-bullet {
          color: var(--lp-accent);
          font-weight: 900;
          font-size: 15px;
          line-height: 1;
          margin-top: 2px;
        }

        /* Business Transformation Practice */
        .lp-consultancy-block {
          background: #FFFFFF;
          border: 1px solid var(--lp-border);
          border-radius: 24px;
          padding: 40px;
          box-shadow: var(--lp-shadow-sm);
          margin-bottom: 32px;
        }

        .lp-consultancy-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 36px;
        }

        .lp-consultancy-header h3 {
          font-size: 24px;
          font-weight: 800;
          color: var(--lp-primary);
          margin: 8px 0;
        }

        .lp-consultancy-header p {
          font-size: 15px;
          color: var(--lp-text-muted);
          line-height: 1.6;
          margin: 0;
        }

        .lp-pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .lp-pillar-card {
          background: #FAF7F2;
          border: 1px solid #EAE4D8;
          border-radius: 20px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
        }

        .lp-pillar-card:hover {
          transform: translateY(-4px);
          border-color: var(--lp-accent);
          box-shadow: var(--lp-shadow-md);
          background: #FFFFFF;
        }

        .lp-pillar-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--lp-primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .lp-pillar-tag {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--lp-accent);
          margin-bottom: 6px;
        }

        .lp-pillar-card h4 {
          font-size: 18px;
          font-weight: 800;
          color: var(--lp-primary);
          margin: 0 0 10px;
        }

        .lp-pillar-card p {
          font-size: 14px;
          line-height: 1.65;
          color: var(--lp-text-body);
          margin: 0 0 18px;
        }

        .lp-pillar-deliverables {
          list-style: none;
          padding: 0;
          margin: auto 0 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px dashed #E2D9CC;
          padding-top: 16px;
        }

        .lp-pillar-deliverables li {
          font-size: 13px;
          color: var(--lp-primary);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .lp-pillar-check {
          color: #16A34A;
          font-weight: 800;
        }

        /* Campuses Strip */
        .lp-campuses-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
        }

        .lp-campus-card {
          background: #FFFFFF;
          border: 1px solid var(--lp-border);
          border-radius: 18px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: var(--lp-shadow-sm);
        }

        .lp-campus-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: #FFF1E8;
          color: #E86014;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lp-campus-info h4 {
          font-size: 16.5px;
          font-weight: 800;
          color: var(--lp-primary);
          margin: 0 0 4px;
        }

        .lp-campus-info p {
          font-size: 13.5px;
          color: var(--lp-text-muted);
          margin: 0;
          line-height: 1.45;
        }

        /* ================= CAROUSEL SECTION (Clean, Premium, Automatic - No Thumbnail list) ================= */
        .lp-carousel-section {
          padding: 88px 0;
          background: #F4EFE6;
        }

        .lp-carousel-card {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: var(--lp-shadow-lg);
          border: 1px solid rgba(232, 226, 215, 0.9);
          background: #0C1D36;
        }

        .lp-carousel-img {
          width: 100%;
          height: 520px;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }

        .lp-carousel-card:hover .lp-carousel-img {
          transform: scale(1.02);
        }

        .lp-carousel-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 50px 40px 32px;
          background: linear-gradient(to top, rgba(12, 29, 54, 0.96) 0%, rgba(12, 29, 54, 0.6) 65%, transparent 100%);
          color: #FFFFFF;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
        }

        .lp-carousel-tag {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--lp-accent);
          text-transform: uppercase;
          margin-bottom: 6px;
          display: block;
        }

        .lp-carousel-title {
          font-size: clamp(22px, 2.8vw, 32px);
          font-weight: 800;
          margin: 0 0 6px;
          color: #FFFFFF;
        }

        .lp-carousel-desc {
          font-size: 15.5px;
          color: #CBD5E0;
          margin: 0;
          max-width: 660px;
          line-height: 1.5;
        }

        .lp-carousel-nav-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .lp-carousel-arrow {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lp-carousel-arrow:hover {
          background: var(--lp-accent);
          border-color: var(--lp-accent);
        }

        /* Dots indicator (Clean modern replacement for cluttered thumbnail row) */
        .lp-carousel-dots-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 22px;
        }

        .lp-dot-pill {
          height: 8px;
          width: 12px;
          border-radius: 9999px;
          background: #D8D2C5;
          cursor: pointer;
          transition: all 0.25s ease;
          border: none;
          padding: 0;
        }

        .lp-dot-pill.active {
          width: 32px;
          background: var(--lp-accent);
        }

        /* ================= VENUE SECTION ================= */
        .lp-venue-section {
          padding: 88px 0;
        }

        .lp-venue-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }

        .lp-venue-card {
          background: var(--lp-surface);
          border: 1px solid var(--lp-border);
          border-radius: 22px;
          padding: 32px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: var(--lp-shadow-sm);
          transition: all 0.25s ease;
        }

        .lp-venue-card:hover {
          transform: translateY(-4px);
          border-color: var(--lp-accent);
          box-shadow: var(--lp-shadow-md);
        }

        .lp-venue-icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--lp-accent-soft);
          color: var(--lp-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .lp-venue-lbl {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--lp-text-muted);
          margin-bottom: 8px;
        }

        .lp-venue-val {
          font-size: 16px;
          font-weight: 800;
          color: var(--lp-primary);
          line-height: 1.4;
          margin: 0 0 8px;
        }

        .lp-venue-sub {
          font-size: 13.5px;
          color: var(--lp-text-body);
          line-height: 1.45;
          margin-bottom: 14px;
        }

        .lp-venue-link {
          margin-top: auto;
          font-size: 13.5px;
          font-weight: 700;
          color: var(--lp-accent);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .lp-venue-link:hover {
          text-decoration: underline;
        }

        /* ================= REGISTRATION FORM SECTION ================= */
        .lp-reg-section {
          padding: 96px 0;
          background: linear-gradient(135deg, #0C1D36 0%, #162B4E 100%);
          position: relative;
          color: #FFFFFF;
        }

        .lp-reg-heading {
          text-align: center;
          color: #FFFFFF;
          margin-bottom: 44px;
        }

        .lp-reg-heading h2 {
          font-size: clamp(32px, 4vw, 44px);
          font-weight: 800;
          margin: 0 0 12px;
          letter-spacing: -0.025em;
        }

        .lp-reg-heading p {
          font-size: 16.5px;
          color: #CBD5E0;
          max-width: 600px;
          margin: 0 auto;
        }

        .lp-form-card {
          max-width: 640px;
          margin: 0 auto;
          background: var(--lp-surface);
          border-radius: 28px;
          padding: 44px 40px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
          color: var(--lp-primary);
        }

        .lp-form-title {
          font-size: 23px;
          font-weight: 800;
          color: var(--lp-primary);
          margin: 0 0 8px;
          border-bottom: 2px solid var(--lp-border-light);
          padding-bottom: 16px;
        }

        .lp-form-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 22px;
        }

        .lp-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .lp-form-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--lp-primary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .lp-form-label span.req {
          color: var(--lp-accent);
        }

        .lp-form-input,
        .lp-form-select {
          width: 100%;
          height: 50px;
          padding: 10px 16px;
          border: 1.5px solid #D6D0C5;
          border-radius: 12px;
          font-size: 15px;
          color: var(--lp-primary);
          background: #FFFFFF;
          transition: all 0.2s ease;
          font-family: inherit;
          box-sizing: border-box;
        }

        .lp-form-input:focus,
        .lp-form-select:focus {
          outline: none;
          border-color: var(--lp-accent);
          box-shadow: 0 0 0 3px rgba(232, 96, 20, 0.16);
        }

        .lp-form-submit-btn {
          width: 100%;
          height: 54px;
          background: var(--lp-accent);
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
          transition: all 0.2s ease;
          box-shadow: 0 6px 18px rgba(232, 96, 20, 0.3);
        }

        .lp-form-submit-btn:hover:not(:disabled) {
          background: var(--lp-accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(232, 96, 20, 0.4);
        }

        .lp-form-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Success box */
        .lp-success-box {
          text-align: center;
          padding: 24px 8px;
        }

        .lp-success-icon {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #DCFCE7;
          color: #16A34A;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .lp-success-box h3 {
          font-size: 24px;
          font-weight: 800;
          color: var(--lp-primary);
          margin: 0 0 10px;
        }

        .lp-success-box p {
          font-size: 15.5px;
          color: var(--lp-text-body);
          margin: 0 0 24px;
          line-height: 1.6;
        }

        .lp-success-summary {
          background: var(--lp-bg);
          border: 1px solid var(--lp-border);
          border-radius: 18px;
          padding: 22px;
          text-align: left;
          margin-bottom: 24px;
        }

        .lp-summary-row {
          display: flex;
          justify-content: space-between;
          padding: 7px 0;
          font-size: 14.5px;
          border-bottom: 1px dashed var(--lp-border-light);
        }

        .lp-summary-row:last-child {
          border-bottom: none;
        }

        .lp-summary-row .label {
          color: var(--lp-text-muted);
        }

        .lp-summary-row .val {
          font-weight: 700;
          color: var(--lp-primary);
        }

        /* Footer */
        .lp-footer {
          background: var(--lp-primary);
          color: #FFFFFF;
          padding: 68px 0 36px;
        }

        .lp-footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        .lp-footer-brand img {
          height: 42px;
          filter: brightness(0) invert(1);
          margin-bottom: 18px;
        }

        .lp-footer-brand p {
          color: #A0AEC0;
          font-size: 14.5px;
          line-height: 1.6;
          max-width: 360px;
        }

        .lp-footer-col h4 {
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 18px;
        }

        .lp-footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .lp-footer-col a {
          color: #CBD5E0;
          font-size: 14px;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .lp-footer-col a:hover {
          color: var(--lp-accent);
        }

        .lp-footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #A0AEC0;
          flex-wrap: wrap;
          gap: 12px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
          .lp-header-inner {
            gap: 16px;
          }
          .lp-desktop-nav {
            gap: 18px;
          }
          .lp-desktop-nav a {
            font-size: 13.5px;
          }
          .lp-header-actions {
            gap: 10px;
          }
          .lp-phone-pill {
            padding: 7px 12px;
            font-size: 12.5px;
          }
          .lp-btn-cta {
            padding: 8px 16px;
            font-size: 13px;
          }
        }

        @media (max-width: 1024px) {
          .lp-desktop-nav-wrap,
          .lp-desktop-nav {
            display: none;
          }
          .lp-mobile-menu-btn {
            display: block;
          }
          .lp-hero-grid {
            grid-template-columns: 1fr;
            gap: 44px;
          }
          .lp-hero-right {
            order: -1;
          }
          .lp-mascot-card {
            max-width: 340px;
          }
          .lp-overview-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .lp-goals-grid {
            grid-template-columns: 1fr;
          }
          .lp-venue-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .lp-footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        @media (max-width: 768px) {
          .lp-hero-schedule-bar {
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
            padding: 16px 18px !important;
            width: 100% !important;
            border-radius: 16px !important;
          }
          .lp-sched-block {
            padding: 0 0 12px 0 !important;
            border-right: none !important;
            border-bottom: 1px dashed var(--lp-border);
          }
          .lp-sched-block:last-child {
            padding-bottom: 0 !important;
            border-bottom: none !important;
          }
          .lp-sched-value {
            white-space: normal;
          }
        }

        @media (max-width: 640px) {
          .lp-container {
            padding: 0 16px;
          }
          .lp-top-bar {
            padding: 6px 0;
            font-size: 11px;
          }
          .lp-top-bar-inner {
            flex-direction: column;
            gap: 3px;
            text-align: center;
          }
          .lp-top-tag {
            justify-content: center;
          }
          .lp-header-inner {
            height: 62px;
          }
          .lp-brand-logo {
            height: 32px;
            max-width: 120px;
          }
          .lp-header-actions {
            gap: 8px;
          }
          .lp-header .lp-btn-cta {
            font-size: 12px;
            padding: 7px 12px;
            white-space: nowrap;
            gap: 4px;
            border-radius: 9999px;
            box-shadow: none;
          }
          .lp-btn-login {
            font-size: 11.5px;
            padding: 6px 11px;
            gap: 4px;
          }
          .lp-phone-pill {
            width: 34px;
            height: 34px;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }
          .lp-phone-pill span {
            display: none;
          }
          .lp-mobile-menu-btn {
            width: 36px;
            height: 36px;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
          }
          .lp-mobile-drawer {
            top: 62px;
          }
          .lp-hero-section {
            padding: 24px 0 44px;
          }
          .lp-hero-grid {
            gap: 28px;
          }
          .lp-mascot-card {
            max-width: 260px;
            padding: 16px 14px 0;
            border-radius: 22px;
            margin: 0 auto;
          }
          .lp-mascot-img {
            max-height: 240px;
          }
          .lp-hero-title {
            font-size: 34px;
            line-height: 1.15;
          }
          .lp-hero-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .lp-overview-cards-grid {
            grid-template-columns: 1fr;
          }
          .lp-venue-grid {
            grid-template-columns: 1fr;
          }
          .lp-about-intro-card {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 28px 20px;
          }
          .lp-vm-grid {
            grid-template-columns: 1fr;
          }
          .lp-pillars-grid {
            grid-template-columns: 1fr;
          }
          .lp-campuses-grid {
            grid-template-columns: 1fr;
          }
          .lp-consultancy-block {
            padding: 24px 20px;
          }
          .lp-form-card {
            padding: 28px 20px;
          }
          .lp-carousel-img {
            height: 340px;
          }
          .lp-carousel-overlay {
            padding: 30px 20px 20px;
          }
        }

        @media (max-width: 480px) {
          .lp-btn-login span {
            display: none;
          }
          .lp-btn-login {
            width: 34px;
            height: 34px;
            padding: 0;
            border-radius: 50%;
          }
        }

        @media (max-width: 390px) {
          .lp-container {
            padding: 0 12px;
          }
          .lp-header-actions {
            gap: 6px;
          }
          .lp-brand-logo {
            height: 28px;
            max-width: 105px;
          }
          .lp-header .lp-btn-cta {
            font-size: 11px;
            padding: 6px 10px;
          }
          .lp-btn-login {
            width: 30px;
            height: 30px;
          }
          .lp-phone-pill {
            width: 30px;
            height: 30px;
          }
          .lp-mobile-menu-btn {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>

      {/* ================= TOP ANNOUNCEMENT BAR ================= */}
      <div className="lp-top-bar">
        <div className="lp-container">
          <div className="lp-top-bar-inner">
            <div className="lp-top-tag">
              <Sparkles size={14} />
              <span>TAG Group Middle-Management Leadership Initiative</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 700 }}>
              <Calendar size={13} color="#FBD38D" />
              <span>18 November 2026</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <Clock size={13} color="#FBD38D" />
              <span>9:30 AM – 5:30 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= HEADER / NAVBAR ================= */}
      <header className="lp-header">
        <div className="lp-container">
          <div className="lp-header-inner">
            {/* Brand Logo */}
            <div className="lp-brand-area" onClick={() => scrollTo('hero')}>
              <img src="/images/logo.webp" alt="WeGrow B School Logo" className="lp-brand-logo" />
            </div>

            {/* Desktop Navigation */}
            <nav className="lp-desktop-nav-wrap">
              <ul className="lp-desktop-nav">
                <li><a href="#hero" onClick={e => { e.preventDefault(); scrollTo('hero'); }}>Overview</a></li>
                <li><a href="#about" onClick={e => { e.preventDefault(); scrollTo('about'); }}>About WeGrow</a></li>
                <li><a href="#carousel" onClick={e => { e.preventDefault(); scrollTo('carousel'); }}>Campus Moments</a></li>
                <li><a href="#venue" onClick={e => { e.preventDefault(); scrollTo('venue'); }}>Venue & Timing</a></li>
                <li><a href="#register" onClick={e => { e.preventDefault(); scrollTo('register'); }}>Register</a></li>
              </ul>
            </nav>

            {/* Header Right Actions */}
            <div className="lp-header-actions">
              <a href="tel:+919344337331" className="lp-phone-pill" title="Call Coordinator">
                <Phone size={14} color="#E86014" />
                <span>+91 93443 37331</span>
              </a>

              <button className="lp-btn-cta" onClick={() => scrollTo('register')}>
                Register now <ArrowRight size={15} />
              </button>

              <button
                type="button"
                className="lp-btn-login"
                onClick={() => navigate('/login')}
                title="Client & Staff Portal Login"
              >
                <LogIn size={14} />
                <span>Portal</span>
              </button>

              <button
                className="lp-mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lp-mobile-drawer">
          <a href="#hero" onClick={e => { e.preventDefault(); scrollTo('hero'); }}>Overview</a>
          <a href="#about" onClick={e => { e.preventDefault(); scrollTo('about'); }}>About WeGrow B-School</a>
          <a href="#carousel" onClick={e => { e.preventDefault(); scrollTo('carousel'); }}>Campus Moments</a>
          <a href="#venue" onClick={e => { e.preventDefault(); scrollTo('venue'); }}>Venue & Timing</a>
          <a href="#register" onClick={e => { e.preventDefault(); scrollTo('register'); }} style={{ color: '#E86014', fontWeight: 800 }}>
            Register Seat Now →
          </a>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 20 }}>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: '#0C1D36',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 14.5,
                padding: '13px 18px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <LogIn size={16} />
              <span>Client Portal Login →</span>
            </button>
            <a href="tel:+919344337331" style={{ border: 'none', color: '#0C1D36', textAlign: 'center', fontSize: 13.5 }}>
              📞 Call: +91 93443 37331
            </a>
          </div>
        </div>
      )}

      {/* ================= HERO SECTION (From Image 1 & 3: Business Transformation Meetup) ================= */}
      <section id="hero" className="lp-hero-section">
        <div className="lp-container">
          <div className="lp-hero-grid">
            {/* Left Column */}
            <div className="lp-hero-left">
              <div className="lp-pill-badge">
                <span className="lp-pill-dot"></span>
                <span>TAG Group Leadership Initiative</span>
              </div>

              {/* Title: Leadership in Action */}
              <h1 className="lp-hero-title">
                Leadership <span className="lp-text-accent">in Action</span>
              </h1>

              <p className="lp-hero-subtitle">
                A Practical Leadership Development Programme for TAG Group's middle-management team,
                structured around guided learning, workplace scenarios, peer discussions, and team-based activities.
              </p>

              {/* Live Countdown Timer to 18 Nov 2026 9:30 AM */}
              <div className="lp-countdown-card">
                <div className="lp-countdown-header">
                  <Clock size={15} color="#FBD38D" />
                  <span className="lp-countdown-tag">COUNTDOWN TO EVENT</span>
                  <span className="lp-countdown-target">18 Nov 2026 • 9:30 AM</span>
                </div>
                <div className="lp-countdown-timer">
                  <div className="lp-countdown-item">
                    <div className="lp-countdown-num">{timeLeft.days}</div>
                    <div className="lp-countdown-lbl">DAYS</div>
                  </div>
                  <div className="lp-countdown-sep">:</div>
                  <div className="lp-countdown-item">
                    <div className="lp-countdown-num">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="lp-countdown-lbl">HOURS</div>
                  </div>
                  <div className="lp-countdown-sep">:</div>
                  <div className="lp-countdown-item">
                    <div className="lp-countdown-num">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="lp-countdown-lbl">MINS</div>
                  </div>
                  <div className="lp-countdown-sep">:</div>
                  <div className="lp-countdown-item">
                    <div className="lp-countdown-num">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="lp-countdown-lbl">SECS</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lp-hero-actions-row">
                <button className="lp-btn-cta" onClick={() => scrollTo('register')}>
                  Register now <ArrowRight size={16} />
                </button>
                <button className="lp-btn-secondary" onClick={() => scrollTo('about')}>
                  About WeGrow & Event
                </button>
              </div>

              {/* Executive Event Schedule Card */}
              <div className="lp-hero-schedule-bar">
                {/* Date */}
                <div className="lp-sched-block">
                  <div className="lp-sched-icon-box">
                    <Calendar size={16} />
                  </div>
                  <div className="lp-sched-text">
                    <span className="lp-sched-label">DATE</span>
                    <span className="lp-sched-value">18 November 2026</span>
                  </div>
                </div>

                {/* Timing */}
                <div className="lp-sched-block">
                  <div className="lp-sched-icon-box">
                    <Clock size={16} />
                  </div>
                  <div className="lp-sched-text">
                    <span className="lp-sched-label">DAILY TIMING</span>
                    <span className="lp-sched-value">9:30 AM – 5:30 PM</span>
                  </div>
                </div>

                {/* Venue */}
                <div className="lp-sched-block">
                  <div className="lp-sched-icon-box">
                    <MapPin size={16} />
                  </div>
                  <div className="lp-sched-text">
                    <span className="lp-sched-label">EVENT VENUE</span>
                    <span className="lp-sched-value">TAG Knowledge Centre, Amathur</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Mascot Card matching Image 1 */}
            <div className="lp-hero-right">
              <div className="lp-mascot-card">
                <img
                  src="/images/mascot.webp"
                  alt="WeGrow B School Mascot"
                  className="lp-mascot-img"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT WEGROW B-SCHOOL SECTION (Replacing Overview & Goals per user instruction) ================= */}
      <section id="about" className="lp-section" style={{ background: '#F5F1EA' }}>
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-pill-badge" style={{ background: '#EAE5DB', color: '#0C1D36' }}>
              <Sparkles size={14} />
              <span>About WeGrow B-School</span>
            </div>
            <h2 className="lp-section-title">Empowering Regional Businesses & Future Leaders</h2>
            <p className="lp-section-subtitle">
              Pioneering practical executive capability, structured management education, and owner-independent business consulting.
            </p>
          </div>

          {/* Executive Intro & Key Institutional Metrics */}
          <div className="lp-about-intro-card">
            <div className="lp-about-intro-left">
              <h3>Bridging Practical Leadership Wisdom & Industrial Enterprise Growth</h3>
              <p>
                <strong>WeGrow B-School</strong> is Tamil Nadu's dedicated practical management institution and corporate
                growth consultancy firm headquartered in Sivakasi with our premier academic campus in Srivilliputhur.
                We work closely with business promoters, second-generation entrepreneurs, and corporate leadership
                teams across Southern Tamil Nadu's thriving industrial clusters including Sivakasi, Srivilliputhur,
                Virudhunagar, Rajapalayam, and Madurai.
              </p>
              <p>
                Unlike purely academic institutions, our programmes and advisory engagements are anchored in
                real-world workplace scenarios, actionable management frameworks, operational SOPs, and structured
                leadership habits designed to produce immediate, measurable business impact.
              </p>
            </div>

            <div className="lp-about-metrics-grid">
              <div className="lp-metric-tile">
                <div className="lp-metric-num">500+</div>
                <div className="lp-metric-label">Leaders Coached</div>
              </div>
              <div className="lp-metric-tile">
                <div className="lp-metric-num">40+</div>
                <div className="lp-metric-label">Corporate Workshops</div>
              </div>
              <div className="lp-metric-tile">
                <div className="lp-metric-num">2</div>
                <div className="lp-metric-label">Active Campuses</div>
              </div>
              <div className="lp-metric-tile">
                <div className="lp-metric-num">100%</div>
                <div className="lp-metric-label">Workplace Scenarios</div>
              </div>
            </div>
          </div>

          {/* Vision & Mission Cards */}
          <div className="lp-vm-grid">
            {/* Vision */}
            <div className="lp-vm-card">
              <div className="lp-vm-header">
                <div className="lp-vm-icon-box">
                  <Compass size={24} />
                </div>
                <div className="lp-vm-title-wrap">
                  <span>OUR ASPIRATION</span>
                  <h3>Our Vision</h3>
                </div>
              </div>
              <p className="lp-vm-statement">
                "To be the foremost regional business leadership academy and transformation partner in South India —
                enabling emerging businesses, manufacturing leaders, and family enterprises to scale into
                owner-independent, enduring corporations."
              </p>
              <ul className="lp-vm-list">
                <li>
                  <span className="lp-vm-bullet">✦</span>
                  <span>Championing regional industrial competitiveness across printing, manufacturing, fireworks, and FMCG sectors.</span>
                </li>
                <li>
                  <span className="lp-vm-bullet">✦</span>
                  <span>Fostering smooth second-generation leadership transition and modern corporate governance.</span>
                </li>
                <li>
                  <span className="lp-vm-bullet">✦</span>
                  <span>Institutionalizing scalable, owner-independent management systems.</span>
                </li>
              </ul>
            </div>

            {/* Mission */}
            <div className="lp-vm-card">
              <div className="lp-vm-header">
                <div className="lp-vm-icon-box">
                  <Target size={24} />
                </div>
                <div className="lp-vm-title-wrap">
                  <span>OUR PURPOSE</span>
                  <h3>Our Mission</h3>
                </div>
              </div>
              <p className="lp-vm-statement">
                "To deliver actionable, scenario-driven management education, executive coaching, and operational
                consulting that instills disciplined systems, cross-functional collaboration, and a high-performance
                culture across every tier of management."
              </p>
              <ul className="lp-vm-list">
                <li>
                  <span className="lp-vm-bullet">✦</span>
                  <span>Bridging functional execution with modern people leadership and delegation frameworks.</span>
                </li>
                <li>
                  <span className="lp-vm-bullet">✦</span>
                  <span>Establishing measurable accountability, structured SOPs, and KPI-driven performance reviews.</span>
                </li>
                <li>
                  <span className="lp-vm-bullet">✦</span>
                  <span>Cultivating strategic decision-making, ethical leadership, and continuous learning habits.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Business Transformation & Consultancy Practice */}
          <div className="lp-consultancy-block">
            <div className="lp-consultancy-header">
              <div className="lp-pill-badge" style={{ background: '#FFF1E8', color: '#E86014' }}>
                <Briefcase size={13} />
                <span>Consultancy Practice</span>
              </div>
              <h3>Business Transformation Practice</h3>
              <p>
                Our hands-on consultancy engagements partner with business promoters and executive teams to build
                resilient systems across three fundamental pillars: People, Process, and Technology.
              </p>
            </div>

            <div className="lp-pillars-grid">
              {/* Pillar 1: People */}
              <div className="lp-pillar-card">
                <div className="lp-pillar-icon-box">
                  <Users size={24} />
                </div>
                <div className="lp-pillar-tag">PILLAR 01 • PEOPLE</div>
                <h4>People & Leadership Transformation</h4>
                <p>
                  Transitioning functional supervisors into inspiring people leaders. We establish delegation frameworks,
                  role clarity, feedback loops, and accountability scorecards.
                </p>
                <ul className="lp-pillar-deliverables">
                  <li><span className="lp-pillar-check">✓</span> Middle-management leadership pipelines</li>
                  <li><span className="lp-pillar-check">✓</span> Structured delegation & accountability SOPs</li>
                  <li><span className="lp-pillar-check">✓</span> KPI-based performance review mechanisms</li>
                </ul>
              </div>

              {/* Pillar 2: Process */}
              <div className="lp-pillar-card">
                <div className="lp-pillar-icon-box">
                  <TrendingUp size={24} />
                </div>
                <div className="lp-pillar-tag">PILLAR 02 • PROCESS</div>
                <h4>Process & Operational Excellence</h4>
                <p>
                  Streamlining operations to eliminate dependency on individual memory. We engineer departmental
                  Standard Operating Procedures (SOPs) and lean manufacturing practices.
                </p>
                <ul className="lp-pillar-deliverables">
                  <li><span className="lp-pillar-check">✓</span> Departmental Standard Operating Procedures</li>
                  <li><span className="lp-pillar-check">✓</span> Supply chain & production cycle optimization</li>
                  <li><span className="lp-pillar-check">✓</span> Quality assurance & waste reduction systems</li>
                </ul>
              </div>

              {/* Pillar 3: Technology */}
              <div className="lp-pillar-card">
                <div className="lp-pillar-icon-box">
                  <Building2 size={24} />
                </div>
                <div className="lp-pillar-tag">PILLAR 03 • TECHNOLOGY</div>
                <h4>Technology & Digital Visibility</h4>
                <p>
                  Equipping business owners and leaders with real-time operational visibility through custom management
                  dashboards, automated attendance portals, and workflow systems.
                </p>
                <ul className="lp-pillar-deliverables">
                  <li><span className="lp-pillar-check">✓</span> Custom management & attendance portals</li>
                  <li><span className="lp-pillar-check">✓</span> Real-time executive dashboards & MIS</li>
                  <li><span className="lp-pillar-check">✓</span> Digital tool adoption & shop-floor visibility</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dual Campus Network */}
          <div className="lp-campuses-grid">
            <div className="lp-campus-card">
              <div className="lp-campus-icon">
                <Building2 size={24} />
              </div>
              <div className="lp-campus-info">
                <h4>Sivakasi Campus — Corporate Advisory Centre</h4>
                <p>
                  193/1A, Ground Floor, Ayyapan Kovil Opp. Police Station Road, Sivakasi – 626 123.
                  Executive training boardroom & consulting hub.
                </p>
              </div>
            </div>

            <div className="lp-campus-card">
              <div className="lp-campus-icon">
                <Building2 size={24} />
              </div>
              <div className="lp-campus-info">
                <h4>Srivilliputhur Campus — Academic & Leadership Hub</h4>
                <p>
                  129, North Car Street, Upstairs Pathras Kids & Gift Shop, Srivilliputtur – 626 125.
                  Comprehensive management library, seminar halls & classroom suites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CAROUSEL SECTION (Premium Full-Width Automatic - Thumbnail list removed) ================= */}
      <section id="carousel" className="lp-carousel-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-pill-badge" style={{ background: '#FFF1E8', color: '#E86014' }}>
              <span>Campus & Live Workshops</span>
            </div>
            <h2 className="lp-section-title">A Glimpse of Our Journey in Action</h2>
            <p className="lp-section-subtitle">
              Interactive workshops, boardroom masterclasses, and executive cohorts delivered by WeGrow B School.
            </p>
          </div>

          {/* Premium Automatic Carousel Card */}
          <div
            className="lp-carousel-card"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <img
              key={CAROUSEL_SLIDES[currentSlide].src}
              src={CAROUSEL_SLIDES[currentSlide].src}
              alt={CAROUSEL_SLIDES[currentSlide].title}
              className="lp-carousel-img"
            />
            <div className="lp-carousel-overlay">
              <div>
                <span className="lp-carousel-tag">
                  {CAROUSEL_SLIDES[currentSlide].tag} • WEGROW B SCHOOL
                </span>
                <h3 className="lp-carousel-title">{CAROUSEL_SLIDES[currentSlide].title}</h3>
                <p className="lp-carousel-desc">{CAROUSEL_SLIDES[currentSlide].desc}</p>
              </div>

              <div className="lp-carousel-nav-group">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="lp-carousel-arrow"
                  title="Previous Slide"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="lp-carousel-arrow"
                  title="Next Slide"
                  aria-label="Next slide"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>
          </div>

          {/* Minimal Elegant Slide Dots Indicator (No Cluttered Thumbnails List) */}
          <div className="lp-carousel-dots-bar">
            {CAROUSEL_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`lp-dot-pill ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= VENUE & TIMING SECTION ================= */}
      <section id="venue" className="lp-venue-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-pill-badge" style={{ background: '#FFF1E8', color: '#E86014' }}>
              <span>Event Details</span>
            </div>
            <h2 className="lp-section-title">Event Venue & Timing</h2>
            <p className="lp-section-subtitle">
              Mark your calendar and arrive 15 minutes early for check-in & networking.
            </p>
          </div>

          <div className="lp-venue-grid">
            {/* Card 1: Date */}
            <div className="lp-venue-card">
              <div className="lp-venue-icon-circle">
                <Calendar size={22} />
              </div>
              <span className="lp-venue-lbl">DATE</span>
              <div className="lp-venue-val">18 November 2026</div>
              <div className="lp-venue-sub">Wednesday • 1-Day Intensive Programme</div>
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noreferrer"
                className="lp-venue-link"
              >
                Add to Calendar <ExternalLink size={13} />
              </a>
            </div>

            {/* Card 2: Timing */}
            <div className="lp-venue-card">
              <div className="lp-venue-icon-circle">
                <Clock size={22} />
              </div>
              <span className="lp-venue-lbl">TIMING</span>
              <div className="lp-venue-val">9:30 AM to 5:30 PM</div>
              <div className="lp-venue-sub">Full Day Hands-on Sessions</div>
              <span className="lp-venue-link" style={{ cursor: 'default', color: '#718096' }}>
                Reporting at 9:15 AM
              </span>
            </div>

            {/* Card 3: Venue */}
            <div className="lp-venue-card">
              <div className="lp-venue-icon-circle">
                <MapPin size={22} />
              </div>
              <span className="lp-venue-lbl">EVENT VENUE</span>
              <div className="lp-venue-val">TAG Knowledge Centre</div>
              <div className="lp-venue-sub" style={{ fontSize: 13 }}>
                Amathur; spacious executive facility reserved for interactive leadership drills
              </div>
              <a
                href="https://maps.google.com/?q=TAG+Knowledge+Centre+Amathur"
                target="_blank"
                rel="noreferrer"
                className="lp-venue-link"
              >
                Get Directions <ExternalLink size={13} />
              </a>
            </div>

            {/* Card 4: Entry & Help */}
            <div className="lp-venue-card">
              <div className="lp-venue-icon-circle">
                <Phone size={22} />
              </div>
              <span className="lp-venue-lbl">ENTRY & HELP</span>
              <div className="lp-venue-val">+91 93443 37331</div>
              <div className="lp-venue-sub">Call or WhatsApp coordinator</div>
              <a
                href={getWhatsAppMessageUrl()}
                target="_blank"
                rel="noreferrer"
                className="lp-venue-link"
              >
                Chat on WhatsApp <MessageCircle size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REGISTRATION FORM SECTION ================= */}
      <section id="register" className="lp-reg-section">
        <div className="lp-container">
          <div className="lp-reg-heading">
            <h2>Reserve Your Programme Seat</h2>
            <p>
              Interactive middle-management leadership development programme structured around workplace scenarios.
            </p>
          </div>

          <div className="lp-form-card">
            {submittedData ? (
              <div className="lp-success-box">
                <div className="lp-success-icon">
                  <CheckCircle2 size={38} />
                </div>
                <h3>Seat Reserved Successfully!</h3>
                <p>
                  Thank you, <strong>{submittedData.fullName}</strong>. Your nomination for{' '}
                  <strong>Leadership in Action</strong> has been recorded.
                </p>

                <div className="lp-success-summary">
                  {/* Generated Employee Passcode */}
                  <div
                    className="lp-summary-row"
                    style={{
                      background: '#FFF1E8',
                      margin: '2px -6px 12px',
                      padding: '12px 14px',
                      borderRadius: 12,
                      border: '1.5px solid rgba(232, 96, 20, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        YOUR GATE ENTRY PASSCODE
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                        Show this passcode at reception gate
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        color: '#EA580C',
                        letterSpacing: '0.06em',
                        background: '#FFFFFF',
                        padding: '4px 12px',
                        borderRadius: 8,
                        boxShadow: '0 2px 6px rgba(234, 88, 12, 0.15)'
                      }}
                    >
                      {submittedData.passCode || 'WG-LDP-001'}
                    </span>
                  </div>

                  <div className="lp-summary-row">
                    <span className="label">Nominee Name</span>
                    <span className="val">{submittedData.fullName}</span>
                  </div>
                  <div className="lp-summary-row">
                    <span className="label">Group / Vertical</span>
                    <span className="val">{submittedData.companyName}</span>
                  </div>
                  <div className="lp-summary-row">
                    <span className="label">Designation</span>
                    <span className="val">{submittedData.designation}</span>
                  </div>
                  <div className="lp-summary-row">
                    <span className="label">Department</span>
                    <span className="val">{submittedData.department}</span>
                  </div>
                  <div className="lp-summary-row">
                    <span className="label">Experience</span>
                    <span className="val">{submittedData.experience || formData.experience || '3 – 5 Years'}</span>
                  </div>
                  <div className="lp-summary-row">
                    <span className="label">Programme</span>
                    <span className="val">Leadership in Action (1 Day)</span>
                  </div>
                  <div className="lp-summary-row">
                    <span className="label">Date & Timing</span>
                    <span className="val">18 November 2026 • 9:30 AM – 5:30 PM</span>
                  </div>
                  <div className="lp-summary-row">
                    <span className="label">Venue</span>
                    <span className="val">TAG Knowledge Centre, Amathur</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <a
                    href={getWhatsAppMessageUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="lp-form-submit-btn"
                    style={{ background: '#25D366', textDecoration: 'none' }}
                  >
                    <MessageCircle size={18} />
                    Confirm on WhatsApp (+91 93443 37331)
                  </a>

                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="lp-btn-secondary"
                    style={{ width: '100%', borderColor: '#CBD5E1', padding: '12px 0' }}
                  >
                    <Calendar size={16} /> Add to Google Calendar
                  </a>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#718096',
                      fontSize: 13.5,
                      cursor: 'pointer',
                      marginTop: 8
                    }}
                  >
                    Register another participant
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="lp-form-title">Nomination & Registration Form</div>

                <div className="lp-form-grid">
                  {/* Field: Full Name */}
                  <div className="lp-form-group">
                    <label className="lp-form-label">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. R. Soundararajan"
                      className="lp-form-input"
                    />
                    {errors.fullName && (
                      <span style={{ color: '#DC2626', fontSize: 12.5, fontWeight: 600 }}>{errors.fullName}</span>
                    )}
                  </div>

                  {/* Field: WhatsApp / Mobile Number */}
                  <div className="lp-form-group">
                    <label className="lp-form-label">
                      WhatsApp / Mobile Number <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      className="lp-form-input"
                    />
                    {errors.phone && (
                      <span style={{ color: '#DC2626', fontSize: 12.5, fontWeight: 600 }}>{errors.phone}</span>
                    )}
                  </div>

                  {/* Field: Company / Group Name */}
                  <div className="lp-form-group">
                    <label className="lp-form-label">
                      Company / Business Vertical <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. TAG Group / The Anamalais Group"
                      className="lp-form-input"
                    />
                    {errors.companyName && (
                      <span style={{ color: '#DC2626', fontSize: 12.5, fontWeight: 600 }}>{errors.companyName}</span>
                    )}
                  </div>

                  {/* Field: Designation */}
                  <div className="lp-form-group">
                    <label className="lp-form-label">
                      Designation <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="e.g. Middle Manager / Team Lead / Operations Head"
                      className="lp-form-input"
                    />
                    {errors.designation && (
                      <span style={{ color: '#DC2626', fontSize: 12.5, fontWeight: 600 }}>{errors.designation}</span>
                    )}
                  </div>

                  {/* Field: Department */}
                  <div className="lp-form-group">
                    <label className="lp-form-label">Department / Vertical</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="lp-form-select"
                    >
                      <option value="Operations">Operations</option>
                      <option value="Manufacturing & Plant">Manufacturing & Plant</option>
                      <option value="Sales & Customer Experience">Sales & Customer Experience</option>
                      <option value="Finance & Accounts">Finance & Accounts</option>
                      <option value="HR & Administration">HR & Administration</option>
                      <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                      <option value="Other">Other Vertical</option>
                    </select>
                  </div>

                  {/* Field: Total Work Experience */}
                  <div className="lp-form-group">
                    <label className="lp-form-label">
                      Total Work Experience <span className="req">*</span>
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="lp-form-select"
                    >
                      <option value="Less than 1 Year">Less than 1 Year</option>
                      <option value="1 – 3 Years">1 – 3 Years</option>
                      <option value="3 – 5 Years">3 – 5 Years</option>
                      <option value="5 – 10 Years">5 – 10 Years</option>
                      <option value="10 – 15 Years">10 – 15 Years</option>
                      <option value="15+ Years">15+ Years</option>
                    </select>
                    {errors.experience && (
                      <span style={{ color: '#DC2626', fontSize: 12.5, fontWeight: 600 }}>{errors.experience}</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button type="submit" disabled={isSubmitting} className="lp-form-submit-btn">
                    {isSubmitting ? (
                      <>Recording nomination…</>
                    ) : (
                      <>
                        Reserve My Seat <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', fontSize: 12, color: '#718096', marginTop: 4 }}>
                    🔒 Interactive Leadership Programme coordinated by WeGrow B School.
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ================= COMPREHENSIVE DUAL-BRANCH FOOTER ================= */}
      <Footer
        scrollToHero={() => scrollTo('hero')}
        scrollToAbout={() => scrollTo('about')}
        scrollToOverview={() => scrollTo('about')}
        scrollToCarousel={() => scrollTo('carousel')}
        scrollToVenue={() => scrollTo('venue')}
        scrollToRegister={() => scrollTo('register')}
      />
    </div>
  );
};
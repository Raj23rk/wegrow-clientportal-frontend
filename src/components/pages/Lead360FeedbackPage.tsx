import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Send,
  Award,
  ChevronLeft,
  Check
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';

const SECTION_A_QUESTIONS = [
  { id: 'q1', num: '01', text: 'The programme objectives were clearly explained.' },
  { id: 'q2', num: '02', text: 'The objectives of the programme were met.' },
  { id: 'q3', num: '03', text: 'The content was relevant to my job role.' },
  { id: 'q4', num: '04', text: 'The topics were well organised and easy to follow.' },
  { id: 'q5', num: '05', text: 'The level of the content was appropriate for me.' }
];

const SECTION_B_QUESTIONS = [
  { id: 'q1', num: '06', text: 'The trainer was knowledgeable about the subject.' },
  { id: 'q2', num: '07', text: 'The trainer explained concepts clearly with examples.' },
  { id: 'q3', num: '08', text: 'The trainer encouraged participation and discussion.' },
  { id: 'q4', num: '09', text: 'The trainer answered questions effectively.' },
  { id: 'q5', num: '10', text: 'The trainer managed time well.' }
];

const SECTION_C_ACTIVITIES = [
  { id: 'selfAwareness', tag: 'QUESTIONNAIRE', title: 'Leadership Self-Awareness Questionnaire' },
  { id: 'leadershipStyle', tag: 'QUESTIONNAIRE', title: 'Leadership Style Questionnaire' },
  { id: 'situationalLeadership', tag: 'CASE STUDY', title: 'Situational Leadership' },
  { id: 'workplaceChallenge', tag: 'CASE STUDY', title: 'Workplace Challenge' }
];

const SECTION_D_QUESTIONS = [
  { id: 'q1', num: '01', text: 'I gained new knowledge and skills from this programme.' },
  { id: 'q2', num: '02', text: 'I can apply what I learned in my day-to-day work.' },
  { id: 'q3', num: '03', text: 'I feel more confident in leading my team.' },
  { id: 'q4', num: '04', text: 'I have a clear idea of what I will do differently at work.' }
];

const SECTION_E_AREAS = [
  { id: 'venueSeating', num: '01', title: 'Venue and seating arrangements' },
  { id: 'audioVisual', num: '02', title: 'Audio-visual and presentation materials' },
  { id: 'foodRefreshments', num: '03', title: 'Food and refreshments' },
  { id: 'scheduleBreaks', num: '04', title: 'Session schedule and breaks' }
];

const AGREE_OPTIONS = [
  'Strongly agree',
  'Agree',
  'Neutral',
  'Disagree',
  'Strongly disagree'
];

const RATING_5_OPTIONS = [
  'Excellent',
  'Very good',
  'Good',
  'Average',
  'Poor'
];

const DURATION_OPTIONS = ['Short', 'Right', 'Long'];
const RECOMMEND_OPTIONS = ['Yes', 'Maybe', 'No'];

const STEPS = [
  { id: 1, title: 'Questions (10)', label: 'Step 1: Programme & Trainer Evaluation (10 Questions)' },
  { id: 2, title: 'Overall', label: 'Step 2: Overall Ratings & Feedback' }
];

export const Lead360FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Wizard Step State (1: Info + Section A, 2: B, 3: C, 4: D, 5: E, F, G)
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; designation?: string }>({});

  // Participant Metadata
  const [participant, setParticipant] = useState({
    name: searchParams.get('name') || '',
    designation: searchParams.get('designation') || '',
    department: searchParams.get('department') || 'Operations',
    date: '2026-11-19',
    trainer: 'WeGrow B School Lead Trainer'
  });

  // Section Responses (empty initially so user actively selects their answers)
  const [sectionA, setSectionA] = useState<Record<string, string>>({});
  const [sectionB, setSectionB] = useState<Record<string, string>>({});
  const [sectionC, setSectionC] = useState<Record<string, string>>({});
  const [sectionD, setSectionD] = useState<Record<string, string>>({});
  const [sectionE, setSectionE] = useState<Record<string, string>>({});

  const [overallRating, setOverallRating] = useState('');
  const [programmeDuration, setProgrammeDuration] = useState('');
  const [recommend, setRecommend] = useState('');

  const [comments, setComments] = useState({
    mostUseful: '',
    leastUseful: '',
    howCanImprove: '',
    futureTopics: '',
    otherComments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const scrollToFormAnchor = () => {
    const el = document.getElementById('fb-form-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const validateStep1 = () => {
    const errors: { name?: string; designation?: string } = {};
    if (!participant.name.trim()) {
      errors.name = 'Participant Name is mandatory';
    }
    if (!participant.designation.trim()) {
      errors.designation = 'Designation is mandatory';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (targetStep: number) => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        scrollToFormAnchor();
        return;
      }
    }
    setFieldErrors({});
    setCurrentStep(targetStep);
    scrollToFormAnchor();
  };

  const handlePrevStep = (targetStep: number) => {
    setCurrentStep(targetStep);
    scrollToFormAnchor();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!participant.name.trim() || !participant.designation.trim()) {
      setFieldErrors({
        name: !participant.name.trim() ? 'Participant Name is mandatory' : undefined,
        designation: !participant.designation.trim() ? 'Designation is mandatory' : undefined
      });
      setCurrentStep(1);
      scrollToFormAnchor();
      return;
    }

    setIsSubmitting(true);

    const ratingMap: Record<string, number> = {
      'Excellent': 5,
      'Very good': 4,
      'Good': 3,
      'Average': 2,
      'Poor': 1
    };
    const numericRating = ratingMap[overallRating] || 5;

    const payload = {
      ...participant,
      programmeTitle: 'Leadership in Action',
      programmeContent: sectionA,
      trainerFacilitator: sectionB,
      activities: sectionC,
      learningApplication: sectionD,
      arrangementsLogistics: sectionE,
      overallRating: overallRating || 'Excellent',
      rating: numericRating,
      programmeDuration: programmeDuration || 'Right',
      recommend: recommend || 'Yes',
      ...comments,
      submittedAt: new Date().toISOString()
    };

    try {
      await api.attendance.submitFeedbackForm(payload);
    } catch (err) {
      console.warn('API feedback submit fallback to local cache:', err);
    }

    // Always cache locally in case network has offline jitter or until full sync
    try {
      const existingStr = localStorage.getItem('leadership_in_action_feedbacks') || localStorage.getItem('lead360_submitted_feedbacks');
      const list = existingStr ? JSON.parse(existingStr) : [];
      list.unshift(payload);
      localStorage.setItem('leadership_in_action_feedbacks', JSON.stringify(list));
      localStorage.setItem('lead360_submitted_feedbacks', JSON.stringify(list));

      // Notify any active open views (Admin or Client portal tabs)
      window.dispatchEvent(new CustomEvent('feedback_submitted', { detail: payload }));
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 450);
  };

  const handleReset = () => {
    setSubmitted(false);
    setCurrentStep(1);
    setFieldErrors({});
    setParticipant({
      name: '',
      designation: '',
      department: 'Operations',
      date: '2026-11-19',
      trainer: 'WeGrow B School Lead Trainer'
    });
    setSectionA({});
    setSectionB({});
    setSectionC({});
    setSectionD({});
    setSectionE({});
    setOverallRating('');
    setProgrammeDuration('');
    setRecommend('');
    setComments({
      mostUseful: '',
      leastUseful: '',
      howCanImprove: '',
      futureTopics: '',
      otherComments: ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fb-root">
      <style>{`
        .fb-root {
          min-height: 100vh;
          background-color: #F8F9FA;
          color: #1E293B;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          padding-bottom: 60px;
        }

        .fb-container {
          max-width: 880px;
          margin: 0 auto;
          padding: 16px 20px;
        }

        /* Top Header Banner */
        .fb-header-card {
          background: #0A192F;
          border-radius: 18px;
          overflow: hidden;
          color: #FFFFFF;
          margin-bottom: 24px;
          position: relative;
          box-shadow: 0 12px 35px rgba(10, 25, 47, 0.16);
        }

        .fb-top-branding {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 26px;
          background: #061122;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .fb-brand-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.3px;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .fb-brand-title span {
          color: #E86014;
        }

        .fb-header-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 26px 30px;
          position: relative;
          background: linear-gradient(135deg, #0A192F 0%, #112240 60%, #1A365D 100%);
        }

        .fb-header-content {
          max-width: 540px;
          z-index: 2;
        }

        .fb-badge-sub {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #FBD38D;
          margin-bottom: 8px;
        }

        .fb-main-title {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 10px;
          color: #FFFFFF;
          letter-spacing: -0.5px;
        }

        .fb-main-desc {
          font-size: 14px;
          color: #CBD5E1;
          margin: 0;
          line-height: 1.55;
        }

        .fb-mascot-box {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-left: 20px;
        }

        .fb-mascot-circle {
          width: 115px;
          height: 115px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #C53030, #7B1113);
          border: 4px solid rgba(255, 255, 255, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }

        .fb-mascot-img {
          width: 105px;
          height: 105px;
          object-fit: contain;
          transform: translateY(4px);
        }

        /* Stepper Progress Card */
        .fb-stepper-container {
          background: #FFFFFF;
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 22px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
        }

        .fb-stepper-progress-track {
          height: 5px;
          background: #E2E8F0;
          border-radius: 4px;
          margin-bottom: 14px;
          overflow: hidden;
        }

        .fb-stepper-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #991B1B 0%, #E86014 100%);
          transition: width 0.35s ease;
        }

        .fb-stepper-steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .fb-step-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          padding: 7px 14px;
          border-radius: 30px;
          font-size: 12.5px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .fb-step-pill:hover {
          border-color: #CBD5E1;
          background: #F1F5F9;
        }

        .fb-step-pill.current {
          background: #0C1D36;
          border-color: #0C1D36;
          color: #FFFFFF;
          box-shadow: 0 3px 10px rgba(12, 29, 54, 0.2);
        }

        .fb-step-pill.completed {
          background: #EFF6FF;
          border-color: #BFDBFE;
          color: #1E40AF;
        }

        .fb-step-pill-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.08);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          line-height: 1;
        }

        .fb-step-pill.current .fb-step-pill-num {
          background: #E86014;
          color: #FFFFFF;
        }

        .fb-step-pill.completed .fb-step-pill-num {
          background: #2563EB;
          color: #FFFFFF;
        }

        /* Form Card */
        .fb-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 22px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
        }

        /* Participant Info Grid */
        .fb-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .fb-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .fb-label {
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #0F172A;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .fb-input, .fb-select, .fb-textarea {
          background: #F8FAFC;
          border: 1.5px solid #CBD5E1;
          border-radius: 9px;
          padding: 10px 14px;
          font-size: 14px;
          color: #0F172A;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        .fb-input:focus, .fb-select:focus, .fb-textarea:focus {
          outline: none;
          border-color: #E86014;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(232, 96, 20, 0.12);
        }

        .fb-input-error {
          border-color: #DC2626 !important;
          background: #FEF2F2 !important;
        }

        .fb-error-text {
          font-size: 11.5px;
          font-weight: 700;
          color: #DC2626;
          margin-top: 2px;
        }

        /* Section Headings with Red/Burgundy Badges */
        .fb-sec-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          border-bottom: 2px solid #F1F5F9;
          padding-bottom: 14px;
          margin-bottom: 20px;
        }

        .fb-sec-title-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          min-width: 240px;
        }

        .fb-sec-badge {
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 9px;
          background: #991B1B;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 16px;
          box-shadow: 0 3px 8px rgba(153, 27, 27, 0.25);
          flex-shrink: 0;
          line-height: 1;
          text-align: center;
        }

        .fb-sec-title {
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          line-height: 1.3;
        }

        .fb-sec-hint {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: #475569;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          padding: 5px 12px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          margin-left: auto;
        }

        /* Questionnaire Rows */
        .fb-row-item {
          padding: 14px 10px;
          border-bottom: 1px solid #F1F5F9;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .fb-row-item:last-child {
          border-bottom: none;
        }

        .fb-row-question {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .fb-num {
          font-size: 13px;
          font-weight: 800;
          color: #991B1B;
          min-width: 22px;
        }

        .fb-qtext {
          font-size: 14px;
          font-weight: 600;
          color: #1E293B;
          line-height: 1.4;
        }

        .fb-act-tag {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
          background: #FEE2E2;
          color: #991B1B;
          padding: 2px 7px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        /* Pill Radio Group for Mobile & Desktop */
        .fb-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-left: 32px;
        }

        .fb-pill-btn {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .fb-pill-btn:hover {
          border-color: #CBD5E1;
          background: #F1F5F9;
        }

        .fb-pill-btn.active {
          background: #0C1D36;
          border-color: #0C1D36;
          color: #FFFFFF;
          box-shadow: 0 2px 6px rgba(12, 29, 54, 0.2);
        }

        .fb-pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #CBD5E1;
        }

        .fb-pill-btn.active .fb-pill-dot {
          background: #E86014;
        }

        /* Overall Box Cards */
        .fb-overall-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .fb-overall-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px;
        }

        .fb-overall-box-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 12px;
        }

        /* Comments Textareas */
        .fb-comments-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        /* Step Action Navigation */
        .fb-step-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 18px;
          margin-top: 14px;
          border-top: 1px solid #F1F5F9;
        }

        .fb-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          border: none;
        }

        .fb-nav-btn.primary {
          background: #0C1D36;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(12, 29, 54, 0.2);
          margin-left: auto;
        }

        .fb-nav-btn.primary:hover {
          background: #112240;
          transform: translateY(-1px);
        }

        .fb-nav-btn.secondary {
          background: #F1F5F9;
          color: #334155;
          border: 1.5px solid #CBD5E1;
        }

        .fb-nav-btn.secondary:hover {
          background: #E2E8F0;
        }

        /* Submit Bar */
        .fb-submit-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
        }

        .fb-submit-btn {
          background: linear-gradient(135deg, #E86014 0%, #D0520E 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(232, 96, 20, 0.35);
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .fb-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(232, 96, 20, 0.45);
        }

        .fb-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        /* Thank You Banner */
        .fb-thankyou-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 44px 32px;
          text-align: center;
          border: 1px solid #E2E8F0;
          box-shadow: 0 15px 40px rgba(12, 29, 54, 0.08);
          animation: popIn 0.3s ease-out;
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 640px) {
          .fb-header-body {
            flex-direction: column-reverse;
            text-align: center;
            padding: 22px 18px;
          }
          .fb-mascot-box {
            margin: 0 0 16px;
          }
          .fb-stepper-steps {
            overflow-x: auto;
            padding-bottom: 4px;
            justify-content: flex-start;
          }
          .fb-step-pill {
            padding: 5px 10px;
            font-size: 11px;
            flex-shrink: 0;
          }
          .fb-meta-grid {
            grid-template-columns: 1fr;
          }
          .fb-pills {
            margin-left: 0;
          }
          .fb-sec-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .fb-sec-hint {
            margin-left: 0;
          }
          .fb-step-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .fb-nav-btn {
            justify-content: center;
            width: 100%;
          }
          .fb-nav-btn.primary {
            margin-left: 0;
          }
        }
      `}</style>

      <div className="fb-container">
        {/* Navigation back */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#475569',
              fontSize: 13,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={16} /> Return to Event Overview
          </button>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#991B1B' }}>
            LEADERSHIP IN ACTION • Learn. Apply. Lead. Transform.
          </span>
        </div>

        {/* Top Header Card Matching PDF */}
        <div className="fb-header-card">
          <div className="fb-top-branding">
            <div className="fb-brand-title">
              WeGrow <span>B School</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', color: '#94A3B8' }}>
              LEADERSHIP IN ACTION · PARTICIPANT FEEDBACK FORM
            </div>
          </div>

          <div className="fb-header-body">
            <div className="fb-header-content">
              <div className="fb-badge-sub">
                <Sparkles size={13} color="#FBD38D" />
                LEADERSHIP IN ACTION · LEADERSHIP DEVELOPMENT PROGRAMME
              </div>
              <h1 className="fb-main-title">Participant Feedback Form</h1>
              <p className="fb-main-desc">
                Thank you for attending the Leadership in Action training programme.
                Your honest feedback helps us improve future sessions. It takes about 5 minutes.
              </p>
            </div>

            <div className="fb-mascot-box">
              <div className="fb-mascot-circle">
                <img
                  src="/images/mascot.webp"
                  alt="WeGrow Mascot"
                  className="fb-mascot-img"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* If submitted, show thank you screen */}
        {submitted ? (
          <div className="fb-thankyou-card">
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: '#DCFCE7',
                color: '#16A34A',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 18
              }}
            >
              <CheckCircle2 size={44} />
            </div>

            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0C1D36', margin: '0 0 10px' }}>
              Thank you for your valuable feedback!
            </h2>

            <p style={{ fontSize: 15, color: '#475569', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Your responses help us make every Leadership in Action programme better.
              WeGrow B School is committed to delivering practical, impactful leadership development.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#F1F5F9',
                padding: '10px 20px',
                borderRadius: 30,
                fontSize: 13,
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: 28
              }}
            >
              <Award size={16} color="#E86014" />
              <span>Overall Rating Given: <b>{overallRating || 'Submitted'}</b></span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: '#0C1D36',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px 22px',
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Submit another response
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  background: '#F1F5F9',
                  color: '#0F172A',
                  border: '1px solid #CBD5E1',
                  borderRadius: 10,
                  padding: '12px 22px',
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Back to Event Page
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Step Progress Stepper Bar */}
            <div id="fb-form-anchor" className="fb-stepper-container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
                  {STEPS[currentStep - 1].label}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#E86014' }}>
                  Step {currentStep} of {STEPS.length}
                </span>
              </div>

              <div className="fb-stepper-progress-track">
                <div
                  className="fb-stepper-progress-fill"
                  style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>

              <div className="fb-stepper-steps">
                {STEPS.map((s) => {
                  const isCurrent = currentStep === s.id;
                  const isCompleted = currentStep > s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        if (isCompleted || s.id < currentStep) {
                          handlePrevStep(s.id);
                        } else if (s.id === currentStep + 1) {
                          handleNextStep(s.id);
                        }
                      }}
                      className={`fb-step-pill ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                    >
                      <span className="fb-step-pill-num">
                        {isCompleted ? <Check size={12} strokeWidth={3} /> : s.id}
                      </span>
                      <span className="fb-step-pill-text">{s.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 1: Participant Info & SECTION A (Programme content) */}
            {currentStep === 1 && (
              <>
                {/* Meta Information Card (Page 1 top) */}
                <div className="fb-card">
                  <div className="fb-meta-grid">
                    <div className="fb-field-group">
                      <label className="fb-label">
                        NAME *
                        {fieldErrors.name && <span className="fb-error-text">({fieldErrors.name})</span>}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. R. Soundararajan"
                        value={participant.name}
                        onChange={(e) => {
                          setParticipant({ ...participant, name: e.target.value });
                          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                        }}
                        className={`fb-input ${fieldErrors.name ? 'fb-input-error' : ''}`}
                      />
                    </div>

                    <div className="fb-field-group">
                      <label className="fb-label">
                        DESIGNATION *
                        {fieldErrors.designation && <span className="fb-error-text">({fieldErrors.designation})</span>}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Middle Manager / Team Lead"
                        value={participant.designation}
                        onChange={(e) => {
                          setParticipant({ ...participant, designation: e.target.value });
                          if (fieldErrors.designation) setFieldErrors({ ...fieldErrors, designation: undefined });
                        }}
                        className={`fb-input ${fieldErrors.designation ? 'fb-input-error' : ''}`}
                      />
                    </div>

                    <div className="fb-field-group">
                      <label className="fb-label">DEPARTMENT *</label>
                      <select
                        value={participant.department}
                        onChange={(e) => setParticipant({ ...participant, department: e.target.value })}
                        className="fb-select"
                      >
                        <option value="Operations">Operations</option>
                        <option value="Manufacturing & Plant">Manufacturing & Plant</option>
                        <option value="Sales & Customer Experience">Sales & Customer Experience</option>
                        <option value="Finance & Accounts">Finance & Accounts</option>
                        <option value="HR & Administration">HR & Administration</option>
                        <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                        <option value="Service & Technical">Service & Technical</option>
                        <option value="Other">Other Vertical</option>
                      </select>
                    </div>

                    <div className="fb-field-group">
                      <label className="fb-label">DATE</label>
                      <input
                        type="text"
                        value={participant.date}
                        onChange={(e) => setParticipant({ ...participant, date: e.target.value })}
                        className="fb-input"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION A: Programme content */}
                <div className="fb-card">
                  <div className="fb-sec-header">
                    <div className="fb-sec-title-wrap">
                      <div className="fb-sec-badge">A</div>
                      <h3 className="fb-sec-title">Programme content</h3>
                    </div>
                    <span className="fb-sec-hint">TICK ONE OPTION PER ROW</span>
                  </div>

                  {SECTION_A_QUESTIONS.map((q) => (
                    <div key={q.id} className="fb-row-item">
                      <div className="fb-row-question">
                        <span className="fb-num">{q.num}</span>
                        <span className="fb-qtext">{q.text}</span>
                      </div>
                      <div className="fb-pills">
                        {AGREE_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`fb-pill-btn ${sectionA[q.id] === opt ? 'active' : ''}`}
                            onClick={() => setSectionA({ ...sectionA, [q.id]: opt })}
                          >
                            <span className="fb-pill-dot" />
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* SECTION B: Trainer / facilitator */}
                <div className="fb-card">
                  <div className="fb-sec-header">
                    <div className="fb-sec-title-wrap">
                      <div className="fb-sec-badge">B</div>
                      <h3 className="fb-sec-title">Trainer / facilitator</h3>
                    </div>
                    <span className="fb-sec-hint">TICK ONE OPTION PER ROW</span>
                  </div>

                  {SECTION_B_QUESTIONS.map((q) => (
                    <div key={q.id} className="fb-row-item">
                      <div className="fb-row-question">
                        <span className="fb-num">{q.num}</span>
                        <span className="fb-qtext">{q.text}</span>
                      </div>
                      <div className="fb-pills">
                        {AGREE_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`fb-pill-btn ${sectionB[q.id] === opt ? 'active' : ''}`}
                            onClick={() => setSectionB({ ...sectionB, [q.id]: opt })}
                          >
                            <span className="fb-pill-dot" />
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="fb-step-actions">
                    <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                      Completed all 10 questions? Click Next for Overall Feedback.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNextStep(2)}
                      className="fb-nav-btn primary"
                    >
                      Next: Overall Feedback <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: SECTION E, SECTION F, SECTION G & SUBMIT */}
            {currentStep === 2 && (
              <>
                {/* SECTION E: Arrangements & logistics */}
                <div className="fb-card">
                  <div className="fb-sec-header">
                    <div className="fb-sec-title-wrap">
                      <div className="fb-sec-badge">E</div>
                      <h3 className="fb-sec-title">Arrangements & logistics</h3>
                    </div>
                    <span className="fb-sec-hint">RATE EACH FACILITY AREA</span>
                  </div>

                  {SECTION_E_AREAS.map((area) => (
                    <div key={area.id} className="fb-row-item">
                      <div className="fb-row-question">
                        <span className="fb-num">{area.num}</span>
                        <span className="fb-qtext">{area.title}</span>
                      </div>
                      <div className="fb-pills">
                        {RATING_5_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`fb-pill-btn ${sectionE[area.id] === opt ? 'active' : ''}`}
                            onClick={() => setSectionE({ ...sectionE, [area.id]: opt })}
                          >
                            <span className="fb-pill-dot" />
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* SECTION F: Overall */}
                <div className="fb-card">
                  <div className="fb-sec-header">
                    <div className="fb-sec-title-wrap">
                      <div className="fb-sec-badge">F</div>
                      <h3 className="fb-sec-title">Overall</h3>
                    </div>
                  </div>

                  <div className="fb-overall-grid">
                    {/* 1. Overall rating */}
                    <div className="fb-overall-box">
                      <div className="fb-overall-box-title">Overall rating of the programme</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {RATING_5_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`fb-pill-btn ${overallRating === opt ? 'active' : ''}`}
                            onClick={() => setOverallRating(opt)}
                            style={{ width: '100%', justifyContent: 'flex-start' }}
                          >
                            <span className="fb-pill-dot" />
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Programme duration */}
                    <div className="fb-overall-box">
                      <div className="fb-overall-box-title">Programme duration</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {DURATION_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`fb-pill-btn ${programmeDuration === opt ? 'active' : ''}`}
                            onClick={() => setProgrammeDuration(opt)}
                            style={{ width: '100%', justifyContent: 'flex-start' }}
                          >
                            <span className="fb-pill-dot" />
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Recommend it? */}
                    <div className="fb-overall-box">
                      <div className="fb-overall-box-title">Recommend it?</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {RECOMMEND_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`fb-pill-btn ${recommend === opt ? 'active' : ''}`}
                            onClick={() => setRecommend(opt)}
                            style={{ width: '100%', justifyContent: 'flex-start' }}
                          >
                            <span className="fb-pill-dot" />
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION G: Your comments */}
                <div className="fb-card">
                  <div className="fb-sec-header">
                    <div className="fb-sec-title-wrap">
                      <div className="fb-sec-badge">G</div>
                      <h3 className="fb-sec-title">Your comments</h3>
                    </div>
                  </div>

                  <div className="fb-comments-grid">
                    <div className="fb-field-group">
                      <label className="fb-label">What did you find most useful?</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Practical case studies, delegation frameworks, peer discussions..."
                        value={comments.mostUseful}
                        onChange={(e) => setComments({ ...comments, mostUseful: e.target.value })}
                        className="fb-textarea"
                      />
                    </div>

                    <div className="fb-field-group">
                      <label className="fb-label">Topics you would like in future trainings</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Advanced conflict management, budgeting, cross-team accountability..."
                        value={comments.futureTopics}
                        onChange={(e) => setComments({ ...comments, futureTopics: e.target.value })}
                        className="fb-textarea"
                      />
                    </div>

                    <div className="fb-field-group">
                      <label className="fb-label">Any other comments</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. General impressions or remarks for the WeGrow team..."
                        value={comments.otherComments}
                        onChange={(e) => setComments({ ...comments, otherComments: e.target.value })}
                        className="fb-textarea"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Submit Bar with Previous button */}
                <div className="fb-card" style={{ background: '#0C1D36', color: '#FFFFFF', border: 'none' }}>
                  <div className="fb-submit-bar" style={{ flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>
                        Ready to submit your feedback?
                      </div>
                      <div style={{ fontSize: 12.5, color: '#94A3B8' }}>
                        🔒 WeGrow B School respects your time and confidentiality.
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        type="button"
                        onClick={() => handlePrevStep(1)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#FFFFFF',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 12,
                          padding: '12px 20px',
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <ChevronLeft size={16} /> Back to Questions
                      </button>

                      <button type="submit" disabled={isSubmitting} className="fb-submit-btn">
                        {isSubmitting ? (
                          <>Submitting feedback…</>
                        ) : (
                          <>
                            Submit Feedback <Send size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </form>
        )}

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#94A3B8' }}>
          <div>LEADERSHIP IN ACTION · PARTICIPANT FEEDBACK FORM</div>
          <div style={{ fontWeight: 700, marginTop: 2 }}>LEADERSHIP IN ACTION · Learn. Apply. Lead. Transform.</div>
        </div>
      </div>
    </div>
  );
};

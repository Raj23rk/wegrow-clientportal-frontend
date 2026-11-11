import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Star,
  QrCode,
  Download,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Check,
  Send,
  MessageCircle,
  Mail,
  UserPlus,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle,
  Building,
  Briefcase,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface AttendeeRecord {
  id: string;
  passCode: string; // e.g. TAG26-001
  fullName: string;
  phone: string;
  email?: string;
  companyName: string;
  designation: string;
  department: string;
  registeredAt: string;
  codeSentWhatsApp: boolean;
  codeSentEmail: boolean;
  isCheckedIn: boolean;
  checkInTime?: string;
  feedbackFilled: boolean;
  feedbackRating?: number;
  feedbackNotes?: string;
}

// Initial 25 TAG Group Middle-Management Nominees
const SEED_ATTENDEES: AttendeeRecord[] = [
  {
    id: 'att_01',
    passCode: 'TAG26-001',
    fullName: 'Krisshiya R.B',
    phone: '9994010131',
    email: 'krisshiya.rb@anamalais.in',
    companyName: 'TAG Group',
    designation: 'Operations Head',
    department: 'Operations',
    registeredAt: '2026-11-09 10:15 AM',
    codeSentWhatsApp: true,
    codeSentEmail: true,
    isCheckedIn: true,
    checkInTime: '09:12 AM',
    feedbackFilled: true,
    feedbackRating: 5
  },
  {
    id: 'att_02',
    passCode: 'TAG26-002',
    fullName: 'Sujay Sarvesh R.B',
    phone: '9994010132',
    email: 'sujay.sarvesh@anamalais.in',
    companyName: 'TAG Group',
    designation: 'Strategic Planning Lead',
    department: 'Operations',
    registeredAt: '2026-11-09 10:20 AM',
    codeSentWhatsApp: true,
    codeSentEmail: true,
    isCheckedIn: true,
    checkInTime: '09:18 AM',
    feedbackFilled: true,
    feedbackRating: 5
  },
  {
    id: 'att_03',
    passCode: 'TAG26-003',
    fullName: 'R. Soundararajan',
    phone: '9842188231',
    email: 'soundar.r@taggroup.in',
    companyName: 'TAG Group',
    designation: 'Senior Plant Manager',
    department: 'Manufacturing & Plant',
    registeredAt: '2026-11-09 11:05 AM',
    codeSentWhatsApp: true,
    codeSentEmail: true,
    isCheckedIn: true,
    checkInTime: '09:22 AM',
    feedbackFilled: true,
    feedbackRating: 4
  },
  {
    id: 'att_04',
    passCode: 'TAG26-004',
    fullName: 'M. Karthikeyan',
    phone: '9789456123',
    email: 'karthik.m@taggroup.in',
    companyName: 'TAG Group',
    designation: 'Supply Chain Director',
    department: 'Supply Chain & Logistics',
    registeredAt: '2026-11-09 11:30 AM',
    codeSentWhatsApp: true,
    codeSentEmail: true,
    isCheckedIn: true,
    checkInTime: '09:25 AM',
    feedbackFilled: false
  },
  {
    id: 'att_05',
    passCode: 'TAG26-005',
    fullName: 'P. Meenakshi Sundaram',
    phone: '9843322110',
    email: 'meenakshi.p@taggroup.in',
    companyName: 'TAG Group',
    designation: 'Quality Assurance Head',
    department: 'Manufacturing & Plant',
    registeredAt: '2026-11-09 11:45 AM',
    codeSentWhatsApp: true,
    codeSentEmail: false,
    isCheckedIn: true,
    checkInTime: '09:28 AM',
    feedbackFilled: false
  },
  {
    id: 'att_06',
    passCode: 'TAG26-006',
    fullName: 'S. Anand Kumar',
    phone: '9443155880',
    email: 'anand.s@taggroup.in',
    companyName: 'TAG Group',
    designation: 'Customer Experience Lead',
    department: 'Sales & Customer Experience',
    registeredAt: '2026-11-09 12:10 PM',
    codeSentWhatsApp: true,
    codeSentEmail: true,
    isCheckedIn: false,
    feedbackFilled: false
  },
  {
    id: 'att_07',
    passCode: 'TAG26-007',
    fullName: 'V. Divya Lakshmi',
    phone: '9944887766',
    email: 'divya.v@taggroup.in',
    companyName: 'TAG Group',
    designation: 'HR & People Operations Manager',
    department: 'HR & Administration',
    registeredAt: '2026-11-09 12:40 PM',
    codeSentWhatsApp: true,
    codeSentEmail: true,
    isCheckedIn: true,
    checkInTime: '09:15 AM',
    feedbackFilled: true,
    feedbackRating: 5
  },
  {
    id: 'att_08',
    passCode: 'TAG26-008',
    fullName: 'K. Rajesh Kannan',
    phone: '9360123456',
    email: 'rajesh.k@taggroup.in',
    companyName: 'TAG Group',
    designation: 'Maintenance & Safety Head',
    department: 'Manufacturing & Plant',
    registeredAt: '2026-11-09 01:15 PM',
    codeSentWhatsApp: true,
    codeSentEmail: true,
    isCheckedIn: false,
    feedbackFilled: false
  },
  {
    id: 'att_09',
    passCode: 'TAG26-009',
    fullName: 'A. Balaji Swaminathan',
    phone: '9840223344',
    email: 'balaji.a@taggroup.in',
    companyName: 'TAG Group',
    designation: 'Finance Controller',
    department: 'Finance & Accounts',
    registeredAt: '2026-11-09 02:00 PM',
    codeSentWhatsApp: true,
    codeSentEmail: false,
    isCheckedIn: true,
    checkInTime: '09:30 AM',
    feedbackFilled: false
  },
  {
    id: 'att_10',
    passCode: 'TAG26-010',
    fullName: 'S. Priyadharshini',
    phone: '9788112233',
    email: 'priya.s@taggroup.in',
    companyName: 'TAG Group',
    designation: 'Continuous Improvement Manager',
    department: 'Operations',
    registeredAt: '2026-11-09 02:30 PM',
    codeSentWhatsApp: true,
    codeSentEmail: true,
    isCheckedIn: false,
    feedbackFilled: false
  },
  {
    id: 'att_11',
    passCode: 'TAG26-011',
    fullName: 'N. Vigneshwaran',
    phone: '9488334455',
    email: 'vignesh.n@taggroup.in',
    companyName: 'TAG Group',
    designation: 'Senior Production Supervisor',
    department: 'Manufacturing & Plant',
    registeredAt: '2026-11-09 03:00 PM',
    codeSentWhatsApp: true,
    codeSentEmail: true,
    isCheckedIn: true,
    checkInTime: '09:20 AM',
    feedbackFilled: true,
    feedbackRating: 4
  },
  {
    id: 'att_12',
    passCode: 'TAG26-012',
    fullName: 'T. Subhashini',
    phone: '9940556677',
    email: 'subha.t@taggroup.in',
    companyName: 'TAG Group',
    designation: 'IT Systems & ERP Administrator',
    department: 'Operations',
    registeredAt: '2026-11-09 03:25 PM',
    codeSentWhatsApp: true,
    codeSentEmail: true,
    isCheckedIn: false,
    feedbackFilled: false
  },
  {
    id: 'att_13',
    passCode: 'TAG26-013',
    fullName: 'G. Murugan',
    phone: '9841778899',
    email: 'murugan.g@taggroup.in',
    companyName: 'TAG Group',
    designation: 'Logistics Fleet Coordinator',
    department: 'Supply Chain & Logistics',
    registeredAt: '2026-11-09 04:10 PM',
    codeSentWhatsApp: true,
    codeSentEmail: false,
    isCheckedIn: true,
    checkInTime: '09:32 AM',
    feedbackFilled: false
  },
  {
    id: 'att_14',
    passCode: 'TAG26-014',
    fullName: 'K. Sangeetha',
    phone: '9361223344',
    email: 'sangeetha.k@taggroup.in',
    companyName: 'TAG Group',
    designation: 'Talent Development Partner',
    department: 'HR & Administration',
    registeredAt: '2026-11-09 04:30 PM',
    codeSentWhatsApp: true,
    codeSentEmail: true,
    isCheckedIn: false,
    feedbackFilled: false
  },
  {
    id: 'att_15',
    passCode: 'TAG26-015',
    fullName: 'D. Saravanan',
    phone: '9843667788',
    email: 'saravanan.d@taggroup.in',
    companyName: 'TAG Group',
    designation: 'Procurement Manager',
    department: 'Supply Chain & Logistics',
    registeredAt: '2026-11-09 05:00 PM',
    codeSentWhatsApp: true,
    codeSentEmail: true,
    isCheckedIn: true,
    checkInTime: '09:27 AM',
    feedbackFilled: true,
    feedbackRating: 5
  }
];

export const AdminAttendancePage: React.FC = () => {
  const navigate = useNavigate();

  // Load attendees from storage or seed defaults
  const [attendees, setAttendees] = useState<AttendeeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('wg_attendance_records');
      if (saved) {
        return JSON.parse(saved);
      }
      // Check if event landing registrations exist
      const publicRegsStr = localStorage.getItem('wg_event_registrations');
      if (publicRegsStr) {
        const publicRegs = JSON.parse(publicRegsStr);
        if (Array.isArray(publicRegs) && publicRegs.length > 0) {
          const mapped: AttendeeRecord[] = publicRegs.map((r, i) => ({
            id: r.id || 'reg_' + i,
            passCode: `TAG26-${String(i + 1).padStart(3, '0')}`,
            fullName: r.fullName || 'Nominee ' + (i + 1),
            phone: r.phone || '9876543210',
            email: r.email || `${(r.fullName || 'nominee').toLowerCase().replace(/\s+/g, '.')}@taggroup.in`,
            companyName: r.companyName || 'TAG Group',
            designation: r.designation || 'Middle Manager',
            department: r.department || 'Operations',
            registeredAt: r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : 'Today',
            codeSentWhatsApp: true,
            codeSentEmail: true,
            isCheckedIn: false,
            feedbackFilled: false
          }));
          return [...mapped, ...SEED_ATTENDEES.slice(mapped.length)];
        }
      }
      return SEED_ATTENDEES;
    } catch {
      return SEED_ATTENDEES;
    }
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'CHECKED_IN' | 'UNCHECKED' | 'FEEDBACK'
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals state
  const [gateModalOpen, setGateModalOpen] = useState(false);
  const [quickCheckInCode, setQuickCheckInCode] = useState('');
  const [quickCheckInResult, setQuickCheckInResult] = useState<{
    success: boolean;
    message: string;
    attendee?: AttendeeRecord;
  } | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    fullName: '',
    phone: '',
    email: '',
    companyName: 'TAG Group',
    designation: '',
    department: 'Operations'
  });

  const [detailModalAttendee, setDetailModalAttendee] = useState<AttendeeRecord | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wg_attendance_records', JSON.stringify(attendees));
    } catch (e) {
      console.warn('Could not persist attendance', e);
    }
  }, [attendees]);

  // Derived Metrics
  const totalRegistered = attendees.length;
  const checkedInCount = attendees.filter((a) => a.isCheckedIn).length;
  const uncheckInCount = totalRegistered - checkedInCount;
  const feedbackCount = attendees.filter((a) => a.feedbackFilled).length;
  const passcodesSentCount = attendees.filter((a) => a.codeSentWhatsApp || a.codeSentEmail).length;
  const checkInRate = totalRegistered > 0 ? Math.round((checkedInCount / totalRegistered) * 100) : 0;

  // Filtered List
  const filteredAttendees = useMemo(() => {
    return attendees.filter((a) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.fullName.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.passCode.toLowerCase().includes(q) ||
        a.designation.toLowerCase().includes(q) ||
        a.companyName.toLowerCase().includes(q) ||
        (a.email && a.email.toLowerCase().includes(q));

      // Department filter
      const matchesDept = filterDepartment === 'ALL' || a.department === filterDepartment;

      // Status filter
      let matchesStatus = true;
      if (filterStatus === 'CHECKED_IN') matchesStatus = a.isCheckedIn;
      else if (filterStatus === 'UNCHECKED') matchesStatus = !a.isCheckedIn;
      else if (filterStatus === 'FEEDBACK') matchesStatus = a.feedbackFilled;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [attendees, searchQuery, filterDepartment, filterStatus]);

  // Toggle Check-In status
  const handleToggleCheckIn = (id: string) => {
    setAttendees((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const willBeCheckedIn = !a.isCheckedIn;
          return {
            ...a,
            isCheckedIn: willBeCheckedIn,
            checkInTime: willBeCheckedIn
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined
          };
        }
        return a;
      })
    );
  };

  // Toggle Feedback status
  const handleToggleFeedback = (id: string) => {
    setAttendees((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const willBeFeedback = !a.feedbackFilled;
          return {
            ...a,
            feedbackFilled: willBeFeedback,
            feedbackRating: willBeFeedback ? 5 : undefined
          };
        }
        return a;
      })
    );
  };

  // Quick Gate Check-In by Code
  const handleQuickCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = quickCheckInCode.trim().toUpperCase();
    if (!cleanCode) return;

    const found = attendees.find(
      (a) =>
        a.passCode.toUpperCase() === cleanCode ||
        a.phone.includes(cleanCode) ||
        a.passCode.toUpperCase().replace('-', '') === cleanCode.replace('-', '')
    );

    if (!found) {
      setQuickCheckInResult({
        success: false,
        message: `No attendee found matching "${cleanCode}". Please verify nominee details.`
      });
      return;
    }

    if (found.isCheckedIn) {
      setQuickCheckInResult({
        success: true,
        message: `Already Checked-In at ${found.checkInTime || 'Gate'}!`,
        attendee: found
      });
      return;
    }

    // Mark Checked In
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendees((prev) =>
      prev.map((a) => (a.id === found.id ? { ...a, isCheckedIn: true, checkInTime: timeNow } : a))
    );

    setQuickCheckInResult({
      success: true,
      message: `Verified! Welcome ${found.fullName} (${found.designation}) to Leadership in Action!`,
      attendee: { ...found, isCheckedIn: true, checkInTime: timeNow }
    });
    setQuickCheckInCode('');
  };

  // Copy Code to Clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Send Passcode via WhatsApp Web
  const handleSendWhatsApp = (a: AttendeeRecord) => {
    const text = encodeURIComponent(
      `⭐ *WeGrow B School • Leadership in Action*\n\n` +
      `Hello ${a.fullName},\n` +
      `Here is your verified entry passcode for the Middle-Management Leadership Programme:\n\n` +
      `🎫 *YOUR ENTRY CODE:* ${a.passCode}\n` +
      `📅 *Date:* 18 November 2026 | 9:30 AM to 5:30 PM\n` +
      `📍 *Venue:* TAG Group Conference Hall, Amathur\n\n` +
      `Please show this code at the reception gate for instant check-in. See you there!`
    );
    window.open(`https://wa.me/91${a.phone}?text=${text}`, '_blank');
    setAttendees((prev) =>
      prev.map((item) => (item.id === a.id ? { ...item, codeSentWhatsApp: true } : item))
    );
  };

  // Send Passcode via Email
  const handleSendEmail = (a: AttendeeRecord) => {
    const subject = encodeURIComponent(`Your Entry Code [${a.passCode}] - Leadership in Action Programme`);
    const body = encodeURIComponent(
      `Dear ${a.fullName},\n\n` +
      `We look forward to welcoming you to the Leadership in Action Programme organized for TAG Group.\n\n` +
      `Your verified entry passcode is: ${a.passCode}\n\n` +
      `Programme Schedule:\n` +
      `Date: 18 November 2026 (9:30 AM – 5:30 PM)\n` +
      `Venue: TAG Group Conference Hall, Amathur\n\n` +
      `Please present this passcode at the gate entrance for verified check-in.\n\n` +
      `Warm regards,\nWeGrow B School Leadership Team`
    );
    window.open(`mailto:${a.email || ''}?subject=${subject}&body=${body}`, '_blank');
    setAttendees((prev) =>
      prev.map((item) => (item.id === a.id ? { ...item, codeSentEmail: true } : item))
    );
  };

  // Add Attendee
  const handleAddAttendeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttendee.fullName || !newAttendee.phone) return;

    const nextNum = attendees.length + 1;
    const passCode = `TAG26-${String(nextNum).padStart(3, '0')}`;
    const record: AttendeeRecord = {
      id: 'att_' + Date.now(),
      passCode,
      fullName: newAttendee.fullName,
      phone: newAttendee.phone,
      email: newAttendee.email || `${newAttendee.fullName.toLowerCase().replace(/\s+/g, '.')}@taggroup.in`,
      companyName: newAttendee.companyName || 'TAG Group',
      designation: newAttendee.designation || 'Middle Manager',
      department: newAttendee.department || 'Operations',
      registeredAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      codeSentWhatsApp: false,
      codeSentEmail: false,
      isCheckedIn: false,
      feedbackFilled: false
    };

    setAttendees((prev) => [record, ...prev]);
    setNewAttendee({
      fullName: '',
      phone: '',
      email: '',
      companyName: 'TAG Group',
      designation: '',
      department: 'Operations'
    });
    setAddModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Pass Code',
      'Full Name',
      'Phone Number',
      'Email',
      'Company',
      'Designation',
      'Department',
      'Registered Date',
      'Gate Check-In Status',
      'Check-In Time',
      'Feedback Status'
    ];

    const rows = attendees.map((a) => [
      a.passCode,
      `"${a.fullName}"`,
      `"${a.phone}"`,
      `"${a.email || ''}"`,
      `"${a.companyName}"`,
      `"${a.designation}"`,
      `"${a.department}"`,
      `"${a.registeredAt}"`,
      a.isCheckedIn ? 'CHECKED IN' : 'UNCHECKED',
      a.checkInTime || '',
      a.feedbackFilled ? 'SUBMITTED' : 'PENDING'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TAG_Leadership_Attendance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="att-page-root">
      {/* Styles */}
      <style>{`
        .att-page-root {
          padding: 24px;
          color: #0F172A;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          background: #F8FAFC;
        }

        /* Top Header Bar */
        .att-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .att-brand-area {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .att-brand-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #FF6B00 0%, #EA580C 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(234, 88, 12, 0.3);
        }

        .att-title-wrap h1 {
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .att-live-pill {
          font-size: 11px;
          font-weight: 700;
          background: #FFF1E8;
          color: #E86014;
          padding: 3px 10px;
          border-radius: 9999px;
          border: 1px solid rgba(232, 96, 20, 0.25);
          letter-spacing: 0.02em;
        }

        .att-subtitle {
          font-size: 13px;
          color: #64748B;
          margin: 3px 0 0;
        }

        .att-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .att-btn-gate-checkin {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #6366F1;
          color: #FFFFFF;
          font-size: 13.5px;
          font-weight: 700;
          padding: 9px 18px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.28);
        }

        .att-btn-gate-checkin:hover {
          background: #4F46E5;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(99, 102, 241, 0.38);
        }

        .att-btn-add {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0F172A;
          color: #FFFFFF;
          font-size: 13.5px;
          font-weight: 700;
          padding: 9px 16px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .att-btn-add:hover {
          background: #1E293B;
          transform: translateY(-1px);
        }

        .att-btn-export {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #FFFFFF;
          color: #059669;
          font-size: 13.5px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 12px;
          border: 1.5px solid #059669;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .att-btn-export:hover {
          background: #ECFDF5;
        }

        .att-btn-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .att-btn-icon:hover {
          background: #F1F5F9;
          color: #0F172A;
        }

        /* 5 Top Stat Cards (Matching User's Reference Screenshot) */
        .att-stat-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .att-stat-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          padding: 18px 20px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          transition: all 0.2s ease;
        }

        .att-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
          border-color: #CBD5E1;
        }

        .att-stat-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #64748B;
          margin-bottom: 6px;
        }

        .att-stat-val {
          font-size: 26px;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.1;
          margin-bottom: 4px;
        }

        .att-stat-sub {
          font-size: 12px;
          font-weight: 600;
          color: #94A3B8;
        }

        .att-stat-badge-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Search & Filter Toolbar */
        .att-filter-toolbar {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          padding: 16px 20px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.02);
        }

        .att-toolbar-top {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .att-search-box {
          position: relative;
          flex: 1;
          min-width: 260px;
        }

        .att-search-box svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .att-search-input {
          width: 100%;
          height: 42px;
          padding: 0 14px 0 42px;
          border-radius: 12px;
          border: 1.5px solid #E2E8F0;
          font-size: 13.5px;
          font-family: inherit;
          color: #0F172A;
          background: #F8FAFC;
          outline: none;
          transition: all 0.2s ease;
        }

        .att-search-input:focus {
          border-color: #6366F1;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .att-filter-select {
          height: 42px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1.5px solid #E2E8F0;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          color: #334155;
          background: #FFFFFF;
          cursor: pointer;
          outline: none;
        }

        .att-filter-select:focus {
          border-color: #6366F1;
        }

        /* Quick Filter Chips */
        .att-chips-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          padding-top: 10px;
          border-top: 1px dashed #E2E8F0;
        }

        .att-chips-label {
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #64748B;
          text-transform: uppercase;
        }

        .att-filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #475569;
        }

        .att-filter-chip:hover {
          background: #F1F5F9;
        }

        .att-filter-chip.active {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }

        .att-chip-count {
          padding: 2px 7px;
          border-radius: 9999px;
          font-size: 11px;
          background: rgba(0,0,0,0.08);
        }

        .att-filter-chip.active .att-chip-count {
          background: rgba(255,255,255,0.25);
          color: #FFFFFF;
        }

        /* Attendees Table */
        .att-table-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
        }

        .att-table-container {
          overflow-x: auto;
          width: 100%;
        }

        .att-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .att-table th {
          background: #F8FAFC;
          color: #64748B;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 14px 18px;
          border-bottom: 1px solid #E2E8F0;
          white-space: nowrap;
        }

        .att-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #F1F5F9;
          font-size: 13.5px;
          color: #0F172A;
          vertical-align: middle;
        }

        .att-table tr:hover td {
          background: #FAFCFF;
        }

        /* Attendee Code Badge */
        .att-code-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          background: #FFF7ED;
          color: #C2410C;
          border: 1px solid rgba(234, 88, 12, 0.25);
          padding: 4px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .att-code-pill:hover {
          background: #FFEDD5;
          transform: translateY(-1px);
        }

        /* Attendee Info */
        .att-name-cell {
          display: flex;
          flex-direction: column;
        }

        .att-name-val {
          font-weight: 700;
          color: #0F172A;
          font-size: 14px;
        }

        .att-email-val {
          font-size: 12px;
          color: #64748B;
        }

        /* Contact Dispatch */
        .att-contact-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .att-phone-val {
          font-weight: 700;
          color: #334155;
          font-size: 13px;
        }

        .att-dispatch-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .att-send-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
        }

        .att-send-btn.wa {
          background: #DCFCE7;
          color: #15803D;
        }
        .att-send-btn.wa:hover {
          background: #25D366;
          color: #FFFFFF;
        }

        .att-send-btn.mail {
          background: #EFF6FF;
          color: #1D4ED8;
        }
        .att-send-btn.mail:hover {
          background: #2563EB;
          color: #FFFFFF;
        }

        /* Status Badges */
        .att-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 9999px;
          letter-spacing: 0.02em;
        }

        .att-status-badge.confirmed {
          background: #DCFCE7;
          color: #15803D;
        }

        .att-status-badge.checked-in {
          background: #EDE9FE;
          color: #6D28D9;
        }

        .att-status-badge.pending {
          background: #FEF3C7;
          color: #B45309;
        }

        /* Check-In Action Button */
        .att-btn-checkin-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          padding: 7px 14px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .att-btn-checkin-action.mark {
          background: #0F172A;
          color: #FFFFFF;
        }

        .att-btn-checkin-action.mark:hover {
          background: #16A34A;
          transform: translateY(-1px);
        }

        .att-btn-checkin-action.done {
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
        }

        .att-btn-checkin-action.done:hover {
          background: #FEE2E2;
          color: #DC2626;
          border-color: #FECACA;
        }

        /* Feedback Pill */
        .att-feedback-toggle {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s ease;
        }

        .att-feedback-toggle.filled {
          background: #F0FDF4;
          color: #16A34A;
          border-color: #BBF7D0;
        }

        .att-feedback-toggle.unfilled {
          background: #F8FAFC;
          color: #94A3B8;
          border-color: #E2E8F0;
        }

        .att-feedback-toggle:hover {
          transform: translateY(-1px);
        }

        /* Table Footer */
        .att-table-footer {
          padding: 14px 20px;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #64748B;
        }

        /* Modal Backdrop */
        .att-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .att-modal-card {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
          overflow: hidden;
          animation: modalPop 0.2s ease-out;
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .att-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .att-modal-header h3 {
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .att-modal-close-btn {
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
        }

        .att-modal-close-btn:hover {
          background: #F1F5F9;
          color: #0F172A;
        }

        .att-modal-body {
          padding: 24px;
        }

        .att-form-group {
          margin-bottom: 16px;
        }

        .att-form-label {
          display: block;
          font-size: 12.5px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 6px;
        }

        .att-form-input {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1.5px solid #CBD5E1;
          font-size: 14px;
          font-family: inherit;
          color: #0F172A;
          outline: none;
        }

        .att-form-input:focus {
          border-color: #6366F1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .att-modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #E2E8F0;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
          .att-stat-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .att-stat-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .att-page-root {
            padding: 16px;
          }
        }

        @media (max-width: 520px) {
          .att-stat-grid {
            grid-template-columns: 1fr;
          }
          .att-header-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .att-header-actions {
            width: 100%;
          }
          .att-btn-gate-checkin,
          .att-btn-add {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>

      {/* TOP HEADER BAR */}
      <div className="att-header-bar">
        <div className="att-brand-area">
          <div className="att-brand-icon-box">
            <QrCode size={24} />
          </div>
          <div className="att-title-wrap">
            <h1>
              Leadership in Action Attendance
              <span className="att-live-pill">Live Event 2026</span>
            </h1>
            <p className="att-subtitle">
              Manage attendee registrations, gate check-in verification, code dispatch, and feedback status.
            </p>
          </div>
        </div>

        <div className="att-header-actions">
          <button
            type="button"
            className="att-btn-icon"
            onClick={() => window.location.reload()}
            title="Refresh Attendance List"
          >
            <RefreshCw size={17} />
          </button>

          {/* Quick Gate Check-In Modal Trigger (Matching User's Reference Button) */}
          <button
            type="button"
            className="att-btn-gate-checkin"
            onClick={() => {
              setQuickCheckInResult(null);
              setQuickCheckInCode('');
              setGateModalOpen(true);
            }}
          >
            <QrCode size={18} />
            <span>Gate Check-In</span>
          </button>

          {/* Add New Attendee */}
          <button
            type="button"
            className="att-btn-add"
            onClick={() => setAddModalOpen(true)}
          >
            <UserPlus size={17} />
            <span>+ Add Attendee</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            className="att-btn-export"
            onClick={handleExportCSV}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 5 METRIC STAT CARDS (Matching user's reference screenshot) */}
      <div className="att-stat-grid">
        {/* Card 1: Total Registered */}
        <div className="att-stat-card">
          <div>
            <div className="att-stat-label">TOTAL REGISTERED</div>
            <div className="att-stat-val">{totalRegistered}</div>
            <div className="att-stat-sub">Nominated attendees</div>
          </div>
          <div className="att-stat-badge-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
            <Users size={22} />
          </div>
        </div>

        {/* Card 2: Checked In Count */}
        <div className="att-stat-card">
          <div>
            <div className="att-stat-label">CHECKED IN</div>
            <div className="att-stat-val" style={{ color: '#16A34A' }}>{checkedInCount}</div>
            <div className="att-stat-sub">Verified at gate ({checkInRate}%)</div>
          </div>
          <div className="att-stat-badge-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Card 3: Unchecked In Count */}
        <div className="att-stat-card">
          <div>
            <div className="att-stat-label">UNCHECKED IN</div>
            <div className="att-stat-val" style={{ color: '#EA580C' }}>{uncheckInCount}</div>
            <div className="att-stat-sub">Pending arrival at venue</div>
          </div>
          <div className="att-stat-badge-icon" style={{ background: '#FFF1E8', color: '#EA580C' }}>
            <Clock size={22} />
          </div>
        </div>

        {/* Card 4: Feedback Fill Form Count */}
        <div className="att-stat-card">
          <div>
            <div className="att-stat-label">FEEDBACK SUBMITTED</div>
            <div className="att-stat-val" style={{ color: '#9333EA' }}>{feedbackCount}</div>
            <div className="att-stat-sub">Completed survey forms</div>
          </div>
          <div className="att-stat-badge-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}>
            <Star size={22} />
          </div>
        </div>

        {/* Card 5: Passcodes Dispatched */}
        <div className="att-stat-card">
          <div>
            <div className="att-stat-label">CODES DISPATCHED</div>
            <div className="att-stat-val" style={{ color: '#0284C7' }}>{passcodesSentCount}</div>
            <div className="att-stat-sub">Sent via WhatsApp / Email</div>
          </div>
          <div className="att-stat-badge-icon" style={{ background: '#E0F2FE', color: '#0284C7' }}>
            <Send size={22} />
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER TOOLBAR */}
      <div className="att-filter-toolbar">
        <div className="att-toolbar-top">
          {/* Search Box */}
          <div className="att-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by Name, Phone, Passcode (TAG26-...), Designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="att-search-input"
            />
          </div>

          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="att-filter-select"
          >
            <option value="ALL">All Departments</option>
            <option value="Operations">Operations</option>
            <option value="Manufacturing & Plant">Manufacturing & Plant</option>
            <option value="Sales & Customer Experience">Sales & Customer Experience</option>
            <option value="Finance & Accounts">Finance & Accounts</option>
            <option value="HR & Administration">HR & Administration</option>
            <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="att-filter-select"
          >
            <option value="ALL">All Gate Statuses</option>
            <option value="CHECKED_IN">Checked In Only</option>
            <option value="UNCHECKED">Pending Check-In</option>
            <option value="FEEDBACK">Feedback Filled</option>
          </select>
        </div>

        {/* Quick Filter Chips */}
        <div className="att-chips-row">
          <span className="att-chips-label">Quick Filter:</span>
          <button
            type="button"
            className={`att-filter-chip ${filterStatus === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterStatus('ALL')}
          >
            All Attendees <span className="att-chip-count">{totalRegistered}</span>
          </button>
          <button
            type="button"
            className={`att-filter-chip ${filterStatus === 'CHECKED_IN' ? 'active' : ''}`}
            onClick={() => setFilterStatus('CHECKED_IN')}
          >
            ✓ Checked In <span className="att-chip-count">{checkedInCount}</span>
          </button>
          <button
            type="button"
            className={`att-filter-chip ${filterStatus === 'UNCHECKED' ? 'active' : ''}`}
            onClick={() => setFilterStatus('UNCHECKED')}
          >
            ⏳ Pending Arrival <span className="att-chip-count">{uncheckInCount}</span>
          </button>
          <button
            type="button"
            className={`att-filter-chip ${filterStatus === 'FEEDBACK' ? 'active' : ''}`}
            onClick={() => setFilterStatus('FEEDBACK')}
          >
            ⭐ Feedback Done <span className="att-chip-count">{feedbackCount}</span>
          </button>
        </div>
      </div>

      {/* ATTENDEE ATTENDANCE TABLE */}
      <div className="att-table-card">
        <div className="att-table-container">
          <table className="att-table">
            <thead>
              <tr>
                <th>PASSCODE</th>
                <th>REG. DATE</th>
                <th>ATTENDEE</th>
                <th>CONTACT &amp; DISPATCH</th>
                <th>VERTICAL / DESIGNATION</th>
                <th>GATE STATUS</th>
                <th>CHECK-IN ACTION</th>
                <th>FEEDBACK</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px 20px', color: '#64748B' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>No attendees found</div>
                    <div style={{ fontSize: 13 }}>Try clearing filters or search query.</div>
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((a) => (
                  <tr key={a.id}>
                    {/* Passcode with Copy */}
                    <td>
                      <div
                        className="att-code-pill"
                        onClick={() => handleCopyCode(a.passCode)}
                        title="Click to copy passcode"
                      >
                        <span>{a.passCode}</span>
                        {copiedCode === a.passCode ? (
                          <Check size={13} color="#16A34A" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td style={{ color: '#64748B', fontSize: 12.5, whiteSpace: 'nowrap' }}>
                      {a.registeredAt}
                    </td>

                    {/* Attendee Name & Email */}
                    <td>
                      <div className="att-name-cell">
                        <span className="att-name-val">{a.fullName}</span>
                        <span className="att-email-val">{a.email || '—'}</span>
                      </div>
                    </td>

                    {/* Contact & Code Dispatch Buttons */}
                    <td>
                      <div className="att-contact-cell">
                        <span className="att-phone-val">{a.phone}</span>
                        <div className="att-dispatch-actions">
                          <button
                            type="button"
                            className="att-send-btn wa"
                            onClick={() => handleSendWhatsApp(a)}
                            title="Send passcode via WhatsApp"
                          >
                            <MessageCircle size={11} />
                            <span>{a.codeSentWhatsApp ? 'Resend' : 'Send'} WA</span>
                          </button>
                          <button
                            type="button"
                            className="att-send-btn mail"
                            onClick={() => handleSendEmail(a)}
                            title="Send passcode via Email"
                          >
                            <Mail size={11} />
                            <span>Mail</span>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Company & Designation */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5 }}>{a.designation}</span>
                        <span style={{ fontSize: 12, color: '#64748B' }}>{a.department} • {a.companyName}</span>
                      </div>
                    </td>

                    {/* Gate Status Badge */}
                    <td>
                      {a.isCheckedIn ? (
                        <div className="att-status-badge checked-in">
                          <CheckCircle2 size={13} />
                          <span>CHECKED IN</span>
                        </div>
                      ) : (
                        <div className="att-status-badge pending">
                          <Clock size={13} />
                          <span>PENDING</span>
                        </div>
                      )}
                    </td>

                    {/* Gate Check-In Action Button */}
                    <td>
                      {a.isCheckedIn ? (
                        <button
                          type="button"
                          className="att-btn-checkin-action done"
                          onClick={() => handleToggleCheckIn(a.id)}
                          title="Click to undo check-in if marked by mistake"
                        >
                          <Check size={14} />
                          <span>{a.checkInTime || 'Checked In'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="att-btn-checkin-action mark"
                          onClick={() => handleToggleCheckIn(a.id)}
                          title="Verify and check-in attendee at the gate"
                        >
                          <span>Mark Check-In</span>
                        </button>
                      )}
                    </td>

                    {/* Feedback Form Status Toggle */}
                    <td>
                      <button
                        type="button"
                        className={`att-feedback-toggle ${a.feedbackFilled ? 'filled' : 'unfilled'}`}
                        onClick={() => handleToggleFeedback(a.id)}
                        title="Click to toggle feedback status"
                      >
                        <Star size={13} />
                        <span>{a.feedbackFilled ? 'Filled (5★)' : 'Pending'}</span>
                      </button>
                    </td>

                    {/* View Details / Card */}
                    <td>
                      <button
                        type="button"
                        className="att-btn-icon"
                        style={{ width: 32, height: 32 }}
                        onClick={() => setDetailModalAttendee(a)}
                        title="View Pass & Nominee Details"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="att-table-footer">
          <span>
            Showing <strong>{filteredAttendees.length}</strong> of <strong>{totalRegistered}</strong> total registered attendees
          </span>
          <span>TAG Group Middle-Management Leadership Programme</span>
        </div>
      </div>

      {/* GATE CHECK-IN QUICK MODAL */}
      {gateModalOpen && (
        <div className="att-modal-backdrop" onClick={() => setGateModalOpen(false)}>
          <div className="att-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <h3>
                <QrCode size={20} color="#6366F1" />
                Gate Entrance Check-In
              </h3>
              <button
                type="button"
                className="att-modal-close-btn"
                onClick={() => setGateModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleQuickCheckInSubmit}>
              <div className="att-modal-body">
                <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 16px' }}>
                  Ask the attendee for their entry passcode (e.g. <strong>TAG26-001</strong>) or phone number to check them in at the gate.
                </p>

                <div className="att-form-group">
                  <label className="att-form-label">Scan or Enter Attendee Passcode / Mobile</label>
                  <input
                    type="text"
                    value={quickCheckInCode}
                    onChange={(e) => setQuickCheckInCode(e.target.value)}
                    placeholder="e.g. TAG26-003 or 9842188231"
                    className="att-form-input"
                    autoFocus
                  />
                </div>

                {quickCheckInResult && (
                  <div
                    style={{
                      padding: '14px 16px',
                      borderRadius: 12,
                      background: quickCheckInResult.success ? '#DCFCE7' : '#FEE2E2',
                      color: quickCheckInResult.success ? '#15803D' : '#DC2626',
                      fontSize: 13.5,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginTop: 14
                    }}
                  >
                    {quickCheckInResult.success ? (
                      <CheckCircle size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                    <div>{quickCheckInResult.message}</div>
                  </div>
                )}

                {quickCheckInResult?.attendee && (
                  <div
                    style={{
                      marginTop: 16,
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: 14,
                      padding: 16
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
                        {quickCheckInResult.attendee.fullName}
                      </span>
                      <span className="att-code-pill">{quickCheckInResult.attendee.passCode}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#64748B' }}>
                      {quickCheckInResult.attendee.designation} • {quickCheckInResult.attendee.department}
                    </div>
                    <div style={{ fontSize: 13, color: '#10B981', fontWeight: 700, marginTop: 6 }}>
                      ✓ Successfully Checked-In at {quickCheckInResult.attendee.checkInTime}
                    </div>
                  </div>
                )}
              </div>

              <div className="att-modal-footer">
                <button
                  type="button"
                  style={{
                    padding: '9px 18px',
                    borderRadius: 10,
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                  onClick={() => setGateModalOpen(false)}
                >
                  Done
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#6366F1',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  Verify &amp; Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW ATTENDEE MODAL */}
      {addModalOpen && (
        <div className="att-modal-backdrop" onClick={() => setAddModalOpen(false)}>
          <div className="att-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <h3>
                <UserPlus size={20} color="#0F172A" />
                Add New Middle-Management Nominee
              </h3>
              <button
                type="button"
                className="att-modal-close-btn"
                onClick={() => setAddModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddAttendeeSubmit}>
              <div className="att-modal-body">
                <div className="att-form-group">
                  <label className="att-form-label">Nominee Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S. Ramachandran"
                    value={newAttendee.fullName}
                    onChange={(e) => setNewAttendee({ ...newAttendee, fullName: e.target.value })}
                    className="att-form-input"
                  />
                </div>

                <div className="att-form-group">
                  <label className="att-form-label">WhatsApp / Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9842188231"
                    value={newAttendee.phone}
                    onChange={(e) => setNewAttendee({ ...newAttendee, phone: e.target.value })}
                    className="att-form-input"
                  />
                </div>

                <div className="att-form-group">
                  <label className="att-form-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. ramachandran.s@taggroup.in"
                    value={newAttendee.email}
                    onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                    className="att-form-input"
                  />
                </div>

                <div className="att-form-group">
                  <label className="att-form-label">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Assistant Operations Manager"
                    value={newAttendee.designation}
                    onChange={(e) => setNewAttendee({ ...newAttendee, designation: e.target.value })}
                    className="att-form-input"
                  />
                </div>

                <div className="att-form-group">
                  <label className="att-form-label">Department / Vertical</label>
                  <select
                    value={newAttendee.department}
                    onChange={(e) => setNewAttendee({ ...newAttendee, department: e.target.value })}
                    className="att-form-input"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Manufacturing & Plant">Manufacturing & Plant</option>
                    <option value="Sales & Customer Experience">Sales & Customer Experience</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="HR & Administration">HR & Administration</option>
                    <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                  </select>
                </div>
              </div>

              <div className="att-modal-footer">
                <button
                  type="button"
                  style={{
                    padding: '9px 18px',
                    borderRadius: 10,
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#E86014',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  Generate Pass &amp; Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ATTENDEE DETAIL PASS MODAL */}
      {detailModalAttendee && (
        <div className="att-modal-backdrop" onClick={() => setDetailModalAttendee(null)}>
          <div className="att-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <h3>Digital Attendance Pass</h3>
              <button
                type="button"
                className="att-modal-close-btn"
                onClick={() => setDetailModalAttendee(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="att-modal-body">
              {/* Event Badge Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0C1D36 0%, #1E3A8A 100%)',
                  borderRadius: 20,
                  padding: 24,
                  color: '#FFFFFF',
                  boxShadow: '0 10px 25px rgba(12, 29, 54, 0.25)',
                  marginBottom: 20
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#FBD38D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      WEGROW B SCHOOL • LEADERSHIP PROGRAMME
                    </span>
                    <h2 style={{ fontSize: 20, fontWeight: 800, margin: '4px 0 0' }}>
                      Leadership in Action
                    </h2>
                  </div>
                  <div
                    style={{
                      background: '#FFFFFF',
                      color: '#E86014',
                      padding: '4px 10px',
                      borderRadius: 8,
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      fontSize: 14
                    }}
                  >
                    {detailModalAttendee.passCode}
                  </div>
                </div>

                <div style={{ padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.15)', borderBottom: '1px solid rgba(255,255,255,0.15)', marginBottom: 16 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>{detailModalAttendee.fullName}</div>
                  <div style={{ fontSize: 13, color: '#93C5FD' }}>{detailModalAttendee.designation} • {detailModalAttendee.department}</div>
                  <div style={{ fontSize: 13, color: '#CBD5E1', marginTop: 4 }}>Company: {detailModalAttendee.companyName}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#93C5FD' }}>
                  <span>Venue: TAG Hall, Amathur</span>
                  <span>Time: 9:30 AM – 5:30 PM</span>
                </div>
              </div>

              {/* Status details */}
              <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B', fontSize: 13 }}>Gate Check-In:</span>
                  <span style={{ fontWeight: 700, color: detailModalAttendee.isCheckedIn ? '#16A34A' : '#D97706' }}>
                    {detailModalAttendee.isCheckedIn ? `✓ Checked In (${detailModalAttendee.checkInTime})` : 'Pending Check-In'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B', fontSize: 13 }}>Registered At:</span>
                  <span style={{ fontWeight: 700 }}>{detailModalAttendee.registeredAt}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: '#64748B', fontSize: 13 }}>Post-Event Feedback:</span>
                  <span style={{ fontWeight: 700, color: detailModalAttendee.feedbackFilled ? '#16A34A' : '#64748B' }}>
                    {detailModalAttendee.feedbackFilled ? '✓ Completed (5★)' : 'Not Submitted'}
                  </span>
                </div>
              </div>

              {/* Dispatch Links */}
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    height: 42,
                    borderRadius: 10,
                    border: 'none',
                    background: '#25D366',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSendWhatsApp(detailModalAttendee)}
                >
                  <MessageCircle size={16} /> Send via WhatsApp
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    height: 42,
                    borderRadius: 10,
                    border: 'none',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSendEmail(detailModalAttendee)}
                >
                  <Mail size={16} /> Send via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminAttendancePage;


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ClientData, User, SessionFeedback, BusinessUpdate } from '../types';
import { api } from '../services/api';

interface PortalContextType {
  user: User | null;
  client: ClientData | null;
  clients: Record<string, ClientData>;
  previewAs: string | null;
  theme: 'light' | 'dark' | 'system';
  collapsed: boolean;
  sidebarOpen: boolean;
  loading: boolean;
  toastMessage: string | null;
  login: (email: string, pass: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
  setTheme: (t: 'light' | 'dark' | 'system') => void;
  setCollapsed: (c: boolean) => void;
  setSidebarOpen: (o: boolean) => void;
  setPreviewAs: (cid: string | null) => void;
  updateClientProfile: (patch: Partial<ClientData>) => Promise<void>;
  submitFeedback: (fb: SessionFeedback) => Promise<void>;
  publishUpdate: (clientId: string, update: Partial<BusinessUpdate>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  addActionComment: (actionId: string, text: string) => Promise<void>;
  toggleEventRegistration: (eventId: string) => Promise<boolean>;
  isRegisteredForEvent: (eventId: string) => boolean;
  markUpdateRead: (updateId: string) => void;
  showToast: (msg: string) => void;
  refreshData: () => Promise<void>;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<ClientData | null>(null);
  const [clients, setClients] = useState<Record<string, ClientData>>({});
  const [previewAs, setPreviewAsState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    try {
      return (localStorage.getItem('wg:theme') as any) || 'system';
    } catch (e) {
      return 'system';
    }
  });

  const [collapsed, setCollapsedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('wg:collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.removeItem('wg:theme'); } catch (e) {}
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      try { localStorage.setItem('wg:theme', theme); } catch (e) {}
    }
  }, [theme]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Fetch client data dynamically from the backend
  const fetchClientData = useCallback(async (clientId: string) => {
    try {
      const data = await api.clients.getById(clientId);
      setClient(data);
      setClients((prev) => ({ ...prev, [clientId]: data }));
    } catch (err: any) {
      console.error('Failed to fetch client data:', err);
      showToast(err.message || 'Error loading client data');
    }
  }, []);

  // Fetch all clients dynamically for admin
  const fetchAdminClients = useCallback(async () => {
    try {
      const list = await api.clients.getAll();
      const map: Record<string, ClientData> = {};
      list.forEach((c) => {
        map[c.id || (c as any).clientId] = c;
      });
      setClients(map);
    } catch (err: any) {
      console.error('Failed to fetch admin clients:', err);
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (user?.role === 'admin') {
      await fetchAdminClients();
      if (previewAs) {
        await fetchClientData(previewAs);
      }
    } else if (user?.clientId) {
      await fetchClientData(user.clientId);
    }
  }, [user, previewAs, fetchAdminClients, fetchClientData]);

  // Restore authenticated session on mount
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      const token = localStorage.getItem('wg:token');
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const profile = await api.auth.getProfile();
        if (mounted && profile) {
          setUser(profile);
          if (profile.role === 'client' && profile.clientId) {
            await fetchClientData(profile.clientId);
          } else if (profile.role === 'admin') {
            await fetchAdminClients();
          }
        }
      } catch (err) {
        console.warn('Session expired or backend offline:', err);
        api.auth.logout();
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initSession();
    return () => {
      mounted = false;
    };
  }, [fetchClientData, fetchAdminClients]);

  // Handle client selection when previewing
  useEffect(() => {
    if (previewAs) {
      fetchClientData(previewAs);
    } else if (user?.role === 'admin') {
      setClient(null);
    }
  }, [previewAs, user, fetchClientData]);

  const login = async (email: string, pass: string, remember: boolean): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.auth.login(email, pass);
      setUser(res.user);
      setPreviewAsState(null);

      if (res.user.role === 'client' && res.user.clientId) {
        await fetchClientData(res.user.clientId);
      } else if (res.user.role === 'admin') {
        await fetchAdminClients();
      }

      setLoading(false);
      return true;
    } catch (err: any) {
      setLoading(false);
      showToast(err.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    setClient(null);
    setClients({});
    setPreviewAsState(null);
  };

  const setTheme = (t: 'light' | 'dark' | 'system') => {
    setThemeState(t);
  };

  const setCollapsed = (c: boolean) => {
    setCollapsedState(c);
    try {
      localStorage.setItem('wg:collapsed', String(c));
    } catch (e) {}
  };

  const setPreviewAs = (cid: string | null) => {
    setPreviewAsState(cid);
  };

  const updateClientProfile = async (patch: Partial<ClientData>) => {
    if (!client) return;
    try {
      const updated = await api.clients.updateProfile(client.id, patch);
      setClient(updated);
      setClients((prev) => ({ ...prev, [client.id]: updated }));
      showToast('Changes saved');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile');
    }
  };

  const submitFeedback = async (fb: SessionFeedback) => {
    if (!client) return;
    try {
      await api.portal.submitFeedback(client.id, fb);
      await fetchClientData(client.id);
      showToast('Feedback submitted — thank you');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit feedback');
    }
  };

  const publishUpdate = async (clientId: string, update: Partial<BusinessUpdate>) => {
    try {
      await api.portal.publishUpdate({
        clientId,
        title: update.title || 'Untitled Update',
        type: update.type || 'General Update',
        cat: update.cat || 'Operations',
        body: update.body || ''
      });
      await refreshData();
      showToast('Update published successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to publish update');
    }
  };

  const markNotificationRead = async (id: string) => {
    if (!client) return;
    try {
      await api.portal.markNotificationRead(client.id, id);
      setClient((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          notifications: prev.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
        };
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const markAllNotificationsRead = async () => {
    if (!client) return;
    try {
      await api.portal.markAllNotificationsRead(client.id);
      setClient((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          notifications: prev.notifications.map((n) => ({ ...n, read: true }))
        };
      });
      showToast('All notifications marked as read');
    } catch (err: any) {
      showToast(err.message || 'Failed to mark notifications read');
    }
  };

  const addActionComment = async (actionId: string, text: string) => {
    if (!client) return;
    try {
      await api.portal.addComment(client.id, actionId, text);
      await fetchClientData(client.id);
      showToast('Comment added');
    } catch (err: any) {
      showToast(err.message || 'Failed to add comment');
    }
  };

  const isRegisteredForEvent = (eventId: string): boolean => {
    if (!client) return false;
    const event = client.events?.find((e) => e.id === eventId);
    if (event && (event as any).registeredClientIds) {
      return (event as any).registeredClientIds.includes(client.id);
    }
    try {
      const reg: string[] = JSON.parse(localStorage.getItem(`wg:reg:${client.id}`) || '[]');
      return reg.includes(eventId);
    } catch (e) {
      return false;
    }
  };

  const toggleEventRegistration = async (eventId: string): Promise<boolean> => {
    if (!client) return false;
    try {
      const res = await api.portal.toggleEventRegistration(client.id, eventId);
      // Persist fallback flag
      let reg: string[] = JSON.parse(localStorage.getItem(`wg:reg:${client.id}`) || '[]');
      if (res.registered) {
        if (!reg.includes(eventId)) reg.push(eventId);
        showToast('You are registered');
      } else {
        reg = reg.filter((id) => id !== eventId);
        showToast('Registration cancelled');
      }
      localStorage.setItem(`wg:reg:${client.id}`, JSON.stringify(reg));
      await fetchClientData(client.id);
      return res.registered;
    } catch (err: any) {
      showToast(err.message || 'Failed to update event registration');
      return false;
    }
  };

  const markUpdateRead = (updateId: string) => {
    if (!client) return;
    const read = client.readUpdates || [];
    if (!read.includes(updateId)) {
      setClient((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          readUpdates: [...read, updateId]
        };
      });
    }
  };

  return (
    <PortalContext.Provider
      value={{
        user,
        client,
        clients,
        previewAs,
        theme,
        collapsed,
        sidebarOpen,
        loading,
        toastMessage,
        login,
        logout,
        setTheme,
        setCollapsed,
        setSidebarOpen,
        setPreviewAs,
        updateClientProfile,
        submitFeedback,
        publishUpdate,
        markNotificationRead,
        markAllNotificationsRead,
        addActionComment,
        toggleEventRegistration,
        isRegisteredForEvent,
        markUpdateRead,
        showToast,
        refreshData
      }}
    >
      {children}
      {toastMessage && (
        <div className="toast" role="status">
          {toastMessage}
        </div>
      )}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used within PortalProvider');
  return ctx;
};

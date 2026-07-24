import { create } from 'zustand';
import api from '../api/client.js';

const defaults = { highContrastMode: false, fontSize: 'Default', typography: 'Default', keyboardNav: false };
const readSettings = () => {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem('questlish-accessibility-settings') || '{}') }; }
  catch { return defaults; }
};
const cachedUser = () => {
  try { return JSON.parse(localStorage.getItem('questlish-user') || sessionStorage.getItem('questlish-user') || 'null'); }
  catch { return null; }
};
const settings = readSettings();

export const useQuestlishStore = create((set, get) => ({
  user: cachedUser(),
  authStatus: 'checking',
  authError: '',
  lessons: [],
  hearts: 5,
  ...settings,
  restoreSession: async () => {
    const token = localStorage.getItem('questlish-token') || sessionStorage.getItem('questlish-token');
    if (!token) return set({ user: null, authStatus: 'guest' });
    try {
      const { data } = await api.get('/auth/session');
      const storage = localStorage.getItem('questlish-token') ? localStorage : sessionStorage;
      storage.setItem('questlish-user', JSON.stringify(data));
      set({ user: data, authStatus: 'authenticated', authError: '' });
      await get().loadLessons();
    } catch {
      localStorage.removeItem('questlish-token'); sessionStorage.removeItem('questlish-token');
      localStorage.removeItem('questlish-user'); sessionStorage.removeItem('questlish-user');
      set({ user: null, authStatus: 'guest' });
    }
  },
  authenticate: async (mode, form, remember) => {
    set({ authStatus: 'loading', authError: '' });
    try {
      const payload = mode === 'login'
        ? { identifier: form.identifier, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const { data } = await api.post(`/auth/${mode}`, payload);
      const storage = remember ? localStorage : sessionStorage;
      const other = remember ? sessionStorage : localStorage;
      other.removeItem('questlish-token'); other.removeItem('questlish-user');
      storage.setItem('questlish-token', data.accessToken);
      storage.setItem('questlish-user', JSON.stringify(data.user));
      set({ user: data.user, authStatus: 'authenticated' });
      await get().loadLessons();
      return true;
    } catch (error) {
      const detail = error.response?.data?.detail;
      set({ authStatus: 'guest', authError: typeof detail === 'string' ? detail : 'We could not complete your request. Please try again.' });
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem('questlish-token'); sessionStorage.removeItem('questlish-token');
    localStorage.removeItem('questlish-user'); sessionStorage.removeItem('questlish-user');
    set({ user: null, lessons: [], authStatus: 'guest' });
  },
  loadLessons: async () => {
    try { const { data } = await api.get('/lessons/map'); set({ lessons: data }); } catch { set({ lessons: [] }); }
  },
  completeLesson: async (lessonId) => {
    const { data } = await api.post(`/lessons/${lessonId}/complete`);
    const user = { ...get().user, totalXp: data.totalXp, streakDays: data.streakDays };
    set({ user });
    const storage = localStorage.getItem('questlish-token') ? localStorage : sessionStorage;
    storage.setItem('questlish-user', JSON.stringify(user));
    await get().restoreSession();
  },
  decrementHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
  addXp: (amount) => set((state) => ({ user: state.user ? { ...state.user, totalXp: state.user.totalXp + amount } : null })),
  resetHearts: () => set({ hearts: 5 }),
  setHighContrastMode: (highContrastMode) => set({ highContrastMode }),
  setFontSize: (fontSize) => set({ fontSize }),
  setTypography: (typography) => set({ typography }),
  setKeyboardNav: (keyboardNav) => set({ keyboardNav }),
  toggleHighContrastMode: () => set((state) => ({ highContrastMode: !state.highContrastMode })),
}));

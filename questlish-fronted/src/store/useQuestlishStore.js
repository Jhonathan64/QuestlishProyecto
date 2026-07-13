import { create } from 'zustand';

const getStoredAccessibilitySettings = () => {
  if (typeof window === 'undefined') {
    return {
      highContrastMode: false,
      fontSize: 'Default',
      typography: 'Default',
      keyboardNav: false,
    };
  }

  try {
    const rawValue = window.localStorage.getItem('questlish-accessibility-settings');
    if (!rawValue) {
      return {
        highContrastMode: false,
        fontSize: 'Default',
        typography: 'Default',
        keyboardNav: false,
      };
    }

    const parsedValue = JSON.parse(rawValue);

    return {
      highContrastMode: Boolean(parsedValue.highContrastMode),
      fontSize: parsedValue.fontSize || 'Default',
      typography: parsedValue.typography || 'Default',
      keyboardNav: Boolean(parsedValue.keyboardNav),
    };
  } catch (error) {
    return {
      highContrastMode: false,
      fontSize: 'Default',
      typography: 'Default',
      keyboardNav: false,
    };
  }
};

const initialAccessibilitySettings = getStoredAccessibilitySettings();

export const useQuestlishStore = create((set) => ({
  xp: 120,
  hearts: 5,
  streak: 3,
  currentLesson: null,
  highContrastMode: initialAccessibilitySettings.highContrastMode,
  fontSize: initialAccessibilitySettings.fontSize,
  typography: initialAccessibilitySettings.typography,
  keyboardNav: initialAccessibilitySettings.keyboardNav,
  
  // Acciones para actualizar el estado
  decrementHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
  resetHearts: () => set({ hearts: 5 }),
  setHighContrastMode: (enabled) => set({ highContrastMode: enabled }),
  setFontSize: (fontSize) => set({ fontSize }),
  setTypography: (typography) => set({ typography }),
  setKeyboardNav: (keyboardNav) => set({ keyboardNav }),
  toggleHighContrastMode: () => set((state) => ({ highContrastMode: !state.highContrastMode })),
}));
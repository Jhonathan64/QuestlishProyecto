import api from './client';

export const questlishService = {
  // Obtener Perfil del Usuario
  getUserProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Obtener Mapa de Lecciones
  getLessonsMap: async () => {
    const response = await api.get('/lessons/map');
    return response.data;
  },

  // Completar Lección
  completeLesson: async (lessonId: string) => {
    const response = await api.post(`/lessons/${lessonId}/complete`);
    return response.data;
  },

  // Obtener Minijuegos
  getMiniGames: async (category?: string) => {
    const response = await api.get('/minigames', {
      params: category ? { category } : {},
    });
    return response.data;
  },

  // Verificar Respuesta del Minijuego
  verifyMiniGameAnswer: async (gameId: string, selectedIndex: number) => {
    const response = await api.post(`/minigames/${gameId}/verify`, { selectedIndex });
    return response.data;
  },
};
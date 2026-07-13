import api from './client'; // o la ruta a tu instancia configurada de Axios/Fetch

export const fetchMiniGames = async () => {
  const response = await api.get('/api/v1/minigames/');
  return response.data;
};

export const verifyAnswer = async (minigameId, selectedIndex) => {
  const response = await api.post('/api/v1/minigames/verify', {
    minigameId,
    selectedIndex,
    userId: 1
  });
  return response.data;
};
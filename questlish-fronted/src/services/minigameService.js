import api from '../api/client'; // Tu instancia de axios configurada con baseURL

export const fetchMiniGames = async () => {
  //  Cambiado de '/api/v1/minigames/' a '/minigames/'
  const response = await api.get('/minigames/');
  return response.data;
};

export const verifyAnswer = async (minigameId, selectedIndex) => {
  //  Cambiado de '/api/v1/minigames/verify' a '/minigames/verify'
  const response = await api.post('/minigames/verify', {
    minigameId,
    selectedIndex,
    userId: 1
  });
  return response.data;
};
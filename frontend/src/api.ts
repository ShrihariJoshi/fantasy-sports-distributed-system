import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (username: string, password: string) =>
    api.post('/register', { username, password }),
  
  login: (username: string, password: string) =>
    api.post('/login', { username, password }),
};

export const teamAPI = {
  addTeam: (token: string, username: string, match_id: string, team: Array<any>) =>
    api.post('/add_team', { username, match_id, team }, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
  
  getTeamScore: (token: string, username: string, matchid: string) =>
    api.get('/get_team', {
      params: { username, matchid },
      headers: { 'Authorization': `Bearer ${token}` }
    }),
};

export default api;

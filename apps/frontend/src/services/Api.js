const API_BASE = '/api';

export const Api = {

    async getLeaderboard() {
        const res = await fetch(`${API_BASE}/scores?limit=5`);
        return res.json();
    },

    async saveScore(playerName, score) {
        const res = await fetch(`${API_BASE}/scores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player_name: playerName, score })
        });
        return res.json();
    },

    async logGameSession(data) {
        return fetch(`${API_BASE}/games`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
};

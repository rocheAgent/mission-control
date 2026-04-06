/**
 * API Layer - Mission Control
 */

const API_BASE = '/api';

async function fetchJSON(endpoint, options) {
    try {
        const response = await fetch(API_BASE + endpoint, options);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return await response.json();
    } catch (error) {
        console.warn('API Error (' + endpoint + '):', error.message);
        return null;
    }
}

const API = {
    serverAvailable: false,
    
    async checkServer() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const response = await fetch(API_BASE + '/status', { signal: controller.signal });
            clearTimeout(timeoutId);
            this.serverAvailable = response.ok;
            return this.serverAvailable;
        } catch (e) {
            this.serverAvailable = false;
            return false;
        }
    },

    // Modelos
    async getModels() {
        const data = await fetchJSON('/models');
        return data || { available: [], configured: {} };
    },

    async setModel(agentId, modelId) {
        return await fetchJSON('/models/set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentId, modelId })
        });
    },

    // Tareas
    async assignTask(task) {
        return await fetchJSON('/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task })
        });
    },

    async completeTask(agentId) {
        return await fetchJSON('/tasks/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentId })
        });
    },

    async clearTasks() {
        return await fetchJSON('/tasks/clear', { method: 'POST' });
    },

    async getTasks() {
        return await fetchJSON('/tasks');
    },

    async getActivity() {
        return await fetchJSON('/activity');
    },

    async getSkills() {
        const data = await fetchJSON('/skills');
        return data || [];
    },

    async getAgents() {
        const data = await fetchJSON('/agents');
        return data || [];
    },

    async getSessions() {
        const data = await fetchJSON('/sessions');
        return data || [];
    },

    async getChats() {
        const data = await fetchJSON('/chats');
        return data || [];
    },

    async getMemoryFiles() {
        const data = await fetchJSON('/memory');
        return (data && data.length > 0) ? data : [];
    },

    async getConfig() {
        const data = await fetchJSON('/config');
        return data || { general: {} };
    },

    async getStats() {
        const data = await fetchJSON('/stats');
        return data || { activeSessions: 0, activeAgents: 0, pendingTasks: 0, uptime: 'running' };
    }
};

API.checkServer().then(function(available) {
    if (available) {
        console.log('Mission Control conectado');
    }
});
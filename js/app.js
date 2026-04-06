/**
 * Mission Control - App Principal
 * Vanilla JS SPA con hash routing
 */

const App = {
    currentView: 'dashboard',
    
    init() {
        this.bindEvents();
        this.handleRoute();
        this.startStatusUpdates();
    },

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.navigate(view);
            });
        });

        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('open');
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshCurrentView();
            });
        }

        // Hash change
        window.addEventListener('hashchange', () => this.handleRoute());
    },

    navigate(view) {
        window.location.hash = view;
    },

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'dashboard';
        this.currentView = hash;
        
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === hash);
        });

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            oficina: '🏢 Oficina',
            skills: 'Skills',
            agents: 'Agentes',
            chats: 'Chats',
            sessions: 'Sesiones',
            memory: 'Memoria',
            config: 'Configuración'
        };
        document.getElementById('page-title').textContent = titles[hash] || 'Dashboard';

        // Render view
        this.renderView(hash);
    },

    async renderView(view) {
        const content = document.getElementById('content');
        content.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

        try {
            switch (view) {
                case 'dashboard':
                    content.innerHTML = await Views.Dashboard.render();
                    break;
                case 'oficina':
                    content.innerHTML = await Views.Oficina.render();
                    Views.Oficina.startRealTimeUpdates();
                    break;
                case 'skills':
                    content.innerHTML = await Views.Skills.render();
                    break;
                case 'agents':
                    content.innerHTML = await Views.Agents.render();
                    break;
                case 'chats':
                    content.innerHTML = await Views.Chats.render();
                    break;
                case 'sessions':
                    content.innerHTML = await Views.Sessions.render();
                    break;
                case 'memory':
                    content.innerHTML = await Views.Memory.render();
                    break;
                case 'config':
                    content.innerHTML = await Views.Config.render();
                    break;
                default:
                    content.innerHTML = await Views.Dashboard.render();
            }
        } catch (error) {
            console.error('Error rendering view:', error);
            content.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Error cargando vista</h3><p>' + error.message + '</p></div>';
        }
    },

    refreshCurrentView() {
        this.renderView(this.currentView);
    },

    startStatusUpdates() {
        const checkAPI = async () => {
            const status = document.getElementById('connection-status');
            if (!status) return;
            try {
                const isOnline = await API.checkServer();
                status.className = 'status ' + (isOnline ? 'online' : 'offline');
                status.innerHTML = '● ' + (isOnline ? 'API Online' : 'API Offline');
            } catch (e) {
                status.className = 'status offline';
                status.innerHTML = '● API Offline';
            }
        };
        checkAPI();
        setInterval(checkAPI, 10000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
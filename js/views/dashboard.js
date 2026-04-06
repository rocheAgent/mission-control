/**
 * Dashboard View
 */

Views.Dashboard = {
    async render() {
        const stats = await API.getStats();
        const agents = await API.getAgents();
        const sessions = await API.getSessions();

        return `
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon blue">🔌</div>
                    <div class="stat-info">
                        <h3>Sesiones Activas</h3>
                        <p>${stats.activeSessions}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">💬</div>
                    <div class="stat-info">
                        <h3>Mensajes Hoy</h3>
                        <p>${stats.totalMessages}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">🎯</div>
                    <div class="stat-info">
                        <h3>Agentes Activos</h3>
                        <p>${stats.activeAgents}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon yellow">📋</div>
                    <div class="stat-info">
                        <h3>Skills Cargados</h3>
                        <p>${stats.skillsLoaded}</p>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">Agentes del Equipo</h3>
                    <a href="#agents" class="btn btn-secondary">Ver todos</a>
                </div>
                <div class="list-container">
                    ${agents.filter(a => a.status === 'active').slice(0, 3).map(agent => `
                        <div class="list-item">
                            <div class="item-icon" style="background: var(--bg-tertiary);">${agent.emoji}</div>
                            <div class="item-content">
                                <p class="item-title">${agent.name}</p>
                                <p class="item-subtitle">${agent.role}</p>
                            </div>
                            <span class="item-status status-active">Activo</span>
                        </div>
                    `).join('')}
                    ${agents.filter(a => a.status === 'active').length === 0 ? `
                        <div class="empty-state" style="padding: 2rem;">
                            <p>No hay agentes activos</p>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">Sesiones Recientes</h3>
                    <a href="#sessions" class="btn btn-secondary">Ver todas</a>
                </div>
                <div class="list-container">
                    ${sessions.slice(0, 3).map(session => `
                        <div class="list-item">
                            <div class="item-icon" style="background: var(--bg-tertiary);">
                                ${session.channel === 'webchat' ? '💻' : session.channel === 'discord' ? '💬' : '📱'}
                            </div>
                            <div class="item-content">
                                <p class="item-title">${session.channel} • ${session.type || 'session'}</p>
                                <p class="item-subtitle">Agente: ${session.agent}</p>
                            </div>
                            <span class="item-status ${session.status === 'active' ? 'status-active' : 'status-idle'}">
                                ${session.status === 'active' ? 'Activa' : 'Inactiva'}
                            </span>
                        </div>
                    `).join('')}
                    ${sessions.length === 0 ? `
                        <div class="empty-state" style="padding: 2rem;">
                            <p>No hay sesiones</p>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">Sistema</h3>
                </div>
                <div class="card-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon green">✅</div>
                            <div>
                                <p class="card-title">Estado</p>
                                <p class="card-value" style="font-size: 1.2rem;">Operativo</p>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon blue">🧠</div>
                            <div>
                                <p class="card-title">Modelo</p>
                                <p class="card-value" style="font-size: 1rem;">kimi-k2.5</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
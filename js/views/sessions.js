/**
 * Sessions View
 */

Views.Sessions = {
    async render() {
        const sessions = await API.getSessions();

        const channelIcons = {
            webchat: '💻',
            discord: '💬',
            telegram: '📱',
            slack: '💼',
            whatsapp: '💬'
        };

        return `
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon green">●</div>
                    <div class="stat-info">
                        <h3>Activas</h3>
                        <p>${sessions.filter(s => s.status === 'active').length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon yellow">●</div>
                    <div class="stat-info">
                        <h3>Inactivas</h3>
                        <p>${sessions.filter(s => s.status === 'idle').length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">💬</div>
                    <div class="stat-info">
                        <h3>Total Mensajes</h3>
                        <p>${sessions.reduce((sum, s) => sum + (s.messages || 0), 0)}</p>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">Sesiones</h3>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Canal</th>
                                <th>Tipo</th>
                                <th>Agente</th>
                                <th>Estado</th>
                                <th>Mensajes</th>
                                <th>Iniciada</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sessions.length > 0 ? sessions.map(session => `
                                <tr>
                                    <td><code style="background: var(--bg-tertiary); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">${(session.id || session.sessionId || 'unknown').slice(0, 12)}...</code></td>
                                    <td>
                                        <span style="display: flex; align-items: center; gap: 0.5rem;">
                                            <span>${channelIcons[session.channel] || '📡'}</span>
                                            ${session.channel || 'unknown'}
                                        </span>
                                    </td>
                                    <td>${session.type || 'session'}</td>
                                    <td>${session.agent || '-'}</td>
                                    <td>
                                        <span class="item-status ${session.status === 'active' ? 'status-active' : 'status-idle'}">
                                            ${session.status === 'active' ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                    <td>${session.messages || 0}</td>
                                    <td style="color: var(--text-secondary);">${session.started ? (typeof session.started === 'string' ? session.started.slice(0, 16) : new Date(session.started).toLocaleString()) : '-'}</td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                                        No hay sesiones activas
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
};
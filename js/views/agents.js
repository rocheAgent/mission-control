/**
 * Agents View
 */

Views.Agents = {
    async render() {
        const agents = await API.getAgents();

        const statusCounts = agents.reduce((acc, agent) => {
            acc[agent.status] = (acc[agent.status] || 0) + 1;
            return acc;
        }, {});

        return `
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon green">●</div>
                    <div class="stat-info">
                        <h3>Activos</h3>
                        <p>${statusCounts.active || 0}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon yellow">●</div>
                    <div class="stat-info">
                        <h3>Inactivos</h3>
                        <p>${statusCounts.idle || 0}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red">●</div>
                    <div class="stat-info">
                        <h3>Offline</h3>
                        <p>${statusCounts.offline || 0}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">📋</div>
                    <div class="stat-info">
                        <h3>Total</h3>
                        <p>${agents.length}</p>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">Todos los Agentes</h3>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Agente</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Tareas</th>
                                <th>Última Actividad</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${agents.map(agent => `
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <span style="font-size: 1.25rem;">${agent.emoji}</span>
                                            <span style="font-weight: 500;">${agent.name}</span>
                                        </div>
                                    </td>
                                    <td>${agent.role}</td>
                                    <td>
                                        <span class="item-status status-${agent.status}">
                                            ${agent.status === 'active' ? 'Activo' : agent.status === 'idle' ? 'Inactivo' : 'Offline'}
                                        </span>
                                    </td>
                                    <td>${agent.tasks || 0}</td>
                                    <td style="color: var(--text-secondary);">${agent.lastActive || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
};
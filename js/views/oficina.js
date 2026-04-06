/**
 * Oficina View - Visualización 2D con modelos
 */

Views.Oficina = {
    agentStates: {},
    updateInterval: null,
    
    async render() {
        const agents = await API.getAgents();
        
        this.agentStates = {};
        agents.forEach(agent => {
            this.agentStates[agent.id] = {
                ...agent,
                working: agent.status === 'active'
            };
        });

        const assignedByLarry = Object.values(this.agentStates).filter(a => a.id !== 'larry' && a.working);

        return `
            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">🏢 Oficina del Equipo</h3>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span class="status online">● Tiempo Real</span>
                        <button class="btn btn-secondary" onclick="Views.Oficina.refresh()">🔄</button>
                    </div>
                </div>
                
                <!-- Instrucciones -->
                <div class="info-banner">
                    <p>💡 <strong>Tú → Larry → Agentes</strong>. Larry distribuye automáticamente según la tarea.</p>
                    <code>curl -X POST http://localhost:8080/api/task -d '{"task":"Crear dashboard con UI, API y tests"}'</code>
                </div>

                <!-- Flujo -->
                <div class="flow-summary">
                    <div class="flow-step active">
                        <span class="flow-icon">👤</span>
                        <span class="flow-label">Misael</span>
                    </div>
                    <span class="flow-arrow">→</span>
                    <div class="flow-step active">
                        <span class="flow-icon">🎯</span>
                        <span class="flow-label">Larry</span>
                        <span class="flow-model">${this.agentStates.larry?.model?.name || 'Kimi K2.5'}</span>
                    </div>
                    <span class="flow-arrow">→</span>
                    <div class="flow-step ${assignedByLarry.length > 0 ? 'active' : ''}">
                        <span class="flow-icon">👥</span>
                        <span class="flow-label">Agentes</span>
                        <span class="flow-action">${assignedByLarry.length} trabajando</span>
                    </div>
                </div>
                
                <!-- Oficina -->
                <div class="office-container">
                    <!-- Larry -->
                    <div class="office-room conference">
                        <div class="room-label">Centro de Comando - Larry</div>
                        <div class="agent-desk active larry-desk">
                            <div class="desk-surface">
                                <div class="monitor">
                                    <div class="screen screen-active larry-screen">
                                        <div class="larry-tasks">${this.agentStates.larry?.current || 'Esperando...'}</div>
                                    </div>
                                </div>
                                <div class="desk-items">
                                    <div class="coffee-cup"></div>
                                    <div class="notepad"></div>
                                </div>
                            </div>
                            <div class="agent-avatar working">
                                <span class="agent-emoji">🎯</span>
                                <div class="status-indicator pulse"></div>
                            </div>
                            <div class="agent-name">Larry</div>
                            <div class="agent-role">PM / Orchestrator</div>
                            <div class="model-badge" style="background: ${this.agentStates.larry?.model?.color || '#6366f1'}20; color: ${this.agentStates.larry?.model?.color || '#6366f1'}; border: 1px solid ${this.agentStates.larry?.model?.color || '#6366f1'}50;">
                                ${this.agentStates.larry?.model?.name || 'Kimi K2.5'}
                            </div>
                            <div class="agent-task active" id="task-larry">${this.agentStates.larry?.current || 'Esperando tareas'}</div>
                            ${assignedByLarry.length > 0 ? `
                                <div class="larry-distributing">
                                    <span class="distributing-label">→ Distribuyendo a:</span>
                                    <div class="distributed-agents">
                                        ${assignedByLarry.map(a => `<span class="agent-badge ${a.id}">${a.emoji} ${a.id}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="section-divider"><span>Agentes de Trabajo</span></div>

                    <!-- Row 1 -->
                    <div class="office-row">
                        <div class="work-station ${this.agentStates.architect?.working ? 'active' : ''}" data-agent="architect">
                            <div class="station-desk">
                                <div class="monitor">
                                    <div class="screen ${this.agentStates.architect?.working ? 'screen-active' : ''}">
                                        ${this.agentStates.architect?.working ? '<div class="work-animation architect-anim"></div>' : '<div class="idle-screen"></div>'}
                                    </div>
                                </div>
                                <div class="agent-avatar ${this.agentStates.architect?.working ? 'working' : ''}">
                                    <span class="agent-emoji">🏗️</span>
                                    <div class="status-indicator ${this.agentStates.architect?.working ? 'pulse' : ''}"></div>
                                </div>
                                <div class="agent-name">Architect</div>
                                <div class="agent-task ${this.agentStates.architect?.working ? 'active' : ''}" id="task-architect">
                                    ${this.agentStates.architect?.current || 'Disponible'}
                                </div>
                                <div class="model-badge" style="background: ${this.agentStates.architect?.model?.color || '#3b82f6'}20; color: ${this.agentStates.architect?.model?.color || '#3b82f6'}; border: 1px solid ${this.agentStates.architect?.model?.color || '#3b82f6'}50;">
                                    ${this.agentStates.architect?.model?.name || 'GLM-5'}
                                </div>
                                ${this.agentStates.architect?.working ? '<div class="working-indicator">⬤ Trabajando</div>' : ''}
                            </div>
                        </div>

                        <div class="work-station ${this.agentStates.backend?.working ? 'active' : ''}" data-agent="backend">
                            <div class="station-desk">
                                <div class="monitor">
                                    <div class="screen ${this.agentStates.backend?.working ? 'screen-active' : ''}">
                                        ${this.agentStates.backend?.working ? '<div class="work-animation backend-anim"></div>' : '<div class="idle-screen"></div>'}
                                    </div>
                                </div>
                                <div class="agent-avatar ${this.agentStates.backend?.working ? 'working' : ''}">
                                    <span class="agent-emoji">⚙️</span>
                                    <div class="status-indicator ${this.agentStates.backend?.working ? 'pulse' : ''}"></div>
                                </div>
                                <div class="agent-name">Backend</div>
                                <div class="agent-task ${this.agentStates.backend?.working ? 'active' : ''}" id="task-backend">
                                    ${this.agentStates.backend?.current || 'Disponible'}
                                </div>
                                <div class="model-badge" style="background: ${this.agentStates.backend?.model?.color || '#3b82f6'}20; color: ${this.agentStates.backend?.model?.color || '#3b82f6'}; border: 1px solid ${this.agentStates.backend?.model?.color || '#3b82f6'}50;">
                                    ${this.agentStates.backend?.model?.name || 'GLM-5'}
                                </div>
                                ${this.agentStates.backend?.working ? '<div class="working-indicator">⬤ Trabajando</div>' : ''}
                            </div>
                        </div>

                        <div class="work-station ${this.agentStates.database?.working ? 'active' : ''}" data-agent="database">
                            <div class="station-desk">
                                <div class="monitor">
                                    <div class="screen ${this.agentStates.database?.working ? 'screen-active' : ''}">
                                        ${this.agentStates.database?.working ? '<div class="work-animation database-anim"></div>' : '<div class="idle-screen"></div>'}
                                    </div>
                                </div>
                                <div class="agent-avatar ${this.agentStates.database?.working ? 'working' : ''}">
                                    <span class="agent-emoji">🗄️</span>
                                    <div class="status-indicator ${this.agentStates.database?.working ? 'pulse' : ''}"></div>
                                </div>
                                <div class="agent-name">Database</div>
                                <div class="agent-task ${this.agentStates.database?.working ? 'active' : ''}" id="task-database">
                                    ${this.agentStates.database?.current || 'Disponible'}
                                </div>
                                <div class="model-badge" style="background: ${this.agentStates.database?.model?.color || '#22c55e'}20; color: ${this.agentStates.database?.model?.color || '#22c55e'}; border: 1px solid ${this.agentStates.database?.model?.color || '#22c55e'}50;">
                                    ${this.agentStates.database?.model?.name || 'MiniMax M2.5'}
                                </div>
                                ${this.agentStates.database?.working ? '<div class="working-indicator">⬤ Trabajando</div>' : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Row 2 -->
                    <div class="office-row">
                        <div class="work-station ${this.agentStates.frontend?.working ? 'active' : ''}" data-agent="frontend">
                            <div class="station-desk">
                                <div class="monitor">
                                    <div class="screen ${this.agentStates.frontend?.working ? 'screen-active' : ''}">
                                        ${this.agentStates.frontend?.working ? '<div class="work-animation frontend-anim"></div>' : '<div class="idle-screen"></div>'}
                                    </div>
                                </div>
                                <div class="agent-avatar ${this.agentStates.frontend?.working ? 'working' : ''}">
                                    <span class="agent-emoji">🎨</span>
                                    <div class="status-indicator ${this.agentStates.frontend?.working ? 'pulse' : ''}"></div>
                                </div>
                                <div class="agent-name">Frontend</div>
                                <div class="agent-task ${this.agentStates.frontend?.working ? 'active' : ''}" id="task-frontend">
                                    ${this.agentStates.frontend?.current || 'Disponible'}
                                </div>
                                <div class="model-badge" style="background: ${this.agentStates.frontend?.model?.color || '#6366f1'}20; color: ${this.agentStates.frontend?.model?.color || '#6366f1'}; border: 1px solid ${this.agentStates.frontend?.model?.color || '#6366f1'}50;">
                                    ${this.agentStates.frontend?.model?.name || 'Kimi K2.5'}
                                </div>
                                ${this.agentStates.frontend?.working ? '<div class="working-indicator">⬤ Trabajando</div>' : ''}
                            </div>
                        </div>

                        <div class="work-station ${this.agentStates.qa?.working ? 'active' : ''}" data-agent="qa">
                            <div class="station-desk">
                                <div class="monitor">
                                    <div class="screen ${this.agentStates.qa?.working ? 'screen-active' : ''}">
                                        ${this.agentStates.qa?.working ? '<div class="work-animation qa-anim"></div>' : '<div class="idle-screen"></div>'}
                                    </div>
                                </div>
                                <div class="agent-avatar ${this.agentStates.qa?.working ? 'working' : ''}">
                                    <span class="agent-emoji">🔍</span>
                                    <div class="status-indicator ${this.agentStates.qa?.working ? 'pulse' : ''}"></div>
                                </div>
                                <div class="agent-name">QA</div>
                                <div class="agent-task ${this.agentStates.qa?.working ? 'active' : ''}" id="task-qa">
                                    ${this.agentStates.qa?.current || 'Disponible'}
                                </div>
                                <div class="model-badge" style="background: ${this.agentStates.qa?.model?.color || '#22c55e'}20; color: ${this.agentStates.qa?.model?.color || '#22c55e'}; border: 1px solid ${this.agentStates.qa?.model?.color || '#22c55e'}50;">
                                    ${this.agentStates.qa?.model?.name || 'MiniMax M2.5'}
                                </div>
                                ${this.agentStates.qa?.working ? '<div class="working-indicator">⬤ Trabajando</div>' : ''}
                            </div>
                        </div>

                        <div class="work-station ${this.agentStates.devops?.working ? 'active' : ''}" data-agent="devops">
                            <div class="station-desk">
                                <div class="monitor">
                                    <div class="screen ${this.agentStates.devops?.working ? 'screen-active' : ''}">
                                        ${this.agentStates.devops?.working ? '<div class="work-animation devops-anim"></div>' : '<div class="idle-screen"></div>'}
                                    </div>
                                </div>
                                <div class="agent-avatar ${this.agentStates.devops?.working ? 'working' : ''}">
                                    <span class="agent-emoji">🚀</span>
                                    <div class="status-indicator ${this.agentStates.devops?.working ? 'pulse' : ''}"></div>
                                </div>
                                <div class="agent-name">DevOps</div>
                                <div class="agent-task ${this.agentStates.devops?.working ? 'active' : ''}" id="task-devops">
                                    ${this.agentStates.devops?.current || 'Disponible'}
                                </div>
                                <div class="model-badge" style="background: ${this.agentStates.devops?.model?.color || '#22c55e'}20; color: ${this.agentStates.devops?.model?.color || '#22c55e'}; border: 1px solid ${this.agentStates.devops?.model?.color || '#22c55e'}50;">
                                    ${this.agentStates.devops?.model?.name || 'MiniMax M2.5'}
                                </div>
                                ${this.agentStates.devops?.working ? '<div class="working-indicator">⬤ Trabajando</div>' : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Legend -->
                    <div class="office-legend">
                        <div class="legend-item">
                            <div class="legend-dot active"></div>
                            <span>Trabajando</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot idle"></div>
                            <span>Disponible</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    async refresh() {
        const content = document.getElementById('content');
        content.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        content.innerHTML = await this.render();
        this.startRealTimeUpdates();
    },
    
    startRealTimeUpdates() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        
        this.updateInterval = setInterval(async () => {
            const agents = await API.getAgents();
            
            agents.forEach(agent => {
                const taskEl = document.getElementById('task-' + agent.id);
                const stationEl = document.querySelector('[data-agent="' + agent.id + '"]');
                const avatarEl = stationEl?.querySelector('.agent-avatar');
                const indicatorEl = stationEl?.querySelector('.status-indicator');
                const screenEl = stationEl?.querySelector('.screen');
                const workIndEl = stationEl?.querySelector('.working-indicator');
                
                if (taskEl) {
                    taskEl.textContent = agent.current || 'Disponible';
                    taskEl.className = 'agent-task' + (agent.status === 'active' ? ' active' : '');
                }
                
                if (stationEl) {
                    stationEl.className = 'work-station' + (agent.status === 'active' ? ' active' : '');
                }
                
                if (avatarEl) {
                    avatarEl.className = 'agent-avatar' + (agent.status === 'active' ? ' working' : '');
                }
                
                if (indicatorEl) {
                    indicatorEl.className = 'status-indicator' + (agent.status === 'active' ? ' pulse' : '');
                }
                
                if (screenEl) {
                    screenEl.className = 'screen' + (agent.status === 'active' ? ' screen-active' : '');
                    if (agent.status === 'active' && !screenEl.querySelector('.work-animation')) {
                        screenEl.innerHTML = '<div class="work-animation ' + agent.id + '-anim"></div>';
                    } else if (agent.status !== 'active' && !screenEl.querySelector('.idle-screen')) {
                        screenEl.innerHTML = '<div class="idle-screen"></div>';
                    }
                }
                
                if (workIndEl) {
                    workIndEl.style.display = agent.status === 'active' ? 'block' : 'none';
                }
            });
            
            const larryTaskEl = document.getElementById('task-larry');
            if (larryTaskEl && agents.find(a => a.id === 'larry')) {
                const larry = agents.find(a => a.id === 'larry');
                larryTaskEl.textContent = larry.current || 'Esperando tareas';
            }
        }, 3000);
    }
};
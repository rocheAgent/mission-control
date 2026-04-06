/**
 * Config View - Configuración de agentes y modelos
 */

Views.Config = {
    models: [],
    agentConfigs: {},
    
    async render() {
        // Fetch models and current config
        const [modelsRes, agentsRes] = await Promise.all([
            fetch('/api/models').then(r => r.json()).catch(() => ({ available: [], configured: {} })),
            fetch('/api/agents').then(r => r.json()).catch(() => [])
        ]);
        
        this.models = modelsRes.available || [];
        this.agentConfigs = {};
        (agentsRes || []).forEach(a => {
            this.agentConfigs[a.id] = a.model || {};
        });

        const modelOptions = this.models.map(m => 
            `<option value="${m.id}">${m.name} (${m.provider})</option>`
        ).join('');

        return `
            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">🤖 Modelos por Agente</h3>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem;">
                    Asigna el modelo de IA que cada agente usará para trabajar.
                </p>
                
                <div class="config-grid">
                    ${(agentsRes || []).map(agent => `
                        <div class="config-card">
                            <div class="config-card-header">
                                <span class="agent-icon">${agent.emoji}</span>
                                <div class="agent-info">
                                    <span class="agent-name">${agent.name}</span>
                                    <span class="agent-role">${agent.role}</span>
                                </div>
                                <span class="model-indicator" style="background: ${agent.model?.color || '#6366f1'}20; color: ${agent.model?.color || '#6366f1'};">
                                    ${agent.model?.name || 'Sin modelo'}
                                </span>
                            </div>
                            <div class="config-card-body">
                                <label class="config-label">Modelo:</label>
                                <select class="config-select" id="model-${agent.id}" 
                                    style="border-color: ${agent.model?.color || '#6366f1'}50;"
                                    onchange="Views.Config.changeModel('${agent.id}', this.value)">
                                    ${this.models.map(m => `
                                        <option value="${m.id}" ${agent.model?.id === m.id ? 'selected' : ''}>
                                            ${m.name} (${m.provider})
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">📋 Modelos Disponibles</h3>
                </div>
                <div class="models-list">
                    ${this.models.map(m => `
                        <div class="model-card" style="border-left: 3px solid ${m.id.includes('kimi') ? '#6366f1' : m.id.includes('glm') ? '#3b82f6' : '#22c55e'};">
                            <div class="model-card-header">
                                <span class="model-name">${m.name}</span>
                                <span class="model-provider">${m.provider}</span>
                            </div>
                            <div class="model-id">${m.id}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">⚙️ Configuración General</h3>
                </div>
                <div class="card" style="max-width: 600px;">
                    <form>
                        <div class="form-group">
                            <label>Nombre del Agente Principal</label>
                            <input type="text" value="Larry" disabled />
                        </div>
                        <div class="form-group">
                            <label>Idioma</label>
                            <select disabled>
                                <option value="es" selected>Español</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Zona Horaria</label>
                            <input type="text" value="America/Tijuana" disabled />
                        </div>
                    </form>
                </div>
            </div>

            <div class="config-actions">
                <button class="btn btn-secondary" onclick="Views.Config.refresh()">↻ Recargar</button>
                <button class="btn btn-primary" onclick="Views.Config.saveAll()">💾 Guardar Cambios</button>
            </div>
        `;
    },
    
    async changeModel(agentId, modelId) {
        try {
            const response = await fetch('/api/models/set', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agentId, modelId })
            });
            const result = await response.json();
            
            if (result.success) {
                // Update indicator color
                const indicator = document.querySelector(`#model-${agentId}`).parentElement.querySelector('.model-indicator');
                if (indicator && result.model) {
                    indicator.style.background = result.model.color + '20';
                    indicator.style.color = result.model.color;
                    indicator.textContent = result.model.name;
                }
                
                // Update select border
                const select = document.getElementById('model-' + agentId);
                if (select && result.model) {
                    select.style.borderColor = result.model.color + '50';
                }
                
                console.log('Modelo actualizado:', result);
            }
        } catch (e) {
            console.error('Error cambiando modelo:', e);
        }
    },
    
    async saveAll() {
        alert('Configuración guardada (los cambios son en tiempo real)');
    },
    
    async refresh() {
        const content = document.getElementById('content');
        content.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        content.innerHTML = await this.render();
    }
};
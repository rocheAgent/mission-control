/**
 * Skills View
 */

Views.Skills = {
    async render() {
        const skills = await API.getSkills();
        
        const categories = {
            flow: 'Flujos de Trabajo',
            agent: 'Agentes',
            integration: 'Integraciones',
            system: 'Sistema',
            dev: 'Desarrollo',
            utility: 'Utilidades'
        };

        const skillsByCategory = skills.reduce((acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = [];
            acc[skill.category].push(skill);
            return acc;
        }, {});

        return `
            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">Skills Disponibles (${skills.length})</h3>
                </div>
                
                ${Object.entries(skillsByCategory).map(([category, catSkills]) => `
                    <div class="section" style="margin-bottom: 2rem;">
                        <h4 style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem; text-transform: uppercase;">
                            ${categories[category] || category}
                        </h4>
                        <div class="card-grid">
                            ${catSkills.map(skill => `
                                <div class="card">
                                    <div class="card-header">
                                        <div class="item-icon" style="background: var(--bg-tertiary); width: 48px; height: 48px;">
                                            ${skill.enabled ? '✅' : '⏸️'}
                                        </div>
                                        <div style="flex: 1;">
                                            <p class="item-title">${skill.name}</p>
                                            <p class="item-subtitle">${skill.id}</p>
                                        </div>
                                    </div>
                                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
                                        ${skill.description}
                                    </p>
                                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                                        <span class="badge badge-skill">${skill.category}</span>
                                        <span class="badge ${skill.enabled ? 'badge-agent' : 'badge-session'}">
                                            ${skill.enabled ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};
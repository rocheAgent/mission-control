/**
 * Memory View
 */

Views.Memory = {
    async render() {
        const files = await API.getMemoryFiles();

        return `
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon purple">🧠</div>
                    <div class="stat-info">
                        <h3>Archivos de Memoria</h3>
                        <p>${files.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">📝</div>
                    <div class="stat-info">
                        <h3>Notas Diarias</h3>
                        <p>${files.filter(f => f.type === 'daily').length}</p>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">Archivos de Memoria</h3>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Tamaño</th>
                                <th>Modificado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${files.length > 0 ? files.map(file => `
                                <tr>
                                    <td>
                                        <span style="display: flex; align-items: center; gap: 0.5rem;">
                                            <span>${file.type === 'long-term' ? '🧠' : '📝'}</span>
                                            <span style="font-weight: 500;">${file.name}</span>
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge ${file.type === 'long-term' ? 'badge-skill' : 'badge-session'}">
                                            ${file.type === 'long-term' ? 'Largo plazo' : 'Diaria'}
                                        </span>
                                    </td>
                                    <td>${file.size}</td>
                                    <td style="color: var(--text-secondary);">${file.modified}</td>
                                    <td>
                                        <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">Ver</button>
                                    </td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                                        No hay archivos de memoria. Los archivos se crean automáticamente cuando el agente escribe notas.
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">Información</h3>
                </div>
                <div class="card-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon purple">🧠</div>
                            <div>
                                <p class="card-title">Memoria Largo Plazo</p>
                                <p class="card-value" style="font-size: 1rem;">MEMORY.md</p>
                            </div>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
                            Memoria curada que persiste entre sesiones. Contiene decisiones importantes, preferencias y contexto clave del usuario.
                        </p>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon blue">📝</div>
                            <div>
                                <p class="card-title">Notas Diarias</p>
                                <p class="card-value">${files.filter(f => f.type === 'daily').length}</p>
                            </div>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
                            Logs diarios de actividad. Raw notes que luego se curan y consolidan en la memoria de largo plazo.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
};
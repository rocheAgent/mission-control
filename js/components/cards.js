/**
 * Reusable Components
 */

const Components = {
    // Stat Card Component
    statCard({ icon, iconColor, label, value }) {
        const colors = {
            blue: 'rgba(59, 130, 246, 0.2)',
            green: 'rgba(34, 197, 94, 0.2)',
            yellow: 'rgba(245, 158, 11, 0.2)',
            purple: 'rgba(168, 85, 247, 0.2)',
            red: 'rgba(239, 68, 68, 0.2)'
        };

        return `
            <div class="stat-card">
                <div class="stat-icon" style="background: ${colors[iconColor] || colors.blue}">${icon}</div>
                <div class="stat-info">
                    <h3>${label}</h3>
                    <p>${value}</p>
                </div>
            </div>
        `;
    },

    // List Item Component
    listItem({ icon, title, subtitle, status, statusClass }) {
        return `
            <div class="list-item">
                <div class="item-icon" style="background: var(--bg-tertiary);">${icon}</div>
                <div class="item-content">
                    <p class="item-title">${title}</p>
                    <p class="item-subtitle">${subtitle}</p>
                </div>
                ${status ? `<span class="item-status ${statusClass}">${status}</span>` : ''}
            </div>
        `;
    },

    // Info Card Component
    infoCard({ icon, iconColor, title, value, description }) {
        const colors = {
            blue: 'rgba(59, 130, 246, 0.2)',
            green: 'rgba(34, 197, 94, 0.2)',
            yellow: 'rgba(245, 158, 11, 0.2)',
            purple: 'rgba(168, 85, 247, 0.2)',
            red: 'rgba(239, 68, 68, 0.2)'
        };

        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-icon ${iconColor}">${icon}</div>
                    <div>
                        <p class="card-title">${title}</p>
                        <p class="card-value">${value}</p>
                    </div>
                </div>
                ${description ? `<p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">${description}</p>` : ''}
            </div>
        `;
    },

    // Badge Component
    badge({ text, type = 'default' }) {
        const classes = {
            skill: 'badge-skill',
            agent: 'badge-agent',
            session: 'badge-session',
            default: ''
        };

        return `<span class="badge ${classes[type]}">${text}</span>`;
    },

    // Empty State Component
    emptyState({ icon = '📭', title = 'Sin contenido', message = 'No hay elementos para mostrar' }) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">${icon}</div>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    },

    // Section Header Component
    sectionHeader({ title, action = '' }) {
        return `
            <div class="section-header">
                <h3 class="section-title">${title}</h3>
                ${action}
            </div>
        `;
    }
};

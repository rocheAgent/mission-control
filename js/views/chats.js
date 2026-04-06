/**
 * Chats View
 */

Views.Chats = {
    async render() {
        const chats = await API.getChats();
        const unreadCount = chats.filter(c => c.unread > 0).length;

        return `
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon blue">💬</div>
                    <div class="stat-info">
                        <h3>Conversaciones</h3>
                        <p>${chats.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon yellow">🔔</div>
                    <div class="stat-info">
                        <h3>Sin Leer</h3>
                        <p>${unreadCount}</p>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">Chats Recientes</h3>
                </div>
                <div class="list-container">
                    ${chats.length > 0 ? chats.map(chat => `
                        <div class="list-item" style="cursor: pointer;">
                            <div class="item-icon" style="background: var(--bg-tertiary);">
                                ${chat.channel === 'webchat' ? '💻' : chat.channel === 'discord' ? '💬' : '📱'}
                            </div>
                            <div class="item-content">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <p class="item-title">${chat.user}</p>
                                    ${chat.unread > 0 ? `<span style="background: var(--danger); color: white; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem;">${chat.unread}</span>` : ''}
                                </div>
                                <p class="item-subtitle">${chat.preview}</p>
                            </div>
                            <span style="color: var(--text-secondary); font-size: 0.85rem;">${chat.time}</span>
                        </div>
                    `).join('') : `
                        <div class="empty-state">
                            <div class="empty-state-icon">💬</div>
                            <h3>No hay chats</h3>
                            <p>Las conversaciones aparecerán aquí</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }
};
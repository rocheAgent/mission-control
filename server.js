#!/usr/bin/env node
/**
 * OpenClaw Mission Control Server
 * Larry distribuye tareas con modelos específicos por agente
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 8080;
const WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/home/hojalata/.openclaw/workspace';

// Configuración de modelos por agente
const agentModels = {
    larry: { model: 'opencode-go/kimi-k2.5', name: 'Kimi K2.5', color: '#6366f1' },
    architect: { model: 'opencode-go/glm-5', name: 'GLM-5', color: '#3b82f6' },
    frontend: { model: 'opencode-go/kimi-k2.5', name: 'Kimi K2.5', color: '#6366f1' },
    backend: { model: 'opencode-go/glm-5', name: 'GLM-5', color: '#3b82f6' },
    database: { model: 'opencode-go/minimax-m2.5', name: 'MiniMax M2.5', color: '#22c55e' },
    qa: { model: 'opencode-go/minimax-m2.5', name: 'MiniMax M2.5', color: '#22c55e' },
    devops: { model: 'opencode-go/minimax-m2.5', name: 'MiniMax M2.5', color: '#22c55e' }
};

// Modelos disponibles
const availableModels = [
    { id: 'opencode-go/kimi-k2.5', name: 'Kimi K2.5', provider: 'Kimi' },
    { id: 'opencode-go/glm-5', name: 'GLM-5', provider: 'GLM' },
    { id: 'opencode-go/minimax-m2.5', name: 'MiniMax M2.5', provider: 'MiniMax' }
];

// Estado de tareas
const agentTasks = {
    larry: { tasks: 0, current: 'Esperando tareas de Misael' },
    architect: { tasks: 0, current: null },
    frontend: { tasks: 0, current: null },
    backend: { tasks: 0, current: null },
    database: { tasks: 0, current: null },
    qa: { tasks: 0, current: null },
    devops: { tasks: 0, current: null }
};

const activityLog = [];

const MIME_TYPES = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon'
};

// Larry distribuye según la tarea
function larryDistribute(task) {
    const lowerTask = task.toLowerCase();
    const assignments = [];
    
    if (lowerTask.includes('diseño') || lowerTask.includes('ui') || lowerTask.includes('frontend') || lowerTask.includes('visual') || lowerTask.includes('pantalla') || lowerTask.includes('componente')) {
        assignments.push({ agentId: 'frontend', subtask: 'Diseño de interfaz' });
    }
    
    if (lowerTask.includes('api') || lowerTask.includes('backend') || lowerTask.includes('servidor') || lowerTask.includes('lógica') || lowerTask.includes('endpoint')) {
        assignments.push({ agentId: 'backend', subtask: 'Implementar lógica' });
    }
    
    if (lowerTask.includes('database') || lowerTask.includes('base de datos') || lowerTask.includes('schema') || lowerTask.includes('migración') || lowerTask.includes('tabla')) {
        assignments.push({ agentId: 'database', subtask: 'Diseñar modelo de datos' });
    }
    
    if (lowerTask.includes('test') || lowerTask.includes('qa') || lowerTask.includes('prueba') || lowerTask.includes('bug')) {
        assignments.push({ agentId: 'qa', subtask: 'Ejecutar pruebas' });
    }
    
    if (lowerTask.includes('deploy') || lowerTask.includes('docker') || lowerTask.includes('servidor') || lowerTask.includes('producción') || lowerTask.includes('configurar') || lowerTask.includes('nginx')) {
        assignments.push({ agentId: 'devops', subtask: 'Preparar despliegue' });
    }
    
    if (lowerTask.includes('arquitectura') || lowerTask.includes('diseño') || lowerTask.includes('spec') || lowerTask.includes('estructura')) {
        assignments.push({ agentId: 'architect', subtask: 'Diseñar arquitectura' });
    }
    
    if (assignments.length === 0) {
        assignments.push({ agentId: 'frontend', subtask: 'Trabajo de implementación' });
        assignments.push({ agentId: 'backend', subtask: 'Trabajo de lógica' });
    }
    
    return assignments;
}

function getAgents() {
    return [
        { id: 'larry', name: 'Larry', role: 'PM / Orchestrator', emoji: '🎯', status: 'active', tasks: agentTasks.larry.tasks, lastActive: 'now', current: agentTasks.larry.current, model: agentModels.larry },
        { id: 'architect', name: 'Architect', role: 'System Architect', emoji: '🏗️', status: agentTasks.architect.tasks > 0 ? 'active' : 'idle', tasks: agentTasks.architect.tasks, lastActive: 'now', current: agentTasks.architect.current, model: agentModels.architect },
        { id: 'frontend', name: 'Frontend', role: 'UI/UX Developer', emoji: '🎨', status: agentTasks.frontend.tasks > 0 ? 'active' : 'idle', tasks: agentTasks.frontend.tasks, lastActive: 'now', current: agentTasks.frontend.current, model: agentModels.frontend },
        { id: 'backend', name: 'Backend', role: 'API Developer', emoji: '⚙️', status: agentTasks.backend.tasks > 0 ? 'active' : 'idle', tasks: agentTasks.backend.tasks, lastActive: 'now', current: agentTasks.backend.current, model: agentModels.backend },
        { id: 'database', name: 'Database', role: 'Data Engineer', emoji: '🗄️', status: agentTasks.database.tasks > 0 ? 'active' : 'idle', tasks: agentTasks.database.tasks, lastActive: 'now', current: agentTasks.database.current, model: agentModels.database },
        { id: 'qa', name: 'QA', role: 'QA Engineer', emoji: '🔍', status: agentTasks.qa.tasks > 0 ? 'active' : 'idle', tasks: agentTasks.qa.tasks, lastActive: 'now', current: agentTasks.qa.current, model: agentModels.qa },
        { id: 'devops', name: 'DevOps', role: 'Infrastructure', emoji: '🚀', status: agentTasks.devops.tasks > 0 ? 'active' : 'idle', tasks: agentTasks.devops.tasks, lastActive: 'now', current: agentTasks.devops.current, model: agentModels.devops }
    ];
}

function getSessions() {
    return getAgents().filter(a => a.status === 'active').map(a => ({
        id: `sess-${a.id}-${Date.now()}`,
        channel: 'webchat', type: 'task', agent: a.id,
        status: 'active', messages: a.tasks * 10, started: new Date().toISOString()
    }));
}

const routes = {
    '/api/status': () => ({ status: 'ok', timestamp: new Date().toISOString() }),
    
    '/api/models': () => ({ available: availableModels, configured: agentModels }),
    
    '/api/models/set': (body) => {
        try {
            const { agentId, modelId } = JSON.parse(body);
            if (!agentModels[agentId]) return { success: false, error: 'Agente no encontrado' };
            const model = availableModels.find(m => m.id === modelId);
            if (!model) return { success: false, error: 'Modelo no encontrado' };
            agentModels[agentId] = { ...model, color: getModelColor(modelId) };
            activityLog.unshift({
                time: new Date().toISOString(),
                type: 'model_changed',
                text: `${agentId} cambió a ${model.name}`,
                agent: 'system'
            });
            return { success: true, agent: agentId, model: agentModels[agentId] };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },
    
    '/api/skills': () => [
        { id: 'clawflow', name: 'ClawFlow', category: 'flow', enabled: true },
        { id: 'coding-agent', name: 'Coding Agent', category: 'agent', enabled: true },
        { id: 'github', name: 'GitHub', category: 'integration', enabled: true },
        { id: 'weather', name: 'Weather', category: 'utility', enabled: true }
    ],
    
    '/api/agents': () => getAgents(),
    '/api/sessions': () => getSessions(),
    '/api/tasks': () => ({ tasks: agentTasks }),
    
    '/api/task': (body) => {
        try {
            const { task } = JSON.parse(body);
            if (!task) return { success: false, error: 'Tarea requerida' };
            
            agentTasks.larry.tasks++;
            agentTasks.larry.current = 'Procesando: ' + task.slice(0, 40);
            
            activityLog.unshift({
                time: new Date().toISOString(),
                type: 'task_received',
                text: `Misael pidió: "${task.slice(0, 50)}..."`,
                agent: 'misael'
            });
            
            const assignments = larryDistribute(task);
            const distributed = [];
            
            assignments.forEach(a => {
                if (agentTasks[a.agentId]) {
                    agentTasks[a.agentId].tasks++;
                    agentTasks[a.agentId].current = a.subtask;
                    distributed.push(a.agentId);
                    
                    activityLog.unshift({
                        time: new Date().toISOString(),
                        type: 'task_distributed',
                        text: `Larry → ${a.agentId}: "${a.subtask}"`,
                        agent: 'larry'
                    });
                }
            });
            
            return {
                success: true,
                message: `Larry recibió la tarea y la distribuyó a: ${distributed.join(', ')}`,
                distributed, assignments,
                details: assignments.map(a => ({
                    agent: a.agentId,
                    task: a.subtask,
                    model: agentModels[a.agentId].name
                }))
            };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },
    
    '/api/tasks/complete': (body) => {
        try {
            const { agentId } = JSON.parse(body);
            if (agentTasks[agentId] && agentTasks[agentId].tasks > 0) {
                agentTasks[agentId].tasks--;
                if (agentTasks[agentId].tasks === 0) {
                    agentTasks[agentId].current = null;
                }
                activityLog.unshift({
                    time: new Date().toISOString(),
                    type: 'task_completed',
                    text: `${agentId} completó su tarea`,
                    agent: agentId
                });
                return { success: true, agent: agentId, tasks: agentTasks[agentId].tasks };
            }
            return { success: false, error: 'No hay tareas' };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },
    
    '/api/tasks/clear': () => {
        Object.keys(agentTasks).forEach(key => {
            agentTasks[key].tasks = 0;
            agentTasks[key].current = null;
        });
        agentTasks.larry.current = 'Esperando tareas de Misael';
        activityLog.unshift({
            time: new Date().toISOString(),
            type: 'cleared',
            text: 'Larry limpió todas las tareas',
            agent: 'larry'
        });
        return { success: true };
    },
    
    '/api/activity': () => activityLog.slice(0, 20),
    
    '/api/chats': () => [
        { id: 'chat-001', user: 'Misael', channel: 'webchat', preview: 'Mission Control activo', unread: 0, time: 'now' }
    ],
    
    '/api/memory': () => {
        const files = [];
        const mainMemory = path.join(WORKSPACE, 'MEMORY.md');
        if (fs.existsSync(mainMemory)) {
            const stats = fs.statSync(mainMemory);
            files.push({ name: 'MEMORY.md', type: 'long-term', size: (stats.size / 1024).toFixed(1) + ' KB', modified: stats.mtime.toISOString() });
        }
        return files;
    },
    
    '/api/config': () => ({
        general: { agentName: 'Larry', defaultModel: 'opencode-go/kimi-k2.5', language: 'es', timezone: 'America/Tijuana' },
        agents: { models: agentModels }
    }),
    
    '/api/stats': () => {
        const agents = getAgents();
        return {
            activeSessions: agents.filter(a => a.status === 'active').length,
            activeAgents: agents.filter(a => a.status === 'active').length,
            pendingTasks: agents.reduce((sum, a) => sum + a.tasks, 0),
            uptime: 'running'
        };
    }
};

function getModelColor(modelId) {
    if (modelId.includes('kimi')) return '#6366f1';
    if (modelId.includes('glm')) return '#3b82f6';
    if (modelId.includes('minimax')) return '#22c55e';
    return '#6366f1';
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    
    if (url.pathname.startsWith('/api/')) {
        const routeKey = url.pathname;
        const route = routes[routeKey];
        
        if (route) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
                const data = typeof route === 'function' ? route(body) : route;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'API not found' }));
        }
        return;
    }
    
    let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
    filePath = path.join(__dirname, filePath);
    
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'text/plain';
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(fs.readFileSync(filePath));
    } else {
        const indexPath = path.join(__dirname, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fs.readFileSync(indexPath));
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    }
});

server.listen(PORT, () => {
    console.log('🐾 Mission Control corriendo en http://localhost:' + PORT);
    console.log('');
    console.log('COMANDOS:');
    console.log('  # Asignar tarea a Larry:');
    console.log('  curl -X POST http://localhost:' + PORT + '/api/task -d \'{"task":"Crear UI"}\'');
    console.log('');
    console.log('  # Cambiar modelo de un agente:');
    console.log('  curl -X POST http://localhost:' + PORT + '/api/models/set -d \'{"agentId":"frontend","modelId":"opencode-go/glm-5"}\'');
});

process.on('SIGTERM', () => { server.close(); process.exit(0); });
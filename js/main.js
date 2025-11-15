/**
 * main.js
 * 
 * Controle da SPA:
 *  - Navegação por hash
 *  - Renderização com Templates
 *  - Integração com TaskManager
 *  - Tema escuro, filtros, export/import
 */

document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const themeBtn = document.getElementById('theme-toggle');

    // === TEMA ESCURO ===
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    themeBtn.onclick = () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };

    // === FUNÇÕES AUXILIARES ===
    function showMessage(id, text, isError = false) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = text;
            el.style.color = isError ? '#e74c3c' : '#27ae60';
            setTimeout(() => el.textContent = '', 3000);
        }
    }

    function navigate(hash) {
        window.location.hash = hash;
        renderPage();
    }

    function exportTasks() {
        const tasks = TaskManager.loadTasks();
        const data = JSON.stringify(tasks, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tarefas-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // === RENDERIZAÇÃO DA PÁGINA ===
    
    function renderPage() {
        const hash = window.location.hash || '#home';
        content.innerHTML = '';

        // HOME
        if (hash === '#home') {
            let tasks = TaskManager.loadTasks();
            const filter = localStorage.getItem('filter') || 'all';
            const sort = localStorage.getItem('sort') || 'asc';

            // Filtro
            if (filter === 'pending') tasks = tasks.filter(t => !t.completed);
            if (filter === 'completed') tasks = tasks.filter(t => t.completed);

            // Ordenação
            tasks.sort((a, b) => sort === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title)
            );

            content.innerHTML = Templates.home({ tasks });

            // Controles
            const filterEl = document.getElementById('filter-status');
            const sortEl = document.getElementById('sort-order');
            if (filterEl) filterEl.value = filter;
            if (sortEl) sortEl.value = sort;

            filterEl?.addEventListener('change', e => {
                localStorage.setItem('filter', e.target.value);
                renderPage();
            });
            sortEl?.addEventListener('change', e => {
                localStorage.setItem('sort', e.target.value);
                renderPage();
            });

            document.getElementById('export-btn')?.addEventListener('click', exportTasks);
            document.getElementById('import-file')?.addEventListener('change', e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => {
                    try {
                        let imported = JSON.parse(ev.target.result);
                        if (Array.isArray(imported)) {
                            imported = imported.map(t => ({ ...t, id: t.id || Date.now() + Math.random() }));
                            localStorage.setItem('tasks', JSON.stringify(imported));
                            renderPage();
                            showMessage('import-message', 'Importado com sucesso!');
                        }
                    } catch {
                        showMessage('import-message', 'Arquivo inválido!', true);
                    }
                };
                reader.readAsText(file);
            });

            // Eventos de tarefa
            document.querySelectorAll('.complete-checkbox').forEach(cb => {
                cb.onclick = e => {
                    TaskManager.toggleComplete(Number(e.target.dataset.id));
                    renderPage();
                };
            });

            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.onclick = e => {
                    const id = Number(e.currentTarget.dataset.id);
                    navigate(`#edit/${id}`);
                };
            });

            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.onclick = e => {
                    if (confirm('Excluir esta tarefa?')) {
                        TaskManager.deleteTask(Number(e.currentTarget.dataset.id));
                        renderPage();
                    }
                };
            });

        // ADICIONAR
        } else if (hash === '#add') {
            content.innerHTML = Templates.add();

            const form = document.getElementById('add-task-form');
            form.onsubmit = e => {
                e.preventDefault();
                if (TaskManager.validateForm('add')) {
                    const task = {
                        title: document.getElementById('add-title').value.trim(),
                        description: document.getElementById('add-description').value.trim()
                    };
                    TaskManager.saveTask(task);
                    showMessage('add-message', 'Tarefa adicionada com sucesso!');
                    form.reset();
                    setTimeout(() => navigate('#home'), 800);
                }
            };

        // EDITAR
        } else if (hash.startsWith('#edit/')) {
            const id = Number(hash.split('/')[1]);
            const tasks = TaskManager.loadTasks();
            const task = tasks.find(t => t.id === id);
            if (!task) return navigate('#home');

            content.innerHTML = Templates.edit(task);

            const form = document.getElementById('edit-task-form');
            form.onsubmit = e => {
                e.preventDefault();
                if (TaskManager.validateForm('edit')) {
                    const updated = {
                        title: document.getElementById('edit-title').value.trim(),
                        description: document.getElementById('edit-description').value.trim()
                    };
                    TaskManager.updateTask(id, updated);
                    showMessage('edit-message', 'Tarefa atualizada com sucesso!');
                    setTimeout(() => navigate('#home'), 800);
                }
            };
        }
    }

    // === NAVEGAÇÃO ===
    document.getElementById('home-btn').onclick = () => navigate('#home');
    document.getElementById('add-btn').onclick = () => navigate('#add');
    window.onhashchange = renderPage;

    // Renderização inicial
    renderPage();
});
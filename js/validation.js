// js/validation.js – Com Unique IDs para tarefas

const TaskManager = (() => {
    function validateForm(prefix) {
        let isValid = true;
        const titleErrorId = `${prefix}-title-error`;
        const descErrorId = `${prefix}-description-error`;

        [titleErrorId, descErrorId].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });

        const titleEl = document.getElementById(`${prefix}-title`);
        const descEl = document.getElementById(`${prefix}-description`);

        if (!titleEl || !descEl) return false;

        const title = titleEl.value.trim();
        const desc = descEl.value.trim();

        if (title.length < 3) {
            const el = document.getElementById(titleErrorId);
            if (el) el.textContent = 'Título deve ter pelo menos 3 caracteres.';
            isValid = false;
        }

        if (desc.length < 10) {
            const el = document.getElementById(descErrorId);
            if (el) el.textContent = 'Descrição deve ter pelo menos 10 caracteres.';
            isValid = false;
        }

        return isValid;
    }

    function loadTasks() {
        try {
            const data = localStorage.getItem('tasks');
            let tasks = data ? JSON.parse(data) : [];
            // Adicionar ID único se não existir (para compatibilidade com dados antigos)
            tasks = tasks.map(task => ({
                ...task,
                id: task.id || Date.now() + Math.random() // Gera ID se ausente
            }));
            localStorage.setItem('tasks', JSON.stringify(tasks)); // Salva atualizado
            return tasks;
        } catch {
            return [];
        }
    }

    function saveTask(task) {
        const tasks = loadTasks();
        tasks.push({
            id: Date.now(),
            title: task.title.trim(),
            description: task.description.trim(),
            completed: false
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTask(taskId, updated) {
        const tasks = loadTasks();
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        Object.assign(task, {
            title: updated.title.trim(),
            description: updated.description.trim()
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function toggleComplete(taskId) {
        const tasks = loadTasks();
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function deleteTask(taskId) {
        let tasks = loadTasks();
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    return { validateForm, loadTasks, saveTask, updateTask, toggleComplete, deleteTask };
})();

window.TaskManager = TaskManager;
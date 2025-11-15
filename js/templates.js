/**
 * templates.js
 * 
 * Todos os templates Handlebars da aplicação.
 * EXPÕE: window.Templates = { home, add, edit }
 */

const homeTemplateSource = `
    <h2>Minhas Tarefas</h2>
    
    <div class="controls">
        <select id="filter-status" title="Filtrar tarefas">
            <option value="all">Todas</option>
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídas</option>
        </select>
        
        <select id="sort-order" title="Ordenar por título">
            <option value="asc">A to Z</option>
            <option value="desc">Z to A</option>
        </select>
        
        <!-- BOTÃO EXPORTAR -->
        <button id="ex_import-btn" class="btn-export" title="Exportar tarefa como JSON">
            <i class="fas fa-download"></i> Exportar
        </button>

        <img src="imagens/tarefas.jpg" alt="Tarefas" width="150">        

        <!-- BOTÃO IMPORTAR -->
        <label id="ex_import-btn" class="btn-import" title="Importar tarefas de um arquivo JSON">
            <i class="fas fa-upload"></i> Importar
            <input type="file" id="import-file" accept=".json" style="display: none;">
        </label>

    </div>

    <ul id="task-list">
        {{#each tasks}}
            <li class="{{#if completed}}completed{{/if}}">
                <div class="task-box">
                    <input type="checkbox" class="complete-checkbox" data-id="{{id}}" {{#if completed}}checked{{/if}}>
                    <div class="task-content">
                        <strong>{{title}}</strong>
                        <p>{{description}}</p>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="btn btn-edit" data-id="{{id}}" aria-label="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-delete" data-id="{{id}}" aria-label="Excluir">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </li>
        {{/each}}
    </ul>

    {{#unless tasks.length}}
        <p style="text-align:center; color:#888; margin-top:2rem; font-style:italic;">
            Nenhuma tarefa ainda. Clique em "Adicionar" para começar!
        </p>
    {{/unless}}
`;

const addTemplateSource = `
    <h2>Adicionar Nova Tarefa</h2>
    <div class="success" id="add-message"></div>
    
    <form id="add-task-form">
        <label for="add-title">Título:</label>
        <input type="text" id="add-title" name="title" required minlength="3" placeholder="Ex: Comprar leite">
        <div class="error" id="add-title-error"></div>

        <label for="add-description">Descrição:</label>
        <textarea id="add-description" name="description" required minlength="10" 
                  placeholder="Detalhe o que precisa ser feito..."></textarea>
        <div class="error" id="add-description-error"></div>

        <!--
        <button type="submit">Adicionar Tarefa</button>
        -->

        <button type="submit" class="btn-ok" title="Adicionar Tarefa">
            <i class="fas fa-add"></i> Adicionar Tarefa
        </button>        

    </form>
`;

const editTemplateSource = `
    <h2>Editar Tarefa</h2>
    <div class="success" id="edit-message"></div>
    
    <form id="edit-task-form">
        <label for="edit-title">Título:</label>
        <input type="text" id="edit-title" name="title" value="{{title}}" required minlength="3">
        <div class="error" id="edit-title-error"></div>

        <label for="edit-description">Descrição:</label>
        <textarea id="edit-description" name="description" required minlength="10">{{description}}</textarea>
        <div class="error" id="edit-description-error"></div>

        <!--
        <button type="submit">Salvar Alterações</button>
        -->

        <button type="submit" class="btn-ok" title="Salvar Alterações">
            <i class="fas fa-save"></i> Salvar Alterações
        </button>        



    </form>
`;

// Compila os templates
const homeTemplate = Handlebars.compile(homeTemplateSource);
const addTemplate = Handlebars.compile(addTemplateSource);
const editTemplate = Handlebars.compile(editTemplateSource);

// EXPÕE GLOBALMENTE
window.Templates = {
    home: homeTemplate,
    add: addTemplate,
    edit: editTemplate
};
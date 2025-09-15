// 待办事项数据
let todos = [];

// DOM元素
const todoList = document.getElementById('todoList');
const newTodoInput = document.getElementById('newTodo');
const addBtn = document.getElementById('addBtn');
const todoCount = document.getElementById('todoCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// 当前过滤状态
let currentFilter = 'all';

// 初始化
function init() {
    // 从本地存储加载数据
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
    
    renderTodos();
    updateTodoCount();
    
    // 事件监听
    addBtn.addEventListener('click', addTodo);
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新活跃状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });
}

// 添加待办事项
function addTodo() {
    const text = newTodoInput.value.trim();
    if (text) {
        todos.push({
            id: Date.now(),
            text: text,
            completed: false
        });
        
        newTodoInput.value = '';
        saveTodos();
        renderTodos();
        updateTodoCount();
    }
}

// 渲染待办事项
function renderTodos() {
    todoList.innerHTML = '';
    
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });
    
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn" data-id="${todo.id}"><i class="fas fa-times"></i></button>
        `;
        todoList.appendChild(li);
    });
    
    // 为新添加的元素添加事件监听
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', toggleTodo);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTodo);
    });
}

// 切换待办事项状态
function toggleTodo(e) {
    const id = parseInt(e.target.dataset.id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
        updateTodoCount();
    }
}

// 删除待办事项
function deleteTodo(e) {
    const id = parseInt(e.target.closest('.delete-btn').dataset.id);
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateTodoCount();
}

// 清除已完成的待办事项
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateTodoCount();
}

// 更新待办事项计数
function updateTodoCount() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    todoCount.textContent = activeCount;
}

// 保存待办事项到本地存储
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 启动应用
init();
    
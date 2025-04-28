// Animate Task Addition
const addTodoForm = document.querySelector('.add-todo-box form');
const todoList = document.querySelector('.todo-list');

addTodoForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const taskInput = document.querySelector('.add-todo-box input');
    const priorityInput = document.querySelector('.add-todo-box select');

    if (taskInput.value.trim()) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span class="task-text">${taskInput.value}</span>
            <button class="delete-btn">Delete</button>
            <button class="edit-btn">Edit</button>
        `;

        // Animate the item (Fade in effect)
        taskItem.style.animation = 'fadeIn 0.5s forwards';
        todoList.appendChild(taskItem);

        // Clear the input fields
        taskInput.value = '';
        priorityInput.selectedIndex = 0;
    }
});

// Delete Todo Item
todoList.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-btn')) {
        const item = e.target.closest('li');
        item.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => item.remove(), 500);
    }
});

// Edit Todo Item
todoList.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-btn')) {
        const taskText = e.target.closest('li').querySelector('.task-text');
        const newTask = prompt('Edit your task:', taskText.textContent);
        if (newTask !== null) {
            taskText.textContent = newTask;
        }
    }
});

// Smooth transitions for filter buttons
const filterBtns = document.querySelectorAll('.filter-btns button');
filterBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
        filterBtns.forEach((btn) => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

import { themeManager, storageManager, eventManager, animationUtils } from './utils.js';
import { STORAGE_KEYS, TAB_IDS, EVENT_TYPES, STATUS_TYPES, THEME_TYPES } from './constants.js';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

// App Initialization
function initializeApp() {
    themeManager.initTheme();
    loadTasks();
    loadHabits();
    loadGoals();
    initializeTabs();
    setupHamburgerMenu();
}

// Event Listeners Setup
function setupEventListeners() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        eventManager.on(themeToggle, 'click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            themeManager.setTheme(currentTheme === THEME_TYPES.LIGHT ? THEME_TYPES.DARK : THEME_TYPES.LIGHT);
        });
    }

    // Hamburger Menu
    const hamburger = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        eventManager.on(hamburger, 'click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Tab Navigation
    document.querySelectorAll('[data-tab]').forEach(tab => {
        eventManager.on(tab, 'click', (e) => {
            e.preventDefault();
            showTab(tab.dataset.tab);
        });
    });

    // Task Checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        eventManager.on(checkbox, 'change', (e) => {
            updateTaskStatus(e.target.dataset.taskId, e.target.checked);
        });
    });
}

// Tab Management
function initializeTabs() {
    const defaultTab = TAB_IDS.OVERVIEW;
    showTab(defaultTab);
}

function showTab(tabId) {
    // Hide all tab panels
    document.querySelectorAll('[data-tab-panel]').forEach(panel => {
        panel.classList.add('hidden');
    });

    // Show selected tab panel
    const selectedPanel = document.querySelector(`[data-tab-panel="${tabId}"]`);
    if (selectedPanel) {
        selectedPanel.classList.remove('hidden');
    }

    // Update active tab state
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabId) {
            tab.classList.add('active');
        }
    });
}

// Hamburger Menu Setup
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburger && mobileMenu) {
        eventManager.on(hamburger, 'click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu on outside click
        eventManager.on(document, 'click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Task Management
function loadTasks() {
    const tasks = storageManager.getData(STORAGE_KEYS.TASKS) || [];
    renderTasks(tasks);
}

function renderTasks(tasks) {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;

    taskList.innerHTML = tasks.map(task => `
        <div class="task-item flex items-center gap-2 p-2">
            <input type="checkbox" 
                   class="task-checkbox" 
                   data-task-id="${task.id}"
                   ${task.completed ? 'checked' : ''}>
            <span class="${task.completed ? 'line-through' : ''}">${task.title}</span>
        </div>
    `).join('');
}

function updateTaskStatus(taskId, completed) {
    const tasks = storageManager.getData(STORAGE_KEYS.TASKS) || [];
    const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
    );
    storageManager.saveData(STORAGE_KEYS.TASKS, updatedTasks);
    renderTasks(updatedTasks);
}

// Habits Management
function loadHabits() {
    const habits = storageManager.getData(STORAGE_KEYS.HABITS) || [];
    renderHabits(habits);
}

function renderHabits(habits) {
    const habitList = document.getElementById('habit-list');
    if (!habitList) return;

    habitList.innerHTML = habits.map(habit => `
        <div class="habit-item p-2">
            <h3 class="font-semibold">${habit.name}</h3>
            <div class="flex gap-2 mt-1">
                ${Array.from({ length: 7 }).map((_, i) => `
                    <div class="habit-day w-6 h-6 border rounded-full 
                         ${habit.completedDays.includes(i) ? 'bg-green-500' : ''}"
                         data-habit-id="${habit.id}" 
                         data-day="${i}">
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Goals Management
function loadGoals() {
    const goals = storageManager.getData(STORAGE_KEYS.GOALS) || [];
    renderGoals(goals);
}

function renderGoals(goals) {
    const goalList = document.getElementById('goal-list');
    if (!goalList) return;

    goalList.innerHTML = goals.map(goal => `
        <div class="goal-item p-4 border rounded-lg mb-4">
            <h3 class="font-bold text-lg">${goal.title}</h3>
            <p class="text-gray-600">${goal.description}</p>
            <div class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" 
                         style="width: ${goal.progress}%">
                    </div>
                </div>
                <span class="text-sm text-gray-600">${goal.progress}% Complete</span>
            </div>
        </div>
    `).join('');
}

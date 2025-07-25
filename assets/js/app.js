import { themeManager, storageManager, eventManager, animationUtils } from './utils.js';
import { STORAGE_KEYS, TAB_IDS, EVENT_TYPES, STATUS_TYPES, THEME_TYPES } from './constants.js';

export const UIController = {
    init() {
        this.initMobileMenu();
        this.initTabs();
        this.initTheme();
        this.initDailyChecklist();
        this.initWaterTracker();
        this.initSupplements();
        this.initCurrentDate();
    },

    initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mainNavLinks = document.getElementById('main-nav-links');
        
        if (mobileMenuButton && mainNavLinks) {
            mobileMenuButton.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                mainNavLinks.classList.toggle('show');
                mainNavLinks.style.display = isExpanded ? 'none' : 'flex';
            });

            // Close menu on outside click
            document.addEventListener('click', function(event) {
                if (!event.target.closest('.main-nav') && mainNavLinks.classList.contains('show')) {
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    mainNavLinks.classList.remove('show');
                    mainNavLinks.style.display = 'none';
                }
            });

            // Close menu on Escape key
            mainNavLinks.addEventListener('keydown', function(event) {
                if (event.key === 'Escape' && mainNavLinks.classList.contains('show')) {
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    mainNavLinks.classList.remove('show');
                    mainNavLinks.style.display = 'none';
                    mobileMenuButton.focus();
                }
            });
        }
    },

    initTabs() {
        const defaultTab = 'dashboard';
        this.showTab(defaultTab);

        // Set up keyboard navigation for tabs
        const tabList = document.querySelector('[role="tablist"]');
        const tabs = tabList?.querySelectorAll('[role="tab"]');
        if (tabList && tabs) {
            const tabIds = Array.from(tabs).map(tab => tab.id.replace('-tab', ''));

            tabList.addEventListener('keydown', (e) => {
                const targetTab = e.target.closest('[role="tab"]');
                if (!targetTab) return;

                let currentIndex = tabIds.indexOf(targetTab.id.replace('-tab', ''));
                let nextIndex;

                switch (e.key) {
                    case 'ArrowLeft':
                        nextIndex = currentIndex - 1;
                        if (nextIndex < 0) nextIndex = tabIds.length - 1;
                        e.preventDefault();
                        break;
                    case 'ArrowRight':
                        nextIndex = currentIndex + 1;
                        if (nextIndex >= tabIds.length) nextIndex = 0;
                        e.preventDefault();
                        break;
                    case 'Home':
                        nextIndex = 0;
                        e.preventDefault();
                        break;
                    case 'End':
                        nextIndex = tabIds.length - 1;
                        e.preventDefault();
                        break;
                    default:
                        return;
                }

                const nextTab = document.getElementById(`${tabIds[nextIndex]}-tab`);
                if (nextTab) {
                    nextTab.focus();
                    this.showTab(tabIds[nextIndex]);
                }
            });
        }
    },

    showTab(tabId) {
        // Update tab panel visibility and accessibility
        document.querySelectorAll('.tab-content').forEach(panel => {
            const isSelected = panel.id === tabId;
            panel.classList.toggle('hidden', !isSelected);
            panel.setAttribute('aria-hidden', !isSelected);
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', `${tabId}-tab`);
            panel.setAttribute('tabindex', isSelected ? '0' : '-1');
        });

        // Update tab button states
        document.querySelectorAll('.tab-button').forEach(button => {
            const isSelected = button.id === `${tabId}-tab`;
            button.classList.toggle('active', isSelected);
            button.setAttribute('aria-selected', isSelected);
            button.setAttribute('tabindex', isSelected ? '0' : '-1');
        });

        // Save current tab
        storageManager.saveData(STORAGE_KEYS.CURRENT_TAB, tabId);
    },

    initTheme() {
        themeManager.initTheme();
        const savedTheme = storageManager.getData(STORAGE_KEYS.THEME) || 'dark';
        themeManager.setTheme(savedTheme);
    },

    initDailyChecklist() {
        const items = [
            { id: 'hydration', text: 'Track Water Intake (3.5-4.0L)', category: 'health' },
            { id: 'supplements', text: 'Take Morning Supplements', category: 'health' },
            { id: 'exercise', text: 'Complete Scheduled Workout', category: 'health' },
            { id: 'study', text: 'GCP Study Session (30 mins)', category: 'career' },
            { id: 'breathing', text: 'Evening Breathing Practice', category: 'wellbeing' },
            { id: 'family', text: 'Family Activity Time', category: 'family' }
        ];

        const container = document.getElementById('daily-checklist');
        if (container) {
            items.forEach(item => {
                const checked = storageManager.getData(`checklist_${item.id}`) || false;
                const li = document.createElement('li');
                li.className = 'flex items-center space-x-3';
                li.innerHTML = `
                    <input type="checkbox" id="${item.id}" 
                           class="form-checkbox h-5 w-5 text-[var(--primary)]"
                           ${checked ? 'checked' : ''}>
                    <label for="${item.id}" class="flex-1">${item.text}</label>
                `;
                container.appendChild(li);

                const checkbox = li.querySelector('input');
                checkbox.addEventListener('change', () => {
                    storageManager.saveData(`checklist_${item.id}`, checkbox.checked);
                });
            });
        }
    },

    initWaterTracker() {
        const waterTracker = document.getElementById('water-tracker');
        const waterLevel = document.getElementById('water-level');
        if (waterTracker && waterLevel) {
            const savedLevel = storageManager.getData(STORAGE_KEYS.WATER_LEVEL) || 0;
            waterTracker.value = savedLevel;
            waterLevel.textContent = savedLevel.toFixed(2) + ' L';

            waterTracker.addEventListener('input', function() {
                const value = parseFloat(this.value);
                waterLevel.textContent = value.toFixed(2) + ' L';
                storageManager.saveData(STORAGE_KEYS.WATER_LEVEL, value);
            });
        }
    },

    initSupplements() {
        const supplements = [
            { id: 'vit-d', name: 'Vitamin D3' },
            { id: 'b12', name: 'B12' },
            { id: 'omega', name: 'Omega-3' },
            { id: 'cranberry', name: 'Cranberry' },
            { id: 'magnesium', name: 'Magnesium Citrate' }
        ];

        const container = document.getElementById('supplement-tracker');
        if (container) {
            supplements.forEach(supp => {
                const checked = storageManager.getData(`supplement_${supp.id}`) || false;
                const div = document.createElement('div');
                div.className = 'flex items-center space-x-3';
                div.innerHTML = `
                    <input type="checkbox" id="${supp.id}"
                           class="form-checkbox h-5 w-5 text-[var(--primary)]"
                           ${checked ? 'checked' : ''}>
                    <label for="${supp.id}" class="flex-1">${supp.name}</label>
                `;
                container.appendChild(div);

                const checkbox = div.querySelector('input');
                checkbox.addEventListener('change', () => {
                    storageManager.saveData(`supplement_${supp.id}`, checkbox.checked);
                });
            });
        }
    },

    initCurrentDate() {
        const currentDateEl = document.getElementById('currentDate');
        if (currentDateEl) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    UIController.init();
});

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

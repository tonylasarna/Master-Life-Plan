// API Configuration
export const API_CONFIG = {
    GEMINI_API_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
    GEMINI_MODEL: 'gemini-2.0-flash'
};

// Application Constants
export const APP_CONSTANTS = {
    STORAGE_KEYS: {
        THEME: 'preferredTheme',
        USER_SETTINGS: 'userSettings',
        DAILY_PROGRESS: 'dailyProgress',
        WATER_GOAL: 'waterGoal',
        SUPPLEMENTS_TAKEN: 'supplementsTaken'
    },
    DEFAULT_SETTINGS: {
        WATER_GOAL: 3.5, // in liters
        WAKE_TIME: '05:30',
        SLEEP_TIME: '21:30',
        THEME: 'light'
    }
};

// UI Text Constants
export const UI_TEXT = {
    ERRORS: {
        API_ERROR: 'An error occurred while fetching data. Please try again.',
        VALIDATION_ERROR: 'Please check your input and try again.',
        STORAGE_ERROR: 'Unable to save your data. Please check your browser settings.'
    },
    SUCCESS: {
        SETTINGS_SAVED: 'Your settings have been saved successfully.',
        PROGRESS_SAVED: 'Your progress has been updated.',
        EXPORT_SUCCESS: 'Your data has been exported successfully.'
    },
    PROMPTS: {
        CONFIRM_RESET: 'Are you sure you want to reset all data? This cannot be undone.',
        CONFIRM_EXPORT: 'Do you want to export your data?'
    }
};

// Activity Categories
export const ACTIVITY_CATEGORIES = {
    HEALTH: {
        id: 'health',
        label: 'Health & Fitness',
        color: '#4CAF50',
        icon: 'fitness_center'
    },
    PRODUCTIVITY: {
        id: 'productivity',
        label: 'Productivity',
        color: '#2196F3',
        icon: 'work'
    },
    MINDFULNESS: {
        id: 'mindfulness',
        label: 'Mindfulness',
        color: '#9C27B0',
        icon: 'self_improvement'
    },
    FAMILY: {
        id: 'family',
        label: 'Family Time',
        color: '#E91E63',
        icon: 'family_restroom'
    },
    LEARNING: {
        id: 'learning',
        label: 'Learning',
        color: '#FF9800',
        icon: 'school'
    }
};

// Time Intervals (in milliseconds)
export const TIME_INTERVALS = {
    AUTOSAVE: 30000, // 30 seconds
    REFRESH_DATA: 300000, // 5 minutes
    CHECK_UPDATES: 3600000 // 1 hour
};

// Chart Configuration
export const CHART_CONFIG = {
    colors: [
        '#4CAF50', // Health
        '#2196F3', // Productivity
        '#9C27B0', // Mindfulness
        '#E91E63', // Family
        '#FF9800'  // Learning
    ],
    defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            labels: {
                padding: 20,
                boxWidth: 10
            }
        },
        tooltips: {
            enabled: true,
            mode: 'index',
            intersect: false,
            callbacks: {
                label: (tooltipItem, data) => {
                    return `${data.labels[tooltipItem.index]}: ${tooltipItem.value}%`;
                }
            }
        }
    }
};

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
    TOGGLE_THEME: 'ctrl+shift+t',
    SAVE_PROGRESS: 'ctrl+s',
    OPEN_SETTINGS: 'ctrl+,',
    TOGGLE_FULLSCREEN: 'f11',
    SHOW_HELP: '?'
};

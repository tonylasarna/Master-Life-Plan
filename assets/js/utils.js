// Theme Management
const themeManager = {
    themes: {
        light: {
            '--background': '#ffffff',
            '--text': '#1a1a1a',
            '--primary': '#4a90e2',
            '--secondary': '#2c3e50',
            '--accent': '#e74c3c',
            '--surface': '#f5f5f5',
            '--border': '#e0e0e0',
            '--shadow': 'rgba(0, 0, 0, 0.1)'
        },
        dark: {
            '--background': '#1a1a1a',
            '--text': '#ffffff',
            '--primary': '#64b5f6',
            '--secondary': '#b2dfdb',
            '--accent': '#ff7043',
            '--surface': '#2d2d2d',
            '--border': '#404040',
            '--shadow': 'rgba(255, 255, 255, 0.1)'
        }
    },

    setTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        localStorage.setItem('preferredTheme', themeName);
    },

    initTheme() {
        const savedTheme = localStorage.getItem('preferredTheme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
    }
};

// Storage Management
const storageManager = {
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving data for key ${key}:`, error);
            return false;
        }
    },

    getData(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`Error retrieving data for key ${key}:`, error);
            return defaultValue;
        }
    },

    removeData(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing data for key ${key}:`, error);
            return false;
        }
    },

    clearAll() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
};

// Event Management
const eventManager = {
    _events: {},

    on(eventName, callback) {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }
        this._events[eventName].push(callback);
    },

    off(eventName, callback) {
        if (!this._events[eventName]) return;
        this._events[eventName] = this._events[eventName]
            .filter(cb => cb !== callback);
    },

    emit(eventName, data) {
        if (!this._events[eventName]) return;
        this._events[eventName].forEach(callback => {
            callback(data);
        });
    }
};

// Form Validation
const formValidator = {
    patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^\+?[\d\s-]{10,}$/,
        url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    },

    validate(value, type) {
        if (!this.patterns[type]) return true;
        return this.patterns[type].test(value);
    },

    validateForm(formElement) {
        const errors = [];
        const formData = new FormData(formElement);

        for (const [name, value] of formData.entries()) {
            const field = formElement.querySelector(`[name="${name}"]`);
            const validationType = field.dataset.validate;

            if (validationType && !this.validate(value, validationType)) {
                errors.push({
                    field: name,
                    message: `Invalid ${validationType} format`
                });
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Animation Utilities
const animationUtils = {
    fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = 1;
        });
    },

    fadeOut(element, duration = 300) {
        element.style.opacity = 1;
        element.style.transition = `opacity ${duration}ms ease`;
        
        element.style.opacity = 0;
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    },

    slideDown(element, duration = 300) {
        element.style.display = 'block';
        const height = element.scrollHeight;
        element.style.overflow = 'hidden';
        element.style.height = '0px';
        element.style.transition = `height ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.height = height + 'px';
        });
    },

    slideUp(element, duration = 300) {
        element.style.height = element.scrollHeight + 'px';
        element.style.transition = `height ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.height = '0px';
        });

        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }
};

// Export utilities
export {
    themeManager,
    storageManager,
    eventManager,
    formValidator,
    animationUtils
};

// Theme Management
export const themeManager = {
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    },
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
};

// Storage Management
export const storageManager = {
    saveData(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};

// Event Management
export const eventManager = {
    on(element, event, handler) {
        element.addEventListener(event, handler);
    },
    off(element, event, handler) {
        element.removeEventListener(event, handler);
    }
};

// Form Validation
export const formValidator = {
    required(value) {
        return value.trim() !== '';
    },
    email(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
};

// Animation Utilities
export const animationUtils = {
    fadeIn(element) {
        element.style.display = 'flex';
        element.style.opacity = '0';
        setTimeout(() => element.style.opacity = '1', 10);
    },
    fadeOut(element) {
        element.style.opacity = '0';
        setTimeout(() => element.style.display = 'none', 300);
    },
    slideDown(element) {
        element.style.display = 'flex';
        element.classList.add('show');
    },
    slideUp(element) {
        element.classList.remove('show');
        element.style.display = 'none';
    }
};

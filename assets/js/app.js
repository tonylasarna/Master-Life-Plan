// Utility Functions
const utils = {
    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    },

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'Spring';
        if (month >= 5 && month <= 7) return 'Summer';
        if (month >= 8 && month <= 10) return 'Fall';
        return 'Winter';
    },

    generateICSContent(events) {
        return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MasterLifePlan//EN']
            .concat(events.map(event => [
                'BEGIN:VEVENT',
                `DTSTART;TZID=America/Toronto:${event.start}`,
                `RRULE:${event.recurrence}`,
                `SUMMARY:${event.summary}`,
                'END:VEVENT'
            ].join('\\n')))
            .concat(['END:VCALENDAR'])
            .join('\\n');
    },

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }
};

// UI Controllers
const UIController = {
    elements: {
        dailyChecklist: document.getElementById('daily-checklist'),
        waterTracker: document.getElementById('water-tracker'),
        waterLevel: document.getElementById('water-level'),
        supplementTracker: document.getElementById('supplement-tracker'),
        motivationalQuote: document.getElementById('motivational-quote'),
        currentDate: document.getElementById('currentDate'),
        modal: document.getElementById('modal'),
        modalTitle: document.getElementById('modal-title'),
        modalBody: document.getElementById('modal-body')
    },

    init() {
        this.updateDate();
        this.initializeChecklist();
        this.initializeSupplements();
        this.initializeQuote();
        this.setupEventListeners();
    },

    updateDate() {
        if (this.elements.currentDate) {
            this.elements.currentDate.textContent = utils.formatDate(new Date());
        }
    },

    initializeChecklist() {
        const checklistItems = [
            "5:30 AM Wake-up",
            "AM Gym Session",
            "3.5L+ Water",
            "20 min Breathing",
            "9:30 PM Sleep",
            "Family Activity",
            "GCP Study"
        ];

        if (this.elements.dailyChecklist) {
            this.elements.dailyChecklist.innerHTML = checklistItems
                .map(item => `
                    <li class="flex items-center">
                        <input type="checkbox" class="h-5 w-5 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] mr-3">
                        <span>${item}</span>
                    </li>
                `).join('');
        }
    },

    initializeSupplements() {
        const supplements = ["Vitamin D", "B12", "Omega-3", "Cranberry", "Magnesium"];
        
        if (this.elements.supplementTracker) {
            this.elements.supplementTracker.innerHTML = supplements
                .map(item => `
                    <div class="flex items-center justify-between">
                        <span>${item}</span>
                        <input type="checkbox" class="h-5 w-5 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]">
                    </div>
                `).join('');
        }
    },

    initializeQuote() {
        const quotes = [
            "The secret of your future is hidden in your daily routine.",
            "Discipline is the bridge between goals and accomplishment.",
            "Success is the sum of small efforts, repeated day in and day out."
        ];

        if (this.elements.motivationalQuote) {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            this.elements.motivationalQuote.textContent = `"${randomQuote}"`;
        }
    },

    setupEventListeners() {
        // Water tracker
        if (this.elements.waterTracker) {
            this.elements.waterTracker.addEventListener('input', (e) => {
                this.elements.waterLevel.textContent = `${parseFloat(e.target.value).toFixed(2)} L`;
            });
        }

        // Modal close button
        document.querySelector('.modal .close-button')?.addEventListener('click', () => {
            this.hideModal();
        });
    },

    showModal(title, content) {
        this.elements.modalTitle.textContent = title;
        this.elements.modalBody.innerHTML = content;
        this.elements.modal.classList.remove('hidden');
    },

    hideModal() {
        this.elements.modal.classList.add('hidden');
    }
};

// API Controller
const APIController = {
    async callGemini(prompt, button) {
        const originalContent = button.innerHTML;
        button.innerHTML = '<div class="loader mx-auto"></div>';
        button.disabled = true;

        try {
            const response = await this.makeAPIRequest(prompt);
            const htmlContent = this.formatResponse(response);
            UIController.showModal('AI Generated Ideas', htmlContent);
        } catch (error) {
            console.error("API Call Error:", error);
            UIController.showModal('Error', `<p>An error occurred: ${error.message}.</p>`);
        } finally {
            button.innerHTML = originalContent;
            button.disabled = false;
        }
    },

    async makeAPIRequest(prompt) {
        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return response.json();
    },

    formatResponse(result) {
        if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid API response format');
        }

        return result.candidates[0].content.parts[0].text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    UIController.init();
});

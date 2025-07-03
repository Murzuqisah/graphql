export class Navigation {
    constructor(activePage = 'dashboard') {
        this.activePage = activePage;
        this.element = null;
    }

    render() {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-lg shadow-sm border border-secondary-200 p-4 mb-6';
        
        const navItems = [
            { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
            { id: 'stats', label: 'Statistics', icon: '📊' },
            { id: 'xp-progress', label: 'XP Progress', icon: '📈' },
            { id: 'projects', label: 'Projects', icon: '📋' },
            { id: 'audits', label: 'Audits', icon: '🔍' },
            { id: 'skills', label: 'Skills', icon: '🎯' },
        ];

        div.innerHTML = `
            <nav class="flex flex-wrap gap-2">
                ${navItems.map((item) => `
                    <a
                        href="#${item.id}"
                        class="nav-item px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                            this.activePage === item.id
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                        }"
                    >
                        <span>${item.icon}</span>
                        <span>${item.label}</span>
                    </a>
                `).join('')}
            </nav>
        `;

        this.element = div;
        return this.element;
    }

    show(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}
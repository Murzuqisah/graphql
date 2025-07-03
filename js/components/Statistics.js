import { formatXPValue } from '../utils/utils.js';

export class Statistics {
    constructor(userData) {
        this.userData = userData;
        this.element = null;
    }

    calculateStats() {
        // Calculate total XP from event 75 transactions only
        const totalXPBytes = this.userData.transaction.reduce((sum, t) => sum + t.amount, 0);
        const totalXP = formatXPValue(totalXPBytes);
        
        // Filter projects for event 75 only
        const event75Progress = this.userData.progress.filter(p => p.eventId === 75 && p.object && p.object.type === "project");
        
        // Use Set to count unique completed projects (avoid counting redone projects)
        const completedProjectIds = new Set(
            event75Progress
                .filter(p => p.grade >= 1 && p.isDone)
                .map(p => p.object.id)
        );
        const completedProjects = completedProjectIds.size;
        
        // Count failed projects (unique failures)
        const failedProjectIds = new Set(
            event75Progress
                .filter(p => p.grade < 1 && p.isDone)
                .map(p => p.object.id)
        );
        const failedProjects = failedProjectIds.size;
        
        // Use the calculated audit ratio from GraphQL
        const auditRatio = this.userData.auditRatio || 0;

        return {
            totalXP,
            totalXPBytes,
            completedProjects,
            failedProjects,
            auditRatio: auditRatio.toFixed(2),
            auditsDone: this.userData.auditsDone || 0,
            auditsReceived: this.userData.auditsReceived || 0
        };
    }

    render() {
        const stats = this.calculateStats();
        
        const div = document.createElement('div');
        div.className = 'space-y-6 animate-fade-in';
        
        div.innerHTML = `
            ${this.renderStatsOverview(stats)}
            <div class="card">
                <h3 class="text-xl font-semibold text-secondary-900 mb-4">Quick Overview</h3>
                <p class="text-secondary-600">
                    Welcome to your dashboard! Use the navigation above to explore detailed statistics for <strong>Module #75</strong>:
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div class="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                        <h4 class="font-semibold text-primary-700 mb-2">📈 XP Progress</h4>
                        <p class="text-sm text-primary-600">Track your experience points over time for Module #75 and see your learning journey.</p>
                    </div>
                    <div class="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                        <h4 class="font-semibold text-green-700 mb-2">📊 Projects</h4>
                        <p class="text-sm text-green-600">View your Module #75 project completion rates and success statistics.</p>
                    </div>
                    <div class="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                        <h4 class="font-semibold text-purple-700 mb-2">🔍 Audits</h4>
                        <p class="text-sm text-purple-600">Analyze your Module #75 audit activity and peer review participation.</p>
                    </div>
                    <div class="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <h4 class="font-semibold text-orange-700 mb-2">🎯 Skills</h4>
                        <p class="text-sm text-orange-600">Explore your Module #75 skill distribution and areas of expertise.</p>
                    </div>
                </div>
            </div>
        `;

        this.element = div;
        return this.element;
    }

    renderStatsOverview(stats) {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-secondary-600">Total XP (Module #75)</p>
                            <p class="text-2xl font-bold text-primary-600">${stats.totalXP}</p>
                            <p class="text-xs text-secondary-500">${stats.totalXPBytes.toLocaleString()} bytes</p>
                        </div>
                        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-secondary-600">Completed Projects</p>
                            <p class="text-2xl font-bold text-green-600">${stats.completedProjects}</p>
                            <p class="text-xs text-secondary-500">Module #75</p>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-secondary-600">Failed Projects</p>
                            <p class="text-2xl font-bold text-red-600">${stats.failedProjects}</p>
                            <p class="text-xs text-secondary-500">Module #75</p>
                        </div>
                        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-secondary-600">Audit Ratio</p>
                            <p class="text-2xl font-bold text-purple-600">${stats.auditRatio}</p>
                            <p class="text-xs text-secondary-500">${stats.auditsDone} done / ${stats.auditsReceived} received</p>
                        </div>
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    show(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}
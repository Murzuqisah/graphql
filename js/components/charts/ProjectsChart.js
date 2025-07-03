export class ProjectsChart {
    constructor(progress) {
        this.progress = progress;
        this.element = null;
    }

    processData() {
        // Filter for completed projects only and count unique projects
        const completedProjects = this.progress.filter(p => p.isDone && p.object && p.object.type === "project");
        
        // Use Set to count unique projects to avoid counting redone projects
        const passedProjectIds = new Set(
            completedProjects
                .filter(p => p.grade >= 1)
                .map(p => p.object.id)
        );
        const failedProjectIds = new Set(
            completedProjects
                .filter(p => p.grade < 1)
                .map(p => p.object.id)
        );
        
        const passed = passedProjectIds.size;
        const failed = failedProjectIds.size;
        const total = passed + failed;

        return {
            passed,
            failed,
            total,
            passRate: total > 0 ? (passed / total) * 100 : 0,
        };
    }

    render() {
        const chartData = this.processData();
        
        if (chartData.total === 0) {
            return this.renderEmptyState();
        }

        const radius = 120;
        const strokeWidth = 20;
        const center = radius + strokeWidth;
        const circumference = 2 * Math.PI * radius;
        const passedOffset = circumference - (chartData.passed / chartData.total) * circumference;
        const failedOffset = circumference - (chartData.failed / chartData.total) * circumference;

        const div = document.createElement('div');
        div.className = 'w-full';
        
        div.innerHTML = `
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-secondary-900 mb-2">Project Success Rate</h4>
                <p class="text-sm text-secondary-600">
                    Pass rate: <span class="font-semibold text-green-600">${chartData.passRate.toFixed(1)}%</span>
                </p>
            </div>

            <div class="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12">
                <div class="relative">
                    <svg width="${center * 2}" height="${center * 2}" class="transform -rotate-90">
                        <circle
                            cx="${center}"
                            cy="${center}"
                            r="${radius}"
                            fill="none"
                            stroke="#f1f5f9"
                            stroke-width="${strokeWidth}"
                        />
                        
                        <circle
                            cx="${center}"
                            cy="${center}"
                            r="${radius}"
                            fill="none"
                            stroke="#10b981"
                            stroke-width="${strokeWidth}"
                            stroke-dasharray="${circumference}"
                            stroke-dashoffset="${passedOffset}"
                            stroke-linecap="round"
                            class="transition-all duration-1000 ease-out"
                        />
                        
                        <circle
                            cx="${center}"
                            cy="${center}"
                            r="${radius}"
                            fill="none"
                            stroke="#ef4444"
                            stroke-width="${strokeWidth}"
                            stroke-dasharray="${circumference}"
                            stroke-dashoffset="${failedOffset}"
                            stroke-linecap="round"
                            class="transition-all duration-1000 ease-out"
                            style="transform: rotate(${(chartData.passed / chartData.total) * 360}deg); transform-origin: ${center}px ${center}px;"
                        />
                    </svg>
                    
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-secondary-900">${chartData.total}</div>
                            <div class="text-sm text-secondary-600">Total Projects</div>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    ${this.renderLegend(chartData)}
                    ${this.renderRecentProjects()}
                </div>
            </div>
        `;

        this.element = div;
        return this.element;
    }

    renderLegend(chartData) {
        return `
            <div class="space-y-4">
                <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div class="flex-1">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-secondary-700">Passed</span>
                            <span class="text-sm font-bold text-green-600">${chartData.passed}</span>
                        </div>
                        <div class="w-32 bg-secondary-200 rounded-full h-2 mt-1">
                            <div
                                class="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                style="width: ${(chartData.passed / chartData.total) * 100}%"
                            ></div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                    <div class="flex-1">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-secondary-700">Failed</span>
                            <span class="text-sm font-bold text-red-600">${chartData.failed}</span>
                        </div>
                        <div class="w-32 bg-secondary-200 rounded-full h-2 mt-1">
                            <div
                                class="bg-red-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                style="width: ${(chartData.failed / chartData.total) * 100}%"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-center h-64 text-secondary-500';
        div.innerHTML = `
            <div class="text-center">
                <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                </svg>
                <p>No project data available</p>
            </div>
        `;
        return div;
    }

    show(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}
export class SkillsChart {
    constructor(skills) {
        this.skills = skills;
        this.element = null;
    }

    processData() {
        const skillMap = new Map();
        
        this.skills.forEach(skill => {
            const skillName = skill.type.replace('skill_', '').replace(/_/g, ' ');
            const currentAmount = skillMap.get(skillName) || 0;
            skillMap.set(skillName, currentAmount + skill.amount);
        });

        return Array.from(skillMap.entries())
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 8);
    }

    render() {
        const chartData = this.processData();
        
        if (chartData.length === 0) {
            return this.renderEmptyState();
        }

        const maxAmount = Math.max(...chartData.map(d => d.amount));
        const colors = [
            '#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b',
            '#ef4444', '#06b6d4', '#84cc16', '#f97316'
        ];

        const radius = 100;
        const center = 150;
        const total = chartData.reduce((sum, skill) => sum + skill.amount, 0);

        const pieSlices = this.calculatePieSlices(chartData, total, radius, center, colors);

        const div = document.createElement('div');
        div.className = 'w-full';
        
        div.innerHTML = `
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-secondary-900 mb-2">Skills Distribution</h4>
                <p class="text-sm text-secondary-600">
                    Top skills based on accumulated points
                </p>
            </div>

            <div class="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12">
                <div class="relative">
                    <svg width="${center * 2}" height="${center * 2}" class="drop-shadow-sm">
                        ${pieSlices.map((slice, index) => `
                            <path
                                d="${slice.pathData}"
                                fill="${slice.color}"
                                stroke="white"
                                stroke-width="2"
                                class="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                            >
                                <title>
                                    ${slice.name}: ${slice.amount} points (${slice.percentage.toFixed(1)}%)
                                </title>
                            </path>
                        `).join('')}
                    </svg>
                </div>

                ${this.renderSkillsBreakdown(chartData, colors, maxAmount, total)}
            </div>
        `;

        this.element = div;
        return this.element;
    }

    calculatePieSlices(chartData, total, radius, center, colors) {
        let currentAngle = 0;
        return chartData.map((skill, index) => {
            const percentage = skill.amount / total;
            const angle = percentage * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
                `M ${center} ${center}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return {
                ...skill,
                pathData,
                color: colors[index % colors.length],
                percentage: percentage * 100,
                startAngle,
                endAngle,
            };
        });
    }

    renderSkillsBreakdown(chartData, colors, maxAmount, total) {
        return `
            <div class="space-y-4 w-full max-w-sm">
                <h5 class="text-sm font-semibold text-secondary-900">Skills Breakdown</h5>
                
                <div class="space-y-3 max-h-64 overflow-y-auto">
                    ${chartData.map((skill, index) => `
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-4 h-4 rounded-full flex-shrink-0"
                                style="background-color: ${colors[index % colors.length]}"
                            ></div>
                            
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-sm font-medium text-secondary-700 truncate capitalize">
                                        ${skill.name}
                                    </span>
                                    <span class="text-sm font-bold text-secondary-900 ml-2">
                                        ${skill.amount}
                                    </span>
                                </div>
                                
                                <div class="w-full bg-secondary-200 rounded-full h-2">
                                    <div
                                        class="h-2 rounded-full transition-all duration-1000 ease-out"
                                        style="width: ${(skill.amount / maxAmount) * 100}%; background-color: ${colors[index % colors.length]}"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="pt-3 border-t border-secondary-200">
                    <div class="flex justify-between items-center text-sm">
                        <span class="font-medium text-secondary-700">Total Points:</span>
                        <span class="font-bold text-secondary-900">${total}</span>
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p>No skills data available</p>
            </div>
        `;
        return div;
    }

    show(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}
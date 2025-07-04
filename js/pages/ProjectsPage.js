import { AuthManager } from '../utils/auth.js';
import { GraphQLClient } from '../utils/graphql.js';
import { Navigation } from '../components/Navigation.js';
import { ProjectsChart } from '../components/charts/ProjectsChart.js';

export class ProjectsPage {
    constructor(onLogout, userData) {
        this.onLogout = onLogout;
        this.userData = userData;
        this.element = null;
        this.currentDisplayCount = 5;
        this.projectsPerLoad = 5;
        this.filteredProjects = [];
    }

    render() {
        const div = document.createElement('div');
        div.className = 'min-h-screen bg-secondary-50';

        div.innerHTML = `
            <header class="bg-white shadow-sm border-b border-secondary-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h1 class="text-xl font-semibold text-secondary-900">Projects Dashboard</h1>
                        </div>
                        <button
                            id="logout-button"
                            class="btn-secondary flex items-center"
                        >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="space-y-8">
                    <div id="navigation"></div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div class="card">
                            <div class="mb-4">
                                <h3 class="text-xl font-semibold text-secondary-900 mb-2">Project Performance</h3>
                                <p class="text-sm text-secondary-600">Success rate and completion statistics</p>
                            </div>
                            <div id="chart-container" class="h-80"></div>
                        </div>

                        <div class="card">
                            <div class="mb-6">
                                <h3 class="text-xl font-semibold text-secondary-900 mb-2">Project Metrics</h3>
                                <p class="text-sm text-secondary-600">Module #75 performance overview</p>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-6 mb-8">
                                <div class="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                                    <div class="flex items-center justify-center mb-3">
                                        <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="text-3xl font-bold text-red-700 mb-2" id="failed-count">-</div>
                                    <div class="text-lg font-medium text-red-600">Failed Projects</div>
                                    <div class="text-sm text-red-500 mt-2" id="failed-percentage">-</div>
                                </div>

                                <div class="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                                    <div class="flex items-center justify-center mb-3">
                                        <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="text-3xl font-bold text-green-700 mb-2" id="passed-count">-</div>
                                    <div class="text-lg font-medium text-green-600">Passed Projects</div>
                                    <div class="text-sm text-green-500 mt-2" id="passed-percentage">-</div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="flex justify-between items-center p-4 bg-secondary-50 rounded-lg">
                                    <span class="text-lg font-medium text-secondary-700">Total Projects</span>
                                    <span class="text-xl font-bold text-secondary-900" id="total-projects">-</span>
                                </div>
                                <div class="flex justify-between items-center p-4 bg-secondary-50 rounded-lg">
                                    <span class="text-lg font-medium text-secondary-700">Success Rate</span>
                                    <span class="text-xl font-bold text-primary-600" id="success-rate">-</span>
                                </div>
                                <div class="flex justify-between items-center p-4 bg-secondary-50 rounded-lg">
                                    <span class="text-lg font-medium text-secondary-700">Average Grade</span>
                                    <span class="text-xl font-bold text-purple-600" id="average-grade">-</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <h3 class="text-xl font-semibold text-secondary-900 mb-2">Recent Projects</h3>
                                <p class="text-sm text-secondary-600">Chronological list of all Module #75 projects</p>
                            </div>
                            <div class="flex items-center space-x-4">
                                <select id="filter-status" class="input-field text-sm">
                                    <option value="all">All Projects</option>
                                    <option value="passed">Passed Only</option>
                                    <option value="failed">Failed Only</option>
                                    <option value="in-progress">In Progress</option>
                                </select>
                                <select id="sort-order" class="input-field text-sm">
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="grade-high">Highest Grade</option>
                                    <option value="grade-low">Lowest Grade</option>
                                </select>
                            </div>
                        </div>
                        
                        <div id="projects-list" class="space-y-4"></div>
                        
                        <div id="view-more-section" class="mt-8 pt-6 border-t border-secondary-200 text-center">
                            <div class="mb-4">
                                <span class="text-sm text-secondary-600">
                                    Showing <span id="showing-count">-</span> of <span id="total-count">-</span> projects
                                </span>
                            </div>
                            <button 
                                id="view-more-btn" 
                                class="btn-primary px-6 py-3 text-sm font-medium"
                                style="display: none;"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                                View More Projects
                            </button>
                            <div id="all-loaded-message" class="text-sm text-secondary-500" style="display: none;">
                                All projects have been loaded
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        `;

        this.element = div;
        this.setupEventListeners();
        this.renderNavigation();
        
        // Chain the rendering functions to ensure data is fetched and processed in order
        this.renderProjectsList().then(() => {
            this.renderMetrics();
            this.renderChart();
        });

        return this.element;
    }

    setupEventListeners() {
        const logoutButton = this.element.querySelector('#logout-button');
        logoutButton.addEventListener('click', () => {
            this.handleLogout();
        });

        // Filter and sort event listeners
        const filterStatus = this.element.querySelector('#filter-status');
        const sortOrder = this.element.querySelector('#sort-order');

        filterStatus.addEventListener('change', () => {
            this.currentDisplayCount = this.projectsPerLoad; // Reset display count
            this.renderProjectsList();
        });

        sortOrder.addEventListener('change', () => {
            this.currentDisplayCount = this.projectsPerLoad; // Reset display count
            this.renderProjectsList();
        });

        // View More button event listener
        const viewMoreBtn = this.element.querySelector('#view-more-btn');
        viewMoreBtn.addEventListener('click', () => {
            this.loadMoreProjects();
        });
    }

    renderNavigation() {
        const navContainer = this.element.querySelector('#navigation');
        const navigation = new Navigation('projects');
        navigation.show(navContainer);
    }

    renderChart() {
        const chartContainer = this.element.querySelector('#chart-container');
        const projectsChart = new ProjectsChart(this.filteredProjects);
        projectsChart.show(chartContainer);
    }

    renderMetrics() {
        const event75Projects = this.filteredProjects.filter(p => p.isDone);

        const passedProjects = event75Projects.filter(p => p.grade >= 1);
        const failedProjects = event75Projects.filter(p => p.grade < 1);
        const totalProjects = event75Projects.length;

        const successRate = totalProjects > 0 ? (passedProjects.length / totalProjects) * 100 : 0;
        const averageGrade = totalProjects > 0 ?
            event75Projects.reduce((sum, p) => sum + p.grade, 0) / totalProjects : 0;

        this.element.querySelector('#failed-count').textContent = failedProjects.length;
        this.element.querySelector('#passed-count').textContent = passedProjects.length;
        this.element.querySelector('#total-projects').textContent = totalProjects;
        this.element.querySelector('#success-rate').textContent = `${successRate.toFixed(1)}%`;
        this.element.querySelector('#average-grade').textContent = averageGrade.toFixed(2);

        const failedPercentage = totalProjects > 0 ? (failedProjects.length / totalProjects) * 100 : 0;
        const passedPercentage = totalProjects > 0 ? (passedProjects.length / totalProjects) * 100 : 0;

        this.element.querySelector('#failed-percentage').textContent = `${failedPercentage.toFixed(1)}% of total`;
        this.element.querySelector('#passed-percentage').textContent = `${passedPercentage.toFixed(1)}% of total`;
    }

    async getFilteredAndSortedProjects() {
        const filterStatus = this.element.querySelector('#filter-status').value;
        const sortOrder = this.element.querySelector('#sort-order').value;

        // Data is now fetched and filtered by the GraphQL query, so we just need to get it.
        const userId = this.userData.user[0].id; // Assuming this is how you get the user ID
        const updatedData = await GraphQLClient.getUserData(userId, filterStatus, sortOrder);
        
        return updatedData.progress;
    }

    async renderProjectsList() {
        this.filteredProjects = await this.getFilteredAndSortedProjects();
        const projectsList = this.element.querySelector('#projects-list');

        if (this.filteredProjects.length === 0) {
            projectsList.innerHTML = `
                <div class="text-center py-12">
                    <svg class="w-12 h-12 mx-auto mb-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="text-secondary-500">No projects found matching the current filter</p>
                </div>
            `;
            this.updateViewMoreSection();
            return;
        }

        const projectsToShow = this.filteredProjects.slice(0, this.currentDisplayCount);

        projectsList.innerHTML = projectsToShow.map(project => {
            const status = project.isDone ? (project.grade >= 1 ? 'passed' : 'failed') : 'in-progress';
            const statusColor = status === 'passed' ? 'green' : status === 'failed' ? 'red' : 'yellow';
            const gradeDisplay = project.isDone ? project.grade.toFixed(2) : 'In Progress';

            return `
                <div class="bg-white p-6 rounded-lg border border-secondary-200 hover:shadow-md transition-shadow duration-200 animate-fade-in">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-4 mb-3">
                                <h4 class="text-lg font-semibold text-secondary-900">${project.object.name}</h4>
                                <span class="px-3 py-1 text-sm font-medium rounded-full ${status === 'passed' ? 'bg-green-100 text-green-800' :
                    status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                }">
                                    ${status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                            </div>
                            
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span class="text-secondary-600">Grade:</span>
                                    <span class="font-semibold text-secondary-900 ml-1">${gradeDisplay}</span>
                                </div>
                                <div>
                                    <span class="text-secondary-600">Started:</span>
                                    <span class="font-semibold text-secondary-900 ml-1">
                                        ${new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span class="text-secondary-600">Updated:</span>
                                    <span class="font-semibold text-secondary-900 ml-1">
                                        ${new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span class="text-secondary-600">Status:</span>
                                    <span class="font-semibold text-secondary-900 ml-1">
                                        ${project.isDone ? 'Completed' : 'In Progress'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="ml-6 text-right">
                            <div class="text-2xl font-bold text-${statusColor}-600 mb-1">
                                ${project.isDone ? (project.grade >= 1 ? '✓' : '✗') : '⏳'}
                            </div>
                            <div class="text-sm text-secondary-500">
                                ${this.getProjectDuration(project)}
                            </div>
                        </div>
                    </div>
                    
                    ${project.isDone && project.grade >= 1 ? `
                        <div class="mt-4 pt-4 border-t border-secondary-200">
                            <div class="w-full bg-secondary-200 rounded-full h-2">
                                <div class="bg-green-500 h-2 rounded-full transition-all duration-500" 
                                     style="width: ${Math.min(100, (project.grade / 1) * 100)}%"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        this.updateViewMoreSection();
    }

    updateViewMoreSection() {
        const showingCount = Math.min(this.currentDisplayCount, this.filteredProjects.length);
        const totalCount = this.filteredProjects.length;
        const hasMoreProjects = showingCount < totalCount;

        // Update counters
        this.element.querySelector('#showing-count').textContent = showingCount;
        this.element.querySelector('#total-count').textContent = totalCount;

        // Show/hide view more button and message
        const viewMoreBtn = this.element.querySelector('#view-more-btn');
        const allLoadedMessage = this.element.querySelector('#all-loaded-message');

        if (hasMoreProjects) {
            viewMoreBtn.style.display = 'inline-flex';
            allLoadedMessage.style.display = 'none';

            // Update button text with remaining count
            const remainingCount = totalCount - showingCount;
            const loadCount = Math.min(this.projectsPerLoad, remainingCount);
            viewMoreBtn.innerHTML = `
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                View ${loadCount} More Project${loadCount > 1 ? 's' : ''} (${remainingCount} remaining)
            `;
        } else {
            viewMoreBtn.style.display = 'none';
            if (totalCount > this.projectsPerLoad) {
                allLoadedMessage.style.display = 'block';
            } else {
                allLoadedMessage.style.display = 'none';
            }
        }
    }

    loadMoreProjects() {
        this.currentDisplayCount += this.projectsPerLoad;
        this.renderProjectsList();

        // Add smooth scroll to the newly loaded content
        setTimeout(() => {
            const projectsList = this.element.querySelector('#projects-list');
            const newItems = projectsList.querySelectorAll('.animate-fade-in');
            if (newItems.length > 0) {
                const lastVisibleItem = newItems[Math.max(0, newItems.length - this.projectsPerLoad)];
                if (lastVisibleItem) {
                    lastVisibleItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        }, 100);
    }

    getProjectDuration(project) {
        const start = new Date(project.createdAt);
        const end = project.updatedAt ? new Date(project.updatedAt) : new Date();
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 day';
        if (diffDays < 7) return `${diffDays} days`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
        return `${Math.floor(diffDays / 30)} months`;
    }

    handleLogout() {
        AuthManager.removeAuthToken();
        this.onLogout();
    }

    show(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}
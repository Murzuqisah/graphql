export class LoadingTemplate {
    static create() {
        const div = document.createElement('div');
        div.className = 'min-h-screen flex items-center justify-center bg-secondary-50';
        
        div.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                <h2 class="text-xl font-semibold text-secondary-900 mb-2">Loading Profile</h2>
                <p class="text-secondary-600">Fetching your data from GraphQL...</p>
            </div>
        `;
        
        return div;
    }
}
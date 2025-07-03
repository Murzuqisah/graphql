import { ApiClient } from '../utils/api.js';
import { AuthManager } from '../utils/auth.js';
import { LoginTemplate } from './templates/LoginTemplate.js';

export class Login {
    constructor(onLogin) {
        this.onLogin = onLogin;
        this.element = null;
        this.isLoading = false;
    }

    render() {
        this.element = LoginTemplate.create();
        this.setupEventListeners();
        return this.element;
    }

    setupEventListeners() {
        const form = this.element.querySelector('#login-form');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(e);
        });
    }

    async handleSubmit(e) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const form = e.target;
        const credentials = form.querySelector('#credentials').value;
        const password = form.querySelector('#password').value;
        const button = form.querySelector('#login-button');
        const errorDiv = form.querySelector('#error-message');
        const errorText = form.querySelector('#error-text');

        // Update button state
        button.disabled = true;
        button.innerHTML = `
            <div class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
            </div>
        `;

        try {
            const token = await ApiClient.signIn(credentials, password);
            AuthManager.setAuthToken(token);
            errorDiv.classList.add('hidden');
            this.onLogin();
        } catch (err) {
            errorText.textContent = err.message;
            errorDiv.classList.remove('hidden');
        } finally {
            this.isLoading = false;
            button.disabled = false;
            button.textContent = 'Sign In';
        }
    }

    show(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}
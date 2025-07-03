export class LoginTemplate {
    static create() {
        const div = document.createElement('div');
        div.className = 'min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 px-4';
        
        div.innerHTML = `
            <div class="max-w-md w-full">
                <div class="card animate-fade-in">
                    <div class="text-center mb-8">
                        <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 class="text-2xl font-bold text-secondary-900">Welcome Back</h1>
                        <p class="text-secondary-600 mt-2">Sign in to access your profile</p>
                    </div>

                    <form id="login-form" class="space-y-6">
                        <div>
                            <label for="credentials" class="block text-sm font-medium text-secondary-700 mb-2">
                                Username or Email
                            </label>
                            <input
                                id="credentials"
                                type="text"
                                class="input-field"
                                placeholder="Enter your username or email"
                                required
                            />
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-secondary-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                class="input-field"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div id="error-message" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-slide-up">
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                </svg>
                                <span id="error-text"></span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            id="login-button"
                            class="w-full btn-primary"
                        >
                            Sign In
                        </button>
                    </form>

                    <div class="mt-6 text-center text-sm text-secondary-600">
                        <p>Use your Zone01 Kisumu credentials</p>
                    </div>
                </div>
            </div>
        `;
        
        return div;
    }
}
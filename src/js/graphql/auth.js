export class AuthManager {
    static AUTH_TOKEN_KEY = 'authToken';

    static setAuthToken(token) {
        localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    }

    static getAuthToken() {
        return localStorage.getItem(this.AUTH_TOKEN_KEY);
    }

    static removeAuthToken() {
        localStorage.removeItem(this.AUTH_TOKEN_KEY);
        localStorage.removeItem('currentUser');
    }

    static isAuthenticated() {
        const token = this.getAuthToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (!payload) return false;

            const currentTime = Date.now() / 1000;
            if (payload.exp && payload.exp < currentTime) {
                this.removeAuthToken();
                return false;
            }
            return true;
        } catch {
            this.removeAuthToken();
            return false;
        }
    }
}
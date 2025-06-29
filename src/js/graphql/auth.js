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

    
}
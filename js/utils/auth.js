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
            const payload = this.decodeJWT(token);
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

    static decodeJWT(token) {
        try {
            // Check if token exists and has the expected JWT format (3 parts separated by dots)
            if (!token || typeof token !== 'string') {
                return null;
            }
            
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }
            
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    }

    static getUserIdFromToken() {
        const token = this.getAuthToken();
        if (!token) return null;
        
        const decoded = this.decodeJWT(token);
        if (!decoded) return null;
        
        // Based on the JWT structure, the user ID is in the 'sub' claim
        return decoded.sub || null;
    }
}
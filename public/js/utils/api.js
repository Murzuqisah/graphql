export class ApiClient {
    static SIGNIN_ENDPOINT = 'https://learn.zone01kisumu.ke/api/auth/signin';

    static async signIn(credentials, password) {
        const authString = btoa(`${credentials}:${password}`);
        
        const response = await fetch(this.SIGNIN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid credentials. Please check your username/email and password.');
            }
            throw new Error(`Authentication failed: ${response.statusText}`);
        }

        // The response might be JSON or plain text
        const contentType = response.headers.get('content-type');
        let token;
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            token = data.token || data;
        } else {
            token = await response.text();
        }
        
        // Validate that we received a valid token
        if (!token || typeof token !== 'string' || token.trim() === '') {
            throw new Error('Invalid token received from server');
        }
        
        return token.trim();
    }
}
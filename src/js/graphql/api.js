import { AUTH_API } from "../ui/login";

export class ApiClient {
    static async signIn(credentials, password) {
        const authString = btoa(`${credentials}:${password}`);
        const response = await fetch(AUTH_API, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
            }
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Invalid credentials.");
            throw new Error("Authentication failed: ${response.statusText}");
        }

        const contentType = response.headers.get('Content-Type');
        let token;
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            token = data.token || data.jwt || data.access_token;
        } else {
            token = await response.text();
        }
    }
}
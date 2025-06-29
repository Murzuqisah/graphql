import { AuthManager } from './auth.js';

export class Client {
    static GRAPHQL_API = 'https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql';

    static async query(query, variables = {}) {
        const token = AuthManager.getAuthToken();
        if (!token) {
            throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch(this.GRAPHQL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query, variables }),
        });
    }
}
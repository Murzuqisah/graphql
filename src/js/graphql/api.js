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
    }
}
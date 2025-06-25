let token = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

export const isAuthenticated = () => {

    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp && payload.exp < currentTime) {
            logout();
            return false;
        }
        return true;
    } catch (error) {
        logout();
        return false;
    }
};

// login functionality
export async function login(identifier, password) {
    const isEmail = identifier.includes('@')

    const query = `
    mutation {
    login(
    ${isEmail ? 'email' : 'username'}: '${identifier}'
    password: ${password}'
    ) {
    token
    user {
    id
    login
    email
    }
    }
    }
    `

    try {
        const loginResponse = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ query }),
        })
        const data = await loginResponse.json()

        if (data.errors) {
            throw new Error(data.errors[0].message || 'Invalid credentials')
        }

        if (data.data && data.data.login && data.data.login.token) {
            localStorage.setItem('jwt', data.data.login.token)

            localStorage.setItem('user', JSON.stringify(data.data.login.user))

            return true
        } else {
            throw new Error('Login failed')
        }
    } catch (error) {
        console.log("Login error:", error)
        throw new Error(error.message || "Login failed. Please try again.")
    }
}
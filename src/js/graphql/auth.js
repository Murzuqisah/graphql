const API_ENDPOINT = 'https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql';

const isAuthenticated = () => {
    return localStorage.getItem('jwt') !== null
}

// login functionality
async function login(identifier, password) {
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
    }
}
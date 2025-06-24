export const queries = {
    LOGIN: `
        query Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
                token
                user {
                    id
                    username
                    email
                }
            }
        }
    `,
}
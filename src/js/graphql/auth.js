const API_ENDPOINT = 'https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql';

const isAuthenticated = () => {
    return localStorage.getItem('jwt') !== null
}

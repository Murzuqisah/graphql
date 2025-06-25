export const renderProfilePage = () => {
    const logoutBtn = root.querySelector('#logout-button');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        location.hash = '/login';
    });
}
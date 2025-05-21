export const renderProfilePage = () => {
    const logoutBtn = root.querySelector('#logout-button');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('jwt');
        location.hash = '#/login';
    });
}
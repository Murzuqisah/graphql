class App {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'login';
        this.appContainer = null;

        this.loginPage = new this.loginPage(this);

        this.init();
    }

    init() {
    }
}
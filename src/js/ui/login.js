import { DOMUtils } from '../controller.js';

class LoginPage {
  constructor(appController) {
    this.appController = appController;
  }

  render(container) {
    container.innerHTML = '';

    const pageContainer = DOMUtils.createElement('div', 'container fade-in');
    const title = DOMUtils.createElement('h1', '', 'Welcome Back');
    const form = this.createForm();

    pageContainer.appendChild(title);
    pageContainer.appendChild(form);
    container.appendChild(pageContainer);

    this.attachEventListeners();

    setTimeout(() => document.getElementById('username').focus(), 100);
  }

  createForm() {
    const form = DOMUtils.createElement('form');
    form.id = 'loginForm';

    // Create form fields
    const usernameInput = DOMUtils.createInput('text', 'username', 'Enter your username or email', true);
    const passwordInput = DOMUtils.createInput('password', 'password', 'Enter your password', true);

    const usernameGroup = DOMUtils.createFormGroup('Username or Email', usernameInput, 'username-error');
    const passwordGroup = DOMUtils.createFormGroup('Password', passwordInput, 'password-error');

    const submitButton = DOMUtils.createElement('button', '', 'Sign In');
    submitButton.type = 'submit';

    const generalError = DOMUtils.createElement('div', 'error-message');
    generalError.id = 'general-error';
    generalError.style.textAlign = 'center';
    generalError.style.marginTop = '1rem';

    form.appendChild(usernameGroup);
    form.appendChild(passwordGroup);
    form.appendChild(submitButton);
    form.appendChild(generalError);

    return form;
  }

  attachEventListeners() {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    usernameInput.addEventListener('input', () => this.validateField('username'));
    passwordInput.addEventListener('input', () => this.validateField('password'));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });
  }

  validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const value = field.value.trim();

    field.classList.remove('error');
    document.getElementById(`${fieldName}-error`).classList.remove('show');

    if (!value) {
      DOMUtils.showError(fieldName, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
      return false;
    }

    if (fieldName === 'username' && value.length < 3) {
      DOMUtils.showError(fieldName, 'Username must be at least 3 characters long');
      return false;
    }

    if (fieldName === 'password' && value.length < 6) {
      DOMUtils.showError(fieldName, 'Password must be at least 6 characters long');
      return false;
    }

    return true;
  }

  showGeneralError(message) {
    const errorElement = document.getElementById('general-error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }

  handleLogin() {
    console.log('Handling login attempt');

    DOMUtils.hideErrors();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const submitButton = document.querySelector('button[type="submit"]');

    const isUsernameValid = this.validateField('username');
    const isPasswordValid = this.validateField('password');

    if (!isUsernameValid || !isPasswordValid) {
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Signing In...';

    setTimeout(() => {
      if (username === this.validCredentials.username && password === this.validCredentials.password) {
        const userData = {
          username: username,
          email: username.includes('@') ? username : `${username}@example.com`,
          loginTime: new Date().toISOString()
        };

        console.log('Login successful', userData);
        this.appController.handleLoginSuccess(userData);
      } else {
        console.log('Login failed - invalid credentials');
        this.showGeneralError('Invalid username or password.');

        submitButton.disabled = false;
        submitButton.textContent = 'Sign In';
      }
    }, 1000);
  }
}

export { LoginPage };
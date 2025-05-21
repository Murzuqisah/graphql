let login
let navigateTo
let logout
let generateSelectedGraph
let loadProfileData

export const renderLoginPage = (root) => {
    const app = document.getElementById('app');

    const loginContainer = document.createElement('div');
    loginContainer.className = 'login-container';

    const loginCard = document.createElement('div');
    loginCard.className = 'login-card';

    const title = document.createElement('div');
    title.textContent = 'Login';

    const errorMessage = document.createElement("div")
  errorMessage.id = "error-message"
  errorMessage.className = "error-message"

  // Create form
  const form = document.createElement("form")
  form.id = "login-form"

  // Create identifier input group
  const identifierGroup = document.createElement("div")
  identifierGroup.className = "form-group"

  const identifierLabel = document.createElement("label")
  identifierLabel.setAttribute("for", "identifier")
  identifierLabel.textContent = "Username or Email"

  const identifierInput = document.createElement("input")
  identifierInput.type = "text"
  identifierInput.id = "identifier"
  identifierInput.name = "identifier"
  identifierInput.required = true

  identifierGroup.appendChild(identifierLabel)
  identifierGroup.appendChild(identifierInput)

  // Create password input group
  const passwordGroup = document.createElement("div")
  passwordGroup.className = "form-group"

  const passwordLabel = document.createElement("label")
  passwordLabel.setAttribute("for", "password")
  passwordLabel.textContent = "Password"

  const passwordInput = document.createElement("input")
  passwordInput.type = "password"
  passwordInput.id = "password"
  passwordInput.name = "password"
  passwordInput.required = true

  passwordGroup.appendChild(passwordLabel)
  passwordGroup.appendChild(passwordInput)

  // Create submit button
  const submitButton = document.createElement("button")
  submitButton.type = "submit"
  submitButton.className = "btn-primary"
  submitButton.textContent = "Login"

  // Assemble form
  form.appendChild(identifierGroup)
  form.appendChild(passwordGroup)
  form.appendChild(submitButton)

  // Assemble login card
  loginCard.appendChild(title)
  loginCard.appendChild(errorMessage)
  loginCard.appendChild(form)

  // Assemble login container
  loginContainer.appendChild(loginCard)

  // Replace app content
  app.innerHTML = ""
  app.appendChild(loginContainer)

  // Add event listener for form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const identifier = document.getElementById("identifier").value
    const password = document.getElementById("password").value

    try {
      errorMessage.textContent = ""
      errorMessage.style.display = "none"

      const success = await login(identifier, password)

      if (success) {
        navigateTo("/profile")
      }
    } catch (error) {
      errorMessage.textContent = error.message
      errorMessage.style.display = "block"
    }
  })
}
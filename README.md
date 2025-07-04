# graphql

A lightweight and modular GraphQL client built using Vanilla JavaScript — no frameworks, no dependencies. This project aims to become a modern, responsive web application for Zone01 Kisumu students to track their learning progress, view statistics, and manage their academic journey.

## Features

- Basic HTML5 project structure.
- A utility-first CSS design system for consistent styling.
- A modular JavaScript entry point for future application logic.

## Technology Stack

- **Vanilla JavaScript** - Modern ES6+ modules
- **CSS3** - Custom utility-first styling system
- **HTML5** - Semantic markup with templates

## Project Structure

```txt
├── public/
├── js/
│ ├── components/
│ │ ├── charts/
│ │ │ ├── AuditRatioChart.js
│ │ │ ├── ProjectsChart.js
│ │ │ ├── SkillsChart.js
│ │ │ └── XPProgressChart.js
│ │ ├── templates/
│ │ │ ├── LoadingTemplate.js
│ │ │ ├── LoginTemplate.js
│ │ │ └── ProfileTemplate.js
│ │ └── LoadingSpinner.js
│ ├── Login.js
│ ├── LoginComponent.js
│ ├── Navigation.js
│ ├── Profile.js
│ ├── Statistics.js
│ ├── UserInfo.js
│ ├── pages/
│ │ ├── AuditsPage.js
│ │ ├── ProjectsPage.js
│ │ ├── SkillsPage.js
│ │ ├── StatsPage.js
│ │ └── XPProgressPage.js
│ ├── utils/
│ │ ├── api.js
│ │ ├── auth.js
│ │ ├── config.js
│ │ ├── graph.js
│ │ ├── graphql.js
│ │ └── utils.js
│ ├── App.js
│ └── main.js
├── styles/
│ └── main.css
├── index.html
├── .gitignore
├── LICENSE
├── package-lock.json
└── package.json        # Core application styles
|-- server.js # Main server for the application
└── README.md               # Project documentation
```

## Descriptions

### Charts

Contains chart components visualising different metrics:

- `AuditRatioChart.js`: Displays audit performance ratios.
- `ProjectsChart.js`: Shows project contributions over time.
- `SkillsChart.js`: Highlights skill distribution.
- `XPProgressChart.js`: Tracks XP progress over time.

### Templates

Reusable HTML/JS templates:

- `LoginTemplate.js`: Renders login form.
- `ProfileTemplate.js`: Displays user profile.
- `LoadingTemplate.js`: Generic loading UI.

### Pages

Dynamic views rendered depending on the route or section:

- `AuditsPage.js`
- `ProjectsPage.js`
- `SkillsPage.js`
- `StatsPage.js`
- `XPProgressPage.js`

### Services and helpers

- `api.js`: API request functions.
- `auth.js`: Authentication logic.
- `config.js`: Environment/config values.
- `graph.js` & `graphql.js`: Graph data utilities.
- `utils.js`: Miscellaneous helpers.

### Logic + UI

- `App.js`: Main application entry setup.
- `main.js`: App bootstrap logic.
- `Login.js`, `LoginComponent.js`, `Navigation.js`, `Profile.js`, `Statistics.js`, `UserInfo.js`: Application sub-components.

---

## Styling

All styles are located under the `styles/` directory.

- `main.css`: Centralised styling file.

---

## Entry Point

- `index.html`: Loads the application via `main.js` and binds all components.

---

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Access to Zone01 Kisumu network

### Setup

1. Clone the repository

```bash
git clone https://github.com/Murzuqisah/graphql
cd graphql
```

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
node server.js
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

### Login

1. Enter your Zone01 Kisumu username or email
2. Provide your password
3. Click "Sign In" to authenticate

### Navigation

- **Dashboard**: Overview of your progress and statistics
- **Profile**: Personal information and account details
- **Statistics**: Detailed analytics and charts
- **Projects**: Complete project history and status
- **Skills**: Skills breakdown and progression

### Additional Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Data**: Live updates from Zone01 Kisumu systems
- **Secure Authentication**: Protected routes and data access
- **Performance Optimized**: Fast loading and smooth interactions

## Configuration

### Environment Variables

The application connects to Zone01 Kisumu's production endpoints:

- **API URL**: `https://learn.zone01kisumu.ke`
- **GraphQL Endpoint**: `/api/graphql-engine/v1/graphql`
- **Authentication Endpoint**: `/api/auth/signin`

### GraphQL Queries

The application uses GraphQL to fetch:

- User profile information
- Transaction history (XP, skills)
- Project progress and results
- Audit data and ratios

### API Authentication

- Basic authentication for login
- JWT tokens for API requests
- Automatic token refresh and validation

## Performance

### Optimization Features

- Lazy loading of components
- Efficient data caching
- Minimal bundle size
- Responsive images and assets

## Security

### Data Protection

- Secure HTTPS connections
- JWT token encryption
- No sensitive data in localStorage
- CORS protection

### Authentication

- Secure credential handling
- Token expiration management
- Automatic logout on security events

## Contributing

### Development Guidelines

### How to Contribute

We welcome contributions! To get involved:

1. **Open an Issue**  
    - Go to the [Issues](../../issues) tab and click "New Issue".
    - Describe the bug, feature request, or improvement clearly.
    - Provide steps to reproduce (if reporting a bug) or a detailed proposal (for features).

2. **Fork the Repository**  
    - Click "Fork" at the top right of the repository page.
    - Clone your fork locally:

      ```bash
      git clone https://github.com/Murzuqisah/graphql.git
      cd graphql
      ```

3. **Create a Branch**  
    - Create a new branch for your fix or feature:

      ```bash
      git checkout -b your-feature-name
      ```

4. **Make Changes**  
    - Implement your changes following the project structure and code style.
    - Test your changes locally.

5. **Commit and Push**  
    - Commit your changes with a descriptive message:

      ```bash
      git add .
      git commit -m "Describe your changes"
      git push origin your-feature-name
      ```

6. **Submit a Pull Request (PR)**  
    - Go to your fork on GitHub and click "Compare & pull request".
    - Reference the related issue number in your PR description.
    - Explain your changes and why they are needed.

7. **Review Process**  
    - The maintainers will review your PR.
    - Respond to feedback and make any requested changes.

Thank you for helping improve the project
---

## License

This project is proprietary software developed for Zone01 Kisumu. All rights reserved.

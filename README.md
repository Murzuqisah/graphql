# graphql

A lightweight and modular GraphQL client built using Vanilla JavaScript — no frameworks, no dependencies. This project demonstrates how to interact with a GraphQL API using native fetch, structured queries and mutations, and a simple, responsive UI. A modern, responsive web application for Zone01 Kisumu students to track their learning progress, view statistics, and manage their academic journey.

## Features

### Authentication

- Secure login using Zone01 Kisumu credentials
- JWT token-based authentication
- Automatic session management

### Dashboard

- Overview of key metrics (XP, projects, audit ratio, current level)
- Recent activity tracking
- Quick statistics summary
- Personalized greeting and progress indicators

### Profile Management

- User information display
- Campus and contact details
- Member since information
- Profile customization

### Project Tracking

- Complete project history
- Success/failure rates
- Project completion statistics
- Progress indicators
- Detailed project information

### Skills Analysis

- Comprehensive skills breakdown
- Skill progression tracking
- Visual skill distribution
- Top skills identification

### Statistics & Analytics

- XP progression over time
- Audit ratio calculations
- Performance metrics
- Achievement tracking

## Technology Stack

### Frontend

- **Vanilla JavaScript** - Modern ES6+ modules
- **CSS3** - Custom utility-first styling system
- **HTML5** - Semantic markup with templates
- **SVG** - Custom charts and visualizations

### Backend Integration

- **GraphQL** - Zone01 Kisumu API integration
- **REST API** - Authentication endpoints
- **JWT** - Secure token management

### Architecture

- **Component-based** - Modular UI components
- **Router system** - Client-side navigation
- **State management** - Centralized data handling
- **Responsive design** - Mobile-first approach

## Project Structure

```txt
public/
├── index.html                 # Main HTML file
├── src/
│   ├── css/
│   │   └── styles.css         # Application styles
│   └── js/
│       ├── main.js            # Application entry point
│       ├── graphql/
│       │   ├── auth.js        # Authentication management
│       │   └── queries.js     # GraphQL client & API calls
│       ├── routes/
│       │   └── route.js       # Client-side routing
│       └── ui/
│           ├── app.js         # Main application component
│           ├── login.js       # Login page component
│           ├── profile.js     # Profile page component
│           ├── config.js      # Configuration constants
│           ├── controller.js  # Application controller
│           └── components/
│               ├── LoadingSpinner.js
│               ├── UserInfo.js
│               ├── Sidebar.js
│               └── Statistics.js
├── server.js                  # Express server
└── package.json              # Dependencies and scripts
```

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Access to Zone01 Kisumu network

### Setup

1. Clone the repository

```bash
git clone https://learn.zone01kisumu.ke/git/jamos/graphql
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

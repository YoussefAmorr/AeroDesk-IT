# AeroDesk IT

AeroDesk IT is a full-stack IT service management and help-desk application built with React, Spring Boot, PostgreSQL, Spring Security, and JWT authentication. It provides separate role-based experiences for employees, technicians, and administrators while supporting the full lifecycle of an internal IT support ticket.

![AeroDesk Employee Dashboard](docs/screenshots/employee-dashboard.png)

## Overview

AeroDesk was designed to model a practical internal IT support workflow. Employees can submit and follow support requests, technicians can manage their assigned workload and update ticket progress, and administrators can oversee tickets, technician assignments, and user accounts.

The project separates frontend presentation, API communication, backend business logic, persistence, and security into dedicated layers to keep the application maintainable as it grows.

## Features

- JWT-based authentication with stateless Spring Security
- Role-based authorization for `EMPLOYEE`, `TECHNICIAN`, and `ADMIN`
- Dedicated dashboards for each user role
- Ticket creation and detailed ticket views
- Ticket status workflow and priority/category tracking
- Technician assignment and reassignment
- Ticket comments for support communication
- Ticket history/audit tracking on the backend
- Admin user management and privileged-user creation
- Ticket deletion with related-data handling
- Real-time client-side search by ticket ID, title, and requester
- Filtering by status, priority, category, and technician
- Technician views for all tickets and tickets assigned to the current technician
- Responsive dashboard, tables, forms, and modal interfaces
- Password hashing with BCrypt
- CORS configuration for the React development client

## Role-Based Workflows

| Role | Capabilities |
| --- | --- |
| **Employee** | Sign in, view personal support requests, create tickets, open ticket details, search/filter tickets, and participate in ticket comments. |
| **Technician** | View the service queue, switch to an assigned-to-me workload, search/filter tickets, open ticket details, update ticket status, and participate in comments. |
| **Administrator** | View all tickets, search/filter by technician and ticket attributes, assign technicians, update workflow status, delete tickets, view users, and create user accounts. |

## Screenshots

### Authentication

![AeroDesk Login](docs/screenshots/login.png)

### Employee Portal

Employees receive a personal support dashboard with ticket statistics, ticket creation, search, and filtering.

![Employee Dashboard](docs/screenshots/employee-dashboard.png)

### Technician Portal

Technicians can work from the full service queue or focus on tickets assigned directly to them.

![Technician Dashboard](docs/screenshots/technician-dashboard.png)

### Administrator Portal

Administrators have system-wide ticket management, including technician-based filtering and assignment workflows.

![Admin Ticket Management](docs/screenshots/admin-tickets.png)

Administrators can also review AeroDesk accounts and their assigned roles.

![Admin User Management](docs/screenshots/admin-users.png)

### Ticket Workflow

The ticket detail view brings together requester information, ticket metadata, technician assignment, workflow controls, deletion controls, and comments.

![Ticket Details](docs/screenshots/ticket-details.png)

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS
- Fetch API

**Backend**
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- OAuth2 Resource Server / JWT
- Jakarta Validation
- Hibernate

**Database & Security**
- PostgreSQL
- BCrypt password hashing
- HMAC-SHA256 signed JWTs
- Role-based endpoint authorization

**Development**
- Maven
- npm
- Git / GitHub
- IntelliJ IDEA

## Architecture

```text
React + Vite
     |
     | HTTP / JSON + Bearer JWT
     v
Spring Boot REST API
     |
     +-- Controllers
     |     AuthController
     |     TicketController
     |     UserController
     |
     +-- Services
     |     AuthService
     |     JwtService
     |     TicketService
     |     UserService
     |
     +-- Repositories
     |     TicketRepository
     |     TicketCommentRepository
     |     TicketHistoryRepository
     |     UserRepository
     |
     +-- JPA Models
           User
           Ticket
           TicketComment
           TicketHistory
     |
     v
PostgreSQL
```

The React frontend is also divided into `pages`, reusable `components`, and `services`. API requests are kept in dedicated service modules rather than embedded throughout the UI components.

## Project Structure

```text
AeroDeskIT/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── CreateTicketModal.jsx
│       │   ├── CreateUserModal.jsx
│       │   ├── DashboardHeader.jsx
│       │   ├── TicketDetailsModal.jsx
│       │   ├── TicketFilters.jsx
│       │   └── TicketTable.jsx
│       ├── pages/
│       │   ├── AdminDashboard.jsx
│       │   ├── EmployeeDashboard.jsx
│       │   ├── LoginPage.jsx
│       │   └── TechnicianDashboard.jsx
│       ├── services/
│       │   ├── authService.js
│       │   ├── ticketService.js
│       │   └── userService.js
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── src/
│   ├── main/
│   │   ├── java/com/aerodesk/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── enums/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   └── resources/
│   │       └── application.properties.example
│   └── test/
├── pom.xml
├── mvnw
└── mvnw.cmd
```

## Security

AeroDesk uses stateless JWT authentication. After a successful login, the backend issues a signed token that the frontend sends in the `Authorization` header for protected API requests.

Spring Security maps the token's role claim to application authorities and protects endpoints based on user role. Administrative operations such as privileged-user creation, ticket assignment, and ticket deletion are restricted to administrators, while ticket workflows are available according to the configured Employee, Technician, and Admin permissions.

Passwords are stored as BCrypt hashes rather than plaintext.

> [!IMPORTANT]
> The real `application.properties` file should remain local and must not be committed. The repository includes `application.properties.example` so developers can configure their own environment without exposing database credentials or JWT secrets.

## Running AeroDesk Locally

### Prerequisites

Install:

- Java compatible with the version configured in `pom.xml`
- Maven, or use the included Maven Wrapper
- Node.js and npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/YoussefAmorr/AeroDesk-IT.git
cd AeroDeskIT
```

### 2. Configure PostgreSQL

Create a PostgreSQL database for AeroDesk.

Copy:

```text
src/main/resources/application.properties.example
```

to:

```text
src/main/resources/application.properties
```

Then fill in your local database credentials and JWT secret using the example file as the template.

Do **not** commit the real `application.properties`.

### 3. Start the backend

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

On macOS/Linux:

```bash
./mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### 4. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server runs on:

```text
http://localhost:5173
```

Open that address in your browser and sign in with a user that exists in your local AeroDesk database.

## API Overview

The application is organized around three main API areas:

```text
/api/auth/**       Authentication
/api/tickets/**    Ticket workflows, comments, assignment, and history
/api/users/**      User retrieval and administration
```

Protected requests use:

```text
Authorization: Bearer <JWT>
```

Authorization is enforced by Spring Security on the backend rather than relying only on frontend role checks.

## What This Project Demonstrates

AeroDesk demonstrates practical full-stack development beyond basic CRUD screens, including:

- designing a layered Spring Boot REST API
- implementing authentication and authorization
- connecting React to authenticated backend services
- modeling relational data with JPA
- handling role-specific application workflows
- maintaining ticket comments and history
- building reusable React components
- separating frontend API services from UI logic
- implementing search and multi-criteria filtering
- managing application state across several role-based dashboards
- working with Git throughout incremental feature development and refactoring

## Future Improvements

Potential next steps include automated backend and frontend test coverage, pagination for larger ticket queues, richer loading/error feedback, configurable ticket categories, email notifications, reporting/analytics, refresh-token support, and production deployment.

## Author

Built as a full-stack portfolio project demonstrating Java/Spring Boot backend development, React frontend development, relational database design, REST APIs, authentication, authorization, and IT service-management workflows.

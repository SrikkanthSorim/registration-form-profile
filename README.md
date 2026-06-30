# Registration Form Profile

Simple full-stack application with React frontend and Java 11 Spring Boot backend.

## Tech Stack

- Backend: Java 11, Spring Boot, Spring Web, Spring Data JPA, H2 Database
- Frontend: React, React Router, Axios
- No OAuth
- No JWT
- No Spring Security

## Project Structure

```text
registration-form-profile/
├── backend/
└── frontend/
```

## Run Backend

```bash
cd backend
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

H2 Console:

```text
http://localhost:8080/h2-console
```

JDBC URL:

```text
jdbc:h2:mem:userdb
```

Username:

```text
sa
```

Password is empty.

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## APIs

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/profile/{email}`

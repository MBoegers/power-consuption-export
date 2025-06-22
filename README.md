# Disclaimer

This application was generated entirely by GitHub Copilot and has intentionally not been manually reviewed or edited. Use at your own risk.

---

# Power Consumption Exporter

This project is a fullstack web application for importing, aggregating, and exporting power consumption data.

## Features

- **CSV Import**: Import time series power consumption data via CSV.
- **Aggregation**: Data is aggregated into 30-minute intervals.
- **Export**: Export aggregated data as CSV or JSON for a selectable date range.
- **User Authentication**: Access to export/import is protected by JWT (locally signed, no external identity provider required).
- **Multi-user**: Multiple users can use the application simultaneously.
- **Integration Tests**: End-to-end tests for import, storage, and export.

## Technology Stack

- **Backend**: Java 21, Spring Boot 2.7, Spring Security (JWT, HMAC), JPA, H2 (demo)
- **Frontend**: React 17, TypeScript, axios, react-router-dom, jwt-decode
- **Build**: Gradle (builds backend and frontend together)
- **Test**: JUnit 5, MockMvc, jjwt

## Setup

### Prerequisites

- Java 21 (Temurin, recommended via [SDKMAN!](https://sdkman.io/))
- Node.js & npm (recommended: Node 18+)
- Gradle (wrapper included)

### Build Backend & Frontend Together

```sh
sdk env
./gradlew build
```

The frontend will be built automatically and copied to `src/main/resources/static`.

### Start Application

```sh
sdk env
./gradlew bootRun
```

The application will be available at [http://localhost:8080](http://localhost:8080).

### Frontend Development (Hot Reload)

```sh
cd frontend
npm start
```
The React frontend will run at [http://localhost:3000](http://localhost:3000).

## Authentication

- JWTs are signed with a local HMAC key (`testtesttesttesttesttesttesttest`).
- For tests, a valid token is generated automatically.
- No external identity provider is required.

## Example of a Valid JWT (HMAC SHA256)

Payload:
```json
{ "sub": "testuser", "exp": ... }
```
Sign with the key: `testtesttesttesttesttesttesttest`

## Tests

All backend and integration tests can be run with:

```sh
./gradlew test
```

## License

MIT


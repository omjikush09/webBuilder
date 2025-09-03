# Website Builder Backend

A Node.js/Express.js backend API for the Website Builder application.

## Features

- Express.js 5.x with TypeScript
- Security middleware (Helmet, CORS)
- Request logging (Morgan)
- Environment variable support
- Health check endpoint
- Error handling middleware

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/website_builder"

# Server Configuration
PORT=8000

# Environment
NODE_ENV=development
```

### Database Setup

1. Install PostgreSQL
2. Create a database named `website_builder`
3. Update the DATABASE_URL with your PostgreSQL credentials
4. Run database migrations (when implemented)

## Prerequisites

- Node.js 18+
- pnpm

## Installation

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration.

## Development

Start the development server with hot reload:

```bash
pnpm dev
```

The server will start on `http://localhost:3001`

## Production

Build the application:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api` - API information

## Project Structure

```
src/
├── app.ts          # Main application file
├── routes/         # API routes
│   └── index.ts    # Route definitions
└── ...
```

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm test` - Run tests (not configured yet)

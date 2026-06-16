# Management

A user profile manager built with Laravel 13, Inertia.js v3, React 19, Tailwind CSS 4, and shadcn/ui — running on Laravel Sail (Docker).

## Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, PHP 8.5 |
| Auth | Laravel Fortify |
| Frontend bridge | Inertia.js v3 |
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Database | MySQL 8.4 |
| Dev environment | Laravel Sail (Docker) |
| Build tool | Vite |
| Type-safe routes | Laravel Wayfinder |

## Features

- User registration and login with success alerts
- User profile CRUD (create, edit, delete) from a single dashboard
- Separate `profiles` table linked one-to-one to `users`
- shadcn/ui Alert component with `default`, `success`, `warning`, and `destructive` variants

## Requirements

- Docker Desktop
- PHP (for the initial `laravel new` scaffold only)
- GitHub CLI (`gh`) — optional

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/kazisohrabuddintitu/management.git
cd management

# 2. Copy environment file and configure
cp .env.example .env

# 3. Install PHP dependencies and generate app key
composer install
php artisan key:generate

# 4. Add Sail alias (optional but recommended)
alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'

# 5. Start Docker containers
sail up -d

# 6. Install JS dependencies (Linux binaries for Docker)
sail npm install

# 7. Run migrations
sail artisan migrate

# 8. Start Vite dev server (keep this terminal open)
sail npm run dev
```

Open **http://localhost** in your browser.

## .env notes

- `DB_HOST=mysql` — use the Docker service name, not `127.0.0.1`
- `FORWARD_DB_PORT=3307` — avoids conflict if local MySQL is running on 3306
- `APP_URL=http://localhost` — Sail serves on port 80

## Daily Development

```bash
sail up -d          # start containers
sail npm run dev    # start Vite (in a separate terminal)
sail down           # stop containers
```

## Useful Commands

```bash
sail artisan migrate          # run migrations
sail artisan wayfinder:generate  # regenerate typed route functions after adding routes
sail artisan route:list       # list all routes
sail composer require <pkg>   # add a PHP package
sail npm install <pkg>        # add a JS package
```

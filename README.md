# Tension

## Getting Started

Ensure you've installed a version of NodeJS >= 8.0

### Run DB

1. Install PostgreSQL ([Postgres App](https://postgresapp.com/) recommended)
2. `createdb tension`
3. `psql tension`
4. `CREATE USER tension;`
5. `\q` to quit (optional)

### Run API

1. `git clone https://github.com/wrobbinz/tension.git`
2. `cd ./tension`
3. `npm i -g @adonisjs/cli`
4. `npm i`
5. `touch .env` and add DB credentials
6. `adonis migration:refresh`
7. `adonis serve --dev`

### Run UI

1. `cd ./tension/ui`
2. `npm i`
3. `npm start`

Go to `http://localhost:3000/` in your browser.

### .env

```
HOST=127.0.0.1
PORT=3333
APP_URL=http://${HOST}:${PORT}
NODE_ENV=development
CACHE_VIEWS=false
APP_KEY=UGjIxtpW6TVJGEiponnKYa3SqcwY20tB
DB_CONNECTION=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=tension
DB_PASSWORD=tension
DB_DATABASE=tension
```

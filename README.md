# url-shortener
Simple URL shortener.

## How to run

Build client:
```
cd client
npm install && npm run build
cd ..
```

Create database:
```
psql -U <username> -a -f ./server/sql/create-db.sql
```

Change database connection string and application port in `server/src/config/index.js`.

Run server:
```
cd server
npm install && node index.js
```

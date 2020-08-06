git pull
npm install
NODE_ENV=production forever --uid "frontend-server" -a start app.js

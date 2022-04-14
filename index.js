const http = require('http');
const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require('path');

const pkg = require('./package.json', 'utf-8');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const PORT_HTTP = process.env.NODE_PORT_HTTP || 80;
const PORT_HTTPS = process.env.NODE_PORT_HTTPS || 443;

const privateKey  = fs.readFileSync(path.resolve(__dirname, 'certs/cert.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, 'certs/cert.crt'), 'utf8');

const credentials = { key: privateKey, cert: certificate };

const app = express();

app.disable('x-powered-by');

app.get('/', (_, res) => {
    res.send("Running!");
});

app.use(express.static('public'))

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const serverHttp = httpServer.listen(PORT_HTTP, () => {
    console.log(`HTTP (${pkg.name}) listening at http://localhost:${PORT_HTTP}`);
    console.log(`  Test SIGTERM: "kill -15 ${process.pid}"`);
});
const serverHttps = httpsServer.listen(PORT_HTTPS, () => {
    console.log(`HTTPS (${pkg.name}) listening at https://localhost:${PORT_HTTPS}`);
    console.log(`  Test SIGTERM: "kill -15 ${process.pid}"`);
});

const shutdownServerHttp = async () => {
    // shutting down server
    return new Promise((resolve) => {
        console.log('SIGTERM signal received: closing HTTP server')
        serverHttp.close(() => {
            console.log('HTTP server closed')
            resolve();
        });
    });
};

const shutdownServerHttps = async () => {
    // shutting down server
    return new Promise((resolve) => {
        console.log('SIGTERM signal received: closing HTTPS server')
        serverHttps.close(() => {
            console.log('HTTPS server closed')
            resolve();
        });
    });
};

const shutdown = () => {
    // do not override the "process.on SIGTERM" and "process.on SIGKILL" that are defined below
    // make sure that all shutdown tasks are executed in this function
    Promise.all([
        shutdownServerHttp(),
        shutdownServerHttps()
    ]).then(() => {
        console.log('All shutdown tasks done!');
    })
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

# https-server

Just a quick local https server.

## Installation

```
npm install
npm run create-certs
```

## Run server

Note: sudo is needed to run servers on port 80 (http) and port 443 (https).

```
sudo npm start
```

Visit this URL (you will have to manually accept the certificate to access the URL):

https://localhost/index.html

## Server custom files

Just copy and override the content of the `public` directory with your own static files.

## Run with domain name

Update you hosts file with:

```
127.0.0.1   devserver.com
```

Visit:
https://devserver.com/index.html

## Change domain name

- Edit the domain and subdomain in this file: `scripts/create-certs.js`
- Delete all crt and key files in the `certs` directory
- Run `npm run create-certs` again
- update you hosts file with the new domains (see previous section)
- start server `sudo npm start`

## Change ports

you can use the following environment variables while you start the server:

```
env NODE_PORT_HTTP=8080 NODE_PORT_HTTPS=8443 npm start
```

Visit:

- http://localhost:8080/index.html
- https://localhost:8443/index.html

import fs from 'fs';

const createServer = (app, port) => {
    const certPath = process.env.APP_TLS_CERT_PATH;
    const keyPath = process.env.APP_TLS_KEY_PATH;

    if (!certPath || !keyPath) {
        console.error('TLS certificates are not provided');
    }

    const key = fs.readFileSync(keyPath, 'utf8');
    const cert = fs.readFileSync(certPath, 'utf8');

    const httpsServer = require('https').createServer({ key, cert }, app);
    console.log ("HTTPS server has been created.")
    httpsServer.listen(port, () => {
        console.log(`HTTPS server listening on port ${port}`);
    });
    return httpsServer;
};

export default {
    createServer,
};

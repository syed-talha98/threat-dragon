import express from 'express';
import path from 'path';
import rateLimit from 'express-rate-limit';
import env from './env/Env.js';
import envConfig from './config/env.config';
import expressHelper from './helpers/express.helper.js';
import httpsConfig from './helpers/https.helper.js';
import loggerHelper from './helpers/logger.helper.js';
import parsers from './config/parsers.config.js';
import routes from './config/routes.config.js';
import securityHeaders from './config/securityheaders.config.js';
import domainController from './controllers/domain.js';
import { upDir } from './helpers/path.helper.js';

const siteDir = path.join(__dirname, upDir, upDir, 'dist');
const docsDir = path.join(__dirname, upDir, upDir, 'docs');

const limiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 6000,
    standardHeaders: true,
    legacyHeaders: false,
});

const create = () => {
    let logger;

    try {
        envConfig.tryLoadDotEnv();
        loggerHelper.level(env.get().config.LOG_LEVEL);
        logger = loggerHelper.get('app.js');

        const app = expressHelper.getInstance();
        app.set('trust proxy', true);

        if (process.env.NODE_ENV === 'production') {
            app.use(limiter);
            logger.info('Apply rate limiting in production environments');
        } else {
            logger.warn('Rate limiting disabled for development environments');
        }

        securityHeaders.config(app);

        // Attempt to use TLS certificates if available
        
        const certPath = process.env.APP_TLS_CERT_PATH;
        const keyPath = process.env.APP_TLS_KEY_PATH;
        const domain = process.env.APP_TLS_HOSTNAME;

        if (certPath && keyPath && domain) {
            // Verify the domain if all TLS variables are set
            const isDomainValid = domainController.verifyDomain(keyPath, certPath, domain);
            if (isDomainValid) {
                // Create the HTTPS server
                httpsConfig.createServer(app).listen(app.get('port'), () => {
                    logger.info(`HTTPS server listening on port ${app.get('port')}`);
                });
                return app;
            } else {
                // Log the domain error
                logger.error(`Domain ${domain} is not valid for the provided certificate.`);
                logger.error('Failed to start HTTPS server:');
            }
        } else {
            // No TLS certificates available, fall back to HTTP
            logger.info('Fallback to HTTP:');
            createHttpServer(app);
        }

        // Serve static files
        app.use('/public', express.static(siteDir));
        app.use('/docs', express.static(docsDir));

        parsers.config(app);
        routes.config(app);

        app.set('port', env.get().config.PORT);
        logger.info('Express server listening on ' + app.get('port'));
        return app;

    } catch (e) {
        if (!logger) { logger = console; }
        logger.error('OWASP Threat Dragon failed to start');
        logger.error(e.message);
        throw e;
    }
};

const createHttpServer = (app) => {
    app.listen(app.get('port'), () => {
        loggerHelper.get('app.js').info(`HTTP server listening on port ${app.get('port')}`);
    });
};

export default {
    create,
};

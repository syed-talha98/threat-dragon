import express from 'express';
import path from 'path';
import rateLimit from 'express-rate-limit';
import env from './env/Env.js';
import envConfig from './config/env.config';
import expressHelper from './helpers/express.helper.js';
import httpConfig from './config/http.config.js'; // HTTPS configuration
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

        // Apply rate limiting in production
        if (process.env.NODE_ENV === 'production') {
            app.use(limiter);
            logger.info('Rate limiting applied for production environments.');
        } else {
            logger.warn('Rate limiting disabled for development environments.');
        }

        // Configure security headers
        securityHeaders.config(app);

        // Serve static files
        app.use('/public', express.static(siteDir));
        app.use('/docs', express.static(docsDir));

        // Configure parsers
        parsers.config(app);

        // Configure routes
        routes.config(app);

        // TLS setup
        if (process.env.APP_USE_TLS === 'true') {
            const certPath = process.env.APP_TLS_CERT_PATH;
            const keyPath = process.env.APP_TLS_KEY_PATH;
            const domain = process.env.APP_TLS_HOSTNAME;

            if (!certPath || !keyPath || !domain) {
                logger.error(
                    'TLS setup failed. APP_TLS_CERT_PATH, APP_TLS_KEY_PATH, or APP_TLS_HOSTNAME is missing.'
                );
                throw new Error('Missing TLS configuration.');
            }

            const isDomainValid = domainController.verifyDomain(keyPath, certPath, domain);
            if (!isDomainValid) {
                logger.error(`Domain ${domain} is invalid for the provided certificate.`);
                throw new Error('Invalid domain for TLS configuration.');
            }

            logger.info(`Domain ${domain} verified for TLS setup.`);
            try {
                const httpsServer = httpConfig.createServer(app); // Create HTTPS server
                httpsServer.listen(app.get('port'), () => {
                    logger.info(`HTTPS server listening on port ${app.get('port')}`);
                });
            } catch (e) {
                logger.error('Failed to start HTTPS server:', e.message);
                throw e;
            }
        } else {
            // Fallback to HTTP if TLS is not configured
            app.listen(app.get('port'), () => {
                logger.info(`HTTP server listening on port ${app.get('port')}`);
            });
        }

        logger.info('Express server setup completed.');
        return app;
    } catch (e) {
        if (!logger) {
            logger = console;
        }
        logger.error('OWASP Threat Dragon failed to start.');
        logger.error(e.message);
        throw e;
    }
};

export default {
    create,
};

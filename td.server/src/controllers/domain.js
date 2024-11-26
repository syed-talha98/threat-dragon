// import loggerHelper from '../helpers/logger.helper.js';
const fs = require('fs');
const tls = require('tls');
const crypto = require("crypto")


// const logger = loggerHelper.get('controllers/homecontroller.js');

/**
  Verifies a domain against a certificate
 * @param {String} keyPath 
 * @param {String} certPath 
 * @param {String} domain 
 * @returns {Boolean}  
 */

// Function to verify domain against a certificate
const verifyDomain = (keyPath, certPath, domain) => {
    try {
      const cert = fs.readFileSync(certPath, 'utf8');
      const key = fs.readFileSync(keyPath);
  
      // Parse the certificate
      const parsedCert = new crypto.X509Certificate(Buffer.from(cert));
      console.log(parsedCert, "Parsed Certificate");
  
      const commonNameField = parsedCert.subject.split(',').find(field => field.includes('CN='));
      const commonName = commonNameField ? commonNameField.replace('CN=', '').trim() : null;
      console.log(commonName, "Extracted Common Name");
  
      const subjectAltNames = parsedCert.subjectAltName
        ? parsedCert.subjectAltName.split(',').map(name => name.replace('DNS:', '').trim())
        : [];
      console.log(subjectAltNames, "Extracted Subject Alternative Names");
  
      console.log(domain, "Domain to Verify");
  
      // Check if the domain matches the
      if (commonName === domain || subjectAltNames.includes(domain)) {
        console.log(`Domain ${domain} is valid for this certificate.`);
        return true;
      } else {
        console.log(`Domain ${domain} is NOT valid for this certificate.`);
        return false;
      }
    } catch (err) {
      console.log('Error reading or parsing certificate:', err.message);
      return false;
    }
  };

export default {
    verifyDomain
};
const nodemailer = require('nodemailer');
const https = require('https');

const adminEmail = process.env.ADMIN_EMAIL || 'luckylucky16477@gmail.com';

// Setup email transporter if credentials exist in .env
let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  const isGmail = 
    process.env.SMTP_HOST === 'smtp.gmail.com' || 
    (!process.env.SMTP_HOST && process.env.SMTP_USER.endsWith('@gmail.com'));

  const transportConfig = isGmail 
    ? {
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000,
        family: 4 // Force IPv4 to prevent ENETUNREACH error on IPv6-unsupported networks like Render
      }
    : {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000,
        family: 4 // Force IPv4
      };

  transporter = nodemailer.createTransport(transportConfig);
  console.log(`[EMAIL SERVICE] SMTP Transporter configured successfully (Gmail mode: ${isGmail}).`);
} else {
  console.log('[EMAIL SERVICE] SMTP details not configured. Operating in simulated console log mode.');
}

/**
 * Sends a notification email when a new project inquiry is received.
 */
exports.sendContactNotification = async (inquiry) => {
  const { name, email, projectType, message } = inquiry;
  const subject = `[AURA Atelier] New Project Inquiry: ${name}`;

  const htmlContent = `
    <div style="font-family: 'Montserrat', Helvetica, Arial, sans-serif; background-color: #f7f7f7; padding: 30px; color: #111;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-top: 4px solid #c5a880; box-shadow: 0 4px 10px rgba(0,0,0,0.05); padding: 40px; border-radius: 4px;">
        <h2 style="font-family: 'Playfair Display', serif; font-size: 24px; color: #111; margin-bottom: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
          New Project Inquiry
        </h2>
        <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 30px;">
          An inquiry has been submitted through the AURA Atelier website. The details are listed below:
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; width: 140px; font-size: 14px; text-transform: uppercase; color: #888;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 15px; color: #111;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; font-size: 14px; text-transform: uppercase; color: #888;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 15px; color: #111;"><a href="mailto:${email}" style="color: #c5a880; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; font-size: 14px; text-transform: uppercase; color: #888;">Typology</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; color: #111; text-transform: capitalize;">${projectType}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; font-size: 14px; text-transform: uppercase; color: #888; vertical-align: top;">Description</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 15px; color: #333; line-height: 1.6;">${message}</td>
          </tr>
        </table>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
          AURA Atelier Admin Notification Center • Sent to ${adminEmail}
        </div>
      </div>
    </div>
  `;

  return await dispatchMail(subject, htmlContent);
};

/**
 * Sends a notification email when a new newsletter subscriber registers.
 */
exports.sendNewsletterNotification = async (subscriberEmail) => {
  const subject = `[AURA Atelier] New Journal Subscriber: ${subscriberEmail}`;

  const htmlContent = `
    <div style="font-family: 'Montserrat', Helvetica, Arial, sans-serif; background-color: #f7f7f7; padding: 30px; color: #111;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-top: 4px solid #c5a880; box-shadow: 0 4px 10px rgba(0,0,0,0.05); padding: 40px; border-radius: 4px;">
        <h2 style="font-family: 'Playfair Display', serif; font-size: 24px; color: #111; margin-bottom: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
          New Journal Subscriber
        </h2>
        <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 30px;">
          A new email has subscribed to the AURA Atelier journal updates:
        </p>
        
        <div style="background-color: #f9f9f9; border-left: 3px solid #c5a880; padding: 15px 20px; font-size: 16px; font-weight: 500; margin-bottom: 30px;">
          Email: <a href="mailto:${subscriberEmail}" style="color: #c5a880; text-decoration: none;">${subscriberEmail}</a>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
          AURA Atelier Admin Notification Center • Sent to ${adminEmail}
        </div>
      </div>
    </div>
  `;

  return await dispatchMail(subject, htmlContent);
};

/**
 * Helper to dispatch mail via Brevo HTTP API, SMTP, or log it as a simulation.
 */
function dispatchMail(subject, htmlContent) {
  return new Promise((resolve, reject) => {
    if (process.env.BREVO_API_KEY) {
      sendBrevoEmail(subject, htmlContent, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    } else if (transporter) {
      const mailOptions = {
        from: `"AURA Atelier API" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: subject,
        html: htmlContent
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('[EMAIL ERROR] Failed to send email:', err.message);
          reject(err);
        } else {
          console.log(`[EMAIL SENT] Notification successfully dispatched. Message ID: ${info.messageId}`);
          resolve(info);
        }
      });
    } else {
      // Beautiful simulation logger
      console.log('\n--- [SIMULATED EMAIL NOTIFICATION] ---');
      console.log(`To:      ${adminEmail}`);
      console.log(`Subject: ${subject}`);
      console.log('--- HTML Preview ---');
      console.log(htmlContent.replace(/<[^>]*>/g, '').trim().substring(0, 400) + '...\n---------------------------------------\n');
      resolve({ simulated: true });
    }
  });
}

/**
 * Diagnostics helper to test SMTP or Brevo HTTP API connection.
 */
exports.testSMTPConnection = (callback) => {
  if (process.env.BREVO_API_KEY) {
    console.log('[DIAGNOSTICS] Verifying Brevo HTTP API connection...');
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SMTP_USER || 'luckylucky16477@gmail.com';
    
    const postData = JSON.stringify({
      sender: { name: 'AURA Atelier SMTP Test', email: senderEmail },
      to: [{ email: adminEmail }],
      subject: '[AURA Atelier] Diagnostics Brevo HTTP Test Email',
      htmlContent: '<p>If you see this email, your Render backend Brevo HTTP API integration is working 100% correctly!</p>'
    });

    const options = {
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('[DIAGNOSTICS] Brevo API connection succeeded and test email dispatched.');
          callback(null, {
            verified: true,
            emailSent: true,
            provider: 'Brevo HTTP API',
            response: body,
            adminEmail: adminEmail
          });
        } else {
          console.error('[DIAGNOSTICS ERROR] Brevo API failed with status:', res.statusCode, body);
          callback(new Error(`Brevo HTTP API returned status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error('[DIAGNOSTICS ERROR] Brevo API request failed:', err.message);
      callback(err);
    });

    req.write(postData);
    req.end();
    return;
  }

  if (!transporter) {
    return callback(new Error('SMTP transporter is not initialized. Make sure SMTP_USER and SMTP_PASS or BREVO_API_KEY environment variables are defined.'));
  }
  
  console.log('[DIAGNOSTICS] Verifying SMTP connection...');
  transporter.verify((error, success) => {
    if (error) {
      console.error('[DIAGNOSTICS ERROR] SMTP verification failed:', error.message);
      return callback(error);
    }
    
    console.log('[DIAGNOSTICS] SMTP verification succeeded. Attempting to send diagnostic test email...');
    const mailOptions = {
      from: `"AURA Atelier SMTP Test" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: '[AURA Atelier] Diagnostics SMTP Test Email',
      html: '<p>If you see this email, your Render backend SMTP credentials are working 100% correctly!</p>'
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('[DIAGNOSTICS ERROR] SMTP test email send failed:', err.message);
        callback(new Error(`Transporter verification succeeded, but sendMail failed: ${err.message}`));
      } else {
        console.log('[DIAGNOSTICS] SMTP test email sent successfully!');
        callback(null, {
          verified: true,
          emailSent: true,
          provider: 'SMTP',
          messageId: info.messageId,
          response: info.response,
          smtpUser: process.env.SMTP_USER,
          adminEmail: adminEmail
        });
      }
    });
  });
};

/**
 * Sends email using Brevo's HTTP API (bypassing Render SMTP blocks)
 */
function sendBrevoEmail(subject, htmlContent, callback) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SMTP_USER || 'luckylucky16477@gmail.com';

  const postData = JSON.stringify({
    sender: { name: 'AURA Atelier API', email: senderEmail },
    to: [{ email: adminEmail }],
    subject: subject,
    htmlContent: htmlContent
  });

  const options = {
    hostname: 'api.brevo.com',
    port: 443,
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`[EMAIL SENT] Brevo API dispatched email successfully. Response: ${body}`);
        if (callback) callback(null, body);
      } else {
        console.error(`[EMAIL ERROR] Brevo API returned status ${res.statusCode}: ${body}`);
        if (callback) callback(new Error(`Brevo HTTP API returned status ${res.statusCode}: ${body}`));
      }
    });
  });

  req.on('error', (err) => {
    console.error('[EMAIL ERROR] Brevo API request failed:', err.message);
    if (callback) callback(err);
  });

  req.write(postData);
  req.end();
}

const nodemailer = require('nodemailer');

const adminEmail = process.env.ADMIN_EMAIL || 'luckylucky16477@gmail.com';

// Setup email transporter if credentials exist in .env
let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  console.log('[EMAIL SERVICE] SMTP Transporter configured successfully.');
} else {
  console.log('[EMAIL SERVICE] SMTP details not configured. Operating in simulated console log mode.');
}

/**
 * Sends a notification email when a new project inquiry is received.
 */
exports.sendContactNotification = (inquiry) => {
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

  dispatchMail(subject, htmlContent);
};

/**
 * Sends a notification email when a new newsletter subscriber registers.
 */
exports.sendNewsletterNotification = (subscriberEmail) => {
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

  dispatchMail(subject, htmlContent);
};

/**
 * Helper to dispatch mail via SMTP or log it as a simulation.
 */
function dispatchMail(subject, htmlContent) {
  if (transporter) {
    const mailOptions = {
      from: `"AURA Atelier API" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: subject,
      html: htmlContent
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('[EMAIL ERROR] Failed to send email:', err.message);
      } else {
        console.log(`[EMAIL SENT] Notification successfully dispatched. Message ID: ${info.messageId}`);
      }
    });
  } else {
    // Beautiful simulation logger
    console.log('\n--- [SIMULATED EMAIL NOTIFICATION] ---');
    console.log(`To:      ${adminEmail}`);
    console.log(`Subject: ${subject}`);
    console.log('--- HTML Preview ---');
    console.log(htmlContent.replace(/<[^>]*>/g, '').trim().substring(0, 400) + '...\n---------------------------------------\n');
  }
}

const providerRejectionTemplate = (name, reason, reapplyUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Provider Application Update</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .info-icon {
          width: 80px;
          height: 80px;
          background: #f59e0b;
          border-radius: 50%;
          margin: 0 auto 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }
        h1 {
          color: #1f2937;
          font-size: 28px;
          margin-bottom: 20px;
          text-align: center;
        }
        .message {
          color: #4b5563;
          font-size: 16px;
          margin-bottom: 30px;
          text-align: center;
        }
        .reason-box {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 20px;
          margin: 30px 0;
          border-radius: 4px;
        }
        .reason-box h3 {
          color: #d97706;
          margin-top: 0;
          margin-bottom: 10px;
        }
        .reason-box p {
          margin: 0;
          color: #78350f;
        }
        .info-box {
          background: #f0f9ff;
          border-left: 4px solid #3b82f6;
          padding: 20px;
          margin: 30px 0;
          border-radius: 4px;
        }
        .info-box h3 {
          color: #1e40af;
          margin-top: 0;
          margin-bottom: 15px;
        }
        .info-box ul {
          margin: 0;
          padding-left: 20px;
        }
        .info-box li {
          margin-bottom: 10px;
          color: #1e3a8a;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
          padding: 16px 40px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px auto;
          display: block;
          max-width: 280px;
        }
        .footer {
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Karigar</div>
          <p style="margin: 0; opacity: 0.9;">Hyperlocal Services Marketplace</p>
        </div>
        
        <div class="content">
          <div class="info-icon">ℹ️</div>
          
          <h1>Application Status Update</h1>
          
          <p class="message">
            Dear ${name}, thank you for your interest in joining Karigar as a service provider. 
            After careful review, we're unable to approve your application at this time.
          </p>

          ${reason ? `
            <div class="reason-box">
              <h3>Reason for Decline</h3>
              <p>${reason}</p>
            </div>
          ` : ''}

          <div class="info-box">
            <h3>What You Can Do</h3>
            <ul>
              <li>Review our provider requirements and guidelines</li>
              <li>Address the concerns mentioned above</li>
              <li>Ensure you have all necessary certifications/documents</li>
              <li>Reapply once you've made the necessary improvements</li>
            </ul>
          </div>

          <p style="text-align: center; color: #4b5563; margin: 30px 0;">
            We encourage you to reapply once you've addressed the feedback. 
            We're always looking for quality service providers to join our platform.
          </p>

          <a href="${reapplyUrl}" class="cta-button">
            Reapply as Provider
          </a>

          <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
            Have questions about this decision? Feel free to reach out to our support team.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 10px 0;">
            <strong>Karigar</strong> - Connecting customers with local service providers
          </p>
          <p style="margin: 0;">
            Need help? <a href="mailto:${process.env.ADMIN_EMAIL || 'support@karigar.com'}">Contact Support</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default providerRejectionTemplate;

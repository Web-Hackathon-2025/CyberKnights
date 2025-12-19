const providerApprovalTemplate = (name, profileUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Provider Application Approved</title>
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
        .success-icon {
          width: 80px;
          height: 80px;
          background: #10b981;
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
        .highlight-box {
          background: #f0fdf4;
          border-left: 4px solid #10b981;
          padding: 20px;
          margin: 30px 0;
          border-radius: 4px;
        }
        .highlight-box h3 {
          color: #10b981;
          margin-top: 0;
          margin-bottom: 15px;
        }
        .highlight-box ul {
          margin: 0;
          padding-left: 20px;
        }
        .highlight-box li {
          margin-bottom: 10px;
          color: #374151;
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
          <div class="success-icon">✓</div>
          
          <h1>🎉 Congratulations ${name}!</h1>
          
          <p class="message">
            Great news! Your service provider application has been <strong>approved</strong> by our admin team. 
            You're now one step away from connecting with customers in your area.
          </p>

          <div class="highlight-box">
            <h3>Next Step: Complete Your Profile</h3>
            <p style="margin-bottom: 15px;">To start receiving service requests, please complete your provider profile with:</p>
            <ul>
              <li>Service category and specialization</li>
              <li>Business details and description</li>
              <li>Service area and location</li>
              <li>Contact information</li>
              <li>Working hours and availability</li>
              <li>Services you offer with pricing</li>
            </ul>
          </div>

          <a href="${profileUrl}" class="cta-button">
            Complete Your Profile
          </a>

          <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
            Once your profile is complete, you'll start receiving service requests from customers in your area. 
            Make sure to provide accurate information to build trust with potential clients.
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

export default providerApprovalTemplate;

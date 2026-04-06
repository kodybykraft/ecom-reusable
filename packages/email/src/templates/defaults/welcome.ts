export const welcomeTemplate = {
  name: 'Welcome',
  subject: 'Welcome to {{storeName}}',
  category: 'welcome',
  htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <span style="display: none; font-size: 1px; color: #f4f4f7; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">Welcome to {{storeName}}! We're excited to have you.</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; width: 100% !important;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #2563eb; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">{{storeName}}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #1a1a2e; font-size: 22px; font-weight: 700;">Welcome Aboard!</h2>
              <p style="margin: 0 0 24px; color: #51545e; font-size: 16px; line-height: 1.625;">Hi {{firstName}},</p>
              <p style="margin: 0 0 24px; color: #51545e; font-size: 16px; line-height: 1.625;">Thank you for creating an account with us. We're thrilled to have you as part of the {{storeName}} community.</p>
              <p style="margin: 0 0 32px; color: #51545e; font-size: 16px; line-height: 1.625;">Browse our latest collection and find something you'll love.</p>
              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{shopUrl}}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 6px;">Start Shopping</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8f9fa; border-top: 1px solid #e8e8eb;">
              <p style="margin: 0; color: #9a9ea6; font-size: 13px; line-height: 1.625; text-align: center;">You received this email because you created an account at {{storeName}}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  textContent: `Welcome Aboard!

Hi {{firstName}},

Thank you for creating an account with us. We're thrilled to have you as part of the {{storeName}} community.

Browse our latest collection and find something you'll love.

Start shopping: {{shopUrl}}

— {{storeName}}`,
};

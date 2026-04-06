export const refundNotificationTemplate = {
  name: 'Refund Notification',
  subject: 'Refund processed for order #{{orderNumber}}',
  category: 'refund-notification',
  htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Refund Processed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <span style="display: none; font-size: 1px; color: #f4f4f7; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">Your refund of {{refundAmount}} for order #{{orderNumber}} has been processed.</span>
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
              <h2 style="margin: 0 0 16px; color: #1a1a2e; font-size: 22px; font-weight: 700;">Refund Processed</h2>
              <p style="margin: 0 0 24px; color: #51545e; font-size: 16px; line-height: 1.625;">Hi {{firstName}},</p>
              <p style="margin: 0 0 24px; color: #51545e; font-size: 16px; line-height: 1.625;">We've processed a refund for your order <strong style="color: #1a1a2e;">#{{orderNumber}}</strong>.</p>
              <!-- Refund Details -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px; border: 1px solid #e8e8eb; border-radius: 6px; overflow: hidden;">
                <tr>
                  <td style="background-color: #f8f9fa; padding: 12px 16px; border-bottom: 1px solid #e8e8eb;">
                    <strong style="color: #1a1a2e; font-size: 14px;">Refund Details</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 4px 0; color: #9a9ea6; font-size: 14px; width: 140px;">Order Number</td>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 14px; font-weight: 600;">#{{orderNumber}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #9a9ea6; font-size: 14px;">Refund Amount</td>
                        <td style="padding: 4px 0; color: #1a1a2e; font-size: 14px; font-weight: 600;">{{refundAmount}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #51545e; font-size: 16px; line-height: 1.625;">The refund should appear on your original payment method within 5-10 business days, depending on your bank.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8f9fa; border-top: 1px solid #e8e8eb;">
              <p style="margin: 0; color: #9a9ea6; font-size: 13px; line-height: 1.625; text-align: center;">You received this email because a refund was issued for your order at {{storeName}}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  textContent: `Refund Processed

Hi {{firstName}},

We've processed a refund for your order #{{orderNumber}}.

Refund Amount: {{refundAmount}}

The refund should appear on your original payment method within 5-10 business days, depending on your bank.

— {{storeName}}`,
};

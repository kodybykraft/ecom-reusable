export const returnConfirmationTemplate = {
  name: 'Return Confirmation',
  subject: 'Return #{{returnId}} approved',
  category: 'return-confirmation',
  htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Return Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <span style="display: none; font-size: 1px; color: #f4f4f7; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">Your return #{{returnId}} for order #{{orderNumber}} has been approved.</span>
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
              <h2 style="margin: 0 0 16px; color: #1a1a2e; font-size: 22px; font-weight: 700;">Return Approved</h2>
              <p style="margin: 0 0 24px; color: #51545e; font-size: 16px; line-height: 1.625;">Hi {{firstName}},</p>
              <p style="margin: 0 0 24px; color: #51545e; font-size: 16px; line-height: 1.625;">Your return request <strong style="color: #1a1a2e;">#{{returnId}}</strong> for order <strong style="color: #1a1a2e;">#{{orderNumber}}</strong> has been approved.</p>
              <!-- Return Items -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px; border: 1px solid #e8e8eb; border-radius: 6px; overflow: hidden;">
                <tr>
                  <td style="background-color: #f8f9fa; padding: 12px 16px; border-bottom: 1px solid #e8e8eb;">
                    <strong style="color: #1a1a2e; font-size: 14px;">Items Being Returned</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px; color: #51545e; font-size: 14px; line-height: 1.625;">
                    {{returnItems}}
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 24px; color: #51545e; font-size: 16px; line-height: 1.625;">Please ship the items back within 14 days. Once we receive and inspect the return, your refund will be processed.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8f9fa; border-top: 1px solid #e8e8eb;">
              <p style="margin: 0; color: #9a9ea6; font-size: 13px; line-height: 1.625; text-align: center;">You received this email because you requested a return at {{storeName}}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  textContent: `Return Approved

Hi {{firstName}},

Your return request #{{returnId}} for order #{{orderNumber}} has been approved.

Items Being Returned:
{{returnItems}}

Please ship the items back within 14 days. Once we receive and inspect the return, your refund will be processed.

— {{storeName}}`,
};

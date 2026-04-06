export const abandonedCartTemplate = {
  name: 'Abandoned Cart',
  subject: 'You left something behind',
  category: 'abandoned-cart',
  htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your Purchase</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <span style="display: none; font-size: 1px; color: #f4f4f7; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">You left items in your cart at {{storeName}}. Complete your purchase before they're gone!</span>
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
              <h2 style="margin: 0 0 16px; color: #1a1a2e; font-size: 22px; font-weight: 700;">You Left Something Behind</h2>
              <p style="margin: 0 0 24px; color: #51545e; font-size: 16px; line-height: 1.625;">Hi {{firstName}},</p>
              <p style="margin: 0 0 24px; color: #51545e; font-size: 16px; line-height: 1.625;">We noticed you left some items in your cart. They're still waiting for you!</p>
              <!-- Cart Items -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1px solid #e8e8eb; border-radius: 6px; overflow: hidden;">
                <tr>
                  <td style="background-color: #f8f9fa; padding: 12px 16px; border-bottom: 1px solid #e8e8eb;">
                    <strong style="color: #1a1a2e; font-size: 14px;">Your Cart</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px; color: #51545e; font-size: 14px; line-height: 1.625;">
                    {{cartItems}}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-top: 2px solid #e8e8eb;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #1a1a2e; font-size: 16px; font-weight: 700;">Cart Total</td>
                        <td align="right" style="color: #1a1a2e; font-size: 16px; font-weight: 700;">{{cartTotal}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{cartUrl}}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 6px;">Complete Your Purchase</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8f9fa; border-top: 1px solid #e8e8eb;">
              <p style="margin: 0; color: #9a9ea6; font-size: 13px; line-height: 1.625; text-align: center;">You received this email because you have items in your cart at {{storeName}}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  textContent: `You Left Something Behind

Hi {{firstName}},

We noticed you left some items in your cart. They're still waiting for you!

Your Cart:
{{cartItems}}

Cart Total: {{cartTotal}}

Complete your purchase: {{cartUrl}}

— {{storeName}}`,
};

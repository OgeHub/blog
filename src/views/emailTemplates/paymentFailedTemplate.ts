const paymentFailedTemplate = ({
  firstName,
}: {
  firstName: string
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Payment failed</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding: 40px 16px">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 520px">
            <tr>
              <td>
                <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 24px;">Payment failed</h1>
                <p style="font-size: 16px; line-height: 24px; margin: 0 0 16px;">
                  Hi ${firstName},
                </p>
                <p style="font-size: 16px; line-height: 24px; margin: 0 0 16px;">
                  We were unable to process your subscription payment. Please update your payment method to avoid any interruption to your membership.
                </p>
                <p style="font-size: 16px; line-height: 24px; margin: 0;">
                  If you have any questions, feel free to reach out.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
}

export default paymentFailedTemplate

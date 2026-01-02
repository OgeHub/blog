const resetPasswordTemplate = ({
    firstName,
    resetLink,
}: {
    firstName: string
    resetLink: string
}) => {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Reset your password</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial,
        sans-serif;
      color: #0f172a;
    "
  >
    <!-- Outer table for email client compatibility -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding: 40px 16px">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="max-width: 520px"
          >
            <tr>
              <td>
                <!-- Content wrapper -->
                <div>
                  <!-- Header -->
                  <h1
                    style="
                      font-size: 24px;
                      font-weight: 700;
                      letter-spacing: -0.02em;
                      margin: 0 0 24px;
                    "
                  >
                    Reset your password
                  </h1>

                  <!-- Body -->
                  <p style="margin: 0 0 16px; line-height: 1.6">
                    Hi ${firstName},
                  </p>

                  <p style="margin: 0 0 16px; line-height: 1.6">
                    We received a request to reset the password for your
                    <strong>Explore</strong> account.
                  </p>

                  <p style="margin: 0 0 24px; line-height: 1.6">
                    Click the button below to choose a new password. This link
                    will expire for security reasons.
                  </p>

                  <!-- Button -->
                  <div style="margin: 32px 0">
                    <a
                      href="${resetLink}"
                      style="
                        display: inline-block;
                        background-color: #1a8917;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 14px 28px;
                        border-radius: 6px;
                        font-size: 16px;
                        font-weight: 600;
                      "
                    >
                      Reset Password
                    </a>
                  </div>

                  <!-- Fallback link -->
                  <p
                    style="
                      margin: 0 0 8px;
                      font-size: 14px;
                      color: #6b7280;
                      line-height: 1.5;
                    "
                  >
                    If the button above doesn’t work, copy and paste this link
                    into your browser:
                  </p>

                  <p
                    style="
                      margin: 0 0 32px;
                      font-size: 14px;
                      color: #6b7280;
                      word-break: break-all;
                    "
                  >
                    ${resetLink}
                  </p>

                  <!-- Footer -->
                  <div
                    style="
                      border-top: 1px solid #e5e7eb;
                      padding-top: 16px;
                      font-size: 13px;
                      color: #6b7280;
                      line-height: 1.6;
                    "
                  >
                    <p style="margin: 0 0 8px">
                      If you didn’t request a password reset, you can safely
                      ignore this email. Your password will remain unchanged.
                    </p>

                    <p style="margin: 0">
                      Powered by <strong>Ogee Softwares</strong>
                    </p>
                  </div>
                </div>
                <!-- End content wrapper -->
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

export default resetPasswordTemplate

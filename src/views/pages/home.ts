const homePage = () => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Explore | Blog API</title>

    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial,
          sans-serif;
        background-color: #ffffff;
        color: #0f172a;
        min-height: 100vh;
      }

      .page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .container {
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
        padding: 0 24px;
      }

      /* Header */

      header {
        border-bottom: 1px solid #e5e7eb;
        padding: 24px 0;
      }

      .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
      }

      .logo {
        color: #0f172a;
        text-decoration: none;
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.03em;
      }

      .logo span {
        color: #1a8917;
      }

      .github {
        color: #374151;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
      }

      .github:hover {
        color: #1a8917;
      }

      /* Hero */

      .hero {
        padding: 100px 0 80px;
        text-align: center;
      }

      .badge {
        display: inline-block;
        margin-bottom: 24px;
        padding: 6px 12px;
        border: 1px solid #d1d5db;
        border-radius: 999px;
        color: #6b7280;
        font-size: 13px;
        font-weight: 500;
      }

      h1 {
        max-width: 700px;
        margin: 0 auto 24px;
        font-size: clamp(42px, 7vw, 64px);
        line-height: 1.05;
        letter-spacing: -0.045em;
        font-weight: 700;
      }

      .highlight {
        color: #1a8917;
      }

      .description {
        max-width: 600px;
        margin: 0 auto;
        color: #6b7280;
        font-size: 18px;
        line-height: 1.7;
      }

      /* Buttons */

      .actions {
        display: flex;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 36px;
      }

      .button {
        display: inline-block;
        padding: 12px 22px;
        border-radius: 6px;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .primary {
        background-color: #1a8917;
        color: #ffffff;
      }

      .primary:hover {
        background-color: #147313;
      }

      .secondary {
        border: 1px solid #d1d5db;
        color: #374151;
        background-color: #ffffff;
      }

      .secondary:hover {
        border-color: #1a8917;
        color: #1a8917;
      }

      /* Features */

      .features {
        border-top: 1px solid #e5e7eb;
        padding: 56px 0;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
        background-color: #e5e7eb;
        border: 1px solid #e5e7eb;
      }

      .feature {
        background-color: #ffffff;
        padding: 28px;
      }

      .feature-icon {
        font-size: 22px;
        margin-bottom: 16px;
      }

      .feature h3 {
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 600;
      }

      .feature p {
        color: #6b7280;
        font-size: 14px;
        line-height: 1.6;
      }

      /* Tech */

      .tech {
        padding: 24px 0 60px;
        text-align: center;
      }

      .tech p {
        color: #9ca3af;
        font-size: 13px;
      }

      /* Footer */

      footer {
        margin-top: auto;
        border-top: 1px solid #e5e7eb;
        padding: 24px 0;
      }

      .footer-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      footer p {
        color: #9ca3af;
        font-size: 13px;
      }

      footer strong {
        color: #6b7280;
      }

      /* Responsive */

      @media (max-width: 650px) {
        .hero {
          padding: 70px 0 60px;
        }

        .description {
          font-size: 16px;
        }

        .features-grid {
          grid-template-columns: 1fr;
        }

        .footer-content {
          flex-direction: column;
          text-align: center;
        }
      }
    </style>
  </head>

  <body>
    <div class="page">

      <!-- Header -->
      <header>
        <div class="container header-content">
          <a href="/" class="logo">
            Explore<span>.</span>
          </a>

          <a
            href="https://github.com/OgeHub/blog"
            target="_blank"
            rel="noopener noreferrer"
            class="github"
          >
            View on GitHub →
          </a>
        </div>
      </header>

      <!-- Hero -->
      <main>
        <section class="hero">
          <div class="container">

            <div class="badge">
              Node.js · TypeScript · REST API
            </div>

            <h1>
              Read. Write. <span class="highlight">Explore.</span>
            </h1>

            <p class="description">
              Explore is a blogging platform API built with Node.js and
              TypeScript, designed for sharing ideas, engaging with content,
              and building meaningful conversations.
            </p>

            <div class="actions">


              <a
                href="https://documenter.getpostman.com/view/36760391/2sBXVckY58"
                target="_blank"
                rel="noopener noreferrer"
                class="button primary"
              >
                API Documentation
              </a>
            </div>

          </div>
        </section>

        <!-- Features -->
        <section class="features">
          <div class="container">

            <div class="features-grid">

              <div class="feature">
                <div class="feature-icon">🔐</div>

                <h3>Authentication</h3>

                <p>
                  Secure authentication with email verification,
                  password recovery, and JWT-based authorization.
                </p>
              </div>

              <div class="feature">
                <div class="feature-icon">✍🏾</div>

                <h3>Blogging</h3>

                <p>
                  Create and manage posts while engaging with readers
                  through comments, replies, and claps.
                </p>
              </div>

              <div class="feature">
                <div class="feature-icon">💳</div>

                <h3>Subscriptions</h3>

                <p>
                  Support for monthly and yearly subscriptions powered
                  by Stripe.
                </p>
              </div>

            </div>

          </div>
        </section>

        <!-- Technology -->
        <section class="tech">
          <div class="container">
            <p>
              Built with Node.js · TypeScript · Express · MongoDB · Stripe
            </p>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer>
        <div class="container footer-content">
          <p>
            © ${new Date().getFullYear()} <strong>Explore</strong>
          </p>

          <p>
            Powered by <strong>Ogee Softwares</strong>
          </p>
        </div>
      </footer>

    </div>
  </body>
</html>
`
}

export default homePage

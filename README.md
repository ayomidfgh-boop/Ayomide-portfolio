# Ayomide Portfolio

A responsive personal portfolio built with plain HTML, CSS and JavaScript. It is ready for static deployment on Vercel or Netlify.

## Deployment

1. Create or sign in to a Vercel account at https://vercel.com.
2. Choose **Add New** and **Project**.
3. Import the Git repository containing this folder.
4. Leave the framework preset as **Other** and leave the build command empty. Set the output directory to `.` if Vercel asks for one.
5. Deploy the site.

This is a static HTML/CSS/JavaScript project, so it does not need a build command or a Vercel configuration file. The existing `netlify.toml` is retained only if you choose Netlify instead.

## Step 3 - Get the public URL

Vercel gives the site a public URL after deployment. That is the URL to share, not the local preview address shown by a development server.

## Step 4 - Add a custom domain later

In Vercel, open the project, choose **Settings**, then **Domains**. Follow Vercel's DNS instructions for the domain provider. HTTPS is provided automatically.

## Step 5 - Test on an iPhone

Open the public Netlify URL in Safari on the iPhone. Check the hero, menu, section links, project/service dialogs, CV download, theme toggle, social links, and contact form. Test both portrait and landscape orientation.

## Step 6 - Test contact delivery

After adding the Formspree endpoint, submit the form from a different email account or another device. Confirm the message arrives at `ayomidfgh@gmail.com`, including the visitor name, email, and message. Also check Formspree's submission dashboard if delivery is delayed.

## Verified local assets

- Profile image: `assets/profile.jpg`
- CV: `assets/documents/Abdul_Fatai_Ibrahim_Ayomide_CV.pdf`

## Local preview

Use a static server such as `npx http-server . -p 4173`, then open the local address printed in the terminal.

## Prospect Intelligence Agent

The repository also contains a separate MVP research studio at `/agent/`. It accepts one public company website URL, extracts a bounded set of readable same-domain pages, and generates a structured prospect research brief with deterministic local logic. The basic workflow does not require an AI provider or API key.

### Local setup

1. Install dependencies with `npm install`.
2. Run the site and Netlify Function locally with `npm run dev`.
3. Open `http://localhost:8888/agent/`.

The function endpoint is `/.netlify/functions/research` and accepts a `POST` request with `websiteUrl` and an optional `userOffer`.

Do not use a static server such as `npx http-server` for this feature. A static server can render `/agent/`, but it cannot execute `netlify/functions/research.js`, so the function URL will not return a research response.

### MVP boundaries

- Only public HTTP and HTTPS websites are supported.
- Research is limited to the homepage and a small number of relevant same-domain pages.
- Login-protected pages, private sources, social profiles, bulk URLs, and automated outreach are out of scope.
- Verified facts include source URLs and evidence excerpts. Deterministic hypotheses are presented separately and require human review.
- No research history database or user authentication is included in v1.

The current provider is `local-deterministic`. It uses public page metadata, headings, readable text, keyword classification, and explicit limitation labels. OpenAI can be added later as a separate provider without changing the frontend contract.

The `.env` file and `OPENAI_*` values are optional placeholders for that future provider. They are not read by the current basic research flow.

### Contact delivery

The homepage contact form posts JSON to `/.netlify/functions/contact`. It uses the Resend transactional email API and does not claim success unless Resend accepts the message. Configure these server-side variables for delivery:

```env
CONTACT_RECEIVER_EMAIL=your-inbox@example.com
CONTACT_SENDER_EMAIL=Portfolio <onboarding@resend.dev>
RESEND_API_KEY=re_your_key
```

The sender address must be permitted by the email provider. The visitor's email is used as `Reply-To`. Without these values, the form returns a clear configuration error rather than pretending to send.

For a custom sending domain, configure the provider's SPF and DKIM records and publish a DMARC policy for that domain. This repository cannot verify DNS ownership or inbox placement from local development.

### Checks

Run `npm test` to execute the validation, extraction, and structured-output tests.

# Ayomide Portfolio

A responsive personal portfolio built with plain HTML, CSS and JavaScript. It is ready for static deployment on Vercel or Netlify.

## Step 1 - Connect the real contact form

The form uses Formspree when configured, so submissions can arrive by email without exposing a private API key. Until an endpoint is added, it opens a pre-filled email draft instead and clearly tells the visitor what is happening.

1. Create an account at https://formspree.io.
2. Create a new form and set the destination email to `ayomidfgh@gmail.com`.
3. Copy the endpoint Formspree gives you.
4. Open `script.js` and replace the empty value here:

```js
formspreeEndpoint: '',
```

with your real endpoint:

```js
formspreeEndpoint: 'PASTE_YOUR_REAL_FORMSPREE_ENDPOINT_HERE',
```

Real form delivery is not connected until this value is supplied. Until then, the fallback opens the visitor's email app with the name, email, and message prepared. No secret key belongs in this file.

## Step 2 - Deploy on Vercel

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

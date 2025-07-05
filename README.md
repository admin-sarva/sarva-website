This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Email Integration Setup

This project uses [Resend](https://resend.com) for sending emails from the contact form. To set up email functionality:

### 1. Create a Resend Account
- Sign up at [resend.com](https://resend.com)
- Verify your domain or use the sandbox domain for testing

### 2. Get Your API Key
- Go to your Resend dashboard
- Navigate to API Keys section
- Create a new API key

### 3. Environment Variables
Create a `.env.local` file in your project root with:

```env
# Resend API Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email Configuration
FROM_EMAIL=noreply@yourdomain.com
```

### 4. Domain Verification
- In your Resend dashboard, add and verify your domain
- Update the `FROM_EMAIL` to use your verified domain
- For testing, you can use the sandbox domain provided by Resend

### 5. Contact Form
The contact form will send emails to `xyz@mmmm.com` as configured in the API route.

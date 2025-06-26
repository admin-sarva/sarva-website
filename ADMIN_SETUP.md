# Admin Authentication Setup

The admin panel is now protected with authentication. Here's how to set it up:

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
ADMIN_PASSWORD=your_secure_password_here
```

**Important:** Choose a strong password and keep it secure. This password will be used to access all admin functionality.

## Default Password

If no `ADMIN_PASSWORD` environment variable is set, the system will use a default password: `admin123`

**⚠️ Security Warning:** Change this default password immediately in production!

## How to Access Admin Panel

1. Navigate to `/admin/login`
2. Enter the admin password
3. You'll be redirected to the admin dashboard at `/admin`

## Admin Routes

- `/admin` - Main dashboard
- `/admin/login` - Login page
- `/admin/notes` - Manage wander notes
- `/admin/stays` - Add/edit stays
- `/admin/places` - Add/edit places

## Security Features

- **HTTP-only cookies**: Session cookies are HTTP-only and cannot be accessed by JavaScript
- **Secure cookies**: In production, cookies are marked as secure (HTTPS only)
- **Session expiration**: Sessions expire after 24 hours
- **Middleware protection**: All admin routes are protected at the middleware level
- **Automatic redirects**: Unauthenticated users are automatically redirected to login

## Logout

Click the "Logout" button on any admin page to end your session and return to the login page.

## Production Considerations

1. **Use a strong password**: Set a complex `ADMIN_PASSWORD` environment variable
2. **HTTPS**: Ensure your site uses HTTPS in production for secure cookie transmission
3. **Regular password changes**: Consider changing the admin password periodically
4. **Monitor access**: Consider adding logging for admin access attempts

## Troubleshooting

If you can't access the admin panel:

1. Check that your `.env.local` file has the correct `ADMIN_PASSWORD`
2. Clear your browser cookies for the site
3. Try accessing `/admin/login` directly
4. Check the browser console for any JavaScript errors 
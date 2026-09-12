# Prevent recovery sessions surviving a refresh

## Change
- Mark the temporary password-recovery session in browser session storage after the OTP is verified.
- When the login page loads and finds that marker, immediately sign out, clear the marker, and show the normal login screen instead of redirecting to the dashboard.
- Clear the marker after a successful password update so the completed flow returns cleanly to login.
- Keep the existing email/password sign-in and successful OTP-to-new-password transition unchanged.

## Validation
- Verify OTP still opens the new-password form without redirecting.
- Refreshing that form signs the temporary recovery session out and returns to login.
- Completing the password change returns to login, and normal sign-in still opens the dashboard.

import { handleAuth, handleLogin, handleCallback, handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/browse'
  }),
  logout: handleLogout({
    returnTo: '/'
  }),
  callback: handleCallback()
});

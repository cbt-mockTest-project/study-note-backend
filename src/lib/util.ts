import { Response } from 'express';

export const setLoginCookie = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  res.cookie('refreshToken', refreshToken, {
    domain: process.env.FRONTEND_DOMAIN,
    path: '/',
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  res.cookie('accessToken', accessToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: process.env.FRONTEND_DOMAIN,
    path: '/',
    sameSite: 'none',
    secure: true,
    httpOnly: false,
  }); // 7 days
};

export const parseCookies = (
  cookieString: string,
): {
  [key: string]: string;
} => {
  const cookies = {};
  if (cookieString) {
    const separateCookies = cookieString.split(';');
    separateCookies.forEach(function (cookie) {
      const parts = cookie.match(/(.*?)=(.*)$/);
      if (parts) {
        const name = parts[1].trim();
        const value = decodeURIComponent(parts[2].trim());
        cookies[name] = value;
      }
    });
  }
  return cookies;
};

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

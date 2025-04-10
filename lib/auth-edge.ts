/* eslint-disable @typescript-eslint/no-unused-vars */
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

const secretKey =
  process.env.JWT_SECRET || 'your-secret-key-at-least-32-chars-long';
const key = new TextEncoder().encode(secretKey);

export async function getUserFromCookies(request: NextRequest) {
  const cookie = request.cookies.get('skillswap_session')?.value;

  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, key);
    return payload;
  } catch (error) {
    return null;
  }
}

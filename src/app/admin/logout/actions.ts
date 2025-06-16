// src/app/admin/logout/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'admin-auth-token';

export async function logoutAction() {
  cookies().set(AUTH_COOKIE_NAME, '', { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: -1, // Expire the cookie immediately
    sameSite: 'lax',
  });
  redirect('/admin/login');
}

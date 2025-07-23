import { env } from '$env/dynamic/public';
import { authClient } from './auth/client';

export const gameApiPrefix = `${env.PUBLIC_BETTER_AUTH_URL || "http:;//localhost:8787"}/game`;

export async function getJWTToken() {
  const { data, error } = await authClient.getSession();
  if (error || !data?.session) {
    return null;
  }

  const res = await fetch(`${env.PUBLIC_BETTER_AUTH_URL}/api/auth/token`, {
    credentials: "include"
  });

  return (await res.json()).token as string;
}


import { env } from '$env/dynamic/public';
import { authClient } from './auth/client';

export const gameApiPrefix = `${env.PUBLIC_BETTER_AUTH_URL || "http:;//localhost:8787"}/game`;

export type LeaderboardEntry = {
  playerId: string;
  score: number;
};

export class GameAPIClient {
  #token: string | null = $state(null);

  constructor(init = true) {
    if (init) {
      this.refreshToken();
    }
  }

  async refreshToken() {
    const { data, error } = await authClient.getSession();
    if (error || !data?.session) {
      return null;
    }

    const res = await fetch(`${env.PUBLIC_BETTER_AUTH_URL}/api/auth/token`, {
      credentials: "include"
    });

    this.#token = (await res.json()).token as string;
  }

  ready = $derived(!!this.#token);

  async submitPop(count = 1) {
    if (!this.ready || count === 0) {
      return;
    }

    await fetch(`${gameApiPrefix}/pop?pop=${count}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.#token}`
      }
    });
  }

  async getGlobalLeaderboard() {
    const res = await fetch(`${gameApiPrefix}/stats/global`, {
      headers: {
        Authorization: `Bearer ${this.#token}`
      }
    });
    return (await res.json()) as Record<string, number>;
  }

  async getInGroupLeaderboard(groupId: string) {
    const res = await fetch(`${gameApiPrefix}/stats/groups/${groupId}`, {
      headers: {
        Authorization: `Bearer ${this.#token}`
      }
    });
    return (await res.json()) as LeaderboardEntry[];
  }

  async getSelfPopCount() {
    const res = await fetch(`${gameApiPrefix}/stats/self`, {
      headers: {
        Authorization: `Bearer ${this.#token}`
      }
    });
    return (await res.json()) as number;
  }

}

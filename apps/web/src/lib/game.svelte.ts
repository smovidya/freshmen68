import { env } from '$env/dynamic/public';
import { authClient } from './auth/client';
import { dev } from "$app/environment";
import { untrack } from "svelte";
import { toast } from 'svelte-sonner';

export const gameApiPrefix = `${env.PUBLIC_BETTER_AUTH_URL || "http:;//localhost:8787"}/game`;

export type LeaderboardEntry = {
  playerId: string;
  score: number;
  player_name?: string;
};

export class GameAPIClient {
  #token: string | null = $state(null);
  playerDisplayName = $state<string | null>(null);

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

  async updateName(newName: string) {
    try {
      await fetch(`${gameApiPrefix}/username`, {
        method: "POST",
        body: newName,
        headers: {
          Authorization: `Bearer ${this.#token}`
        }
      });
      this.playerDisplayName = newName;
      toast.success("อัพเดตชื่อผู้ใช้เรียบร้อยแล้ว");
      this.playerDisplayName = newName;
    } catch (e) {
      toast.error("ไม่สามารถอัพเดตชื่อผู้ใช้ได้");
      console.error(e);
    }
  }

  async getName() {
    try {
      return await fetch(`${gameApiPrefix}/username`, {
        headers: {
          Authorization: `Bearer ${this.#token}`
        }
      })
        .catch(() => {
          throw new Error("Failed to fetch username");
        })
        .then(it => it.text());
    } catch {
      toast.error("ไม่สามารถดึงชื่อผู้ใช้ได้");
    }
  }

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

export class GamePopper {
  // groupPollIntervalId!: NodeJS.Timeout; // wtf, idc anymore
  flushIntervalId!: NodeJS.Timeout;
  selfPollIntervalId!: NodeJS.Timeout; // wtf, idc anymore
  batchedCount: number = $state(0);
  #serverCount = $state(0);
  displaySelfCount = $derived(this.batchedCount + this.#serverCount);
  displayName = $state<string | undefined>(undefined);

  // TODO: optimistic update, nahhhh
  // #clickSpeedPerGroups = $state(zeroGroupCounts());
  #client: GameAPIClient;
  // groupId: string;

  #ready = $state(false);

  constructor(client: GameAPIClient) {
    // this.groupId = groupId;
    this.#client = client;
    // console.log(localStorage.getItem("__pop_count"));
    this.#serverCount = parseInt(localStorage.getItem("__pop_count") ?? "0") || 0;
  }

  async init() {
    this.#serverCount = await this.#client.getSelfPopCount();
    localStorage.setItem("__pop_count", String(untrack(() => this.#serverCount)));
    this.displayName = await this.#client.getName()
    // let abortController: AbortController | null = null;
    // const pollGroupCount = () => {
    //   abortController?.abort();
    //   abortController = new AbortController();
    //   this.#client.getInGroupLeaderboard(this.groupId).then((counts) => {
    //     this.#realGroupCount = {
    //       ...this.#realGroupCount,
    //       ...counts
    //     };
    //   }).catch(() => { });
    // };

    // pollGroupCount();
    // this.groupPollIntervalId = setInterval(pollGroupCount, dev ? 500 : 1000 * 30);

    const pollSelfCount = () => {
      this.#client.getSelfPopCount().then((count) => {
        if (count > this.#serverCount) { // update from another device
          this.#serverCount = count;
        }
        this.#ready = true;
      }).catch(() => { });
    };

    pollSelfCount();
    this.selfPollIntervalId = setInterval(pollSelfCount, dev ? 1000 : 1000 * 5);

    this.flushIntervalId = setInterval(() => {
      this.#flush();
    }, dev ? 1000 : 1000 * 5);
  }

  private stop() {
    clearInterval(this.selfPollIntervalId);
    clearInterval(this.flushIntervalId);
  }

  pop() {
    this.batchedCount += 1;
    localStorage.setItem("__pop_count", String(untrack(() => this.displaySelfCount)));
  }

  async #flush() {
    const batched = untrack(() => this.batchedCount);
    // console.log(`Flushing ${batched} pop`);
    this.#serverCount = untrack(() => this.displaySelfCount);
    this.batchedCount = 0;
    try {
      await this.#client.submitPop(batched);
    } catch (e) {
      toast.error("ไม่สามารถส่งข้อมูลได้");
      console.log(e);
    }
  }

  destroy() {
    this.#flush();
    this.stop();
  }
}

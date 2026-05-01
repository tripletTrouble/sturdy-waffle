import type { Task } from "./types";

export type SyncResult = {
  success: boolean;
  data?: any;
  error: Error | null;
};

export const sync: {syncUrl?: string | null; syncSecretKey?: string | null} = $state({
  syncUrl: null,
  syncSecretKey: null,
});

export async function pull(): Promise<SyncResult> {
  const { syncUrl, syncSecretKey } = sync;

  if (!syncUrl || syncUrl.trim() === "") {
    return {
      success: false,
      error: new Error("Sync URL is not set"),
    };
  }

  const endpoint = syncUrl + (syncSecretKey ? `?secret=${syncSecretKey}` : "");

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      return {
        success: false,
        error: new Error(
          `Failed to pull data from ${endpoint}: ${response.statusText}`,
        ),
      };
    }

    const data = (await response.json()) as { success: boolean; tasks: Task[] };

    return {
      success: true,
      data: data.tasks,
      error: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error : new Error("An unknown error occurred"),
    };
  }
}

export async function push(tasks: Task[]): Promise<SyncResult> {
  const { syncUrl, syncSecretKey } = sync;

  if (!syncUrl || syncUrl.trim() === "") {
    return {
      success: false,
      error: new Error("Sync URL is not set"),
    };
  }

  try {
    const response = await fetch(syncUrl, {
      method: "POST",
      body: JSON.stringify({ tasks, secret: syncSecretKey }),
      mode: "cors",
    });

    if (!response.ok) {
      return {
        success: false,
        error: new Error(
          `Failed to push data to ${syncUrl}: ${response.statusText}`,
        ),
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error : new Error("An unknown error occurred"),
    };
  }
}


import { logger } from "./logging.js";

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: unknown): boolean {
  const candidate = error as {
    status?: number;
    code?: string;
    response?: {
      headers?: Record<string, string>;
    };
  };

  if (candidate.status === 429) {
    return true;
  }

  if (
    candidate.status === 403 &&
    candidate.response?.headers?.["x-ratelimit-remaining"] === "0"
  ) {
    return true;
  }

  if (
    candidate.code === "ECONNRESET" ||
    candidate.code === "ETIMEDOUT" ||
    candidate.code === "ECONNREFUSED"
  ) {
    return true;
  }

  return false;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 500,
    maxDelayMs = 4000,
  } = options;

  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (!isRetryableError(error) || attempt >= maxRetries) {
        throw error;
      }

      const delay = Math.min(
        initialDelayMs * 2 ** attempt,
        maxDelayMs
      );

      attempt++;

      logger.warn(
        `GitHub no está disponible temporalmente. Reintento ${attempt}/${maxRetries} en ${delay} ms.`
      );

      await sleep(delay);
    }
  }
}
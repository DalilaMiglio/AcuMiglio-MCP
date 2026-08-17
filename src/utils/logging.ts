function sanitize(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(
      /github_pat_[A-Za-z0-9_]+/g,
      "[TOKEN_PROTEGIDO]"
    );
  }

  return value;
}

export const logger = {
  info(message: string): void {
    console.error(`[INFO] ${message}`);
  },

  warn(message: string): void {
    console.error(`[WARN] ${message}`);
  },

  error(message: string, error?: unknown): void {
    const safeError = sanitize(
      error instanceof Error ? error.message : error
    );

    console.error(`[ERROR] ${message}`, safeError ?? "");
  },
};
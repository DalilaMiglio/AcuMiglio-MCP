export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "No fue posible autenticar con GitHub.") {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class PermissionError extends AppError {
  constructor(message = "El token no tiene permisos suficientes para realizar esta operación.") {
    super(message, "PERMISSION_ERROR", 403);
    this.name = "PermissionError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "El recurso solicitado no fue encontrado en GitHub.") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Se alcanzó el límite de solicitudes permitido por GitHub. Intentá nuevamente más tarde.") {
    super(message, "RATE_LIMIT", 429);
    this.name = "RateLimitError";
  }
}

export class NetworkError extends AppError {
  constructor(message = "No fue posible comunicarse con GitHub. Verificá la conexión e intentá nuevamente.") {
    super(message, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

export function transformGitHubError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const githubError = error as {
    status?: number;
    message?: string;
    response?: {
      headers?: Record<string, string>;
    };
  };

  switch (githubError.status) {
    case 401:
      return new AuthenticationError(
        "GitHub rechazó la autenticación. Verificá que el token sea válido."
      );

    case 403: {
      const remaining =
        githubError.response?.headers?.["x-ratelimit-remaining"];

      if (remaining === "0") {
        return new RateLimitError();
      }

      return new PermissionError();
    }

    case 404:
      return new NotFoundError(
        "No se encontró el recurso solicitado. Verificá el usuario y el nombre del repositorio."
      );

    case 422:
      return new ValidationError(
        "GitHub rechazó los datos enviados. Verificá que sean válidos y que el recurso no exista previamente."
      );

    case 429:
      return new RateLimitError();

    default:
      return new AppError(
        "Ocurrió un error inesperado al comunicarse con GitHub.",
        "GITHUB_ERROR",
        githubError.status
      );
  }
}

export function formatErrorForLLM(
  error: unknown,
  action: string
): string {
  const transformedError = transformGitHubError(error);

  return `No se pudo ${action}. ${transformedError.message}`;
}
import { describe, test, expect } from "vitest";

import {
  transformGitHubError,
  formatErrorForLLM,
  AuthenticationError,
  PermissionError,
  NotFoundError,
} from "../src/errors/index.js";

describe("Transformación y manejo de errores", () => {
  test("10. transforma un error 401 en AuthenticationError", () => {
    const result = transformGitHubError({
      status: 401,
    });

    expect(result).toBeInstanceOf(AuthenticationError);

    expect(result.message).toContain(
      "autenticación"
    );
  });

  test("11. transforma un error 403 en PermissionError", () => {
    const result = transformGitHubError({
      status: 403,
      response: {
        headers: {
          "x-ratelimit-remaining": "10",
        },
      },
    });

    expect(result).toBeInstanceOf(PermissionError);

    expect(result.message).toContain(
      "permisos"
    );
  });

  test("12. transforma un error 404 en un mensaje comprensible para el LLM", () => {
    const message = formatErrorForLLM(
      {
        status: 404,
      },
      "listar los issues"
    );

    expect(message).toContain(
      "No se pudo listar los issues"
    );

    expect(message).toContain(
      "No se encontró"
    );

    expect(message).not.toContain(
      "stack"
    );
  });
});
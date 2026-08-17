import { describe, test, expect } from "vitest";

import {
  CreateRepositorySchema,
  ListRepositoriesSchema,
  CreateIssueSchema,
  ListIssuesSchema,
  CreateCommitSchema,
} from "../src/schemas/index.js";

describe("Validación de schemas con Zod", () => {
  test("1. acepta un repositorio válido", () => {
    const result = CreateRepositorySchema.safeParse({
      name: "acumiglio-catalogo",
      description: "Catálogo digital de muebles AcuMiglio",
      private: false,
    });

    expect(result.success).toBe(true);
  });

  test("2. rechaza un nombre de repositorio con espacios", () => {
    const result = CreateRepositorySchema.safeParse({
      name: "acumiglio catalogo",
      private: false,
    });

    expect(result.success).toBe(false);
  });

  test("3. rechaza un issue sin título", () => {
    const result = CreateIssueSchema.safeParse({
      owner: "usuario-prueba",
      repo: "acumiglio-catalogo",
      body: "Falta agregar una colección",
    });

    expect(result.success).toBe(false);
  });

  test("4. acepta listar issues abiertos", () => {
    const result = ListIssuesSchema.safeParse({
      owner: "usuario-prueba",
      repo: "acumiglio-catalogo",
      state: "open",
      per_page: 10,
    });

    expect(result.success).toBe(true);
  });

  test("5. rechaza un commit sin path", () => {
    const result = CreateCommitSchema.safeParse({
      owner: "usuario-prueba",
      repo: "acumiglio-catalogo",
      message: "Agregar catálogo",
      content: "Nueva colección AcuMiglio",
    });

    expect(result.success).toBe(false);
  });
});
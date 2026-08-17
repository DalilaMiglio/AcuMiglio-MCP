import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
} from "vitest";

vi.mock("../src/github/client.js", () => ({
  octokit: {
    rest: {
      repos: {
        createForAuthenticatedUser: vi.fn(),
        listForAuthenticatedUser: vi.fn(),
        getContent: vi.fn(),
        createOrUpdateFileContents: vi.fn(),
      },

      issues: {
        create: vi.fn(),
        listForRepo: vi.fn(),
      },
    },
  },
}));

import { octokit } from "../src/github/client.js";

import {
  createRepository,
  listRepositories,
  createIssue,
} from "../src/github/operations.js";

describe("Operaciones de GitHub con mocks de Octokit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("6. listRepositories devuelve repositorios simulados", async () => {
    vi.mocked(
      octokit.rest.repos.listForAuthenticatedUser
    ).mockResolvedValue({
      data: [
        {
          id: 1,
          name: "acumiglio-catalogo",
          html_url:
            "https://github.com/prueba/acumiglio-catalogo",
          private: false,
        },
      ],
    } as any);

    const result = await listRepositories({
      per_page: 10,
      page: 1,
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("acumiglio-catalogo");

    expect(
      octokit.rest.repos.listForAuthenticatedUser
    ).toHaveBeenCalledOnce();
  });

  test("7. createRepository crea un repositorio mediante Octokit", async () => {
    vi.mocked(
      octokit.rest.repos.createForAuthenticatedUser
    ).mockResolvedValue({
      data: {
        id: 2,
        name: "acumiglio-admin",
        html_url:
          "https://github.com/prueba/acumiglio-admin",
        private: false,
      },
    } as any);

    const result = await createRepository({
      name: "acumiglio-admin",
      description: "Panel de AcuMiglio",
      private: false,
    });

    expect(result.name).toBe("acumiglio-admin");

    expect(
      octokit.rest.repos.createForAuthenticatedUser
    ).toHaveBeenCalledOnce();
  });

  test("8. createIssue crea un issue mediante Octokit", async () => {
    vi.mocked(
      octokit.rest.issues.create
    ).mockResolvedValue({
      data: {
        number: 15,
        title: "Agregar sillones nuevos",
        html_url:
          "https://github.com/prueba/acumiglio/issues/15",
      },
    } as any);

    const result = await createIssue({
      owner: "usuario-prueba",
      repo: "acumiglio-catalogo",
      title: "Agregar sillones nuevos",
      body: "Incorporar nueva colección.",
    });

    expect(result.number).toBe(15);
    expect(result.title).toBe("Agregar sillones nuevos");

    expect(
      octokit.rest.issues.create
    ).toHaveBeenCalledOnce();
  });

  test("9. un error 404 de GitHub se transforma en un error controlado", async () => {
    vi.mocked(
      octokit.rest.repos.listForAuthenticatedUser
    ).mockRejectedValue({
      status: 404,
    });

    await expect(
      listRepositories({
        per_page: 10,
        page: 1,
      })
    ).rejects.toThrow(
      "No se encontró el recurso solicitado"
    );
  });
});
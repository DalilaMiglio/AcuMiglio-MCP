import { ListRepositoriesSchema } from "../schemas/index.js";
import { listRepositories } from "../github/operations.js";
import { formatErrorForLLM } from "../errors/index.js";

export const listRepositoriesTool = {
  name: "list-repositories",

  title: "Listar repositorios de GitHub",

  description:
    "Obtiene y muestra los repositorios de la cuenta de GitHub autenticada. Usa este tool cuando el usuario quiera ver, consultar, buscar o listar sus repositorios.",

  schema: ListRepositoriesSchema,

  handler: async (input: unknown) => {
    try {
      const validatedInput = ListRepositoriesSchema.parse(input);
      const repositories = await listRepositories(validatedInput);

      if (repositories.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "No se encontraron repositorios.",
            },
          ],
        };
      }

      const formattedRepositories = repositories
        .map(
          (repo, index) =>
            `${index + 1}. ${repo.name}\n` +
            `   URL: ${repo.html_url}\n` +
            `   Visibilidad: ${repo.private ? "privado" : "público"}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text" as const,
            text: `Repositorios encontrados:\n\n${formattedRepositories}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: formatErrorForLLM(error, "listar los repositorios"),
          },
        ],
        isError: true,
      };
    }
  },
};
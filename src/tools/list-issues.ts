import { ListIssuesSchema } from "../schemas/index.js";
import { listIssues } from "../github/operations.js";
import { formatErrorForLLM } from "../errors/index.js";

export const listIssuesTool = {
  name: "list-issues",

  title: "Listar issues de GitHub",

  description:
    "Obtiene los issues de un repositorio de GitHub. Usa este tool cuando el usuario quiera consultar, revisar o listar issues abiertos, cerrados o todos los issues de un repositorio.",

  schema: ListIssuesSchema,

  handler: async (input: unknown) => {
    try {
      const validatedInput = ListIssuesSchema.parse(input);
      const issues = await listIssues(validatedInput);

      if (issues.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "No se encontraron issues con los criterios indicados.",
            },
          ],
        };
      }

      const formattedIssues = issues
        .map(
          (issue) =>
            `#${issue.number} - ${issue.title}\n` +
            `Estado: ${issue.state}\n` +
            `URL: ${issue.html_url}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text" as const,
            text: `Issues encontrados:\n\n${formattedIssues}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: formatErrorForLLM(error, "listar los issues"),
          },
        ],
        isError: true,
      };
    }
  },
};
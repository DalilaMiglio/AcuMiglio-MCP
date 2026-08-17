import { CreateIssueSchema } from "../schemas/index.js";
import { createIssue } from "../github/operations.js";
import { formatErrorForLLM } from "../errors/index.js";

export const createIssueTool = {
  name: "create-issue",

  title: "Crear issue de GitHub",

  description:
    "Crea un nuevo issue dentro de un repositorio de GitHub. Usa este tool cuando el usuario quiera registrar un problema, tarea, mejora, bug o solicitud dentro de un repositorio.",

  schema: CreateIssueSchema,

  handler: async (input: unknown) => {
    try {
      const validatedInput = CreateIssueSchema.parse(input);
      const issue = await createIssue(validatedInput);

      return {
        content: [
          {
            type: "text" as const,
            text:
              `Issue creado correctamente.\n` +
              `Número: #${issue.number}\n` +
              `Título: ${issue.title}\n` +
              `URL: ${issue.html_url}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: formatErrorForLLM(error, "crear el issue"),
          },
        ],
        isError: true,
      };
    }
  },
};
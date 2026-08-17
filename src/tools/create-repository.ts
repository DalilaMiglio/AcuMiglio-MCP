import { CreateRepositorySchema } from "../schemas/index.js";
import { createRepository } from "../github/operations.js";
import { formatErrorForLLM } from "../errors/index.js";

export const createRepositoryTool = {
  name: "create-repository",

  title: "Crear repositorio de GitHub",

  description:
    "Crea un nuevo repositorio en la cuenta de GitHub autenticada. Usa este tool cuando el usuario solicite crear, generar o iniciar un nuevo repositorio de GitHub.",

  schema: CreateRepositorySchema,

  handler: async (input: unknown) => {
    try {
      const validatedInput = CreateRepositorySchema.parse(input);
      const repository = await createRepository(validatedInput);

      return {
        content: [
          {
            type: "text" as const,
            text:
              `Repositorio creado correctamente.\n` +
              `Nombre: ${repository.name}\n` +
              `URL: ${repository.html_url}\n` +
              `Visibilidad: ${repository.private ? "privado" : "público"}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: formatErrorForLLM(error, "crear el repositorio"),
          },
        ],
        isError: true,
      };
    }
  },
};
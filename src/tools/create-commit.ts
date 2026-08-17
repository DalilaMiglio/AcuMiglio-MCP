import { CreateCommitSchema } from "../schemas/index.js";
import { createCommit } from "../github/operations.js";
import { formatErrorForLLM } from "../errors/index.js";

export const createCommitTool = {
  name: "create-commit",

  title: "Crear commit en GitHub",

  description:
    "Crea o actualiza un archivo en un repositorio de GitHub y genera un commit. Usa este tool cuando el usuario quiera crear un archivo, modificar su contenido o guardar cambios mediante un commit.",

  schema: CreateCommitSchema,

  handler: async (input: unknown) => {
    try {
      const validatedInput = CreateCommitSchema.parse(input);
      const result = await createCommit(validatedInput);

      return {
        content: [
          {
            type: "text" as const,
            text:
              `Commit realizado correctamente.\n` +
              `Archivo: ${validatedInput.path}\n` +
              `Mensaje: ${validatedInput.message}\n` +
              `Commit: ${result.commit.html_url ?? "creado correctamente"}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: formatErrorForLLM(error, "realizar el commit"),
          },
        ],
        isError: true,
      };
    }
  },
};
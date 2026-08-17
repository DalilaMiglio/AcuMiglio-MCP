import { z } from "zod";

/**
 * Schema para crear un repositorio.
 */
export const CreateRepositorySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del repositorio es obligatorio.")
    .max(100, "El nombre del repositorio no puede superar los 100 caracteres.")
    .regex(
      /^[A-Za-z0-9._-]+$/,
      "El nombre solo puede contener letras, números, puntos, guiones y guiones bajos."
    )
    .describe(
      "Nombre del nuevo repositorio de GitHub. Ejemplo: acumiglio-catalogo"
    ),

  description: z
    .string()
    .max(350, "La descripción no puede superar los 350 caracteres.")
    .optional()
    .describe(
      "Descripción opcional que explica el propósito del repositorio."
    ),

  private: z
    .boolean()
    .default(false)
    .describe(
      "Indica si el repositorio debe ser privado. false crea un repositorio público."
    ),
});

/**
 * Schema para listar repositorios.
 */
export const ListRepositoriesSchema = z.object({
  per_page: z
    .number()
    .int("per_page debe ser un número entero.")
    .min(1, "Debe solicitarse al menos 1 repositorio.")
    .max(100, "GitHub permite como máximo 100 resultados por página.")
    .default(30)
    .describe(
      "Cantidad máxima de repositorios que se desean obtener por página."
    ),

  page: z
    .number()
    .int("page debe ser un número entero.")
    .min(1, "La página debe ser igual o mayor a 1.")
    .default(1)
    .describe("Número de página de resultados que se desea consultar."),
});

/**
 * Schema para crear un issue.
 */
export const CreateIssueSchema = z.object({
  owner: z
    .string()
    .min(1, "El propietario del repositorio es obligatorio.")
    .describe(
      "Usuario u organización propietaria del repositorio en GitHub."
    ),

  repo: z
    .string()
    .min(1, "El nombre del repositorio es obligatorio.")
    .describe(
      "Nombre del repositorio donde se creará el issue."
    ),

  title: z
    .string()
    .min(1, "El título del issue es obligatorio.")
    .max(256, "El título del issue es demasiado largo.")
    .describe(
      "Título claro y breve del issue que se desea crear."
    ),

  body: z
    .string()
    .optional()
    .describe(
      "Descripción opcional del problema, tarea o mejora del issue."
    ),
});

/**
 * Schema para listar issues.
 */
export const ListIssuesSchema = z.object({
  owner: z
    .string()
    .min(1, "El propietario del repositorio es obligatorio.")
    .describe(
      "Usuario u organización propietaria del repositorio."
    ),

  repo: z
    .string()
    .min(1, "El nombre del repositorio es obligatorio.")
    .describe(
      "Repositorio cuyos issues se desean consultar."
    ),

  state: z
    .enum(["open", "closed", "all"])
    .default("open")
    .describe(
      "Estado de los issues a consultar: open, closed o all."
    ),

  per_page: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(30)
    .describe(
      "Cantidad máxima de issues a devolver."
    ),
});

/**
 * Schema para crear o actualizar un archivo mediante commit.
 */
export const CreateCommitSchema = z.object({
  owner: z
    .string()
    .min(1, "El propietario del repositorio es obligatorio.")
    .describe(
      "Usuario u organización propietaria del repositorio."
    ),

  repo: z
    .string()
    .min(1, "El nombre del repositorio es obligatorio.")
    .describe(
      "Repositorio donde se realizará el commit."
    ),

  path: z
    .string()
    .min(1, "La ruta del archivo es obligatoria.")
    .describe(
      "Ruta del archivo dentro del repositorio. Ejemplo: docs/catalogo.md"
    ),

  message: z
    .string()
    .min(1, "El mensaje del commit es obligatorio.")
    .describe(
      "Mensaje que describe el cambio realizado en el commit."
    ),

  content: z
    .string()
    .min(1, "El contenido del archivo no puede estar vacío.")
    .describe(
      "Contenido completo que se escribirá dentro del archivo."
    ),

  branch: z
    .string()
    .optional()
    .describe(
      "Rama donde se realizará el commit. Si no se indica, se utilizará la rama principal."
    ),
});

export const ToolsSchemas = {
  CreateRepositorySchema,
  ListRepositoriesSchema,
  CreateIssueSchema,
  ListIssuesSchema,
  CreateCommitSchema,
};
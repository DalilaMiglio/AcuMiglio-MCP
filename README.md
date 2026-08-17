# 🪑 AcuMiglio MCP GitHub Agent
AcuMiglio MCP GitHub Agent es un servidor MCP (Model Context Protocol) desarrollado con TypeScript que permite a un agente de inteligencia artificial interactuar con GitHub mediante lenguaje natural.
El usuario puede realizar operaciones sobre GitHub sin ejecutar manualmente llamadas a la API. El LLM interpreta la solicitud, selecciona el tool MCP apropiado y el servidor ejecuta la operación mediante Octokit y GitHub API.
---
## 🎯 Objetivo
El objetivo del proyecto es implementar un MCP Server funcional capaz de conectar un agente de IA con GitHub.
AcuMiglio utiliza una identidad inspirada en una tienda de muebles ficticia, mientras que el objetivo técnico del proyecto es demostrar la integración:
Usuario → Antigravity → LLM → MCP Server → Tools → Octokit → GitHub API.
---
## ✨ ¿Por qué es útil?
Permite realizar tareas habituales de GitHub utilizando lenguaje natural.
Ejemplos:
- Crear repositorios.
- Consultar repositorios.
- Crear issues.
- Consultar issues.
- Crear o actualizar archivos mediante commits.
En lugar de interactuar directamente con la API de GitHub, el usuario puede escribir una instrucción como:
> Creá un issue en mi repositorio indicando que debemos actualizar el catálogo de muebles.
El LLM interpreta la intención y selecciona el tool correspondiente.
---
## 🏗️ Arquitectura
```text
Usuario
   ↓
Antigravity (Host)
   ↓
LLM
   ↓
MCP Client
   ↓
AcuMiglio MCP Server
   ↓
Tools
   ↓
Schemas Zod
   ↓
GitHub Operations
   ↓
Octokit
   ↓
GitHub API
```
### Flujo de una solicitud
1. El usuario escribe una instrucción en lenguaje natural.
2. El LLM interpreta la intención.
3. El LLM analiza las descripciones de los tools disponibles.
4. Selecciona el tool apropiado.
5. Zod valida los parámetros.
6. El MCP Server ejecuta la operación.
7. Octokit realiza la solicitud a GitHub API.
8. GitHub devuelve el resultado.
9. El MCP Server transforma la respuesta.
10. El agente comunica el resultado al usuario.
---
## 🧰 Tecnologías
- Node.js
- TypeScript
- Model Context Protocol (MCP)
- MCP TypeScript SDK
- Zod
- Octokit
- GitHub REST API
- Vitest
- Antigravity
- MCP Inspector
- dotenv
---
## 📁 Estructura

```text
M5-MCP/
├── .agents/
│   └── mcp_config.json
├── src/
│   ├── tools/
│   │   ├── create-repository.ts
│   │   ├── create-issue.ts
│   │   ├── list-repositories.ts
│   │   ├── create-commit.ts
│   │   └── list-issues.ts
│   ├── schemas/
│   │   └── index.ts
│   ├── github/
│   │   ├── client.ts
│   │   └── operations.ts
│   ├── errors/
│   │   └── index.ts
│   ├── utils/
│   │   ├── logging.ts
│   │   └── retry.ts
│   ├── server.ts
│   └── types.ts
├── tests/
│   ├── tools.test.ts
│   ├── github.test.ts
│   └── errors.test.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```
---
# ⚙️ Requisitos
- Node.js 20 o superior
- npm
- Git
- Cuenta de GitHub
- Personal Access Token de GitHub
- Antigravity

---
# 🚀 Instalación
## 1. Clonar el repositorio
```bash
git clone URL_DEL_REPOSITORIO
```
Entrar al proyecto:
```bash
cd M5-MCP
```
## 2. Instalar dependencias
```bash
npm install
```
## 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz:
```env
GITHUB_PERSONAL_ACCESS_TOKEN=tu_token
```
Nunca se debe subir `.env` al repositorio.
El proyecto incluye `.env.example` como referencia.
## 4. Compilar

```bash
npm run build
```

## 5. Desarrollo

```bash
npm run dev
```

---

# 🔐 GitHub Personal Access Token
El servidor necesita autenticarse con GitHub.

El token utilizado debe disponer de los permisos necesarios para las operaciones que se quieran ejecutar, incluyendo acceso de lectura/escritura a repositorios, contenidos e issues.
El token debe almacenarse exclusivamente en `.env`.
Nunca debe:
- hardcodearse en el código;
- incluirse en el README;
- almacenarse en commits;
- exponerse mediante logs.

Si un token se publica accidentalmente, debe revocarse inmediatamente.

---

# 🤖 Configuración con Antigravity

El proyecto utiliza Antigravity como host del MCP Server.

Ejemplo:

```json
{
  "mcpServers": {
    "acumiglio-mcp": {
      "command": "node",
      "args": ["dist/src/server.js"],
      "cwd": "RUTA_ABSOLUTA_AL_PROYECTO"
    }
  }
}
```
`cwd` establece la raíz desde la que se ejecuta el servidor, permitiendo que `dotenv` encuentre correctamente el archivo `.env`.
No debe colocarse el token real dentro de este archivo.
Antes de utilizar Antigravity:
```bash
npm install
npm run build
```
---
# 🛠️ Tools
## 1. create-repository
Crea un repositorio en la cuenta autenticada.
### Parámetros
- `name`: string — nombre del repositorio.
- `description`: string opcional — descripción.
- `private`: boolean — determina su visibilidad.
### Prompt
> Creá un repositorio público llamado acumiglio-catalogo para almacenar el catálogo digital de muebles.
---
## 2. list-repositories
Lista los repositorios de la cuenta autenticada.
### Parámetros
- `per_page`: number — cantidad de resultados.
- `page`: number — página solicitada.
### Prompt
> Mostrame mis últimos 5 repositorios de GitHub.
---
## 3. create-issue
Crea un issue en un repositorio.
### Parámetros
- `owner`: string — propietario.
- `repo`: string — repositorio.
- `title`: string — título.
- `body`:string opcional — descripción.
### Prompt
> Creá un issue en acumiglio-catalogo llamado "Agregar colección de sillones" indicando que debemos incorporar los nuevos modelos.
---
## 4. list-issues
Consulta los issues de un repositorio.
### Parámetros
- `owner`: string — propietario.
- `repo`: string — repositorio.
- `state`: `open`, `closed` o `all`.
- `per_page`: number — cantidad máxima.
### Prompt
> Mostrame los issues abiertos de acumiglio-catalogo.
---
## 5. create-commit
Crea o actualiza un archivo y genera un commit.
### Parámetros
- `owner`: string — propietario.
- `repo`: string — repositorio.
- `path`: string — ruta del archivo.
- `message`: string — mensaje del commit.
- `content`: string — contenido.
- `branch`: string opcional — rama.
### Prompt
> Creá README.md en acumiglio-catalogo con una presentación de AcuMiglio y hacé el commit con el mensaje "docs: agregar README".
---
# 🛡️ Validación y manejo de errores
Los inputs se validan mediante Zod antes de ejecutar las operaciones.
El servidor transforma errores técnicos de GitHub en mensajes comprensibles.
Se contemplan, entre otros:
- `401` — autenticación.
- `403` — permisos o rate limit.
- `404` — recurso no encontrado.
- `422` — datos rechazados.
- `429` — rate limit.
El sistema incorpora retry con exponential backoff para errores temporales y evita ciclos de reintentos inmediatos.
Los logs utilizan `stderr` para evitar interferir con la comunicación MCP mediante `stdio`.
---
# 🧪 Tests
Los tests utilizan Vitest.
Ejecutar:
```bash
npm run test
```
El proyecto incluye tests para:
- schemas de Zod;
- inputs válidos;
- inputs inválidos;
- operaciones de GitHub;
- mocks de Octokit;
- autenticación;
- permisos;
- recursos inexistentes;
- transformación de errores.
Las operaciones de los tests utilizan mocks y no dependen de llamadas reales a GitHub.
---
# 🔍 MCP Inspector
Para probar el servidor sin utilizar un LLM:
```bash
npx @modelcontextprotocol/inspector node dist/src/server.js
```
Inspector permite verificar los tools y ejecutar llamadas directamente.
--

# 🧯 Troubleshooting
### El MCP Server no inicia
Ejecutar:
```bash
npm run build
```
y revisar errores de TypeScript.
### Antigravity no encuentra el servidor
Verificar:
- ruta del proyecto;
- `cwd`;
- existencia de `dist/src/server.js`;
- que el proyecto haya sido compilado.
### Falta GITHUB_PERSONAL_ACCESS_TOKEN
Comprobar que existe:
```text
M5-MCP/.env
```
y que contiene:
```env
GITHUB_PERSONAL_ACCESS_TOKEN=...
```
### GitHub devuelve 401
El token puede ser inválido o haber expirado.
### GitHub devuelve 403
El token puede no disponer de permisos suficientes o se alcanzó un rate limit.
### GitHub devuelve 404
Comprobar `owner` y `repo`.
### Los tests fallan
Ejecutar:
```bash
npm install
npm run test
```
# 🔒 Seguridad
- `.env` está excluido mediante `.gitignore`.
- El token no está hardcodeado.
- Los logs evitan exponer credenciales.
- `.env.example` no contiene valores reales.
- Los errores enviados al LLM no incluyen stack traces.

# 📜 Licencia
MIT
# 👩‍💻 Proyecto académico
Proyecto Integrador M5 — Especialización Backend.
AcuMiglio MCP GitHub Agent.
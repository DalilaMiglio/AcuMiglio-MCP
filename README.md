# AcuMiglio MCP GitHub Agent

Servidor MCP desarrollado con Node.js y TypeScript para que un agente de IA opere sobre GitHub mediante herramientas con entradas validadas.

**[Repositorio](https://github.com/DalilaMiglio/AcuMiglio-MCP)** · **[Herramientas](src/tools)** · **[Pruebas](tests)**

## Qué demuestra el proyecto

Integración entre un host compatible con Model Context Protocol, un servidor por `stdio` y la API REST de GitHub mediante Octokit. El servidor registra cinco herramientas:

| Herramienta | Operación |
| --- | --- |
| `create-repository` | Crear un repositorio en la cuenta autenticada |
| `list-repositories` | Consultar repositorios |
| `create-issue` | Crear un issue |
| `list-issues` | Consultar issues y su estado |
| `create-commit` | Crear o actualizar un archivo mediante un commit |

Proyecto académico individual de formación backend. Implementé herramientas MCP, esquemas Zod, operaciones de GitHub, manejo de errores y pruebas con Vitest.

## Tecnologías

Node.js, TypeScript, MCP TypeScript SDK, Octokit, Zod, dotenv y Vitest. Antigravity se utilizó como host durante el desarrollo.

## Arquitectura

El host recibe la solicitud del usuario y el agente elige una herramienta. El servidor valida sus parámetros con Zod, llama a GitHub mediante Octokit y transforma la respuesta para devolverla al host.

- `src/server.ts`: registro de herramientas y transporte `stdio`.
- `src/tools/`: esquemas y handlers de cada operación.
- `src/github/`: cliente y operaciones de GitHub.
- `src/schemas/`: validación de entradas.
- `src/errors/`: errores y mensajes para el agente.
- `src/utils/`: logging y reintentos.
- `tests/`: pruebas de esquemas, operaciones y errores.

## Instalación

Requiere Git, Node.js y npm compatibles con las dependencias de `package.json`. Para operaciones reales se necesita una cuenta de GitHub y un token con acceso a los repositorios y operaciones utilizados.

```bash
git clone https://github.com/DalilaMiglio/AcuMiglio-MCP.git
cd AcuMiglio-MCP
npm ci
cp .env.example .env
```

Completar en el archivo local `.env`:

```env
GITHUB_PERSONAL_ACCESS_TOKEN=tu_token
```

Compilar y ejecutar:

```bash
npm run build
npm start
```

El servidor se comunica por entrada y salida estándar. No abre una página web. Los mensajes de diagnóstico se envían a `stderr`.

Para desarrollo:

```bash
npm run dev
```

## Conectar desde un host MCP

Ejemplo de configuración. Reemplazar `/ruta/absoluta/AcuMiglio-MCP` por la ubicación local real del repositorio:

```json
{
  "mcpServers": {
    "acumiglio-mcp": {
      "command": "node",
      "args": ["/ruta/absoluta/AcuMiglio-MCP/dist/src/server.js"],
      "cwd": "/ruta/absoluta/AcuMiglio-MCP"
    }
  }
}
```

Ejecutar `npm run build` antes de iniciar el host. `cwd` permite que dotenv encuentre el archivo local de configuración.

## Demostración de uso

Una vez conectado el servidor al host:

1. Pedir: «Mostrame mis últimos cinco repositorios de GitHub».
2. Comprobar la llamada a `list-repositories`.
3. Pedir: «Creá un issue en mi repositorio de pruebas con el título Actualizar documentación».
4. Revisar en GitHub el issue creado y su contenido.

Utilizar un repositorio de pruebas para operaciones de escritura. Las herramientas ejecutan cambios reales cuando se usan credenciales reales.

## Pruebas automatizadas

```bash
npm test
```

Modo interactivo:

```bash
npm run test:watch
```

Los archivos de `tests/` cubren validación de esquemas con Zod, operaciones con mocks de Octokit y transformación de errores. El código de las pruebas puede consultarse en el repositorio; no se publica una cifra de cobertura.

Para inspeccionar las herramientas desde MCP Inspector después de compilar:

```bash
npx @modelcontextprotocol/inspector node dist/src/server.js
```

## Seguridad y configuración

- Utilizar un token limitado a los repositorios y permisos necesarios.
- Guardar las credenciales en el entorno local y no incluirlas en commits, documentación o capturas.
- Mantener `.env` fuera del control de versiones.
- Verificar el repositorio, la rama y el contenido antes de ejecutar herramientas de escritura.

## Solución de problemas

| Situación | Qué revisar |
| --- | --- |
| El host no encuentra el servidor | Ruta absoluta y existencia de `dist/src/server.js` después del build |
| Falta el token | Archivo `.env` y directorio de trabajo del host |
| GitHub responde 401 | Validez del token |
| GitHub responde 403 | Permisos, acceso al repositorio y límites de la API |
| GitHub responde 404 | Propietario, nombre del repositorio y acceso |
| Falla la compilación o una prueba | Versión de Node.js, instalación con `npm ci` y mensaje de error |


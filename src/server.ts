import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createRepositoryTool } from "./tools/create-repository.js";
import { listRepositoriesTool } from "./tools/list-repositories.js";
import { createIssueTool } from "./tools/create-issue.js";
import { listIssuesTool } from "./tools/list-issues.js";
import { createCommitTool } from "./tools/create-commit.js";

const server = new McpServer({
  name: "acumiglio-mcp",
  version: "1.0.0",
});

const tools = [
  createRepositoryTool,
  listRepositoriesTool,
  createIssueTool,
  listIssuesTool,
  createCommitTool,
];

for (const tool of tools) {
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.schema.shape,
    },
    tool.handler
  );
}

async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error(
    "AcuMiglio MCP Server iniciado correctamente con 5 tools."
  );
}

main().catch((error) => {
  console.error("Error fatal al iniciar AcuMiglio MCP Server:", error);
  process.exit(1);
});
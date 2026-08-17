import "dotenv/config";
import { Octokit } from "@octokit/rest";

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

if (!token) {
  throw new Error(
    "GITHUB_PERSONAL_ACCESS_TOKEN no está configurado. Agregalo al archivo .env."
  );
}

export const octokit = new Octokit({
  auth: token,
});
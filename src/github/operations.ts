import { octokit } from "./client.js";
import { withRetry } from "../utils/retry.js";
import { transformGitHubError } from "../errors/index.js";

import type {
  CreateRepositoryInput,
  ListRepositoriesInput,
  CreateIssueInput,
  ListIssuesInput,
  CreateCommitInput,
} from "../types.js";

async function executeGitHubOperation<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await withRetry(operation);
  } catch (error) {
    throw transformGitHubError(error);
  }
}

export async function createRepository(
  input: CreateRepositoryInput
) {
  return executeGitHubOperation(async () => {
    const response =
      await octokit.rest.repos.createForAuthenticatedUser({
        name: input.name,
        description: input.description,
        private: input.private,
      });

    return response.data;
  });
}

export async function listRepositories(
  input: ListRepositoriesInput
) {
  return executeGitHubOperation(async () => {
    const response =
      await octokit.rest.repos.listForAuthenticatedUser({
        per_page: input.per_page,
        page: input.page,
        sort: "updated",
      });

    return response.data;
  });
}

export async function createIssue(input: CreateIssueInput) {
  return executeGitHubOperation(async () => {
    const response = await octokit.rest.issues.create({
      owner: input.owner,
      repo: input.repo,
      title: input.title,
      body: input.body,
    });

    return response.data;
  });
}

export async function listIssues(input: ListIssuesInput) {
  return executeGitHubOperation(async () => {
    const response = await octokit.rest.issues.listForRepo({
      owner: input.owner,
      repo: input.repo,
      state: input.state,
      per_page: input.per_page,
    });

    return response.data;
  });
}

export async function createCommit(input: CreateCommitInput) {
  return executeGitHubOperation(async () => {
    let sha: string | undefined;

    try {
      const existingFile = await octokit.rest.repos.getContent({
        owner: input.owner,
        repo: input.repo,
        path: input.path,
        ref: input.branch,
      });

      if (
        !Array.isArray(existingFile.data) &&
        existingFile.data.type === "file"
      ) {
        sha = existingFile.data.sha;
      }
    } catch (error: any) {
      if (error?.status !== 404) {
        throw error;
      }
    }

    const response =
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: input.owner,
        repo: input.repo,
        path: input.path,
        message: input.message,
        content: Buffer.from(
          input.content,
          "utf8"
        ).toString("base64"),
        branch: input.branch,
        ...(sha ? { sha } : {}),
      });

    return response.data;
  });
}
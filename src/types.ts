import { z } from "zod";

import {
  CreateRepositorySchema,
  ListRepositoriesSchema,
  CreateIssueSchema,
  ListIssuesSchema,
  CreateCommitSchema,
} from "./schemas/index.js";

export type CreateRepositoryInput = z.infer<
  typeof CreateRepositorySchema
>;

export type ListRepositoriesInput = z.infer<
  typeof ListRepositoriesSchema
>;

export type CreateIssueInput = z.infer<
  typeof CreateIssueSchema
>;

export type ListIssuesInput = z.infer<
  typeof ListIssuesSchema
>;

export type CreateCommitInput = z.infer<
  typeof CreateCommitSchema
>;

export interface GitHubRepositoryResult {
  id: number;
  name: string;
  fullName: string;
  url: string;
  private: boolean;
  description: string | null;
}

export interface GitHubIssueResult {
  number: number;
  title: string;
  state: string;
  url: string;
}
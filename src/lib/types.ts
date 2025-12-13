/* =========================================================
   CLIENT-SAFE SHARED TYPES
   ========================================================= */

export enum CredentialType {
  OPENAI = "OPENAI",
  ANTHROPIC = "ANTHROPIC",
  GEMINI = "GEMINI",
}

export enum NodeType {
  INITIAL = "INITIAL",
  MANUAL_TRIGGER = "MANUAL_TRIGGER",
  HTTP_REQUEST = "HTTP_REQUEST",
  GOOGLE_FORM_TRIGGER = "GOOGLE_FORM_TRIGGER",
  STRIPE_TRIGGER = "STRIPE_TRIGGER",
  OPENAI = "OPENAI",
  GEMINI = "GEMINI",
  ANTHROPIC = "ANTHROPIC",
  DISCORD = "DISCORD",
  SLACK = "SLACK",
}

export enum ExecutionStatus {
  RUNNING = "RUNNING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

/* -------------------------
   DTOs
-------------------------- */

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CredentialDTO = {
  id: string;
  name: string;
  value: string;
  type: CredentialType;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type NodeDTO = {
  id: string;
  workflowId: string;
  name: string;
  type: NodeType;
  position: Record<string, unknown>;
  data: Record<string, unknown>;
  credentialId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConnectionDTO = {
  id: string;
  workflowId: string;
  fromNodeId: string;
  toNodeId: string;
  fromOutput: string;
  toInput: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkflowDTO = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  nodes: NodeDTO[];
  connections: ConnectionDTO[];
  executions?: ExecutionDTO[];
};

export type ExecutionDTO = {
  id: string;
  workflowId: string;
  workflow: {
    id: string;
    name: string;
  };
  status: ExecutionStatus;
  error?: string | null;
  errorStack?: string | null;
  startedAt: string;
  completedAt?: string | null;
  inngestEventId: string;
  output?: Record<string, unknown> | null;
};

/* -------------------------
   PAGINATION
-------------------------- */

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/* -------------------------
   AUTH
-------------------------- */

export type SessionDTO = {
  user: UserDTO;
  expiresAt: string;
};

/* -------------------------
   UTIL
-------------------------- */

export type IdPayload = {
  id: string;
};

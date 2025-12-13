import { ExecutionStatus } from "@/lib/types";

type PrismaExecutionLike = {
  id: string;
  workflowId: string;
  status: string;
  error?: string | null;
  errorStack?: string | null;
  startedAt: Date;
  completedAt?: Date | null;
  inngestEventId: string;
  output?: unknown | null;
  workflow?: {
    id: string;
    name: string;
  };
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

export function mapExecutionToDTO(e: PrismaExecutionLike): ExecutionDTO {
  return {
    id: e.id,
    workflowId: e.workflowId,
    workflow: e.workflow!,
    status: e.status as ExecutionStatus, // ✅ SAFE
    error: e.error ?? null,
    errorStack: e.errorStack ?? null,
    startedAt: e.startedAt.toISOString(),
    completedAt: e.completedAt?.toISOString() ?? null,
    inngestEventId: e.inngestEventId,
    output: (e.output as Record<string, unknown>) ?? null,
  };
}

import { NodeType } from "@/lib/types";

/* ---------- DTOs ---------- */

export type WorkflowSummaryDTO = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkflowEditorDTO = {
  id: string;
  name: string;
  nodes: {
    id: string;
    type: NodeType;
    position: { x: number; y: number };
    data: Record<string, unknown>;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
  }[];
};

/* ---------- MAPPERS ---------- */

export function mapWorkflowToSummaryDTO(w: {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}): WorkflowSummaryDTO {
  return {
    id: w.id,
    name: w.name,
    userId: w.userId,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
  };
}

export function mapWorkflowToEditorDTO(w: {
  id: string;
  name: string;
  nodes: any[];
  connections: any[];
}): WorkflowEditorDTO {
  return {
    id: w.id,
    name: w.name,
    nodes: w.nodes.map((n) => ({
      id: n.id,
      type: n.type as NodeType,
      position: n.position as { x: number; y: number },
      data: (n.data as Record<string, unknown>) ?? {},
    })),
    edges: w.connections.map((c) => ({
      id: c.id,
      source: c.fromNodeId,
      target: c.toNodeId,
      sourceHandle: c.fromOutput,
      targetHandle: c.toInput,
    })),
  };
}

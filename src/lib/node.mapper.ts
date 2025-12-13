import { NodeType } from "@/lib/types";

type PrismaNodeLike = {
  id: string;
  workflowId: string;
  name: string;
  type: string;
  position: unknown;
  data: unknown;
  credentialId?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function mapNodeToDTO(node: PrismaNodeLike) {
  return {
    id: node.id,
    workflowId: node.workflowId,
    name: node.name,
    type: node.type as NodeType, // ✅ enum cast
    position: node.position as Record<string, unknown>,
    data: (node.data as Record<string, unknown>) ?? {},
    credentialId: node.credentialId ?? null,
    createdAt: node.createdAt.toISOString(),
    updatedAt: node.updatedAt.toISOString(),
  };
}

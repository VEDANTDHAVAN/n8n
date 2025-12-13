type PrismaConnectionLike = {
  id: string;
  workflowId: string;
  fromNodeId: string;
  toNodeId: string;
  fromOutput: string;
  toInput: string;
  createdAt: Date;
  updatedAt: Date;
};

export function mapConnectionToDTO(c: PrismaConnectionLike) {
  return {
    id: c.id,
    workflowId: c.workflowId,
    fromNodeId: c.fromNodeId,
    toNodeId: c.toNodeId,
    fromOutput: c.fromOutput,
    toInput: c.toInput,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

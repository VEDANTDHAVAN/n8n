"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import '@xyflow/react/dist/style.css';
import { type Node, type Edge, applyNodeChanges, applyEdgeChanges, addEdge,
  type NodeChange, type EdgeChange, type Connection, 
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel} from '@xyflow/react';
import { useCallback, useMemo, useState } from "react";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { EditorAtom } from "../store/atoms";
import { NodeType } from "@/generated/prisma/enums";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

export const EditorLoading = () => {
 return <LoadingView message="Loading Editor..." />
}

export const EditorError = () => {
 return <ErrorView message="Error Loading Editor" />
}

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const setEditor = useSetAtom(EditorAtom);
 
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER)
  }, [nodes])

  return (
    <div className="size-full">
     <ReactFlow nodes={nodes} edges={edges} onConnect={onConnect}
      onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} 
      fitView nodeTypes={nodeComponents} onInit={setEditor}
      snapGrid={[10, 10]} snapToGrid panOnScroll panOnDrag={false} selectionOnDrag
     >
      <Background /> <Controls /> <MiniMap />
      <Panel position="top-right">
       <AddNodeButton /> 
      </Panel>
      {hasManualTrigger && (
       <Panel position="bottom-center">
       <ExecuteWorkflowButton workflowId={workflowId} /> 
       </Panel>
      )}
     </ReactFlow>
    </div>
  );
};
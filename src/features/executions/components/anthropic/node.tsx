"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { AnthropicDialog, AnthropicFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchAnthropicTokenRealtime } from "./actions";
import { ANTHROPIC_CHANNEL_NAME } from "@/inngest/channels/anthropic";

type AnthropicNodeData = {
  variableName?: string;  
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false); 
  const { setNodes } = useReactFlow();  
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: ANTHROPIC_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchAnthropicTokenRealtime,
  });
  const nodeData = props.data;
  
  const description = nodeData.userPrompt 
     ? `claude-opus-4-0: ${nodeData.userPrompt.slice(0, 50)}...`
     : "Not Configured!!"; 
  
  const handleOpenSettings = () => setDialogOpen(true);  
  
  const handleSubmit = (values: AnthropicFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
      if(node.id === props.id) {
        return {
          ...node, data: {
            ...node.data, ...values,
          }
        }
      }
     return node;
    }))
  }

    return (
      <>
       <AnthropicDialog onSubmit={handleSubmit} defaultValues={nodeData}
        open={dialogOpen} onOpenChange={setDialogOpen} />
       <BaseExecutionNode {...props} id={props.id} icon="/logos/anthropic.svg" name="Anthropic"
        description={description} status={nodeStatus} onSettings={handleOpenSettings} onDoubleClick={handleOpenSettings}
       />
      </>  
    )
});

AnthropicNode.displayName = "AnthropicNode";
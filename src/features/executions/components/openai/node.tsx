"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { OpenAIDialog, OpenAIFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenAITokenRealtime } from "./actions";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";

type OpenAINodeData = {
  variableName?: string;  
  credentialId?: string; 
  systemPrompt?: string;
  userPrompt?: string;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false); 
  const { setNodes } = useReactFlow();  
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: OPENAI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenAITokenRealtime,
  });
  const nodeData = props.data;
  
  const description = nodeData.userPrompt 
     ? `openai: ${nodeData.userPrompt.slice(0, 50)}...`
     : "Not Configured!!"; 
  
  const handleOpenSettings = () => setDialogOpen(true);  
  
  const handleSubmit = (values: OpenAIFormValues) => {
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
       <OpenAIDialog onSubmit={handleSubmit} defaultValues={nodeData}
        open={dialogOpen} onOpenChange={setDialogOpen} />
       <BaseExecutionNode {...props} id={props.id} icon="/logos/openai.svg" name="OpenAI"
        description={description} status={nodeStatus} onSettings={handleOpenSettings} onDoubleClick={handleOpenSettings}
       />
      </>  
    )
});

OpenAINode.displayName = "OpenAINode";
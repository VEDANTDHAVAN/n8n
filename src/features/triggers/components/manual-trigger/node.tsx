import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { fetchManualTriggerTokenRealtime } from "./actions";

export const ManualtriggerNode = memo((props: NodeProps)=> {
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenSettings = () => setDialogOpen(true);
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: MANUAL_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchManualTriggerTokenRealtime,
      });

    return (
    <>
     <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
     <BaseTriggerNode 
      {...props} icon={MousePointerIcon} status={nodeStatus}
      name="When clicking 'Execute Workflow'"
      onSettings={handleOpenSettings}
      onDoubleClick={handleOpenSettings}
     />  
    </>  
    )
})
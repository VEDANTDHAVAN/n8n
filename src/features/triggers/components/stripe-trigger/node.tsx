import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchStripeTriggerTokenRealtime } from "./actions";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger";

export const StripeTriggerNode = memo((props: NodeProps)=> {
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenSettings = () => setDialogOpen(true);
    const nodeStatus = useNodeStatus({
         nodeId: props.id,
         channel: STRIPE_TRIGGER_CHANNEL_NAME,
         topic: "status",
         refreshToken: fetchStripeTriggerTokenRealtime,
        });
    

    return (
    <>
     <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
     <BaseTriggerNode 
      {...props} icon="/logos/stripe.svg" status={nodeStatus}
      name="Stripe" description="When Stripe Event is captured"
      onSettings={handleOpenSettings}
      onDoubleClick={handleOpenSettings}
     />  
    </>  
    )
})
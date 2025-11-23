"use client";

import { LogoutButton } from "./logout";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());
  const create = useMutation(trpc.createWorkFlow.mutationOptions({
    onSuccess: () => {
      toast.success("Job queued");
    }
  })); 
  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess: () => {
      toast.success("AI Job queued");
    }
  }));

  return (
    <div className="min-h-screen win-w-screen flex items-center justify-center flex-col gap-y-6">
     protected server component
     <div>
      {JSON.stringify(data)}
     </div>
     <Button onClick={() => testAi.mutate()} disabled={testAi.isPending}>
      Test Ai
     </Button>
     <Button onClick={() => create.mutate()} disabled={create.isPending}>
      Create Workflow
     </Button>
     <LogoutButton />
    </div> 
  )
}

export default Page;
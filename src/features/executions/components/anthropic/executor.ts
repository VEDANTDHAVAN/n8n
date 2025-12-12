import HandleBars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import prisma from "@/lib/db";


HandleBars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(jsonString);
  
  return safeString;
});

type AnthropicData = {
  variableName?: string,
  credentialId?: string,
  systemPrompt?: string,
  userPrompt?: string,
};

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
  nodeId, context, step, data, publish, userId
}) => {
  await publish(anthropicChannel().status({
    nodeId, status: "loading",
  }));

  if(!data.variableName) {
    await publish(anthropicChannel().status({
      nodeId, status: "error",
    }));
    throw new NonRetriableError("Anthropic node: Variable name is Missing!!");
  }

  if(!data.credentialId) {
    await publish(anthropicChannel().status({
      nodeId, status: "error",
    }));
    throw new NonRetriableError("Anthropic node: Credential is Missing!!"); 
  }

  if(!data.userPrompt) {
    await publish(anthropicChannel().status({
      nodeId, status: "error",
    }));
    throw new NonRetriableError("Anthropic node: User Prompt is Missing!!");
  }

  const systemPrompt = data.systemPrompt 
   ? HandleBars.compile(data.systemPrompt)(context)
   : "You are a Helpful Assistant.";

  const userPrompt = HandleBars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
     where: {
      id: data.credentialId, userId,
     },
    });
  });

  if(!credential) {
   await publish(anthropicChannel().status({
      nodeId, status: "error",
    })); 
   throw new NonRetriableError("Anthropic node: Credential not found!!")
  }

  const anthropic = createAnthropic({
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap(
      "anthropic-generate-text", generateText,
      {
        model: anthropic("claude-opus-4-0"),
        system: systemPrompt, prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true, recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const text = steps[0]?.content[0]?.type === "text" ?
     steps[0].content[0].text : "";
    
    await publish(anthropicChannel().status({
      nodeId, status: "success",
    }));

    return {
      ...context, [data.variableName]: {
        text,
      },
    }
  } catch (error) {
    await publish(anthropicChannel().status({
      nodeId, status: "error",
    }),);
    throw error;
  }
};
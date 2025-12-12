import HandleBars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { openAIChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";


HandleBars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(jsonString);
  
  return safeString;
});

type OpenAIData = {
  variableName?: string,
  credentialId?: string,
  systemPrompt?: string,
  userPrompt?: string,
};

export const openAIExecutor: NodeExecutor<OpenAIData> = async ({
  nodeId, context, step, data, publish, userId
}) => {
  await publish(openAIChannel().status({
    nodeId, status: "loading",
  }));

  if(!data.variableName) {
    await publish(openAIChannel().status({
      nodeId, status: "error",
    }));
    throw new NonRetriableError("OpenAI node: Variable name is Missing!!");
  }

  if(!data.credentialId) {
   await publish(openAIChannel().status({
      nodeId, status: "error",
    }));
    throw new NonRetriableError("OpenAI node: Credential is Missing!!"); 
  }

  if(!data.userPrompt) {
    await publish(openAIChannel().status({
      nodeId, status: "error",
    }));
    throw new NonRetriableError("OpenAI node: User Prompt is Missing!!");
  }
  
  const systemPrompt = data.systemPrompt 
   ? HandleBars.compile(data.systemPrompt)(context)
   : "You are a Helpful Assistant.";

  const userPrompt = HandleBars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: {
        id: data.credentialId,
        userId,
      },
    });
  });

  if(!credential) {
    await publish(openAIChannel().status({
      nodeId, status: "error",
    }));
    throw new NonRetriableError("OpenAI node: Credential not found!!")
  }

  const openai = createOpenAI({
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap(
      "openai-generate-text", generateText,
      {
        model: openai("gpt-4"),
        system: systemPrompt, prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true, recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const text = steps[0]?.content[0]?.type === "text" ?
     steps[0].content[0].text : "";
    
    await publish(openAIChannel().status({
      nodeId, status: "success",
    }));

    return {
      ...context, [data.variableName]: {
        text,
      },
    }
  } catch (error) {
    await publish(openAIChannel().status({
      nodeId, status: "error",
    }),);
    throw error;
  }
};
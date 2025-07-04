import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { MastraClient } from "@mastra/client-js";

export const runtime = "edge";
export const maxDuration = 30;



export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  const client = new MastraClient({
    baseUrl: "http://localhost:4111",
  });
  const agent = client.getAgent("stellarAgent");
  
  const result = await agent.stream({
    messages,
    system,
    toolCallStreaming: true,
    clientTools: {
      ...frontendTools(tools),
    },
  });

  // Return the stream response directly
  return result;
}

import { Mastra } from "@mastra/core/mastra";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";
import { PinoLogger } from "@mastra/loggers";
import { PostgresStore } from "@mastra/pg";
import { weatherAgent } from "./agents/weather-agent";
import { weatherWorkflow } from "./workflows/weather-workflow";

const storage = new PostgresStore({
  connectionString: process.env.DATABASE_URL!,
});

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  storage: storage,
  deployer: new CloudflareDeployer({
    scope: process.env.CLOUDFLARE_ACCOUNT_ID || "",
    projectName: "setmindset-agent",
    auth: {
      apiToken: process.env.CLOUDFLARE_API_TOKEN || "",
    },
  }),
  server: {
    build: {
      swaggerUI: true,
    },
  },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});

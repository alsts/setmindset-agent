
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { CloudflareDeployer } from '@mastra/deployer-cloudflare';
import { PostgresStore } from '@mastra/pg';

const storage = new PostgresStore({
  connectionString: process.env.DATABASE_URL!,
});

const devStorage = new LibSQLStore({
  url: "file:../mastra.db",
});


export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  storage: storage,
  deployer: new CloudflareDeployer({
    scope: process.env.CLOUDFLARE_ACCOUNT_ID || "",
    projectName: process.env.CLOUDFLARE_PROJECT_NAME || "",
    auth: {
      apiToken: process.env.CLOUDFLARE_API_TOKEN || "",
    },
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});

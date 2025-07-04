
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { stellarWorkflow } from './workflows/stellar-workflow';
import { stellarAgent } from './agents/stellar-agent';
import { pgdb, pgdbVector } from './storage/pg';

export const mastra = new Mastra({
  workflows: { 
    stellarWorkflow 
  },
  agents: { 
    stellarAgent 
  },
  storage: pgdb,
  vectors: {
    pg: pgdbVector,
  },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});

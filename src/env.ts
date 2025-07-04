import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    ANTHROPIC_API_KEY: z.string().min(1),
    LAUNCHTUBE_URL: z.string().url(),
    LAUNCHTUBE_JWT: z.string().min(1),
    WALLET_WASM_HASH: z.string().min(1),
    RPC_URL: z.string().url(),
    HORIZON_URL: z.string().url(),
    NETWORK_PASSPHRASE: z.string().min(1),
    MERCURY_JWT: z.string().min(1),
    MERCURY_URL: z.string().url(),
    MERCURY_PROJECT_NAME: z.string().min(1),
    NETWORK: z.string().min(1),
    CONTRACT_ID: z.string().min(1),
    WALLET_ID: z.string().min(1),
    AGENT_POLICY_SIGNER_KEY: z.string().min(1),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    LAUNCHTUBE_URL: process.env.LAUNCHTUBE_URL,
    LAUNCHTUBE_JWT: process.env.LAUNCHTUBE_JWT,
    WALLET_WASM_HASH: process.env.WALLET_WASM_HASH,
    RPC_URL: process.env.RPC_URL,
    HORIZON_URL: process.env.HORIZON_URL,
    NETWORK_PASSPHRASE: process.env.NETWORK_PASSPHRASE,
    MERCURY_JWT: process.env.MERCURY_JWT,
    MERCURY_URL: process.env.MERCURY_URL,
    MERCURY_PROJECT_NAME: process.env.MERCURY_PROJECT_NAME,
    NETWORK: process.env.NETWORK,
    CONTRACT_ID: process.env.CONTRACT_ID,
    WALLET_ID: process.env.WALLET_ID,
    AGENT_POLICY_SIGNER_KEY: process.env.AGENT_POLICY_SIGNER_KEY,
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
}); 
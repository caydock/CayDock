// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { shouldEnableSentry } from "./src/utils/env.js";

// 只在生产环境启用Sentry
if (shouldEnableSentry) {
  Sentry.init({
    dsn: "https://584cffa4e4b6b765c78f1c67ad2f1100@o4509933470810112.ingest.us.sentry.io/4509933473234944",

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
} else {
  console.log('🔧 Sentry Edge Runtime已禁用（开发环境）');
}

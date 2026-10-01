import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { TYPESAFE_API_KEY } from "$env/static/private";

const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;

import { TypeSafeClient } from "@typesafe-ai/sdk";
import {
  isQuery as isInputQuery,
  getRelevantDumps as getDumps,
} from "../../../services/jev";

const client = new TypeSafeClient({ apiKey: TYPESAFE_API_KEY });

export const appRouter = router({
  isQuery: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => isInputQuery(input.query, client)),
  getRelevantDumps: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => getDumps(input.query, client)),
});

export type AppRouter = typeof appRouter;

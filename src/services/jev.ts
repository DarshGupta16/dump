import { TypeSafeClient, noul, score } from "@typesafe-ai/sdk";
import { fetchDumps } from "./pocketbase";

export const isQuery = async (query: string, client: TypeSafeClient) => {
  const response = await client.systemOne({
    state: `User Input: ${query}`,
    questions: {
      isQuery: noul("Is this a search query?"),
    },
  });

  console.log(response.answers.isQuery.noul);
  return Boolean(Math.round(response.answers.isQuery.noul));
};

export const getRelevantDumps = async (
  query: string,
  client: TypeSafeClient,
) => {
  const dumps = await fetchDumps();

  const promises = dumps.map(async (dump) => {
    const response = await client.systemOne({
      state: `User search query: ${query}\nsnippet (${new Date(dump.updated).toLocaleString()}): ${dump.dump}\n\nCurrent datetime: ${new Date().toLocaleString()}`,
      questions: {
        isRelevant: noul("Is the snippet relevant to the search query?"),
      },
    });

    return {
      isRelevant: response.answers.isRelevant.noul,
      ...dump,
    };
  });

  const results = await Promise.all(promises);
  console.log(results);
  return results
    .filter((dump) => Math.round(dump.isRelevant) !== 0)
    .sort((a, b) => b.isRelevant - a.isRelevant);
};

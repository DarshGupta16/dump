import { getContext, setContext } from "svelte";
import { createTRPC } from "$lib/trpc";
import { fetchDumps, writeDump } from "./services/pocketbase";

class AppStore {
  userinput = $state("");
  trpc = createTRPC();
  dumpsBeingDisplayed = $state<any[]>([]);

  constructor() {
    const fetchDumpsFn = async () => {
      this.dumpsBeingDisplayed = await fetchDumps();
    };

    fetchDumpsFn();
  }

  async onInputSubmit(e: KeyboardEvent) {
    if (e.key.toLowerCase() == "enter") {
      if (this.userinput.valueOf().trim().length < 1) return;
      const isQuery = await this.trpc.isQuery.query({
        query: this.userinput,
      });
      console.log(isQuery);

      if (this.userinput.includes("--no-exec")) return;

      if (!isQuery) {
        const result = await writeDump(this.userinput.valueOf());
        if (result.error) {
          console.log(result.error);
          return;
        }
        this.userinput = "";
        return;
      }

      const relevantDumps = await this.trpc.getRelevantDumps.query({
        query: this.userinput,
      });
      console.log(relevantDumps);
    }
  }
}

const STORE_KEY = Symbol("APP_STORE_KEY");

export const setAppStoreContext = () => setContext(STORE_KEY, new AppStore());
export const getAppStoreContext = () => getContext<AppStore>(STORE_KEY);

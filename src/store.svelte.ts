import { getContext, setContext } from "svelte";
import { createTRPC } from "$lib/trpc";
import {
  fetchDumps,
  writeDump,
  deleteDump as pbDeleteDump,
} from "./services/pocketbase";

class AppStore {
  userinput = $state("");
  trpc = createTRPC();
  dumpsBeingDisplayed = $state<any[]>([]);
  allDumpsCache = $state<any[]>([]);
  isQuerying = $state(false);
  showingQueryDumps = $state(false);

  constructor() {
    const fetchDumpsFn = async () => {
      const dumps = await fetchDumps();
      this.dumpsBeingDisplayed = dumps;
      this.allDumpsCache = dumps;
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
        const newDumpTemp = {
          dump: this.userinput.valueOf(),
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          id: `temp-${Math.floor(Math.random() * 1000)}`,
        };

        this.dumpsBeingDisplayed.push(newDumpTemp);
        this.allDumpsCache.push(newDumpTemp);

        const result = await writeDump(this.userinput.valueOf());

        if (result.error) {
          console.log(result.error);
          return;
        }

        this.userinput = "";
        return;
      }

      this.isQuerying = true;

      try {
        const relevantDumps = await this.trpc.getRelevantDumps.query({
          query: this.userinput,
        });

        this.showingQueryDumps = true;
        this.dumpsBeingDisplayed = relevantDumps;
        console.log(relevantDumps);
      } finally {
        this.isQuerying = false;
      }
    }
  }

  clearQuery() {
    this.showingQueryDumps = false;
    this.isQuerying = false;
    this.dumpsBeingDisplayed = [...this.allDumpsCache];
    this.userinput = "";
  }

  async deleteDump(id: string) {
    const result = await pbDeleteDump(id);
    if (result.error) {
      console.log(result.error);
      return;
    }

    this.dumpsBeingDisplayed = this.dumpsBeingDisplayed.filter(
      ({ id: dumpId }) => dumpId != id,
    );
    this.allDumpsCache = this.allDumpsCache.filter(
      ({ id: dumpId }) => dumpId != id,
    );
  }
}

const STORE_KEY = Symbol("APP_STORE_KEY");

export const setAppStoreContext = () => setContext(STORE_KEY, new AppStore());
export const getAppStoreContext = () => getContext<AppStore>(STORE_KEY);

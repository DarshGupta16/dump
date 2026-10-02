import PocketBase from "pocketbase";
const pb = new PocketBase("http://127.0.0.1:8090");

export const fetchDumps = () => pb.collection("dumps").getFullList();

export const writeDump = async (dump: string) => {
  try {
    await pb.collection("dumps").create({ dump });
    return { status: "succeeded" };
  } catch (error: any) {
    return { status: "failed", error };
  }
};

export const deleteDump = async (id: string) => {
  try {
    await pb.collection("dumps").delete(id);
    return { status: "succeeded" };
  } catch (error: any) {
    return { status: "failed", error };
  }
};

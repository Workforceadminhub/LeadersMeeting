import { useQuery } from "@tanstack/react-query";
import supabase from "./supabase";
import type { Worker } from "../types";

const searchWorkers = async (
  searchParams: string | undefined | null
): Promise<Worker[]> => {
  if (!searchParams) return [];
  const { data, error } = await supabase.rpc("get_search_results_v2", {
    search_text: searchParams.trim(),
  });
  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Worker not found");
  }
  return data as Worker[];
};

export const useSearchWorker = (searchParams: string | undefined | null) => {
  return useQuery<Worker[]>({
    queryKey: [searchParams],
    queryFn: () => searchWorkers(searchParams),
  });
};

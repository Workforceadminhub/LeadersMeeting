import { useQuery } from "@tanstack/react-query";
import supabase from "./supabase";

export const DEFAULT_MEETING_TITLE =
  "Leaders Meeting with Pastor Mayowa Agboade\nSaturday 18th April 2026";

const fetchSetting = async (key) => {
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data?.value ?? null;
};

export const useMeetingTitle = () => {
  const query = useQuery({
    queryKey: ["app_settings", "meeting_title"],
    queryFn: () => fetchSetting("meeting_title"),
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    networkMode: "offlineFirst",
  });

  const raw = query.data;
  const title =
    typeof raw === "string" && raw.trim().length > 0
      ? raw
      : DEFAULT_MEETING_TITLE;

  return { ...query, title };
};

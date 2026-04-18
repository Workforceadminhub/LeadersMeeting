import { useQuery } from "@tanstack/react-query";
import supabase from "./supabase";
import type { ReportRowFilter } from "../utils/report";

export type LeaderDetail = {
  id: number | string;
  firstname: string | null;
  lastname: string | null;
  fullname: string | null;
  phonenumber: string | null;
  team: string | null;
  department: string | null;
  workerrole: string | null;
  gender: string | null;
  ispresent: boolean | null;
  isconfirmed: boolean | null;
  updatedat: string | null;
};

const PAGE_SIZE = 1000;

const fetchPage = async (
  filter: ReportRowFilter,
  from: number,
  to: number
): Promise<LeaderDetail[]> => {
  let q = supabase
    .from("leader")
    .select(
      "id, firstname, lastname, fullname, phonenumber, team, department, workerrole, gender, ispresent, isconfirmed, updatedat"
    )
    .range(from, to);

  if (filter.kind === "team") {
    q = q.ilike("team", filter.team);
  } else if (filter.kind === "team-department") {
    q = q.ilike("team", filter.team).ilike("department", filter.department);
  } else if (filter.kind === "team-department-suffix") {
    q = q.ilike("team", filter.team).ilike("department", `%${filter.suffix}`);
  }

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data || []) as LeaderDetail[];
};

const fetchAllForFilter = async (
  filter: ReportRowFilter
): Promise<LeaderDetail[]> => {
  const all: LeaderDetail[] = [];
  let from = 0;
  while (true) {
    const to = from + PAGE_SIZE - 1;
    const page = await fetchPage(filter, from, to);
    if (page.length === 0) break;
    all.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return all;
};

const dedupeById = (rows: LeaderDetail[]) => {
  const seen = new Set<string | number>();
  const out: LeaderDetail[] = [];
  for (const r of rows) {
    const key = r.id ?? `${r.firstname}-${r.lastname}-${r.phonenumber}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
};

export const useLeaderDetails = (filters: ReportRowFilter[] | null) => {
  return useQuery({
    queryKey: ["leader_details", filters],
    enabled: Boolean(filters && filters.length > 0),
    queryFn: async () => {
      if (!filters || filters.length === 0) return [] as LeaderDetail[];
      const results = await Promise.all(filters.map(fetchAllForFilter));
      return dedupeById(results.flat()).sort((a, b) => {
        const an = `${a.lastname || ""} ${a.firstname || ""}`
          .trim()
          .toLowerCase();
        const bn = `${b.lastname || ""} ${b.firstname || ""}`
          .trim()
          .toLowerCase();
        return an.localeCompare(bn);
      });
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

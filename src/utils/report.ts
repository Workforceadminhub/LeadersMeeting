export type LeaderAggRow = {
  team: string | null;
  department: string | null;
  ispresent: boolean | null;
};

export type ReportRow = {
  label: string;
  match: (leader: LeaderAggRow) => boolean;
  /**
   * Optional manual override for team strength. When set, the report
   * uses this value as the denominator instead of counting rows in
   * the `leader` table. Present/absent stay DB-driven.
   */
  strength?: number;
};

export type Directorate = {
  label: string;
  /** Tailwind bg color class applied to the directorate name cell. */
  colorClass: string;
  rows: ReportRow[];
};

const matchTeam = (team: string) => (l: LeaderAggRow) =>
  (l.team || "").toLowerCase() === team.toLowerCase();

const matchTeamDepartment = (team: string, department: string) =>
  (l: LeaderAggRow) =>
    (l.team || "").toLowerCase() === team.toLowerCase() &&
    (l.department || "").toLowerCase() === department.toLowerCase();

const matchTeamDepartmentSuffix =
  (team: string, suffix: string) => (l: LeaderAggRow) => {
    if ((l.team || "").toLowerCase() !== team.toLowerCase()) return false;
    return (l.department || "").toLowerCase().endsWith(suffix.toLowerCase());
  };

export const directorates: Directorate[] = [
  {
    label: "ATTRACTION",
    colorClass: "bg-cyan-300",
    rows: [
      { label: "Mission", match: matchTeam("Mission"), strength: 29 },
      { label: "Programs", match: matchTeam("Programs"), strength: 189 },
    ],
  },
  {
    label: "NLP",
    colorClass: "bg-purple-300",
    rows: [{ label: "NLP", match: matchTeam("NLP") }],
  },
  {
    label: "SPD",
    colorClass: "bg-yellow-300",
    rows: [
      { label: "Maturity", match: matchTeam("Maturity"), strength: 29 },
      { label: "Ministry", match: matchTeam("Ministry"), strength: 58 },
      { label: "Membership", match: matchTeam("Membership"), strength: 106 },
    ],
  },
  {
    label: "NEXT GEN",
    colorClass: "bg-blue-300",
    rows: [
      {
        label: "Kidzone",
        match: matchTeamDepartmentSuffix("Next Gen", "Kidszone"),
        strength: 35,
      },
      {
        label: "Stir House",
        match: matchTeamDepartmentSuffix("Next Gen", "Stirhouse"),
        strength: 20,
      },
    ],
  },
  {
    label: "GENERAL SERVICES",
    colorClass: "bg-orange-300",
    rows: [
      {
        label: "Admin & Facility",
        match: matchTeamDepartment("General Service", "Admin and Facility"),
        strength: 2,
      },
      {
        label: "Communication (DMU)",
        match: matchTeamDepartment(
          "General Service",
          "Communications (DMU)"
        ),
        strength: 6,
      },
      {
        label: "Finance",
        match: matchTeamDepartment("General Service", "Finance"),
        strength: 6,
      },
    ],
  },
  {
    label: "COMMUNITIES",
    colorClass: "bg-red-300",
    rows: [{ label: "Districts", match: matchTeam("Districts") }],
  },
  {
    label: "INTERACTIVE GROUPS",
    colorClass: "bg-green-400",
    rows: [
      {
        label: "Men of Harvest",
        match: matchTeamDepartment("Interactive Groups", "Men of Harvest"),
      },
      {
        label: "Singles Ministry",
        match: matchTeamDepartment("Interactive Groups", "Singles Ministry"),
      },
      {
        label: "Women of Wisdom",
        match: matchTeamDepartment("Interactive Groups", "Women of Wisdom"),
      },
    ],
  },
  {
    label: "SENIOR LEADERSHIP",
    colorClass: "bg-green-200",
    rows: [
      {
        label: "Directional leaders",
        match: matchTeamDepartment("Senior Leadership", "Directional leader"),
      },
      {
        label: "Pastoral leaders",
        match: matchTeamDepartment("Senior Leadership", "Pastoral Leaders"),
      },
    ],
  },
];

export type DirectorateReport = {
  label: string;
  colorClass: string;
  rows: Array<{
    label: string;
    strength: number;
    present: number;
    absent: number;
    percentPresent: number;
  }>;
  totals: {
    strength: number;
    present: number;
    absent: number;
    percentPresent: number;
  };
};

export type ReportData = {
  directorates: DirectorateReport[];
  totals: {
    strength: number;
    present: number;
    absent: number;
    percentPresent: number;
  };
};

export const buildReport = (leaders: LeaderAggRow[]): ReportData => {
  const directorateReports: DirectorateReport[] = directorates.map((dir) => {
    const rows = dir.rows.map((row) => {
      const matching = leaders.filter(row.match);
      const present = matching.filter((l) => l.ispresent === true).length;
      const strength =
        typeof row.strength === "number" ? row.strength : matching.length;
      const absent = Math.max(strength - present, 0);
      const percentPresent = strength ? (present / strength) * 100 : 0;
      return {
        label: row.label,
        strength,
        present,
        absent,
        percentPresent,
      };
    });
    const strength = rows.reduce((s, r) => s + r.strength, 0);
    const present = rows.reduce((s, r) => s + r.present, 0);
    const absent = strength - present;
    const percentPresent = strength ? (present / strength) * 100 : 0;
    return {
      label: dir.label,
      colorClass: dir.colorClass,
      rows,
      totals: { strength, present, absent, percentPresent },
    };
  });

  const strength = directorateReports.reduce(
    (s, d) => s + d.totals.strength,
    0
  );
  const present = directorateReports.reduce(
    (s, d) => s + d.totals.present,
    0
  );
  const absent = strength - present;
  const percentPresent = strength ? (present / strength) * 100 : 0;

  return {
    directorates: directorateReports,
    totals: { strength, present, absent, percentPresent },
  };
};

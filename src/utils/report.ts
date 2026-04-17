export type LeaderAggRow = {
  team: string | null;
  department: string | null;
  ispresent: boolean | null;
};

export type ReportRow = {
  label: string;
  match: (leader: LeaderAggRow) => boolean;
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
      { label: "Mission", match: matchTeam("Mission") },
      { label: "Programs", match: matchTeam("Programs") },
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
      { label: "Maturity", match: matchTeam("Maturity") },
      { label: "Ministry", match: matchTeam("Ministry") },
      { label: "Membership", match: matchTeam("Membership") },
    ],
  },
  {
    label: "NEXT GEN",
    colorClass: "bg-blue-300",
    rows: [
      {
        label: "Kidzone",
        match: matchTeamDepartmentSuffix("Next Gen", "Kidszone"),
      },
      {
        label: "Stir House",
        match: matchTeamDepartmentSuffix("Next Gen", "Stirhouse"),
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
      },
      {
        label: "Communication (DMU)",
        match: matchTeamDepartment(
          "General Service",
          "Communications (DMU)"
        ),
      },
      {
        label: "Finance",
        match: matchTeamDepartment("General Service", "Finance"),
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
      const strength = matching.length;
      const present = matching.filter((l) => l.ispresent === true).length;
      const absent = strength - present;
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

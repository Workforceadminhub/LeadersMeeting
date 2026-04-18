export type LeaderAggRow = {
  team: string | null;
  department: string | null;
  ispresent: boolean | null;
  isconfirmed: boolean | null;
};

export type ReportRowFilter =
  | { kind: "team"; team: string }
  | { kind: "team-department"; team: string; department: string }
  | { kind: "team-department-suffix"; team: string; suffix: string };

export type ReportRow = {
  label: string;
  filter: ReportRowFilter;
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

export const rowMatcher = (filter: ReportRowFilter) => {
  switch (filter.kind) {
    case "team":
      return (l: LeaderAggRow) =>
        (l.team || "").toLowerCase() === filter.team.toLowerCase();
    case "team-department":
      return (l: LeaderAggRow) =>
        (l.team || "").toLowerCase() === filter.team.toLowerCase() &&
        (l.department || "").toLowerCase() ===
          filter.department.toLowerCase();
    case "team-department-suffix":
      return (l: LeaderAggRow) => {
        if ((l.team || "").toLowerCase() !== filter.team.toLowerCase())
          return false;
        return (l.department || "")
          .toLowerCase()
          .endsWith(filter.suffix.toLowerCase());
      };
  }
};

export const directorates: Directorate[] = [
  {
    label: "ATTRACTION",
    colorClass: "bg-cyan-300",
    rows: [
      {
        label: "Mission",
        filter: { kind: "team", team: "Mission" },
        strength: 29,
      },
      {
        label: "Programs",
        filter: { kind: "team", team: "Programs" },
        strength: 189,
      },
    ],
  },
  {
    label: "NLP",
    colorClass: "bg-purple-300",
    rows: [{ label: "NLP", filter: { kind: "team", team: "NLP" } }],
  },
  {
    label: "SPD",
    colorClass: "bg-yellow-300",
    rows: [
      {
        label: "Maturity",
        filter: { kind: "team", team: "Maturity" },
        strength: 29,
      },
      {
        label: "Ministry",
        filter: { kind: "team", team: "Ministry" },
        strength: 58,
      },
      {
        label: "Membership",
        filter: { kind: "team", team: "Membership" },
        strength: 106,
      },
    ],
  },
  {
    label: "NEXT GEN",
    colorClass: "bg-blue-300",
    rows: [
      {
        label: "Kidzone",
        filter: {
          kind: "team-department-suffix",
          team: "Next Gen",
          suffix: "Kidszone",
        },
        strength: 35,
      },
      {
        label: "Stir House",
        filter: {
          kind: "team-department-suffix",
          team: "Next Gen",
          suffix: "Stirhouse",
        },
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
        filter: {
          kind: "team-department",
          team: "General Service",
          department: "Admin and Facility",
        },
        strength: 2,
      },
      {
        label: "Communication (DMU)",
        filter: {
          kind: "team-department",
          team: "General Service",
          department: "Communications (DMU)",
        },
        strength: 6,
      },
      {
        label: "Finance",
        filter: {
          kind: "team-department",
          team: "General Service",
          department: "Finance",
        },
        strength: 6,
      },
    ],
  },
  {
    label: "COMMUNITIES",
    colorClass: "bg-red-300",
    rows: [{ label: "Districts", filter: { kind: "team", team: "Districts" } }],
  },
  {
    label: "INTERACTIVE GROUPS",
    colorClass: "bg-green-400",
    rows: [
      {
        label: "Men of Harvest",
        filter: {
          kind: "team-department",
          team: "Interactive Groups",
          department: "Men of Harvest",
        },
      },
      {
        label: "Singles Ministry",
        filter: {
          kind: "team-department",
          team: "Interactive Groups",
          department: "Singles Ministry",
        },
      },
      {
        label: "Women of Wisdom",
        filter: {
          kind: "team-department",
          team: "Interactive Groups",
          department: "Women of Wisdom",
        },
      },
    ],
  },
  {
    label: "SENIOR LEADERSHIP",
    colorClass: "bg-green-200",
    rows: [
      {
        label: "Directional leaders",
        filter: {
          kind: "team-department",
          team: "Senior Leadership",
          department: "Directional leader",
        },
      },
      {
        label: "Pastoral leaders",
        filter: {
          kind: "team-department",
          team: "Senior Leadership",
          department: "Pastoral Leaders",
        },
      },
    ],
  },
];

export type ReportRowTotals = {
  strength: number;
  confirmed: number;
  present: number;
  absent: number;
  percentPresent: number;
  /** Percentage of confirmed leaders who are also marked present. */
  percentConfirmedPresent: number;
};

export type DirectorateReport = {
  label: string;
  colorClass: string;
  rows: Array<ReportRowTotals & { label: string; row: ReportRow }>;
  totals: ReportRowTotals;
};

export type ReportData = {
  directorates: DirectorateReport[];
  totals: ReportRowTotals;
};

export const buildReport = (leaders: LeaderAggRow[]): ReportData => {
  const directorateReports: DirectorateReport[] = directorates.map((dir) => {
    const rows = dir.rows.map((row) => {
      const matching = leaders.filter(rowMatcher(row.filter));
      const present = matching.filter((l) => l.ispresent === true).length;
      const confirmed = matching.filter((l) => l.isconfirmed === true).length;
      const confirmedAndPresent = matching.filter(
        (l) => l.isconfirmed === true && l.ispresent === true
      ).length;
      const strength =
        typeof row.strength === "number" ? row.strength : matching.length;
      const absent = Math.max(strength - present, 0);
      const percentPresent = strength ? (present / strength) * 100 : 0;
      const percentConfirmedPresent = confirmed
        ? (confirmedAndPresent / confirmed) * 100
        : 0;
      return {
        label: row.label,
        row,
        strength,
        confirmed,
        present,
        absent,
        percentPresent,
        percentConfirmedPresent,
      };
    });

    const strength = rows.reduce((s, r) => s + r.strength, 0);
    const confirmed = rows.reduce((s, r) => s + r.confirmed, 0);
    const present = rows.reduce((s, r) => s + r.present, 0);
    const absent = Math.max(strength - present, 0);
    const percentPresent = strength ? (present / strength) * 100 : 0;
    const confirmedAndPresent = dir.rows
      .flatMap((row) => leaders.filter(rowMatcher(row.filter)))
      .filter((l) => l.isconfirmed === true && l.ispresent === true).length;
    const percentConfirmedPresent = confirmed
      ? (confirmedAndPresent / confirmed) * 100
      : 0;

    return {
      label: dir.label,
      colorClass: dir.colorClass,
      rows,
      totals: {
        strength,
        confirmed,
        present,
        absent,
        percentPresent,
        percentConfirmedPresent,
      },
    };
  });

  const strength = directorateReports.reduce(
    (s, d) => s + d.totals.strength,
    0
  );
  const confirmed = directorateReports.reduce(
    (s, d) => s + d.totals.confirmed,
    0
  );
  const present = directorateReports.reduce(
    (s, d) => s + d.totals.present,
    0
  );
  const absent = Math.max(strength - present, 0);
  const percentPresent = strength ? (present / strength) * 100 : 0;
  const confirmedAndPresent = leaders.filter(
    (l) => l.isconfirmed === true && l.ispresent === true
  ).length;
  const percentConfirmedPresent = confirmed
    ? (confirmedAndPresent / confirmed) * 100
    : 0;

  return {
    directorates: directorateReports,
    totals: {
      strength,
      confirmed,
      present,
      absent,
      percentPresent,
      percentConfirmedPresent,
    },
  };
};

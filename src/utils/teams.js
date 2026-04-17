export const teams = [
  {
    label: "Maturity (Prayer, Midweek)",
    value: "Maturity",
  },
  {
    label: "General Service (Finance, Facility, Etc)",
    value: "General Service",
  },
  {
    label: "Ministry (Leadership & Dev, Workforce Etc)",
    value: "Ministry",
  },
  {
    label: "Membership (Growth Track, Etc)",
    value: "Membership",
  },
  {
    label: "Programs (Choir, Ushers, Etc)",
    value: "Programs",
  },
  { label: "Next Gen (Kidzone & Stir House)", value: "Next Gen" },
  {
    label: "Missions (NLP, HSAP, Evangelism, Etc)",
    value: "Missions",
  },
  { label: "District/Community", value: "Districts" },
  {
    label: "Interactive Groups (Singles, WOW, Etc)",
    value: "Interactive Groups",
  },
  {
    label: "Pastoral Leaders",
    value: "Pastoral Leaders",
  },
  { label: "Directional Leaders", value: "Directional Leader" },
];

export const leaderTeams = [
  {
    label: "All Teams",
    value: "All",
  },
  { label: "Districts", value: "Districts" },
  { label: "General Service", value: "General Service" },
  { label: "Interactive Groups", value: "Interactive Groups" },
  { label: "Maturity", value: "Maturity" },
  { label: "Membership", value: "Membership" },
  { label: "Ministry", value: "Ministry" },
  { label: "Mission", value: "Mission" },
  { label: "NLP", value: "NLP" },
  { label: "Next Gen", value: "Next Gen" },
  { label: "Programs", value: "Programs" },
  { label: "Senior Leadership", value: "Senior Leadership" },
];

export const workerrolesoptions = [
  { label: "All Roles", value: "All" },
  { label: "Worker", value: "Worker" },
  { label: "Small Group Leader", value: "Small Group Leader" },
  { label: "House Church Leader", value: "House Church Leader" },
  { label: "E-Group Leader", value: "E-Group Leader" },
  { label: "Connect Leader", value: "Connect Leader" },
  { label: "Cell Leader", value: "Cell Leader" },
  { label: "Assistant HOD", value: "Assistant HOD" },
  { label: "Zonal Leader", value: "Zonal Leader" },
  { label: "HOD", value: "HOD" },
  { label: "Sub team Head (heads more 2 or more departments)", value: "Sub team Head (heads more 2 or more departments)" },
  { label: "Community Leader", value: "Community Leader" },
  { label: "District Pastor", value: "District Pastor" },
  { label: "Pastoral Leader", value: "Pastoral Leader" },
  { label: "Directional Leader", value: "Directional Leader" }
]

export const campusoptions = [
  { label: "All Campuses", value: "All" },
  { label: "Abeokuta", value: "Abeokuta" },
  { label: "Akobo", value: "Akobo" },
  { label: "Apapa", value: "Apapa" },
  { label: "Arepo", value: "Arepo" },
  { label: "Gbagada", value: "Gbagada" },
  { label: "Ibadan / Jerico", value: "Ibadan / Jerico" },
  { label: "Ikorodu", value: "Ikorodu" },
  { label: "Ilupeju", value: "Ilupeju" },
  { label: "Magodo", value: "Magodo" },
  { label: "Portharcourt", value: "Portharcourt" },
  { label: "Surulere", value: "Surulere" },
  { label: "Yaba", value: "Yaba" }
]


export function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');
}

// const depts = [
//   { department: "All" },
//   {
//     department: "Ushering - Iyaanu",
//   },
//   {
//     department: "Greeters 3rd team",
//   },
//   {
//     department: "Administration - Kidszone",
//   },
//   {
//     department: "Data Management",
//   },
//   {
//     department: "Diamond ET",
//   },
//   {
//     department: "Ushering - Bimpe",
//   },
//   {
//     department: "Harvesters Intelligence Unit",
//   },
//   {
//     department: "Media-Graphics",
//   },
//   {
//     department: "Prayer and Bible Study",
//   },
//   {
//     department: "Media-Experience",
//   },
//   {
//     department: "Data Management",
//   },
//   {
//     department: "Group Partnership",
//   },
//   {
//     department: "Communications (DMU)",
//   },
//   {
//     department: "Stirhouse",
//   },
//   {
//     department: "HSAP",
//   },
//   {
//     department: "Kidzone",
//   },
//   {
//     department: "Singles",
//   },
//   {
//     department: "Singles attraction",
//   },
//   {
//     department: "Royal Priesthoods Community",
//   },
//   {
//     department: "Invest and Invite",
//   },
//   {
//     department: "Administration - Kidszone",
//   },
//   {
//     department: "Church office",
//   },
//   {
//     department: "Christ chosen generation",
//   },

//   {
//     department: "Trailblazer Community",
//   },
//   {
//     department: "God's encounter",
//   },
//   {
//     department: "Data Management",
//   },
//   {
//     department: "Ushering - Kofoworola",
//   },
//   {
//     department: "Pastoral Care",
//   },
//   {
//     department: "Greeters 3rd team",
//   },
//   {
//     department: "Call Center",
//   },
//   {
//     department: "Info Hub",
//   },
//   {
//     department: "HSAP",
//   },
//   {
//     department: "Sound",
//   },
//   {
//     department: "Harvesters Intelligence Unit",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Greeters 3rd team",
//   },
//   {
//     department: "Data Management",
//   },
//   {
//     department: "Data Management",
//   },
//   {
//     department: "Media-Visuals",
//   },
//   {
//     department: "Media-Graphics",
//   },
//   {
//     department: "Interactors",
//   },
//   {
//     department: "Learning and Development - Kidszone",
//   },
//   {
//     department: "Special ministry",
//   },
//   {
//     department: "Prayer and Bible Study",
//   },
//   {
//     department: "Pastoral leader",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Learning and Development - Kidszone",
//   },

//   {
//     department: "Praise (Couple) Community",
//   },
//   {
//     department: "Bethel Community",
//   },

//   {
//     department: "Trailblazer Community",
//   },
//   {
//     department: "Ogudu community",
//   },
//   {
//     department: "God encounter",
//   },
//   {
//     department: "HSAP",
//   },
//   {
//     department: "Programs Admin Team",
//   },
//   {
//     department: "Publicity",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Leadership Recruitment",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Leadership Recruitment",
//   },
//   {
//     department: "Prayer and Bible Study",
//   },
//   {
//     department: "Ceremonies",
//   },
//   {
//     department: "Call Center",
//   },
//   {
//     department: "Call Centre",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "God's encounter",
//   },
//   {
//     department: "Career and Finance",
//   },
//   {
//     department: "Evangelism",
//   },
//   {
//     department: "Shomolu",
//   },
//   {
//     department: "Workforce Admin",
//   },
//   {
//     department: "Medical Ministry",
//   },
//   {
//     department: "Prison Ministry",
//   },
//   {
//     department: "Greeters",
//   },
//   {
//     department: "Assimilation",
//   },
//   {
//     department: "Kids Support",
//   },
//   {
//     department: "Spiritual Progress & Development",
//   },
//   {
//     department: "Media",
//   },
//   {
//     department: "Praise (Couple) Community",
//   },
//   {
//     department: "Leadership training",
//   },
//   {
//     department: "Greeters 2nd team",
//   },
//   {
//     department: "Attraction",
//   },
//   {
//     department: "Discipleship",
//   },
//   {
//     department: "Stage management",
//   },
//   {
//     department: "Prayer and Bible Study",
//   },
//   {
//     department: "Programmes",
//   },
//   {
//     department: "HSAP",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Unveil",
//   },
//   {
//     department: "Emerald ET",
//   },
//   {
//     department: "Protocol",
//   },
//   {
//     department: "Media-Visuals",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Ushering - Bimpe",
//   },
//   {
//     department: "Exalted Tribe",
//   },
//   {
//     department: "Group Partnership",
//   },
//   {
//     department: "Leadership Training",
//   },
//   {
//     department: "Communication",
//   },
//   {
//     department: "Media-Livestream",
//   },
//   {
//     department: "Greeters 1st team",
//   },
//   {
//     department: "Singles Ministry",
//   },
//   {
//     department: "District",
//   },
//   {
//     department: "Weddings",
//   },
//   {
//     department: "Unveil",
//   },
//   {
//     department: "Pastoral Care",
//   },
//   {
//     department: "Praise (Couple) Community",
//   },
//   {
//     department: "Programming and environment - stirhouse",
//   },
//   {
//     department: "Communications (DMU)",
//   },
//   {
//     department: "New Convert",
//   },
//   {
//     department: "Administration - Kidszone",
//   },

//   {
//     department: "Greeters 1st team",
//   },
//   {
//     department: "Harvesters Intelligence Unit",
//   },
//   {
//     department: "Bethel Community",
//   },
//   {
//     department: "Lightbearers Community",
//   },
//   {
//     department: "Ushering - Queen",
//   },
//   {
//     department: "Bethel Community",
//   },
//   {
//     department: "Prayer and Bible Study",
//   },
//   {
//     department: "Program Management",
//   },
//   {
//     department: "Media-Audio Production",
//   },
//   {
//     department: "Unveil",
//   },
//   {
//     department: "Info Hub",
//   },
//   {
//     department: "Media-Visuals",
//   },
//   {
//     department: "Greeters 4th team",
//   },
//   {
//     department: "Courses HSDC",
//   },
//   {
//     department: "Media Light",
//   },
//   {
//     department: "Harvesters Intelligence Unit",
//   },
//   {
//     department: "Administration - Kidszone",
//   },
//   {
//     department: "Learning and Development - Kidszone",
//   },
//   {
//     department: "Leadership Effectiveness",
//   },
//   {
//     department: "Interactors",
//   },
//   {
//     department: "Communities",
//   },
//   {
//     department: "Finance",
//   },
//   {
//     department: "Venue Management",
//   },
//   {
//     department: "Leadership Training",
//   },
//   {
//     department: "Communications (DMU)",
//   },
//   {
//     department: "Media-Video",
//   },
//   {
//     department: "Career and Finance",
//   },
//   {
//     department: "Reach and Partnership - Kidszone",
//   },
//   {
//     department: "Harmony Community",
//   },
//   {
//     department: "Trailblazer",
//   },
//   {
//     department: "Learning and Development - Kidszone",
//   },
//   {
//     department: "Ushering - Queen",
//   },
//   {
//     department: "Greeters 2nd team",
//   },
//   {
//     department: "Programs Admin Team",
//   },
//   {
//     department: "Publicity",
//   },
//   {
//     department: "Weddings",
//   },
//   {
//     department: "Administration - Kidszone",
//   },
//   {
//     department: "Workforce Admin",
//   },
//   {
//     department: "Call Center",
//   },
//   {
//     department: "Sound",
//   },
//   {
//     department: "Greeters 1st team",
//   },
//   {
//     department: "Workforce Admin",
//   },
//   {
//     department: "Programs management",
//   },
//   {
//     department: "Programs Admin Team",
//   },
//   {
//     department: "Stirhouse",
//   },
//   {
//     department: "Sound",
//   },
//   {
//     department: "Media-Livestream",
//   },
//   {
//     department: "Musicians",
//   },
//   {
//     department: "Media-Text & Timing",
//   },
//   {
//     department: "Bethel Community",
//   },
//   {
//     department: "General Service",
//   },
//   {
//     department: "Trailblazer Community",
//   },
//   {
//     department: "Bethel Community",
//   },
//   {
//     department: "Ushering - Bimpe",
//   },
//   {
//     department: "Ushering - Kofoworola",
//   },
//   {
//     department: "Media-Text & Timing",
//   },
//   {
//     department: "Media-Video",
//   },
//   {
//     department: "Administration - Kidszone",
//   },
//   {
//     department: "Learning and Development - Kidszone",
//   },
//   {
//     department: "HSAP",
//   },
//   {
//     department: "Weddings",
//   },
//   {
//     department: "Ushering - Kofoworola",
//   },
//   {
//     department: "Kids Support",
//   },
//   {
//     department: "Weddings",
//   },
//   {
//     department: "Sunrise",
//   },
//   {
//     department: "Communication",
//   },
//   {
//     department: "Ushering - Bimpe",
//   },
//   {
//     department: "Call Center",
//   },
//   {
//     department: "Next Gen",
//   },
//   {
//     department: "Kidszone",
//   },
//   {
//     department: "Communications (DMU)",
//   },
//   {
//     department: "Media-Visuals",
//   },
//   {
//     department: "Prayer and Bible Study",
//   },
//   {
//     department: "Shomolu 2 Community",
//   },
//   {
//     department: "Traffic",
//   },
//   {
//     department: "Leadership Training",
//   },
//   {
//     department: "Media-Graphics",
//   },
//   {
//     department: "Media-Video",
//   },
//   {
//     department: "Celebrations and venue management",
//   },
//   {
//     department: "HSDC",
//   },

//   {
//     department: "Unveil",
//   },
//   {
//     department: "Next Gen",
//   },
//   {
//     department: "Publicity",
//   },
//   {
//     department: "Programs Admin Team",
//   },
//   {
//     department: "Pastoral Care",
//   },
//   {
//     department: "Leadership Recruitment",
//   },
//   {
//     department: "Medical Ministry",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Invite & Invest",
//   },
//   {
//     department: "Reach and Partnership - Stirhouse",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Learning and Development - Kidszone",
//   },
//   {
//     department: "Greeters 2nd team",
//   },
//   {
//     department: "Greeters 4th team",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Quality Assurance",
//   },
//   {
//     department: "Media-Text & Timing",
//   },
//   {
//     department: "Pearl ET",
//   },
//   {
//     department: "Traffic",
//   },
//   {
//     department: "Media-Administration",
//   },
//   {
//     department: "Administration - Kidszone",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Choir",
//   },
//   {
//     department: "Sunsrise",
//   },
//   {
//     department: "Medicals",
//   },

//   {
//     department: "Ushering ",
//   },
//   {
//     department: "Trailblazer Community",
//   },
//   {
//     department: "Gbagada Estate Community",
//   },
//   {
//     department: "Trailblazer Community",
//   },

//   {
//     department: "Administration - Kidszone",
//   },
//   {
//     department: "Harvesters Intelligence Unit",
//   },
//   {
//     department: "Maturity",
//   },
//   {
//     department: "Publicity",
//   },
//   {
//     department: "Greeters",
//   },
//   {
//     department: "Media-Video",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Harvesters Intelligence Unit",
//   },
//   {
//     department: "Courses HSDC",
//   },
//   {
//     department: "Ushering - Queen",
//   },
//   {
//     department: "Invest and Invite",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Prayer and Bible Study",
//   },
//   {
//     department: "Greeters 4th team",
//   },
//   {
//     department: "Media-Light",
//   },
//   {
//     department: "Career and Finance",
//   },
//   {
//     department: "Prison Ministry",
//   },
//   {
//     department: "Traffic",
//   },
//   {
//     department: "Ceremonies",
//   },
//   {
//     department: "Zonal ",
//   },
//   {
//     department: "Prayer and Bible Study",
//   },
//   {
//     department: "Administration - Stirhouse",
//   },
//   {
//     department: "Programming and Environment - Kidszone",
//   },
//   {
//     department: "Learning and Development - Kidszone",
//   },
//   {
//     department: "Light bearer community",
//   },
//   {
//     department: "Bethel Community",
//   },

//   {
//     department: "Target Missions",
//   },
//   {
//     department: "Workforce Admin",
//   },
//   {
//     department: "Quality Assurance",
//   },
//   {
//     department: "Harvesters Intelligence Unit",
//   },
//   {
//     department: "Call Center",
//   },
//   {
//     department: "Interactors",
//   },
//   {
//     department: "Courses HSDC",
//   },
//   {
//     department: "Unveil",
//   },
//   {
//     department: "Programming and Environment - Stirhouse",
//   },
//   {
//     department: "Media-Video",
//   },
//   {
//     department: "Medical Ministry",
//   },
//   {
//     department: "Call Center",
//   },
//   {
//     department: "Ministry team leadership",
//   },
//   {
//     department: "Greeters 1st team",
//   },
//   {
//     department: "Group Partnership",
//   },
//   {
//     department: "Interactors",
//   },
//   {
//     department: "Communications (DMU)",
//   },
//   {
//     department: "Medical Ministry",
//   },
//   {
//     department: "Media-Visuals",
//   },
//   {
//     department: "Info Hub",
//   },
//   {
//     department: "Musicians",
//   },
//   {
//     department: "Communications (DMU)",
//   },
//   {
//     department: "Traffic",
//   },

//   {
//     department: "Leadership Recruitment",
//   },
//   {
//     department: "Media-Video",
//   },
//   {
//     department: "Exalted Tribe",
//   },
//   {
//     department: "Praise community",
//   },
//   {
//     department: "Bethel Community",
//   },
//   {
//     department: "Bethel Community",
//   },
//   {
//     department: "Ceremonies",
//   },
//   {
//     department: "Media-Photo (Capturing)",
//   },
//   {
//     department: "Ceremonies",
//   },
//   {
//     department: "Leadership Recruitment",
//   },
//   {
//     department: "Leadership Recruitment",
//   },
//   {
//     department: "Communications (DMU)",
//   },
//   {
//     department: "Ushering - Bimpe",
//   },
//   {
//     department: "Learning and Development - Stirhouse",
//   },
//   {
//     department: "Greeters 4th team",
//   },
//   {
//     department: "Admin and Facility",
//   },
//   {
//     department: "Ceremonies",
//   },
//   {
//     department: "Reach and Partnership - Kidszone",
//   },
//   {
//     department: "Greeters 1st team",
//   },
//   {
//     department: "Ushering - Queen",
//   },
//   {
//     department: "Programming and Environment - Kidszone",
//   },
//   {
//     department: "Ushering - Queen",
//   },
//   {
//     department: "Prison Ministry",
//   },
//   {
//     department: "Greeters 1st team",
//   },
//   {
//     department: "Leadership Recruitment",
//   },
//   {
//     department: "Publicity",
//   },
//   {
//     department: "Pearl ET",
//   },
//   {
//     department: "Weddings",
//   },
//   {
//     department: "Hiu",
//   },
//   {
//     department: "Media-Light",
//   },
//   {
//     department: "Workforce Admin",
//   },
//   {
//     department: "Leadership Recruitment",
//   },
//   {
//     department: "Ushering - Queen",
//   },
//   {
//     department: "Pastoral Care",
//   },
//   {
//     department: "Harvesters Intelligence Unit",
//   },
//   {
//     department: "Harmony Community",
//   },
//   {
//     department: "Unveil",
//   },
//   {
//     department: "Guest Welcome",
//   },
//   {
//     department: "Bethel Community",
//   },
//   {
//     department: "Gbagada Estate Community",
//   },
//   {
//     department: "Prayer and Bible Study",
//   },
//   {
//     department: "Media-Visuals",
//   },
//   {
//     department: "Prison Ministry",
//   },
//   {
//     department: "Harvesters Intelligence Unit",
//   },
//   {
//     department: "Media-Equipment Management",
//   },
//   {
//     department: "Ushering - Tosin",
//   },
//   {
//     department: "Traffic",
//   },
//   {
//     department: "Leadership Training",
//   },
//   {
//     department: "God's encounter",
//   },
//   {
//     department: "HSAP",
//   },
//   {
//     department: "Data Management",
//   },
//   {
//     department: "Reach and Partnership - Stirhouse",
//   },
//   {
//     department: "Medical Ministry",
//   },
//   {
//     department: "Admin and Facility",
//   },
//   {
//     department: "Greeters 4th team",
//   },
//   {
//     department: "Media-Video",
//   },
//   {
//     department: "Missions",
//   },
//   {
//     department: "Growth Track",
//   },
//   {
//     department: "Publicity",
//   },
//   {
//     department: "Trailblazer Community",
//   },
//   {
//     department: "Career and Finance",
//   },
//   {
//     department: "Kidzone",
//   },
//   {
//     department: "Membership",
//   },
//   {
//     department: "Alapere community",
//   },
//   {
//     department: "HSAP",
//   },
//   {
//     department: "Learning and Development - Kidszone",
//   },
//   {
//     department: "Women of Wisdom",
//   },
//   {
//     department: "Trailblazer Community",
//   },
//   {
//     department: "Programs Admin Team",
//   },
//   {
//     department: "House of Dorcas",
//   },
//   {
//     department: "Media-Graphics",
//   },
//   {
//     department: "District",
//   },
//   {
//     department: "Singles",
//   },
//   {
//     department: "Attraction",
//   },
//   {
//     department: "Men of Harvest",
//   },
//   {
//     department: "Learning and Development - Kidszone",
//   },
//   {
//     department: "Choir",
//   },
//   {
//     department: "Info Hub",
//   },
//   {
//     department: "Leadership effectiveness",
//   },
//   {
//     department: "Medical",
//   },
//   {
//     department: "Leadership& development",
//   },
//   {
//     department: "Data Management",
//   },
//   {
//     department: "Exalted tribe",
//   },
//   {
//     department: "Choir",
//   },
//   {
//     department: "Ministry",
//   },
//   {
//     department: "Facility & Admin",
//   },
//   {
//     department: "Exalted tribe",
//   },
//   {
//     department: "Media",
//   },
//   {
//     department: "Exalted tribe",
//   },
//   {
//     department: "Finance",
//   },
//   {
//     department: "Exalted tribe",
//   },
//   {
//     department: "Communications",
//   },
//   {
//     department: "Sound engineeer",
//   },
//   {
//     department: "Prayer and Bible Study",
//   },
//   {
//     department: "Stir House",
//   },
//   {
//     department: "Programmes",
//   },
//   {
//     department: "Finance",
//   },
//   {
//     department: "Small Group",
//   },
//   {
//     department: "Spiritual Progress & Development",
//   },
//   {
//     department: "Royal priesthood",
//   },
//   {
//     department: "Evangelism",
//   },
//   {
//     department: "Stir house",
//   },
//   {
//     department: "Facility",
//   },
//   {
//     department: "Leadership Effectiveness",
//   },
//   {
//     department: "Media-Text & Timing",
//   },
//   {
//     department: "Venue manangement",
//   },
//   {
//     department: "Ushering - Tosin",
//   },
//   {
//     department: "New converts",
//   },
//   {
//     department: "Benevolence",
//   },
//   {
//     department: "Celebration",
//   },
//   {
//     department: "Media experience",
//   },
//   {
//     department: "Recruitment and Assimilation",
//   },
//   {
//     department: "Media experience",
//   },
//   {
//     department: "Programs management",
//   },
//   {
//     department: "Learning and Development - Kidszone",
//   },
//   {
//     department: "Protocol",
//   },
//   {
//     department: "Information hub",
//   },
//   {
//     department: "Chiors",
//   },
//   {
//     department: "Exalted tribe",
//   },
//   {
//     department: "Exalted tribe",
//   },
//   {
//     department: "Discipleship",
//   },
//   {
//     department: "Recruitment and development",
//   },
//   {
//     department: "Career",
//   },
//   {
//     department: "Media",
//   },
//   {
//     department: "Finance",
//   },
//   {
//     department: "Protocol",
//   },
//   {
//     department: "Drama",
//   },
//   {
//     department: "Ushering",
//   },
//   {
//     department: "Sound ",
//   },
//   {
//     department: "Media - video unit",
//   },
//   {
//     department: "Media- text and timing",
//   },
//   {
//     department: "Prayer",
//   },
//   {
//     department: "Gbagada cell",
//   },
//   {
//     department: "Bariga ",
//   },
//   {
//     department: "Gbagada",
//   },
//   {
//     department: "Shomulu district shepherd",
//   },
//   {
//     department: "Singles",
//   },
//   {
//     department: "House of dorcas",
//   },
//   {
//     department: "Media",
//   },
//   {
//     department: "Harvesters Intelligence Unit",
//   },
//   {
//     department: "Quality assurance",
//   },
//   {
//     department: "Learning and Development - Kidszone",
//   },
//   {
//     department: "Exalted tribe",
//   },
//   {
//     department: "Royal priesthood community",
//   },
//   {
//     department: "Praise community",
//   },
//   {
//     department: "Ogudu ",
//   },
//   {
//     department: "Ogudu harvesters",
//   },
//   {
//     department: "Online cell",
//   },
//   {
//     department: "Sunrise Community",
//   },
//   {
//     department: "Bethel Community",
//   },
//   {
//     department: "Next gen",
//   },
//   {
//     department: "Singles",
//   },
//   {
//     department: "Wow",
//   },
//   {
//     department: "Weddings ",
//   },
// ];

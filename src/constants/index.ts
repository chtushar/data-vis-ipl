export const colors = ["#D8F3DC", "#74C69D", "#40916C", "#1B4332"];

// export const playerTypes = [
//     'ALL-ROUNDER',
//     'BATTER',
//     'BOWLER',
//     'WICKETKEEPER',
// ]

export enum SectionLabels {
  Lineup = "lineup",
  Unsold = "unsold",
  Type = "type",
  Role = "role",
  Teams = "teams",
}

export const playerTypes = ["all-rounder", "bowler", "batter", "wk/batter"];

export const playerTypesLabel = {
  "all-rounder": "All-Rounder",
  bowler: "Bowler",
  batter: "Batter",
  "wk/batter": "Wicketkeeper",
};

export enum Teams {
  KKR = "Kolkata Knight Riders",
  SRH = "Sunrisers Hyderabad",
  GT = "Gujarat Titans",
  LSG = "Lucknow Super Giants",
  MI = "Mumbai Indians",
  RCB = "Royal Challengers Bangalore",
  RR = "Rajasthan Royals",
  CSK = "Chennai Super Kings",
  PBKS = "Punjab Kings",
  DC = "Delhi Capitals",
}

export enum Nationality {
  Indian = "Indian",
  Overseas = "Overseas",
}

export const teamIdMapping = {
  CSK: Teams.CSK,
  DC: Teams.DC,
  GT: Teams.GT,
  KKR: Teams.KKR,
  LSG: Teams.LSG,
  MI: Teams.MI,
  PBKS: Teams.PBKS,
  RCB: Teams.RCB,
  RR: Teams.RR,
  SRH: Teams.SRH,
};

export const teamMapping = {
  [Teams.KKR]: "KKR",
  [Teams.SRH]: "SRH",
  [Teams.GT]: "GT",
  [Teams.LSG]: "LSG",
  [Teams.MI]: "MI",
  [Teams.RCB]: "RCB",
  [Teams.RR]: "RR",
  [Teams.CSK]: "CSK",
  [Teams.PBKS]: "PBKS",
  [Teams.DC]: "DC",
};

export const teamColors = {
  CSK: "#F0BC00",
  DC: "#F22C1C",
  GT: "#112543",
  KKR: "#241046",
  LSG: "#2676CD",
  MI: "#093AA1",
  PBKS: "#D21D2B",
  RCB: "#A30000",
  RR: "#074A9A",
  SRH: "#D95A08",
};

export const nationalityColors = {
  Indian: "#000080",
  Overseas: "#F0BC00",
};

export const roleColors = {
  batter: "#94d2bd",
  bowler: "#ee9b00",
  "all-rounder": "#ca6702",
  "wk/batter": "#0a9396",
};

export const sankyLinkColors = {
  ...teamColors,
  ...nationalityColors,
  ...roleColors,
};

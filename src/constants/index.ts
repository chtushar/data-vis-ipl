export const colors = ['#D8F3DC', '#74C69D', '#40916C', '#1B4332']

// export const playerTypes = [
//     'ALL-ROUNDER',
//     'BATTER',
//     'BOWLER',
//     'WICKETKEEPER',
// ]

export enum SectionLabels {
    Lineup = 'lineup',
    Unsold = 'unsold',
    Type = 'type',
    Role = 'role',
}

export const playerTypes = [
    'all-rounder',
    'bowler',
    'batter',
    'wk/batter',
]

export enum Teams {
    KKR = 'Kolkata Knight Riders',
    SRH = 'Sunrisers Hyderabad',
    GT = 'Gujarat Titans',
    LSG = 'Lucknow Super Giants',
    MI = 'Mumbai Indians',
    RCB = 'Royal Challengers Bangalore',
    RR = 'Rajasthan Royals',
    CSK = 'Chennai Super Kings',
    PK = 'Punjab Kings',
    DC = 'Delhi Capitals',
}

export const teamIdMapping = {
    CSK: Teams.CSK,
    DC: Teams.DC,
    GT: Teams.GT,
    KKR: Teams.KKR,
    LSG: Teams.LSG,
    MI: Teams.MI,
    PK: Teams.PK,
    RCB: Teams.RCB,
    RR: Teams.RR,
    SRH: Teams.SRH,
}

export const teamMapping = {
    [Teams.KKR]: 'KKR',
    [Teams.SRH]: 'SRH',
    [Teams.GT]: 'GT',
    [Teams.LSG]: 'LSG',
    [Teams.MI]: 'MI',
    [Teams.RCB]: 'RCB',
    [Teams.RR]: 'RR',
    [Teams.CSK]: 'CSK',
    [Teams.PK]: 'PK',
    [Teams.DC]: 'DC',
}

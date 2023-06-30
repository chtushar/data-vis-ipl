// import { Teams, Nationality, playerTypes } from "../constants";
import { sankeyLinks } from "../constants/sankey";
import type players from "../data.json";

// export const buildTeamToNationalityLinks = () => {
//   return Object.keys(Teams).reduce((acc, current) => {
//     return [
//       ...acc,
//       { source: current, target: Nationality.Indian },
//       { source: current, target: Nationality.Overseas },
//     ];
//   }, []);
// };

// export const buildNationalityToRoleLinks = () => {
//   return playerTypes.reduce((acc, current) => {
//     return [
//       ...acc,
//       { source: Nationality.Indian, target: current },
//       { source: Nationality.Overseas, target: current },
//     ];
//   }, []);
// };

export const generateSankeyLinks = (data: typeof players) => {
  const defaultObj = sankeyLinks.reduce((acc, current) => {
    return {
      ...acc,
      [`${current.source}-${current.target}`]: {
        ...current,
        value: 1,
        players: [],
      },
    };
  }, {});

  return Object.values(data).reduce((acc, current) => {
    const keyTeamToNationality = `${current.TeamCode}-${current.Nationality}`;
    const keyNationalityToRole = `${current.Nationality}-${current.role}`;

    return {
      ...acc,
      [keyTeamToNationality]: {
        ...defaultObj[keyTeamToNationality],
        value: (acc[keyTeamToNationality]?.value ?? 0) + 1,
        players: [...(acc[keyTeamToNationality]?.players ?? []), current.id],
      },
      [keyNationalityToRole]: {
        ...defaultObj[keyNationalityToRole],
        value: (acc[keyNationalityToRole]?.value ?? 0) + 1,
        players: [...(acc[keyNationalityToRole]?.players ?? []), current.id],
      },
    };
  }, {});
};

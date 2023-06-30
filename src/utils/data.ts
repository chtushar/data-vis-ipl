const isExtra = (outcome: number | string) => {
  return outcome.toString().endsWith("b") || outcome.toString().endsWith("wd");
};

const countBall = (extras) => {
  if (typeof extras === "undefined") {
    return 0;
  }

  if (extras.hasOwnProperty("noballs") || extras.hasOwnProperty("wides")) {
    return -1;
  }

  return 0;
};

export const getBallWiseRunScored = (
  data: Array<{
    match_number: number;
    batter: string;
    score: number;
    outcome: number | string;
    runs?: { batter: number };
    extras?: {
      byes?: number;
      noballs?: number;
      legbyes?: number;
      wides?: number;
    };
  }>
) => {
  return data.reduce((acc, current, index) => {
    let newAcc = [...acc];
    const currentBatterScore = acc?.[index - 1]?.[current.batter]?.runs ?? 0;
    const currentBatterBalls = acc?.[index - 1]?.[current.batter]?.balls ?? 0;
    const ballFactor = countBall(current.extras);

    newAcc[index] = {
      ...acc?.[index - 1],
      [current.batter]: {
        runs: currentBatterScore + (current?.runs.batter ?? 0),
        balls: currentBatterBalls + 1 + ballFactor,
      },
    };

    return newAcc;
  }, []);
};

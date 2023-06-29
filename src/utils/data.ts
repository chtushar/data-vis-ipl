const isExtra = (outcome: number | string) => {
  return outcome.toString().endsWith("b") || outcome.toString().endsWith("wd");
};

export const getBallWiseRunScored = (
  data: Array<{
    batter: string;
    score: number;
    outcome: number | string;
    runs?: { batter: number };
  }>
) => {
  return data.reduce((acc, current, index) => {
    let newAcc = [...acc];
    const currentBatterScore = acc?.[index - 1]?.[current.batter]?.runs ?? 0;
    const currentBatterBalls = acc?.[index - 1]?.[current.batter]?.balls ?? 0;
    newAcc[index] = {
      ...acc?.[index - 1],
      [current.batter]: {
        runs: currentBatterScore + (current?.runs.batter ?? 0),
        balls: currentBatterBalls + 1,
      },
    };
    return newAcc;
  }, []);
};

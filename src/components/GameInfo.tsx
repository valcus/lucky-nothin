interface Props {
  turnScore: {
    value: number;
    pos: number;
    neg: number;
    direct: boolean;
  };
  totalScore: number;
  roundCount: number;
  rollsRemaining: number;
}

const GameInfo = ({
  turnScore,
  totalScore,
  roundCount,
  rollsRemaining,
}: Props) => {
  return (
    <div className="d-flex justify-content-evenly flex-wrap m-2">
      {turnScore.direct ? (
        <div className="m-2">{"turn score: " + turnScore.value}</div>
      ) : (
        <div className="m-2">
          {"turn score: " +
            turnScore.value +
            " (" +
            turnScore.pos +
            "-" +
            Math.abs(turnScore.neg) +
            ")"}
        </div>
      )}
      <div className="m-2">{"total score: " + totalScore}</div>
      <div className="m-2">{"round: " + roundCount}</div>
      <div className="m-2">{"rolls remaining: " + rollsRemaining}</div>
    </div>
  );
};

export default GameInfo;

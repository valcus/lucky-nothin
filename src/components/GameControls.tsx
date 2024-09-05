import Button from "./Button";

interface Props {
  gamePhase: string;
  rollEnabled: boolean;
  endTurnEnabled: boolean;
  totalScore: number;
  onRollDice: () => void;
  onEndTurn: () => void;
  onNewGame: () => void;
}

const GameControls = ({
  gamePhase,
  rollEnabled,
  endTurnEnabled,
  totalScore,
  onRollDice,
  onEndTurn,
  onNewGame,
}: Props) => {
  switch (gamePhase) {
    case "new":
      return (
        <div className="d-flex justify-content-center my-2">
          <Button onClick={onNewGame}>New Game</Button>
        </div>
      );
      break;
    case "rolling":
      return (
        <div className="d-flex justify-content-center my-2">
          <Button onClick={onRollDice} enabled={rollEnabled}>
            Roll!
          </Button>
          <Button
            onClick={onEndTurn}
            color="secondary"
            enabled={endTurnEnabled}
          >
            End Turn
          </Button>
        </div>
      );
      break;
    case "break":
      return (
        <div className="d-flex justify-content-center my-2">
          <Button onClick={onRollDice}>Start Round</Button>
        </div>
      );
      break;
    case "end":
      return (
        <>
          <div className="d-flex justify-content-center">
            Your final score was {totalScore}!
          </div>
          <div className="d-flex justify-content-center">
            <Button onClick={onNewGame}>Play Again</Button>
          </div>
        </>
      );
    default:
      return <></>;
      break;
  }
};

export default GameControls;

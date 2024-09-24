import { GamePhase } from "../logic/Engine";
import Button from "./Button";

interface Props {
  gamePhase: GamePhase;
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
    case GamePhase.New:
      return (
        <div className="d-flex justify-content-center my-2">
          <Button onClick={onNewGame}>New Game</Button>
        </div>
      );
    case GamePhase.Rolling:
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
    case GamePhase.Break:
      return (
        <div className="d-flex justify-content-center my-2">
          <Button onClick={onRollDice}>Start Round</Button>
        </div>
      );
    case GamePhase.End:
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
  }
};

export default GameControls;

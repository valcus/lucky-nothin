import { useReducer } from "react";
import Button from "./Button";
import Die from "./Die";
import GameInfo from "./GameInfo";
import GameControls from "./GameControls";
import { GamePhase, initialState, reducer } from "../logic/Engine";

function GameBoard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <GameInfo
        turnScore={state.turnScore}
        totalScore={state.totalScore}
        roundCount={state.roundCount}
        rollsRemaining={state.rollsRemaining}
      />

      {state.gamePhase === GamePhase.Rolling && (
        <div className="d-flex justify-content-evenly flex-wrap m-2">
          {state.diceValues.map(
            (val: number, index: number, array: number[]) => {
              return (
                <Die
                  key={index}
                  value={val}
                  locked={state.lockedValue === val}
                ></Die>
              );
            }
          )}
        </div>
      )}

      <GameControls
        gamePhase={state.gamePhase}
        rollEnabled={
          state.roundCount <= 10 &&
          state.rollsRemaining > 0 &&
          state.lockedValue > 0
        }
        endTurnEnabled={
          state.roundCount <= 10 &&
          state.roundCount > 0 &&
          state.rollsRemaining === 0 &&
          !(state.spreadState && !state.spreadDecided)
        }
        totalScore={state.totalScore}
        onNewGame={() => dispatch({ type: "newGame" })}
        onRollDice={() => dispatch({ type: "rollDice" })}
        onEndTurn={() => dispatch({ type: "endTurn" })}
      />

      <div className="d-flex justify-content-center flex-wrap m-2">
        {state.spreadState ? (
          <>
            <Button
              onClick={() => {
                dispatch({ type: "spreadSelect", selected: 21 });
              }}
              enabled={state.turnScore.value !== 21}
            >
              +21
            </Button>
            <Button
              onClick={() => {
                dispatch({ type: "spreadSelect", selected: -21 });
              }}
              enabled={state.turnScore.value !== -21}
            >
              -21
            </Button>
          </>
        ) : (
          state.lockableValues.map(
            (value: number, index: number, array: number[]) => {
              return (
                <Button
                  key={"btn-" + index}
                  onClick={() => {
                    dispatch({ type: "lockValue", value: value });
                  }}
                  enabled={value !== state.lockedValue}
                >
                  lock {value}
                </Button>
              );
            }
          )
        )}
      </div>
    </>
  );
}

export default GameBoard;

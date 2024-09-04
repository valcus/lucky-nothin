import { useState } from "react";
import Button from "./Button";
import Die from "./Die";
import GameInfo from "./GameInfo";
import GameControls from "./GameControls";

//game phases: "new", "rolling", "break", "end"
function GameBoard() {
  const [state, setState] = useState({
    gamePhase: "new",
    gameStarted: false,
    roundCount: 0,
    rollsRemaining: 3,
    turnScore: {
      value: 0,
      pos: 0,
      neg: 0,
      direct: true,
    },
    totalScore: 0,
    diceValues: Array(6).fill(888),
    lockedValue: 0,
    lockableValues: Array(),
    spreadState: false,
    spreadDecided: true,
  });

  const onNewGame = () => {
    console.log("new game");
    let newState = structuredClone(state);
    console.log("old state: " + JSON.stringify(state, null, 2));
    newState.gamePhase = "break";
    newState.gameStarted = true;
    newState.roundCount = 1;
    newState.rollsRemaining = 3;
    newState.turnScore = { value: 0, pos: 0, neg: 0, direct: true };
    newState.totalScore = 0;
    newState.diceValues = Array(6).fill(888);
    newState.lockedValue = 0;
    newState.lockableValues = [];
    console.log("new state: " + JSON.stringify(newState));
    setState(newState);
  };

  const onRollDice = () => {
    console.log("rolling");
    let newState = structuredClone(state);
    console.log("old state: " + JSON.stringify(state, null, 2));
    newState.gamePhase = "rolling";
    newState.diceValues = rollDice(state.diceValues, state.lockedValue);
    newState.rollsRemaining = state.rollsRemaining - 1;
    const valCount = countValues(newState.diceValues);
    if (valCount == 6) {
      newState.rollsRemaining = 0;
      newState.turnScore = { value: 0, pos: 0, neg: 0, direct: true };
      newState.lockableValues = [];
      newState.lockedValue = 0;
      newState.spreadState = true;
      newState.spreadDecided = false;
    } else if (valCount == 1) {
      newState.rollsRemaining = 0;
      newState.turnScore = {
        value: -state.totalScore,
        pos: 0,
        neg: 0,
        direct: true,
      };
      newState.lockableValues = [];
      newState.lockedValue = 0;
    } else {
      newState.lockableValues = calcLockableVals(newState.diceValues);
      if (newState.lockableValues.length === 1) {
        newState.lockedValue = newState.lockableValues[0];
        newState.turnScore = calcTurnScore(
          newState.diceValues,
          newState.lockedValue
        );
      } else if (state.lockedValue > 0) {
        newState.turnScore = calcTurnScore(
          newState.diceValues,
          state.lockedValue
        );
      } else {
        newState.lockedValue = 0;
        newState.turnScore = { value: 0, pos: 0, neg: 0, direct: true };
      }
    }
    console.log("new state: " + JSON.stringify(newState));
    setState(newState);
  };

  const onEndTurn = () => {
    console.log("end turn");
    let newState = structuredClone(state);
    console.log("old state: " + JSON.stringify(state));
    if (state.roundCount >= 10) {
      newState.gamePhase = "end";
    } else {
      newState.gamePhase = "break";
    }
    newState.totalScore = state.totalScore + state.turnScore.value;
    newState.turnScore = {
      value: 0,
      pos: 0,
      neg: 0,
      direct: true,
    };
    newState.roundCount = state.roundCount + 1;
    newState.lockableValues = [];
    newState.rollsRemaining = 3;
    newState.diceValues = Array(6).fill(888);
    newState.turnScore = { value: 0, pos: 0, neg: 0, direct: true };
    newState.lockedValue = 0;
    newState.gameStarted = false;
    newState.spreadState = false;
    console.log("new state: " + JSON.stringify(newState));
    setState(newState);
  };

  return (
    <>
      <GameInfo
        turnScore={state.turnScore}
        totalScore={state.totalScore}
        roundCount={state.roundCount}
        rollsRemaining={state.rollsRemaining}
      />

      {state.gamePhase === "rolling" && (
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
        onNewGame={onNewGame}
        onRollDice={onRollDice}
        onEndTurn={onEndTurn}
      />

      <div className="d-flex justify-content-center flex-wrap m-2">
        {state.spreadState ? (
          <>
            <Button
              onClick={() => {
                let newState = structuredClone(state);
                newState.turnScore = {
                  value: 21,
                  pos: 0,
                  neg: 0,
                  direct: true,
                };
                newState.spreadDecided = true;
                setState(newState);
              }}
              enabled={state.turnScore.value !== 21}
            >
              +21
            </Button>
            <Button
              onClick={() => {
                let newState = structuredClone(state);
                newState.turnScore = {
                  value: -21,
                  pos: 0,
                  neg: 0,
                  direct: true,
                };
                newState.spreadDecided = true;
                setState(newState);
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
                    let newState = structuredClone(state);
                    newState.lockedValue = value;
                    newState.turnScore = calcTurnScore(state.diceValues, value);
                    setState(newState);
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

function rollDice(diceVals: number[], lockedVal: number) {
  return diceVals.map((val: number, index: number, array: number[]) => {
    const manipMatch = false;
    const manipDiff = false;
    if (lockedVal === val) {
      return val;
    } else {
      if (manipMatch && Math.floor(Math.random() * 2) === 1 && lockedVal > 0) {
        return lockedVal;
      } else if (manipDiff) {
        return index + 1;
      } else {
        return Math.floor(Math.random() * 6) + 1;
      }
    }
  });
}

function calcLockableVals(diceVals: number[]) {
  let valCount = Array(7).fill(0);

  diceVals.forEach((value: number, index: number, array: number[]) => {
    valCount[value] += 1;
  });

  let lockableVals = [0];
  valCount.forEach((value: number, index: number, array: number[]) => {
    if (value > valCount[lockableVals[0]]) {
      lockableVals = [index];
    } else if (value == valCount[lockableVals[0]]) {
      lockableVals.push(index);
    }
  });

  return lockableVals;
}

function calcTurnScore(diceVals: number[], lockedVal: number) {
  const scores = diceVals.map(
    (value: number, index: number, array: number[]) => {
      if (value == lockedVal) {
        return value;
      } else {
        return 0 - value;
      }
    }
  );
  console.log(scores);

  let pSum = 0;
  let nSum = 0;
  scores.forEach((value: number, index: number, array: number[]) => {
    if (value > 0) {
      pSum += value;
    }
    if (value < 0) {
      nSum += value;
    }
  });
  const sum = nSum + pSum;

  console.log("+" + pSum + " " + nSum + " = " + sum);
  return { value: sum, pos: pSum, neg: nSum, direct: false };
}

function countValues(diceVals: number[]) {
  let seen = Array();
  diceVals.forEach((value: number, index: number, array: number[]) => {
    if (!seen.includes(value)) {
      seen.push(value);
    }
  });

  console.log("seen: " + seen);
  return seen.length;
}

export default GameBoard;

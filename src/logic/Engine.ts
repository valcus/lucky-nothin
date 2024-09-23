export enum GamePhase {
  New = "new",
  Rolling = "rolling",
  Break = "break",
  End = "end",
}

export type State = {
  gamePhase: GamePhase;
  gameStarted: boolean;
  roundCount: number;
  rollsRemaining: number;
  turnScore: TurnScore;
  totalScore: number;
  diceValues: number[];
  lockedValue: number;
  lockableValues: number[];
  spreadState: boolean;
  spreadDecided: boolean;
};

type TurnScore = {
    value: number;
    pos: number;
    neg: number;
    direct: boolean;
}

export type Action = 
  { type: "newGame" } |
  { type: "rollDice" } |
  { type: "endTurn" } |
  { type: "spreadSelect", selected: number } |
  { type: "lockValue", value: number };

export const initialState: State = {
  gamePhase: GamePhase.New,
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
};

export function reducer(state: State, action: Action): State {
  let newState: State = { ...state };
  switch (action.type) {
    case "newGame":
      newState = actionNewGame(state)
      break;
    case "rollDice":
      newState = actionRollDice(state)
      break;
    case "endTurn":
      newState = actionEndTurn(state)
      break;
    case "spreadSelect": 
      newState = actionSpreadSelect(state, action.selected)
      break;
    case "lockValue":
      newState = actionLockValue(state, action.value)
      break;
  }
  console.log(JSON.stringify({action: action, diff: objDiff(state, newState)}, null, 2))
  return newState;
}

function actionNewGame(state: State): State {
  return {
    ...state,
    gamePhase: GamePhase.Break,
    gameStarted: true,
    roundCount: 1,
    rollsRemaining: 3,
    turnScore: { value: 0, pos: 0, neg: 0, direct: true },
    totalScore: 0,
    diceValues: Array(6).fill(888),
    lockedValue: 0,
    lockableValues: Array(),
    spreadState: false,
    spreadDecided: true,
  };
}

function actionRollDice(state: State): State {
  let newState: State = { ...state };
  let newDiceValues = rollDice(state.diceValues, state.lockedValue);
  const valCount = countValues(newDiceValues);

  newState.gamePhase = GamePhase.Rolling;
  newState.diceValues = newDiceValues;
  newState.rollsRemaining = state.rollsRemaining - 1;

  if (valCount === 6 || valCount === 1) {
    newState.rollsRemaining = 0;
    newState.lockableValues = [];
    newState.lockedValue = 0;
    if (valCount === 6) {
      newState.turnScore = { value: 0, pos: 0, neg: 0, direct: true };
      newState.spreadState = true;
      newState.spreadDecided = false;
    } else {
      newState.turnScore = {
        value: -state.totalScore,
        pos: 0,
        neg: 0,
        direct: true,
      };
    }
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
  return newState
}

function actionEndTurn(state: State): State {
  let nextPhase = GamePhase.Break
  if (state.roundCount >= 10) {
    nextPhase = GamePhase.End;
  }

  return {
    ...state,
    gamePhase: nextPhase,
    totalScore: state.totalScore + state.turnScore.value,
    turnScore: {value: 0, pos: 0, neg: 0, direct: true},
    roundCount: state.roundCount + 1,
    lockableValues: [],
    rollsRemaining: 3,
    diceValues: Array(6).fill(888),
    lockedValue: 0,
    gameStarted: false,
    spreadState: false,
  }
}

function actionSpreadSelect(state: State, selected: number): State {
  return {
    ...state,
    turnScore: {
        value: selected,
        pos: 0,
        neg: 0,
        direct: true,
    },
    spreadDecided: true,
  }
}

function actionLockValue(state: State, value: number): State {
  return {
    ...state,
    lockedValue: value,
    turnScore: calcTurnScore(state.diceValues, value),
  }
}

function rollDice(diceVals: number[], lockedVal: number): number[] {
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

function calcLockableVals(diceVals: number[]): number[] {
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

function calcTurnScore(diceVals: number[], lockedVal: number): TurnScore {
  const scores = diceVals.map(
    (value: number, index: number, array: number[]) => {
      if (value == lockedVal) {
        return value;
      } else {
        return 0 - value;
      }
    }
  );
//   console.log(scores);

  let pSum = 0;
  let nSum = 0;
  scores.forEach((value: number, index: number, array: number[]) => {
    pSum += Math.max(0, value);
    nSum += Math.min(0, value);
  });
  const sum = nSum + pSum;

//   console.log("+" + pSum + " " + nSum + " = " + sum);
  return { value: sum, pos: pSum, neg: nSum, direct: false };
}

function countValues(diceVals: number[]): number {
  let seen = Array();
  diceVals.forEach((value: number, index: number, array: number[]) => {
    if (!seen.includes(value)) {
      seen.push(value);
    }
  });

//   console.log("seen: " + seen);
  return seen.length;
}

function objDiff(oldObj: any, newObj: any) {
    let diffOld: any = {};
    let diffNew: any = {};
    for (const key in oldObj) {
        if (Object.prototype.hasOwnProperty.call(oldObj, key)) {
            if (oldObj[key] !== newObj[key]) {
                diffOld[key] = oldObj[key];
                diffNew[key] = newObj[key];
            }
        }
    }
    return {
        old: diffOld,
        new: diffNew,
    }
}
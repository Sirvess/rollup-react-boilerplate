import * as React from "react";
import styled from "styled-components";

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  border: 0.5px solid blue;
`;

const Cell = styled.div<{ checked: boolean }>`
  display: flex;
  border: 0.5px solid blue;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${({ checked }) => (checked ? `grey` : `transparent`)};
  font-size: 20px;

  &:hover {
    background-color: grey;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px;
  &,
  > * {
    font-size: 20px;
  }
`;

type CellValue = "x" | "o" | null;
type GameArr = CellValue[];

const GAME_SIZE = 9; //3x3 matrix

const getEmptyGame: (gameSize: number) => GameArr = (gameSize) =>
  new Array(gameSize).fill(null);

const checkIndeces: (
  game: GameArr
) => (winningIndexCombo: number[]) => CellValue = (game) => (indeces) =>
  indeces
    .map((i) => game[i])
    .reduce((a, b) => (a !== null && a === b ? a : null));

const getWinner = (a: CellValue, b: CellValue) =>
  a !== null ? a : b !== null ? b : null;

// Assume square board
const getIndeces = (type: "rows" | "columns") => (gameSize: number) => {
  const sideLength = Math.sqrt(gameSize);
  return new Array(sideLength)
    .fill(null)
    .map((_, outerIndex) =>
      new Array(sideLength)
        .fill(null)
        .map((_, innerIndex) =>
          type === "rows"
            ? innerIndex + sideLength * outerIndex
            : innerIndex * sideLength + outerIndex
        )
    );
};

const topLeftDiagIndeces = [0, 4, 8];
const topRightDiagIndeces = [2, 4, 6];
const diagonals = [topLeftDiagIndeces, topRightDiagIndeces];

const winningTests = [
  ...getIndeces("rows")(GAME_SIZE),
  ...getIndeces("columns")(GAME_SIZE),
  ...diagonals,
];

const checkIfWinner = (game: GameArr): CellValue =>
  winningTests.map(checkIndeces(game)).reduce(getWinner);

const isGameOver = (gameState: GameArr, winnerOverride: CellValue) =>
  gameState.filter((x) => x === null).length === 0 || winnerOverride;

export const TicTacToe = () => {
  const [gameState, setGameState] = React.useState<GameArr>(
    getEmptyGame(GAME_SIZE)
  );
  const [winner, setWinner] = React.useState<CellValue>(null);
  const [turn, setTurn] = React.useState<"x" | "o">("x");
  const toggleTurn = () => setTurn(turn === "x" ? "o" : "x");
  const setNewGame = React.useCallback(() => {
    setGameState(getEmptyGame(GAME_SIZE));
    setWinner(null);
    setTurn("x");
  }, [setGameState, setWinner, setTurn]);

  return (
    <>
      <GameGrid>
        {gameState.map((x, i) => (
          <Cell
            key={i}
            onClick={() => {
              if (gameState[i] === null && !winner) {
                const gameNextTurn = gameState.slice();
                gameNextTurn[i] = turn;
                setWinner(checkIfWinner(gameNextTurn));
                setGameState(gameNextTurn);
                toggleTurn();
              } else if (isGameOver(gameState, winner)) {
                setNewGame();
              }
            }}
            checked={gameState[i] !== null ? true : false}
          >
            {x || `-`}
          </Cell>
        ))}
      </GameGrid>
      <Controls>
        <p>
          {winner
            ? `Winner is: ${winner}`
            : isGameOver(gameState, winner)
            ? `NOBODY WINS`
            : `Current turn: ${turn}`}
        </p>
        <br />
        <button
          onClick={() => {
            setNewGame();
          }}
        >
          New game
        </button>
      </Controls>
    </>
  );
};

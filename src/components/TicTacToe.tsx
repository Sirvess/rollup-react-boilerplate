import * as React from "react";
import styled from "styled-components";

const GameGrid = styled.div<{ gameSize: number }>`
  display: grid;
  grid-template: ${({ gameSize }) => `repeat(${Math.sqrt(gameSize)}, 100px)`} / ${({
      gameSize,
    }) => `repeat(${Math.sqrt(gameSize)}, 100px)`};
  border: 0.5px solid blue;
`;

const Cell = styled.div<{ checked: boolean }>`
  display: flex;
  border: 0.5px solid blue;
  justify-content: center;
  align-items: center;
  cursor: ${({ checked }) => (checked ? `default` : `pointer`)};
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
    font-size: 16px;
  }
`;

type CellValue = "x" | "o" | null;
type GameArr = CellValue[];

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

const getDiagonal = (x: "left" | "right") => (gameSize: number) => {
  const sideLength = Math.sqrt(gameSize);
  return new Array(sideLength)
    .fill(null)
    .map((_, i) =>
      x === "left" ? i + i * sideLength : (i + 1) * sideLength - (i + 1)
    );
};

const diagonals = (gameSize: number) => [
  getDiagonal("left")(gameSize),
  getDiagonal("right")(gameSize),
];

const winningTests = (gameSize: number) => [
  ...getIndeces("rows")(gameSize),
  ...getIndeces("columns")(gameSize),
  ...diagonals(gameSize),
];

const checkIfWinner = (game: GameArr): CellValue =>
  winningTests(game.length).map(checkIndeces(game)).reduce(getWinner);

const isGameOver = (gameState: GameArr, winnerOverride: CellValue) =>
  gameState.filter((x) => x === null).length === 0 || winnerOverride;
const INITIAL_GAME_SIZE = 9;
export const TicTacToe = () => {
  const [gameSize, resetGame] = React.useState({ gameSize: INITIAL_GAME_SIZE });
  const [gameState, setGameState] = React.useState<GameArr>(
    getEmptyGame(gameSize.gameSize)
  );
  const [winner, setWinner] = React.useState<CellValue>(null);
  const [turn, setTurn] = React.useState<"x" | "o">("x");
  const toggleTurn = () => setTurn(turn === "x" ? "o" : "x");
  const initializeGame = () => {
    resetGame(gameSize);
    setGameState(getEmptyGame(gameSize.gameSize));
    setWinner(null);
    setTurn("x");
  };
  React.useEffect(initializeGame, [gameSize]);

  return (
    <>
      <GameGrid gameSize={gameSize.gameSize}>
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
                resetGame(gameSize);
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
        <button onClick={() => resetGame({ gameSize: 9 })}>Reset (3)</button>
        <button onClick={() => resetGame({ gameSize: 16 })}>Reset (4)</button>
      </Controls>
    </>
  );
};

import * as React from "react";
import styled from "styled-components";

const GameContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  border: 0.5px solid blue;
`;
const GameCell = styled.div<{ checked: boolean }>`
  display: flex;
  border: 0.5px solid blue;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${({ checked }) => (checked ? `grey` : `transparent`)};

  &:hover {
    background-color: grey;
  }
`;

type CellValue = "x" | "o" | null;
type GameArr = CellValue[];
type WinChecker = (x: GameArr) => CellValue;

const getEmptyGame: () => GameArr = () => [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

const checkIndeces: (
  game: GameArr
) => (winningIndexCombo: number[]) => CellValue = (game) => (indeces) =>
  indeces
    .map((i) => game[i])
    .reduce((a, b) => (a !== null && a === b ? a : null));

const getWinner = (a: CellValue, b: CellValue) =>
  a !== null ? a : b !== null ? b : null;

const rowOneIndeces = [0, 1, 2];
const rowTwoIndeces = [3, 4, 5];
const rowThreeIndeces = [6, 7, 8];
const checkRows: WinChecker = (game) =>
  [rowOneIndeces, rowTwoIndeces, rowThreeIndeces]
    .map(checkIndeces(game))
    .reduce(getWinner);

const colOneIndeces = [0, 3, 6];
const colTwoIndeces = [1, 4, 7];
const colThreeIndeces = [2, 5, 8];
const checkColumns: WinChecker = (game) =>
  [colOneIndeces, colTwoIndeces, colThreeIndeces]
    .map(checkIndeces(game))
    .reduce(getWinner);

const topLeftDiagIndeces = [0, 4, 8];
const topRightDiagIndeces = [2, 4, 6];
const checkDiagonals: WinChecker = (game) =>
  [topLeftDiagIndeces, topRightDiagIndeces]
    .map(checkIndeces(game))
    .reduce(getWinner);

const winningTests: WinChecker[] = [checkRows, checkColumns, checkDiagonals];

const checkIfWinner = (game: GameArr): CellValue =>
  winningTests.reduce((a, b) => (a !== null ? a : b(game)), null as CellValue);

const Game = () => {
  const [gameState, setGameState] = React.useState<GameArr>(getEmptyGame());
  const [winner, setWinner] = React.useState<"x" | "o" | null>(null);
  const [turn, setTurn] = React.useState<"x" | "o">("x");
  const toggleTurn = () => (turn === "x" ? setTurn("o") : setTurn("x"));
  const setNewGame = React.useCallback(() => {
    setGameState(getEmptyGame());
    setWinner(null);
    setTurn("x");
  }, [setGameState, setWinner, setTurn]);

  return (
    <>
      <GameContainer>
        {gameState.map((x, i) => (
          <GameCell
            key={i}
            onClick={() => {
              if (gameState[i] === null && !winner) {
                const gameNextTurn = gameState.slice();
                gameNextTurn[i] = turn;
                setWinner(checkIfWinner(gameNextTurn));
                setGameState(gameNextTurn);
                toggleTurn();
              } else if (
                gameState.filter((x) => x === null).length === 0 ||
                winner
              ) {
                setNewGame();
              }
            }}
            checked={gameState[i] !== null ? true : false}
          >
            {x || `-`}
          </GameCell>
        ))}
      </GameContainer>
      Current turn: {turn}
      <br />
      {winner !== null ? `Winner is: ${winner}` : ""}
      <br />
      <button
        onClick={() => {
          setNewGame();
        }}
      >
        Reset
      </button>
    </>
  );
};

export const TicTacToe = () => (
  <div>
    <Game />
  </div>
);

import * as React from "react";
import styled from "styled-components";

const GameContainer = styled.div`
  display: grid;
  grid-gap: 1px;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  border: 1px solid yellow;
`;
const GameCell = styled.div`
  display: flex;
  border: 1px solid blue;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

type CellValue = "x" | "o" | null;
type GameArr = CellValue[];
type WinChecker = (x: GameArr) => CellValue;

const emptyGame: () => GameArr = () => [
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
  const [gameState, setGameState] = React.useState<GameArr>(emptyGame());
  const [winner, setWinner] = React.useState<"x" | "o" | null>(null);
  const [turn, setTurn] = React.useState<"x" | "o">("x");
  const toggleTurn = () => (turn === "x" ? setTurn("o") : setTurn("x"));

  return (
    <>
      <GameContainer>
        {gameState.map((x, i) => (
          <GameCell
            key={i}
            onClick={() => {
              if (gameState[i] === null && !winner) {
                const newGame = gameState;
                newGame[i] = turn;
                setGameState(newGame);
                setWinner(checkIfWinner(gameState));
                toggleTurn();
              } else if (
                gameState.filter((x) => x === null).length === 0 ||
                winner
              ) {
                setGameState(emptyGame());
                setWinner(null);
                setTurn("x");
              }
            }}
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
          setGameState(emptyGame());
          setWinner(null);
          setTurn("x");
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

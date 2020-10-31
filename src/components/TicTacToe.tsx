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
const rows = [rowOneIndeces, rowTwoIndeces, rowThreeIndeces];

const colOneIndeces = [0, 3, 6];
const colTwoIndeces = [1, 4, 7];
const colThreeIndeces = [2, 5, 8];
const columns = [colOneIndeces, colTwoIndeces, colThreeIndeces];

const topLeftDiagIndeces = [0, 4, 8];
const topRightDiagIndeces = [2, 4, 6];
const diagonals = [topLeftDiagIndeces, topRightDiagIndeces];

const winningTests = [...rows, ...columns, ...diagonals];

const checkIfWinner = (game: GameArr): CellValue =>
  winningTests.map(checkIndeces(game)).reduce(getWinner);

export const TicTacToe = () => {
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
          </Cell>
        ))}
      </GameGrid>
      <Controls>
        <p>{winner ? `Winner is: ${winner}` : `Current turn: ${turn}`}</p>
        <br />
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

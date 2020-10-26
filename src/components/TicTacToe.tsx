import * as React from "react";
import styled from "styled-components";

const GameContainer = styled.div`
  display: grid;
  grid-gap: 1px;
  grid-template-columns: repeat(3, 1fr);
`;
const GameCell = styled.div`
  background-color: blue;
`;

type CellValue = "x" | "o" | null;
type GameArr = CellValue[];
const emptyGame: GameArr = [
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

// TODO: Implement these
declare const checkRows: (x: GameArr) => CellValue;
declare const checkColumns: (x: GameArr) => CellValue;
declare const checkDiagonals: (x: GameArr) => CellValue;

const winningTests = [checkRows, checkColumns, checkDiagonals];

const checkIfWinner = (game: GameArr): CellValue =>
  winningTests.reduce((a, b) => (a !== null ? a : b(game)), null as CellValue);

const Game = () => {
  const [gameState, setGameState] = React.useState<GameArr>(emptyGame);
  const [winner, setWinner] = React.useState<"x" | "o" | null>(null);
  const [turn, setTurn] = React.useState<"x" | "o">("x");
  const toggleTurn = () => (turn === "x" ? setTurn("o") : setTurn("x"));

  React.useEffect(() => {
    setWinner(checkIfWinner(gameState));
  }, [gameState]);

  return (
    <GameContainer>
      {gameState.map((x, i) => (
        <GameCell
          key={i}
          onClick={() => {
            if (winner) {
              setGameState(emptyGame);
              setTurn("x");
            } else if (gameState[i] === null && !winner) {
              const newGame = gameState;
              newGame[i] = turn;
              setGameState(newGame);
              toggleTurn();
            }
          }}
        >
          {x}
          {i}
        </GameCell>
      ))}
      {winner !== null ? `${winner}` : ""}
    </GameContainer>
  );
};

export const TicTacToe = () => (
  <div>
    <Game />
  </div>
);

import * as React from "react";
import styled from "styled-components";
import { render } from "react-dom";

import { TicTacToe } from "./components";

const Container = styled.div`
  background-color: black;
`;

export const Main = () => (
  <Container>
    <TicTacToe />
  </Container>
);

render(<Main />, document.body);

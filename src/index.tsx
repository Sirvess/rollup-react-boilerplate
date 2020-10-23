import * as React from "react";
import styled from "styled-components";
import { render } from "react-dom";

const Container = styled.div`
  background-color: black;
`;

export const Main = () => <Container>Hello</Container>;

render(<Main />, document.body);

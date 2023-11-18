import React, { PropsWithChildren } from "react";
import { Container } from "@mantine/core";

export default async function ApplicationLayout(props: PropsWithChildren<{}>) {
  return <Container>{props.children}</Container>;
}

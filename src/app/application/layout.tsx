import React, { PropsWithChildren } from "react";
import { Button, Container, Group, Text } from "@mantine/core";
import { getCurrentUser } from "@/app/api/auth/[...nextauth]/auth-options";
import { SignOutButton } from "@/app/application/sign-out-button";

export default async function ApplicationLayout(props: PropsWithChildren<{}>) {
  const user = await getCurrentUser();

  return (
    <>
      {user != null ? (
        <Group>
          <Text>Hello, {user.name}!</Text>
          <SignOutButton>Sign out</SignOutButton>
        </Group>
      ) : (
        <Button component="a" href="/application/login">
          Sign in
        </Button>
      )}
      <Container>{props.children}</Container>
    </>
  );
}

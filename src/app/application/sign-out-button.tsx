"use client";

import React, { ComponentProps } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@mantine/core";

export function SignOutButton(
  props: Omit<ComponentProps<typeof Button>, "onClick">,
) {
  return <Button {...props} onClick={() => signOut()} />;
}

"use client";

import React, { ComponentProps } from "react";
import { ActionButton } from "@/components/action-button";
import { signOut } from "next-auth/react";

export function SignOutButton(
  props: Omit<ComponentProps<typeof ActionButton>, "onClick">,
) {
  return <ActionButton {...props} onClick={signOut} />;
}

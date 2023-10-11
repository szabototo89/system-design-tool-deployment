"use client";

import { Button } from "@mantine/core";
import { ComponentProps, useTransition } from "react";

type Props = { onClick?(): void } & Omit<
  ComponentProps<typeof Button<"button">>,
  "loading" | "onClick"
>;

export function ActionButton(props: Props) {
  const [isLoading, startTransition] = useTransition();

  return (
    <Button
      {...props}
      loading={isLoading}
      disabled={isLoading || props.disabled}
      onClick={() => {
        startTransition(() => props.onClick?.());
      }}
    >
      {props.children}
    </Button>
  );
}

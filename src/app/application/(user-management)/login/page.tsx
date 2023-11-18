import { withComponentLogger } from "@/logging/logger";
import { Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { CSRFToken } from "@/app/application/(user-management)/login/crsf-token";

export default withComponentLogger(async function LoginPage() {
  return (
    <Stack>
      <Title>Login</Title>

      <form method="POST" action="/api/auth/callback/credentials">
        <CSRFToken />
        <input name="callbackUrl" type="hidden" defaultValue="/application/" />

        <Stack gap="md">
          <TextInput label="E-mail" name="username" />
          <PasswordInput label="Password" name="password" />

          <Button type="submit">Login</Button>
        </Stack>
      </form>
    </Stack>
  );
});

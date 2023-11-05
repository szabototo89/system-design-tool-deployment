import { withComponentLogger } from "@/logging/logger";
import { Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { zfd } from "zod-form-data";
import { z } from "zod";

const LoginFormSchema = zfd.formData({
  email: z.string().email("Username must be an e-mail"),
  password: zfd.text(),
});

export default withComponentLogger(function LoginPage() {
  return (
    <Stack>
      <Title>Login</Title>

      <form
        action={async (formData: FormData) => {
          "use server";

          const { email, password } = LoginFormSchema.parse(formData);
        }}
      >
        <Stack gap="md">
          <TextInput label="E-mail" name="email" />
          <PasswordInput label="Password" name="password" />

          <Button type="submit">Login</Button>
        </Stack>
      </form>
    </Stack>
  );
});

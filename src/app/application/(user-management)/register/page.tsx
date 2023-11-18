import { Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { userAction } from "@/db/entities/users/queries";
import { redirect } from "next/navigation";

const RegisterNewUserFormDataSchema = zfd
  .formData({
    email: z.string().email(),
    password: zfd.text(),
    confirmPassword: zfd.text(),
  })
  .refine((formData) => formData.password === formData.confirmPassword, {
    message: "Passwords are not matching",
  });

export default function RegisterPage() {
  return (
    <Stack>
      <Title>Register a user</Title>

      <form
        method="POST"
        action={async function registerNewUser(formData: FormData) {
          "use server";
          const { email, password } =
            RegisterNewUserFormDataSchema.parse(formData);

          await userAction.registerUser({
            email,
            password,
            name: email,
          });

          redirect("/application/login");
        }}
      >
        <input name="callbackUrl" type="hidden" defaultValue="/" />

        <Stack gap="md">
          <TextInput label="E-mail" name="email" />
          <PasswordInput label="Password" name="password" />
          <PasswordInput label="Confirm password" name="confirmPassword" />

          <Button type="submit">Register</Button>
        </Stack>
      </form>
    </Stack>
  );
}

import { getCsrfToken } from "next-auth/react";
import { cookies } from "next/headers";

export async function CSRFToken() {
  const csrfToken = await getCsrfToken({
    req: {
      headers: {
        cookie: cookies().toString(),
      },
    },
  });

  return <input name="csrfToken" type="hidden" defaultValue={csrfToken} />;
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
try {
const { username, password } =
await req.json();

if (!username || !password) {
  return NextResponse.json(
    {
      error:
        "Benutzername und Passwort fehlen",
    },
    {
      status: 400,
    }
  );
}

const email =
  `${username.toLowerCase()}@dashboard.local`;

const { data, error } =
  await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

if (error) {
  return NextResponse.json(
    {
      error: error.message,
    },
    {
      status: 400,
    }
  );
}

await supabaseAdmin
  .from("profiles")
  .upsert({
    id: data.user.id,
    email,
    username,
    role: "user",
  });

return NextResponse.json({
  success: true,
});

} catch (error) {
console.error(error);

return NextResponse.json(
  {
    error: "Serverfehler",
  },
  {
    status: 500,
  }
);

}
}
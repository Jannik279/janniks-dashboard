import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
try {
const {
userId,
password,
} = await req.json();

if (!userId || !password) {
  return NextResponse.json(
    {
      error:
        "Benutzer-ID oder Passwort fehlt",
    },
    {
      status: 400,
    }
  );
}

const { error } =
  await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      password,
    }
  );

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
import { NextApiHandler } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

const handler: NextApiHandler = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    res.status(400).send("No code provided");
    return;
  }
  const supabase = createPagesServerClient({ req, res });

  console.log("code", code);

  try {
    await supabase.auth.exchangeCodeForSession(String(code));
    res.redirect("/dashboard");

  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Authentication error");
  }
};

export default handler;

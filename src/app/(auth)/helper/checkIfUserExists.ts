import { User } from "@/lib/models/User";

export async function checkIfUserExists(email: string) {
  if (!email || email === "") return;

  // Check if email already exists in db
  const isUserExists: boolean | null = await User.findOne({
    email,
  });

  const awaitedResponse = await isUserExists;

  return awaitedResponse;
}

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helper";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <HomePageClient userName={user.name || "Agriculteur"} />;
}

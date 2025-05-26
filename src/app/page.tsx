import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect to Portuguese locale (default)
  redirect("/pt");
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "@/server/queries/users";
import { getBooks, getBookStats } from "@/server/queries/books";
import { DashboardContent } from "@/components/dashboard";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const [booksResult, stats] = await Promise.all([
    getBooks(user.id, {
      sortBy: "updatedAt",
      sortOrder: "desc",
      page: 1,
      limit: 50,
    }),
    getBookStats(user.id),
  ]);

  return <DashboardContent books={booksResult.books} stats={stats} />;
}

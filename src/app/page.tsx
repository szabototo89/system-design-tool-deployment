import { MessageBoardCard } from "@/components/MessageBoardCard";
import { db, MessageBoards } from "@/db/schema";

export default async function Home() {
  const messageBoards = await db.select().from(MessageBoards);

  return (
    <>
      {messageBoards.map((messageBoard) => (
        <MessageBoardCard key={messageBoard.id} messageBoard={messageBoard} />
      ))}
    </>
  );
}

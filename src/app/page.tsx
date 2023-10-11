import { MessageBoardCard } from "@/components/MessageBoardCard";
import { db } from "@/db/schema";
import { MessageBoards } from "@/db/schemas/messageBoards.schema";

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

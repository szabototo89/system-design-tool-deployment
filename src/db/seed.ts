import { faker } from "@faker-js/faker";
import {
  db,
  Message,
  MessageBoard,
  MessageBoards,
  messageBoardStatusList,
  Messages,
} from "./schema";

await db.delete(Messages);
await db.delete(MessageBoards);

const messageBoards = faker.helpers.multiple(
  () => {
    const testMessageBoard: Partial<MessageBoard> = {
      title: faker.lorem.words(10),
      description: faker.lorem.text(),
      status: faker.helpers.arrayElement(messageBoardStatusList),
    };
    return testMessageBoard;
  },
  { count: 15 },
);

const updatedMessageBoards = await db
  .insert(MessageBoards)
  .values(messageBoards)
  .returning();

const messages = updatedMessageBoards.flatMap((messageBoard) => {
  return faker.helpers.multiple(
    (): Partial<Message> => {
      return {
        messageBoardID: messageBoard.id,
        content: faker.lorem.text(),
        createdAt: faker.date.anytime(),
      };
    },
    { count: faker.number.int({ min: 1, max: 10 }) },
  );
});

await db.insert(Messages).values(messages);

import { faker } from "@faker-js/faker";
import {
  db,
  Message,
  MessageBoard,
  MessageBoardTable,
  messageBoardStatusList,
  MessageTable,
} from "./schema";

await db.delete(MessageTable);
await db.delete(MessageBoardTable);

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
  .insert(MessageBoardTable)
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

await db.insert(MessageTable).values(messages);

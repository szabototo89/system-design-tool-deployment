import { Text } from "@mantine/core";
import { Message } from "@/db/schema";

type Props = { message: Message };

export function MessageCard(props: Props) {
  return <Text>{props.message.content}</Text>;
}

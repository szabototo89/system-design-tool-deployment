import { formatDistanceToNow } from "date-fns";

type Props = { children: Date };

export function RelativeTimestamp(props: Props) {
  return formatDistanceToNow(props.children);
}

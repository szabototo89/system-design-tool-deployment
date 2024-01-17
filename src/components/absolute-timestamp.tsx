import { formatRFC7231 } from "date-fns";

type Props = {
  children: Date;
};

export function AbsoluteTimestamp(props: Props) {
  return formatRFC7231(props.children);
}

import { SystemElement } from "@/db/entities/system-element/schema";
import { Handle, Position, useNodeId, useReactFlow } from "reactflow";

type Props = {
  data: SystemElement & { isParent: boolean };
};

export function SystemElementNode({ data }: Props) {
  return (
    <>
      <div
        style={
          data.isParent
            ? {
                textAlign: "center",
                border: "2px solid black",
                padding: "10px",
                fontSize: 12,
                width: "100%",
                height: "100%",
              }
            : {
                textAlign: "center",
                backgroundColor: "blue",
                color: "white",
                padding: "10px",
                fontSize: 12,
                maxWidth: "200px",
                width: "100%",
                height: "100%",
              }
        }
      >
        <div>[{data.type}]</div>
        <div style={{ fontWeight: "bold" }}>{data.name}</div>
        {!data.isParent && (
          <div style={{ lineHeight: 1.3 }}>{data.description}</div>
        )}
      </div>
      {!data.isParent && (
        <>
          <Handle position={Position.Top} type="target" />
          <Handle position={Position.Bottom} type="source" />
        </>
      )}
    </>
  );
}

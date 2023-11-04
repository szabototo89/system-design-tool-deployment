import pino from "pino";
import { ReactNode, ValidationMap, WeakValidationMap } from "react";

interface AsyncFunctionComponent<P = {}> {
  (props: P, context?: any): ReactNode;

  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}

export const logger = pino({
  level: "debug",
});

const applicationLogger = logger.child({});

export function withComponentLogger<TProps>(
  component: AsyncFunctionComponent<TProps>,
) {
  function ComponentWithLogger(props: TProps) {
    const componentLogger = applicationLogger.child({
      type: "component_logger",
      component: {
        name: component.name ?? component.displayName,
        props,
      },
    });
    componentLogger.debug("Render component");

    return component(props);
  }

  return ComponentWithLogger;
}

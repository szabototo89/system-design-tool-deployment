import { SQLiteTable, SQLiteTableFn } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { sql } from "drizzle-orm";
import { DrizzleDatabase } from "@/db/schema";

export type ActionType = "create" | "update" | "delete" | "upsert";

export type EntityQueryConfiguration = Record<
  string,
  EqlQueryBuilder<any, any, z.ZodTypeAny>
>;

export const onDeletionAction = <TSchema extends z.ZodTypeAny>(
  entitySchema: TSchema,
  listener: (db: DrizzleDatabase, entity: z.infer<TSchema>) => Promise<void>,
) => {
  return async (
    actionType: ActionType,
    db: DrizzleDatabase,
    entity: unknown,
  ) => {
    if (actionType !== "delete") {
      return;
    }

    const parsedEntity = entitySchema.safeParse(entity);

    if (!parsedEntity.success) {
      return;
    }

    await listener(db, entity);
  };
};

export class EqlQueryBuilder<
  TImplementationResult,
  TImplementationFn extends (...args: any[]) => TImplementationResult,
  TOutputSchema extends z.ZodTypeAny,
> {
  public constructor(
    protected implementationFn: TImplementationFn,
    protected outputSchema: TOutputSchema,
  ) {}

  implementation<
    TNextImplementationResult,
    TNextImplementationFn extends (...args: any[]) => TNextImplementationResult,
  >(fn: TNextImplementationFn) {
    return new EqlQueryBuilder(fn as TNextImplementationFn, this.outputSchema);
  }

  output<TNextOutputSchema extends z.ZodTypeAny>(schema: TNextOutputSchema) {
    return new EqlQueryBuilder(
      this.implementationFn,
      schema as TNextOutputSchema,
    );
  }

  buildQuery() {
    return async (
      ...params: Parameters<TImplementationFn>
    ): Promise<z.infer<TOutputSchema>> => {
      const result = await this.implementationFn(...params);
      return this.outputSchema.parse(result);
    };
  }
}

export function createSQLiteBackedEntity<
  TSQLiteTableDefinition extends ReturnType<SQLiteTableFn>,
  TQueryConfiguration extends EntityQueryConfiguration,
  TActionConfiguration extends Record<
    string,
    ActionBuilder<
      ActionType,
      any,
      z.ZodTypeAny,
      (db: DrizzleDatabase, ...rest: any[]) => Promise<any>
    >
  >,
  TSchema extends z.ZodTypeAny,
  TEdgeDefinitions, //extends Record<string, ReturnType<SQLiteTableFn>>,
>(schemaConfiguration: {
  table(): TSQLiteTableDefinition;
  edges?(config: {
    sourceTable: TSQLiteTableDefinition;
    sourceSchema: TSchema;
  }): TEdgeDefinitions;
  entitySchema(table: TSQLiteTableDefinition): TSchema;
  actions?(config: {
    table: TSQLiteTableDefinition;
    schema: TSchema;
    edges: TEdgeDefinitions;
  }): TActionConfiguration;
  queries(config: {
    table: TSQLiteTableDefinition;
    edges: TEdgeDefinitions;
    schema: TSchema;
    queryBuilder: EqlQueryBuilder<unknown, () => never, TSchema>;
  }): TQueryConfiguration;
}) {
  const table = schemaConfiguration.table();
  const schema = schemaConfiguration.entitySchema(table);
  const edges =
    schemaConfiguration.edges?.({ sourceTable: table, sourceSchema: schema }) ??
    ({} as TEdgeDefinitions);
  const queryBuilder = entityQueryBuilder.query().output(schema);

  function createQueries(configuration: TQueryConfiguration): {
    [queryName in keyof TQueryConfiguration]: Awaited<
      ReturnType<TQueryConfiguration[queryName]["buildQuery"]>
    >;
  } {
    const configurations = Object.entries(configuration).map(
      ([queryName, configuration]) => {
        return [queryName, configuration.buildQuery()];
      },
    );

    return Object.fromEntries(configurations);
  }

  function createActions(actionConfiguration?: TActionConfiguration): {
    [actionName in keyof TActionConfiguration]: ReturnType<
      TActionConfiguration[actionName]["build"]
    >;
  } {
    return Object.fromEntries(
      Object.entries(actionConfiguration ?? {}).map(([actionName, action]) => {
        const buildResult = action.build() as ReturnType<
          TActionConfiguration[keyof TActionConfiguration]["build"]
        >;

        return [
          actionName satisfies keyof TActionConfiguration,
          (async (db, ...args) => {
            const result = await buildResult(db, ...args);
            await Promise.all(
              actionListeners.map(
                async (listener) =>
                  await listener(action.actionType, db, result),
              ),
            );
            return result;
          }) as ReturnType<
            TActionConfiguration[keyof TActionConfiguration]["build"]
          >,
        ] as const;
      }),
    ) as {
      [actionName in keyof TActionConfiguration]: ReturnType<
        TActionConfiguration[actionName]["build"]
      >;
    };
  }

  const queryConfiguration = schemaConfiguration.queries({
    table,
    edges,
    schema,
    queryBuilder,
  });

  const actionListeners: Array<
    (actionType: ActionType, db: DrizzleDatabase, entity: unknown) => void
  > = [];

  function registerActionListener<
    TListener extends (
      actionType: ActionType,
      db: DrizzleDatabase,
      deletionResult: unknown,
    ) => void,
  >(listener: TListener) {
    actionListeners.push(listener);

    return () => {
      actionListeners.splice(actionListeners.indexOf(listener));
    };
  }

  const result = {
    table,
    schema,
    queries: createQueries(queryConfiguration),
    actions: createActions(
      schemaConfiguration.actions?.({ table, schema, edges }),
    ),
    configurations: {
      queryConfiguration,
    },
    registerActionListener,
  };

  return result;
}

export const entityQueryBuilder = {
  query() {
    return new EqlQueryBuilder(() => {
      throw new Error("Implementation missing");
    }, z.never());
  },
};

export class ActionBuilder<
  TActionType extends ActionType,
  TActionResult,
  TSchema extends z.ZodTypeAny,
  TImplementation extends (
    db: DrizzleDatabase,
    ...rest: any[]
  ) => Promise<TActionResult>,
> {
  public constructor(
    public readonly actionType: TActionType,
    public readonly implementation: TImplementation,
    public readonly schema: TSchema,
  ) {}

  public build() {
    return async (
      ...[db, ...rest]: Parameters<TImplementation>
    ): Promise<z.infer<TSchema>> => {
      try {
        db.run(sql`SAVEPOINT action`);
        const result = await this.implementation(db, ...rest);
        const schematizedResult = this.schema.parse(result);
        db.run(sql`RELEASE SAVEPOINT action`);
        return schematizedResult;
      } catch (error) {
        db.run(sql`ROLLBACK TO SAVEPOINT action`);
        throw error;
      }
    };
  }
}

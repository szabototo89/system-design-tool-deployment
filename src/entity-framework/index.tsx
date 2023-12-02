import { SQLiteTableFn } from "drizzle-orm/sqlite-core";
import { z } from "zod";

export type EntityQueryConfiguration = Record<
  string,
  EqlQueryBuilder<any, any, z.ZodTypeAny>
>;

export class EqlQueryBuilder<
  TImplementationResult,
  TImplementationFn extends (...args: any[]) => Promise<TImplementationResult>,
  TOutputSchema extends z.ZodTypeAny,
> {
  public constructor(
    protected implementationFn: TImplementationFn,
    protected outputSchema: TOutputSchema,
  ) {}

  implementation<
    TNextImplementationResult,
    TNextImplementationFn extends (
      ...args: any[]
    ) => Promise<TNextImplementationResult>,
  >(fn: TNextImplementationFn) {
    return new EqlQueryBuilder(fn as TNextImplementationFn, this.outputSchema);
  }

  output<TNextOutputSchema extends z.ZodTypeAny>(schema: TNextOutputSchema) {
    return new EqlQueryBuilder(
      this.implementationFn,
      schema as TNextOutputSchema,
    );
  }

  async buildQuery() {
    return async (
      ...params: Parameters<TImplementationFn>
    ): Promise<z.infer<TOutputSchema>> => {
      const result = await this.implementationFn(...params);
      return this.outputSchema.parse(result);
    };
  }
}

export const entityQueryBuilder = {
  query() {
    return new EqlQueryBuilder(() => {
      throw new Error("Implementation missing");
    }, z.never());
  },
};

export async function createSQLiteBackedEntity<
  TSQLiteTableDefinition extends ReturnType<SQLiteTableFn>,
  TQueryConfiguration extends EntityQueryConfiguration,
  TSchema extends z.ZodTypeAny,
>(schemaConfiguration: {
  table(): TSQLiteTableDefinition;
  entitySchema(table: TSQLiteTableDefinition): TSchema;
  queries(config: {
    table: TSQLiteTableDefinition;
    schema: TSchema;
    queryBuilder: EqlQueryBuilder<unknown, () => never, TSchema>;
  }): TQueryConfiguration;
}) {
  async function createQuery(configuration: TQueryConfiguration): Promise<{
    [queryName in keyof TQueryConfiguration]: Awaited<
      ReturnType<TQueryConfiguration[queryName]["buildQuery"]>
    >;
  }> {
    const configurations = await Promise.all(
      Object.entries(configuration).map(async ([queryName, configuration]) => {
        return [queryName, await configuration.buildQuery()];
      }),
    );

    return Object.fromEntries(configurations);
  }

  const table = schemaConfiguration.table();
  const schema = schemaConfiguration.entitySchema(table);
  const queryBuilder = entityQueryBuilder.query().output(schema);

  const result = {
    table,
    schema,
    queries: await createQuery(
      schemaConfiguration.queries({ table, schema, queryBuilder }),
    ),
  };

  return result;
}

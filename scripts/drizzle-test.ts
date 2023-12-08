import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sql } from "drizzle-orm";

const sqliteClient = new Database(":memory:");

const db = drizzle(sqliteClient);

const sqlScript = sql`create table if not exists foo(
    name varchar    
)`;

console.clear();
console.log(db.run(sqlScript));

db.run(sql`insert into foo(name) values ('John Doe')`);
db.run(sql`insert into foo(name) values ('Jane Doe')`);
console.log(db.all(sql`select * from foo`));

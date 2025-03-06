import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    return knex.schema.createTable("addresses", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
        table.string("street").notNullable();
        table.string("city").notNullable();
        table.string("state").notNullable();
        table.string("zip").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
      });
}


export async function down(knex: Knex): Promise<void> {
}


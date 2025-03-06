import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("posts", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
        table.string("title").notNullable();
        table.text("body").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("posts");
}


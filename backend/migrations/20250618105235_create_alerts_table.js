/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("alerts", (table) => {
    table.increments("id").primary()
    table
    table.bigint("user_id").unsigned().notNullable()
    table.string("coin_name").notNullable()
    table.string("coin_id").notNullable()
    // table.timestamp("trigger_date").nullable()
    table.string("option").notNullable() // e.g., ">", "<", "="
    table.decimal("price", 16, 2).notNullable()
    table.boolean("is_active").defaultTo(true)
    table.timestamp("created_at").defaultTo(knex.fn.now())

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("alerts")
}

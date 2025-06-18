/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("notifications", (table) => {
    table.increments("id").primary()
    table.bigint("user_id").unsigned().notNullable()
    table
      .integer("alert_id")
      .references("id")
      .inTable("alerts")
      .onDelete("SET NULL")
    table.text("message").notNullable()
    table.timestamp("sent_at").defaultTo(knex.fn.now())
    table.boolean("read").defaultTo(false)

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
  return knex.schema.dropTableIfExists("notifications")
}

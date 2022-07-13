import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('bookings',(table)=>{
        table.increments('id').primary().nullable().unique();
        table.integer('seat_count').notNullable();
        table.string('email').notNullable();
        table.integer('flight').notNullable();         
    })
}


export async function down(knex: Knex): Promise<void> {
}


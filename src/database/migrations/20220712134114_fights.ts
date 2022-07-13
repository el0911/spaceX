import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('flights',(table)=>{
        table.increments('id').primary().nullable().unique();
        table.string('code').notNullable();
        table.dateTime('departure_at').notNullable();
        table.integer('seat_count').notNullable();      
        table.integer('available_seats').notNullable();      
        table.integer('launch_site').notNullable();      
        table.integer('landing_site').notNullable();      
    })
}


export async function down(knex: Knex): Promise<void> {
}

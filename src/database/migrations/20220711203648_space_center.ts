import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('space_centers',(table)=>{
        table.integer('id').primary().notNullable().unique();
        table.string('uid').notNullable();
        table.string('name').notNullable();
        table.string('planet_code').notNullable();
        table.text('description').notNullable();
        table.float('latitude').notNullable();
        table.float('longitude').notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
}


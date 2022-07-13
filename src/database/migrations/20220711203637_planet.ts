import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('planets',(table)=>{
        table.integer('id').primary().notNullable().unique();
        table.string('name').notNullable();
        table.string('code').notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
}


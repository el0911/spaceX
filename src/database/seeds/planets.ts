import { Knex } from "knex";
import planets  from './data/planets'


export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("planets").del();

    // Inserts seed entries
    await knex("planets").insert(planets.map((data,i)=>{
        return {
            id:i,
            ...data
        }
    }));
};

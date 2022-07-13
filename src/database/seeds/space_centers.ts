import { Knex } from "knex";
import spaceCenter  from './data/space-centers'
export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("space_centers").del();

    // Inserts seed entries
    const data = spaceCenter.map((data,i)=>{
        return {
            id:i,
            ...data,
            // longitude: '0'
        }
    })
    await knex("space_centers").insert( data);
};


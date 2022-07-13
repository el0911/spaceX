require('dotenv').config();

import Koa from "koa";
import KoaRouter from "koa-router";
import { ApolloServer, gql } from "apollo-server-koa";
import { readdirSync, readFileSync } from "fs";
import { join as pathJoin } from "path";
import DataLoader from 'dataloader'
import queries from "./queries";
import mutations from "./mutations";
import db from "./database";
import customResolvers from "./customResolvers";

 


const main = async () => {
    const app = createApp();
    const port = process.env.PORT || 3000;
    console.log(`Connected to db`);

    app.listen(port);

    console.log(`Listening on port ${port}`);

}

export function createApp(): Koa {
    const app = new Koa();

    const router = new KoaRouter();

    // Fetch all schema definition files
    const schemaFiles = readdirSync(pathJoin(__dirname, "schema")).filter(
        file => file.indexOf(".graphql") > 0
    );



    // Concatanate them to create our schema
    const schema = schemaFiles
        .map(file => readFileSync(pathJoin(__dirname, `schema/${file}`)).toString())
        .join();



    const server = new ApolloServer({
        typeDefs: gql(`
            type Query,
            schema {
                query: Query,
                mutation:Mutation,
            }
            ${schema}
    `),
        resolvers: {
            Query: queries.Query,
            Mutation : mutations.Mutation,
            ...customResolvers
           
        },  
        formatError: errorHandler,
        context : ()=>{
            return {
                planetLoader : new DataLoader(async (keys:string[]) => {
                    const planets =  await db().select().from('planets').whereIn("code",keys)
                    const planetMap =  {}
                    planets.forEach(planet =>{
                        planetMap[planet.code] = planet
                    })

                     return keys.map(key => planetMap[key])
                } ),


                spaceCenterLoaderById : new DataLoader(async (keys:string[]) => {
                    const spaceCenters =  await db().select().from('space_centers').whereIn("id",keys)
                    const spaceMaps =  {}
                    spaceCenters.forEach(spaceCenter =>{
                        spaceMaps[spaceCenter.id] = spaceCenter
                    })

                     return keys.map(key => spaceMaps[key])
                } ),

                flightLoaderById   : new DataLoader(async (keys:string[]) => {
                    const fights =  await db().select().from('flights').whereIn("id",keys)
                    const fightsMap =  {}
                    fights.forEach(flight =>{
                        fightsMap[flight.id] = flight
                    })

                     return keys.map(key => fightsMap[key])
                } ),
                
                spaceCentersLoader : new DataLoader(async (keys:string[]) => {
                   try {
                     const spaceCenters =  await db().select().from('space_centers').whereIn("planet_code",keys)
                     const spaceMaps =  {}
                     spaceCenters.forEach(spaceCenter =>{
                             if (spaceMaps[spaceCenter.planet_code]) {
                                  spaceMaps[spaceCenter.planet_code] = [spaceCenter] .concat(spaceMaps[spaceCenter.planet_code])
                             }else{
                                spaceMaps[spaceCenter.planet_code] = [spaceCenter] 
                             } 
                     })
 
                      return keys.map(key => spaceMaps[key])
                   } catch (error) {
                        console.log
                   }
                } )
            }
        }
    });

    router.get("/health", ctxt => {
        ctxt.body = { success: true };
    });

    router.post("/graphql", server.getMiddleware());
    router.get("/graphql", server.getMiddleware());

    app.use(router.routes());
    app.use(router.allowedMethods());

    return app;
}

const errorHandler = (err: Error) => {
    console.log("Error while running resolver", {
        error: err
    });

    // Hide all internals by default
    // Change that when we introduce custom error instances
    return new Error("Internal server error");
};

if (require.main === module) {
    main();
}
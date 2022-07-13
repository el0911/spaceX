 

export default {
    Planet: {
        spaceCenters:async (obj, args: { limit }, context, info) => {
            
            const data =  await context.spaceCentersLoader.load( obj.code )
              return  data.splice(0,args.limit)
         }
    },
    SpaceCenter: {
        planet: (obj, args,context) => {
            return context.planetLoader.load( obj.planet_code )
        },
    },
    FlightResponse : {
        launchSite :   (obj, args, context, info) => {
            return  context.spaceCenterLoaderById.load( obj.launchSite ) 
        }, 
        landingSite:    (obj, args, context, info) => {
            return   context.spaceCenterLoaderById.load( obj.landingSite )  
        }, 
    },
    Flight: {
        launchSite :   (obj, args, context, info) => {
            return  context.spaceCenterLoaderById.load( obj.launch_site )   
        }, 
        landingSite:  async (obj, args , context, info) => {
            return  context.spaceCenterLoaderById.load( obj.landing_site )    
        }, 
    },
    // BookingResponse :{
    //     flight : async (obj, args , context, info) => {
    //         return context.flightLoaderById.load( obj.flight )   
    //     }, 
    // }
}
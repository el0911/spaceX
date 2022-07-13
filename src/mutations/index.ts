import db from "../database";
import { getFlight, getSpaceCenter } from "../services";
import { v4 as uuidv4 } from 'uuid';

 
export default {
  Mutation: {
    scheduleFlight: async (obj, args) => {
        const { launchSiteId, landingSiteId, departureAt, seatCount } = args.flightInfo
        

        try {
             //valiidate space center
            const [launch,land]  = await Promise.all( [getSpaceCenter(launchSiteId) ,getSpaceCenter(landingSiteId) ])
          
            if (!launch  || !land) {
                throw new Error('Cant find the Space center')
            }


            const data = {
                code: uuidv4(),
                launch_site: launchSiteId,
                landing_site: landingSiteId,
                departure_at: new Date(departureAt).toISOString(),
                seat_count: seatCount,
                available_seats : seatCount ///available seats are all seats on the crreatinig the flight
            }


            const trx = await(db.transaction());
             try {
                const returnData = await trx.insert(data).returning(['id','code','launch_site','landing_site','departure_at','seat_count','available_seats']).into('flights')
                await trx.commit();
                 return {
                    ...returnData[0],
                    launchSite : returnData[0].launch_site,
                    landingSite : returnData[0].landing_site,
                    departureAt : returnData[0].departure_at,
                    seatCount: returnData[0].seat_count,
                    availableSeats:returnData[0].available_seats,

                }
            } catch (error) {
                await trx.rollback(error);
            }
             
            return {}
        } catch (error) {
            return error
        }
         
    },
  
    bookFlight  :  async (obj, args) => {
        const { seatCount, flightId, email } = args.bookingInfo
        

        try {
             //valiidate space center
            const flight  = await getFlight(flightId)
          
            if (!flight) {
                throw new Error('Cant find the flight')
            }

            //no avaiilable seats
            if (flight.available_seats === 0 || (flight.available_seats  - seatCount) < 0 ) {
                throw new Error('No more seats available')
            }

            const data = {
                seat_count: seatCount,
                flight: flightId,
                email: email,
            }///data to save the flight booking 

            const trx = await(db.transaction());
             try {
                const [bookingData,_] = await Promise.all( [
                    trx.insert(data).returning(['id','email','flight']).into('bookings'), 
                    trx.table('flights').where('id', '=', flightId).decrement('available_seats',seatCount)
                ])
                ///boked a flight now we have to decrement the available seats
                   
                await trx.commit();
                return {
                    ...bookingData[0],
                    flight : {
                        ...flight,
                        seatCount :flight.seat_count,
                        availableSeats  :flight.available_seats -  1
                    }
                }
            } catch (error) {
                await trx.rollback(error);
            }
             
            return {}
        } catch (error) {
            return error
        }
         
    },

}
};
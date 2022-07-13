import db from "../database";

type Planet = {
  id: any;
  name: String;
  code: String;
  spaceCenters: any[];
}

type spaceCenter = {
  id: String,
  name: String,
  uid: String,
  description: String,
  planet: Planet,
  latitude: String,
  longitude: String,
}

type planets = Planet[]


const processPageSize = (args) =>{
  if (args.pageSize > 100) {
    args.pageSize = 100
  }

  else if (args.pageSize < 1) {
    args.pageSize = 10
  } 

  return args
}
export default {
  Query: {
    planets: function getPlanets(root: {}): Promise<planets> {
      return db().select('*').from('planets');
    },

    spaceCenter: function getPlanets(root: {}, args: {
      id: number,
      uid: string
    }): Promise<spaceCenter> {
      return db().select('*').from('space_centers').where(args.id ? {
        id: args.id
      } : {
        uid: args.uid
      }).first();
    },

    spaceCenters: async function getPlanets(root: {}, args: { page, pageSize }) {
      args =  processPageSize(args)
      let { page = 1, pageSize = 10 } = args
      
      const nodes = await db().select('*').from('space_centers').offset(pageSize * (page - 1)).limit(pageSize);
      const total = await db('space_centers').count('*', { as: 'count' }).first()
      return {
        pagination: {

          total: total.count,
          page: page,
          pageSize: pageSize,

        }, nodes
      }
    },
    flight: function getPlanets(root: {},args:{id}) {
      return db().select('*').from('flights').where({...args}).first();
    },
    flights: async function getPlanets(root: {}, args: { page, pageSize, from, to, seatCount,availableSeats,departureDay }) {
      
      args =  processPageSize(args)
      let { page = 1, pageSize = 10,from, to, seatCount,availableSeats,departureDay } = args

      const search = {
      }

      if (from) {
        search['launch_site'] = from
      }
    

      if (to) {
        search['landing_site'] = to
      }
    

      if (seatCount) {
        search['seat_count'] = seatCount
      }

      

       

      const query  =  db().select('*').from('flights').offset(pageSize * (page - 1)).limit(pageSize).where({
        ...search
      });

      const countQuery =  db('flights').where({
        ...search
      }).count('*', { as: 'count' }).first()

      if (availableSeats) {
        query.andWhere('available_seats','>',availableSeats)
        countQuery.andWhere('available_seats','>',availableSeats)
      }

      // cretes query by checking inbetween two time stamps beginiing of the day and end of the day
      if (departureDay) {
        var start = new Date(departureDay);
        start.setUTCHours(0,0,0,0);
        var end = new Date(departureDay);
        end.setUTCHours(23,59,59,999);
        query.whereBetween('departure_at', [start, end]);
        countQuery.whereBetween('departure_at', [start, end]);
      }
    
      const nodes = await  query
      const total = await  countQuery
      return {
        pagination: {

          total: total.count,
          page: page,
          pageSize: pageSize,

        }, nodes
      }
    },
    bookings : async (obj, args) => {
      args =  processPageSize(args)
      let { page = 1, pageSize = 10,email } = args
      const query =  db() .select('*', 'seat_count as seatCount').from('bookings').offset(pageSize * (page - 1)).limit(pageSize);
      const countQuery =  db('bookings').count('*', { as: 'count' }).first()

      if (email) {
        query.where({email})
        countQuery.where({email})
      }
      const nodes = await query
      const total = await countQuery
      return {
        pagination: {

          total: total.count,
          page: page,
          pageSize: pageSize,

        }, nodes
      }
    },
    booking : async (obj, args) => {
      const query =  db() .select('*', 'seat_count as seatCount').from('bookings') 
      return query.where({id:args.id}).first()
    
     
    },

  
  }
};
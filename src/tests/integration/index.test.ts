
import supertest from "supertest";
import { expect } from "chai";
import { createApp } from "../../server";
 
 
const request = supertest(createApp().listen());

describe("GraphQL Server", () => {
  it("should get all  planets", async () => {
    await request
      .post("/graphql")
      .send({
        query: `
          {
            planets {
              id
              name
              code
              spaceCenters(limit: 3) {
                id
              }
            }
          }
        `
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        console.log(response.body)
        expect(response.body.data.planets[0]).to.have.property('id');;
        expect(response.body.data.planets[0].spaceCenters).to.have.lengthOf(3);

      });
  });


  it("should get some   space centers", async () => {
    await request
      .post("/graphql")
      .send({
        query: `
          {
            spaceCenters {
              pagination {
                total
                page
                pageSize
              }
              nodes {
                id
                uid
                name
                description
                latitude
                longitude
                planet {
                  id
                  name
                  code
                }
              }
            }
          }
        `
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        expect(response.body.data.spaceCenters.nodes).to.have.lengthOf(10);
 
      });
  });


  it("should get create a flight", async () => {
    await request
      .post("/graphql")
      .send({
        query: `
        mutation {
          scheduleFlight(
            flightInfo: { launchSiteId: 15, 	landingSiteId: 22, departureAt: "2022-07-12T19:15:45+01:00",  seatCount: 4 }
          ) {
            id
            code
            launchSite {
              name
              planet {
                name
              }
            }
            landingSite {
              name
              planet {
                name
              }
            }
            availableSeats
            seatCount
            departureAt
          }
        }
        `
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        expect(response.body.data.scheduleFlight).to.have.property('code');
 
      });
  });
});
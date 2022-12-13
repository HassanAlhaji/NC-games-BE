const request = require("supertest");
const db = require("../db/connection");
const app = require("../app.js");
const testData = require('../db/data/test-data/index')
const seed = require("../db/seeds/seed")

beforeEach(() => seed(testData));
afterAll(() => {
  db.end()
});

describe("GET/api/categories", () => {
    test('status:200, responds with an array of categories objects', () => {
      return request(app)
        .get('/api/categories')
        .expect(200)
        .then((response) => {
          const  categories  = response.body.categories;
          expect(categories).toBeInstanceOf(Array);
          expect(categories).toHaveLength(4);
          categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String)
              })
            );
          });
        });
    });
  });

  describe("error handling", ()=>{
    test("GET un existed path should return 404 not found",()=>{
      return request(app).get("/api/cats").expect(404).then((res)=>{
        expect(res.body.msg).toBe("path not found")
      })
    })
  })
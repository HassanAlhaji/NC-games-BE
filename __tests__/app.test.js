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
  describe("GET//api/reviews", ()=>{
    test('status:200, responds with an array of reviews objects has comment_count keys', () => {
      return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((response) => {
          const  reviews  = response.body.reviews;
          expect(reviews ).toBeInstanceOf(Array);
          expect(reviews ).toHaveLength(13);
          expect(reviews).toBeSortedBy("comment_count", { descending: true })
          reviews.forEach((reviews ) => {
            expect(reviews ).toEqual(
              expect.objectContaining({
                review_id: expect.any(Number),
                title: expect.any(String),
                category: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number)
              })
            );
          });
        });
    });
  })
  describe("GET /api/reviews/:review_id", () => {
    test("should return a review object with the specified properties", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            review_id: 2,
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: "philippaclaire9",
            created_at: expect.any(String),
          });
        });
    });
  })
  describe("error handling", ()=>{
    test("GET un existed path should return 404 not found",()=>{
      return request(app).get("/api/cats").expect(404).then((res)=>{
        expect(res.body.msg).toBe("path NOT found")
      })
    })
  })

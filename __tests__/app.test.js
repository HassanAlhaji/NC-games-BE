const request = require("supertest");
const db = require("../db/connection");
const app = require("../app.js");
const testData = require('../db/data/test-data/index')
const seed = require("../db/seeds/seed");
const { response } = require("../app.js");

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
  describe("GET/api/reviews", ()=>{
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
            title: 'Jenga',
            review_body: 'Fiddly fun for all the family',
            designer: 'Leslie Scott',
            review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            votes: 5,
            category: 'dexterity',
            owner: "philippaclaire9",
            created_at: '2021-01-18T10:01:41.251Z',
          });
        });
    });
  })

  describe('GET /api/reviews/:review_id/comments',()=>{
    test('status:200, responds with an array of comments objects for the given review_id',()=>{
      return request(app)
      .get('/api/reviews/2/comments')
      .expect(200)
      .then((response)=>{
        const comments = response.body.comments
        expect(comments ).toHaveLength(3); 
        expect(comments).toBeSortedBy("comment_id", { descending: true })
        comments.forEach((comment)=>{
          expect.objectContaining({
            comment_id:expect.any(Number),
            votes: expect.any(String),
            created_at:expect.any(String),
            author:expect.any(String),
            body: expect.any(String),
            review_id:expect.any(String)
          })
        })
      })
    })
  })
 test('400:invalid comment_id',()=>{
  return request(app)
  .get('/api/reviews/orange/comments')
  .expect(400)
  .then((response)=>{
    const msg = response.body.msg
    expect(msg).toBe("bad request")
  })
 })
 test('200: review_id is valid, but no existent',()=>{
  return request(app)
  .get('/api/reviews/100/comments')
  .expect(200)
  .then((response)=>{
    
    console.log(response.body, 'inside test')
    expect(response.body.comments).toStrictEqual([])
  })
 })

  describe("error handling", ()=>{
    test("GET un existed path should return 404 not found",()=>{
      return request(app).get("/api/cats").expect(404).then((res)=>{
        expect(res.body.msg).toBe("path NOT found")
      })
    })
  })

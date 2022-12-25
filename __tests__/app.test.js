const request = require("supertest");
const db = require("../db/connection");
const app = require("../app.js");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const { response } = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => {
  db.end();
});

describe("GET/api/categories", () => {
  test("status:200, responds with an array of categories objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        const categories = response.body.categories;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
describe("GET/api/reviews", () => {
  test("status:200, responds with an array of reviews objects has comment_count keys", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const reviews = response.body.reviews;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("comment_count", { descending: true });
        reviews.forEach((reviews) => {
          expect(reviews).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              category: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});
describe("GET /api/reviews/:review_id", () => {
  test("should return a review object with the specified properties", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          review_id: 2,
          title: "Jenga",
          review_body: "Fiddly fun for all the family",
          designer: "Leslie Scott",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 5,
          category: "dexterity",
          owner: "philippaclaire9",
          created_at: "2021-01-18T10:01:41.251Z",
        });
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("status:200, responds with an array of comments objects for the given review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toHaveLength(3);
        expect(comments).toBeSortedBy("comment_id", { descending: true });
        comments.forEach((comment) => {
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(String),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: expect.any(String),
          });
        });
      });
  });
});
test("400:invalid review_id", () => {
  return request(app)
    .get("/api/reviews/orange/comments")
    .expect(400)
    .then((response) => {
      const msg = response.body.msg;
      expect(msg).toBe("bad request");
    });
});
test("200: review_id is valid, but no existent", () => {
  return request(app)
    .get("/api/reviews/100/comments")
    .expect(200)
    .then((response) => {
      expect(response.body.comments).toStrictEqual([]);
    });
});

describe("POST api/reviews/:review_id/comments", () => {
  const newComment = { username: "philippaclaire9", body: "my new commnet" };
  test("404: not found", () => {
    return request(app)
      .post("/api/reviews/40/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("not found");
      });
  });
  test("400:invalid review_id", () => {
    const newComment = { username: "philippaclaire9", body: "my new commnet" };
    return request(app)
      .post("/api/reviews/orange/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("bad request");
      });
  });
  test("400: if the body sent without the correct keys", () => {
    const newComment = { banana: "Yes", orange: "Definitely" };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("bad request");
      });
  });
  test("404: username doesn't exist", () => {
    const newComment = { username: "Rob", body: "my new commnet" };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("not found");
      });
  });

  test("should Responds with the posted comment", () => {
    const newComment = { username: "philippaclaire9", body: "my new commnet" };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect.objectContaining({
          comment_id: 7,
          body: "my new commnet",
          review_id: 3,
          author: "philippaclaire9",
          votes: 0,
          created_at: "2022-12-16T14:13:50.293Z",
        });
      });
  });
});
describe("patch", () => {
  test("it should update inc_votes", () => {
    const obj = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/1").send(obj)
      .expect(200)
      .then((response) => {
        const review = response.body.review;
        expect(review).toEqual(
          expect.objectContaining({
            review_id :1,
            title: 'Agricola',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: 'Farmyard fun!',
            category: 'euro game',
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 2
          })
        );
      });
  });
  test("it should update inc_votes", () => {
    const obj = { inc_votes: -10 };
    return request(app)
      .patch("/api/reviews/1").send(obj)
      .expect(200)
      .then((response) => {
        const review = response.body.review;
        expect(review).toEqual(
          expect.objectContaining({
            review_id :1,
            title: 'Agricola',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: 'Farmyard fun!',
            category: 'euro game',
            created_at: "2021-01-18T10:00:20.514Z",
            votes: -9
          })
        );
      });
  });
});
test("400:invalid review_id", () => {
  const obj = { inc_votes: 1 }
  return request(app)
    .patch("/api/reviews/orange")
    .send(obj)
    .expect(400)
    .then((response) => {
      const msg = response.body.msg;
      expect(msg).toBe("bad request");
    });
});
describe("200: get user", () => {
  test('GET /api/users', ()=>{
    request(app)
    .get('/api/users')
    .expect(200)
    .then((response=>{
      const users = response.body.users
      expect(users).toBeInstanceOf(Array)
      expect(users).toHaveLength(4)
      users.forEach((user)=>{
        expect.objectContaining({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        })
      })
    }))
  })
})

describe("error handling", () => {
  test("GET un existed path should return 404 not found", () => {
    return request(app)
      .get("/api/cats")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path NOT found");
      });
  });
});

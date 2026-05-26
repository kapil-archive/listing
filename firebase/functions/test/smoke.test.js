/* eslint-env mocha */
const assert = require("assert");
const request = require("supertest");

const app = require("../src/app");

describe("Smoke tests", () => {
  it("GET / should return running message", async () => {
    const res = await request(app).get("/");
    assert.strictEqual(res.status, 200);
    assert.ok(
        res.text && res.text.includes("Firebase API is running"),
    );
  });
});

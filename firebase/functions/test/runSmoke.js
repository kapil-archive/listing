const request = require("supertest");
const app = require("../src/app");

(async () => {
  try {
    const res = await request(app).get("/");
    if (
      res.status === 200 &&
      res.text &&
      res.text.includes("Firebase API is running")
    ) {
      console.log("Smoke test passed");
      process.exit(0);
    }
    console.error("Smoke test failed", res.status, res.text);
    process.exit(2);
  } catch (err) {
    console.error("Smoke test error", err);
    process.exit(1);
  }
})();

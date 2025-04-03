// test-lambda.ts

import { handler } from "./status/PostStatusLambda";

const testEvent = {
  token: "5c19db34733b0335e666a8e588d8d5f7d8a33d4ad67be3383fbb6ebadd915241",
  status: {
    post: "Test status", // Include underscores to match real input
    user: {
      firstName: "Test",
      lastName: "User",
      alias: "testuser",
      imageUrl: "http://example.com/image.jpg",
    },
    timestamp: Date.now(),
    segments: [],
  },
};

async function run() {
  try {
    const result = await handler(testEvent);
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

run();

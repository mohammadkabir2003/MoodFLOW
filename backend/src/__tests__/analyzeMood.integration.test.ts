jest.mock("@xenova/transformers", () => ({
  pipeline: jest.fn(),
}));

import request from "supertest";
import express from "express";
import { MoodAnalyzer } from "../services/MoodAnalyzer";

describe("POST /analyzeMood", () => {
  const app = express();
  app.use(express.json());

  const analyzer = new MoodAnalyzer();

  app.post("/analyzeMood", async (req, res) => {
    try {
      const { text, emojiScore } = req.body;
      const score = await analyzer.getAugmentedMoodScore(text, emojiScore);

      res.json({ moodScore: score });
    } catch (err) {
      res.status(500).json({ error: "Mood analysis failed" });
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns moodScore when analysis succeeds", async () => {
    jest
      .spyOn(MoodAnalyzer.prototype, "getAugmentedMoodScore")
      .mockResolvedValue(4.2);

    const res = await request(app)
      .post("/analyzeMood")
      .send({ text: "I feel great", emojiScore: 5 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ moodScore: 4.2 });
  });

  it("returns 500 when mood analysis fails", async () => {
    jest
      .spyOn(MoodAnalyzer.prototype, "getAugmentedMoodScore")
      .mockRejectedValue(new Error("model failed"));

    const res = await request(app)
      .post("/analyzeMood")
      .send({ text: "I feel bad", emojiScore: 1 });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Mood analysis failed" });
  });
});
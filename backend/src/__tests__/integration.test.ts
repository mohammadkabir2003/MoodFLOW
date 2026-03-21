import request from "supertest";
import { createApp } from "../app";

describe("POST /analyzeMood (Integration Test)", () => {
  it("returns mood score when analyzer succeeds", async () => {
    const mockAnalyzer = {
      getAugmentedMoodScore: jest.fn().mockResolvedValue(3.5),
    };

    const app = createApp(mockAnalyzer as any);

    const res = await request(app)
      .post("/analyzeMood")
      .send({ text: "good day", emojiScore: 4 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ moodScore: 3.5 });
    expect(mockAnalyzer.getAugmentedMoodScore).toHaveBeenCalledWith("good day", 4);
  });

  it("returns 500 when analyzer throws error", async () => {
    const mockAnalyzer = {
      getAugmentedMoodScore: jest.fn().mockRejectedValue(new Error("fail")),
    };

    const app = createApp(mockAnalyzer as any);

    const res = await request(app)
      .post("/analyzeMood")
      .send({ text: "bad day", emojiScore: 1 });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Mood analysis failed" });
  });
});

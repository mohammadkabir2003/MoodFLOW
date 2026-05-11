import request from "supertest";
import { createApp } from "../app";

jest.mock("../firebaseAdmin", () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        collection: jest.fn(() => ({
          orderBy: jest.fn(() => ({
            get: jest.fn().mockResolvedValue({
              docs: [
                {
                  id: "1",
                  data: () => ({
                    emojiScore: 4,
                    moodScore: 4.2,
                    date: {
                      toDate: () => new Date(),
                    },
                  }),
                },
              ],
            }),
          })),
        })),
      })),
    })),
  },
}));

describe("POST /analyzeMood", () => {

  it("returns a mood score from the analyzer", async () => {
    const fakeAnalyzer = {
      getAugmentedMoodScore: jest.fn().mockResolvedValue(4.5),
    } as any;

    const app = createApp(fakeAnalyzer);

    const response = await request(app)
      .post("/analyzeMood")
      .send({
        text: "I feel good",
        emojiScore: 4,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ moodScore: 4.5 });
    expect(fakeAnalyzer.getAugmentedMoodScore).toHaveBeenCalledWith(
    "I feel good",
    4
    );
  });

  it("returns 500 when mood analysis fails", async () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  const fakeAnalyzer = {
    getAugmentedMoodScore: jest.fn().mockRejectedValue(new Error("failed")),
  } as any;

  const app = createApp(fakeAnalyzer);

  const response = await request(app)
    .post("/analyzeMood")
    .send({
      text: "I feel bad",
      emojiScore: 2,
    });

  expect(response.status).toBe(500);
  expect(response.body).toEqual({ error: "Mood analysis failed" });

  consoleErrorSpy.mockRestore();
  });

  it("returns 400 when uid is missing", async () => {
    const fakeAnalyzer = {
      getAugmentedMoodScore: jest.fn(),
    } as any;

    const app = createApp(fakeAnalyzer);

    const response = await request(app).get("/mood-trends");

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: "uid is required",
    });
  });

  it("returns formatted mood trends data", async () => {
    const fakeAnalyzer = {
      getAugmentedMoodScore: jest.fn(),
    } as any;

    const app = createApp(fakeAnalyzer);

    const response = await request(app)
      .get("/mood-trends")
      .query({
        uid: "user-123",
        range: "7 Days",
      });

    expect(response.status).toBe(200);

    expect(response.body.chartData.length).toBe(1);

    expect(response.body.chartData[0]).toEqual(
      expect.objectContaining({
        score: 4.2,
      })
    );
  });

});
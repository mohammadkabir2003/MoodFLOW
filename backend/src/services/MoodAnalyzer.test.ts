jest.mock("@xenova/transformers", () => ({
  pipeline: jest.fn()
}));

import { MoodAnalyzer } from "./MoodAnalyzer";

describe("MoodAnalyzer.computeScore", () => {
  const analyzer = new MoodAnalyzer();

  it("returns a high mood score for positive sentiment", () => {
    const result = [{ label: "POSITIVE", score: 0.9 }];

    const score = analyzer.computeScore(result);

    expect(score).toBe(4.8);
  });

  it("returns a low mood score for negative sentiment", () => {
    const result = [{ label: "NEGATIVE", score: 0.9 }];

    const score = analyzer.computeScore(result);

    expect(score).toBe(1.2);
  });

});
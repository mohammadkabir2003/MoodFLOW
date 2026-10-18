jest.mock("@xenova/transformers", () => ({
  pipeline: jest.fn(),
}));

import { MoodAnalyzer } from "../services/MoodAnalyzer";
import { pipeline } from "@xenova/transformers";

describe("MoodAnalyzer", () => {
  let analyzer: MoodAnalyzer;

  beforeEach(() => {
    analyzer = new MoodAnalyzer();
  });

  describe("computeScore", () => {
    it("returns a high score for positive sentiment", () => {
      const result = [{ label: "POSITIVE", score: 0.9 }];

      const score = analyzer.computeScore(result);

      expect(score).toBeCloseTo(4.8);
    });

    it("returns a low score for negative sentiment", () => {
      const result = [{ label: "NEGATIVE", score: 0.9 }];

      const score = analyzer.computeScore(result);

      expect(score).toBeCloseTo(1.2);
    });
  });

  describe("getAugmentedMoodScore", () => {
    it("combines mood score and emoji score with the correct weights", async () => {
      jest.spyOn(analyzer, "getMoodScore").mockResolvedValue(5);

      const score = await analyzer.getAugmentedMoodScore("I feel amazing", 3);

      expect(score).toBeCloseTo(3.6);
    });
  });

  describe("getMoodScore", () => {
    it("initializes the classifier and returns a mood score", async () => {
      const mockClassifier = jest.fn().mockResolvedValue([
        {
          label: "POSITIVE",
          score: 0.8,
        },
      ]);

      (pipeline as jest.Mock).mockResolvedValue(mockClassifier);

      const score = await analyzer.getMoodScore("I feel great");

      expect(pipeline).toHaveBeenCalledWith(
        "text-classification",
        "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
      );

      expect(mockClassifier).toHaveBeenCalledWith(
        "I feel great",
        { top_k: null }
      );

      expect(score).toBeCloseTo(4.6);
    });
  });
});
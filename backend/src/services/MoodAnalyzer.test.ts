import { pipeline } from "@xenova/transformers";
import { MoodAnalyzer } from "./MoodAnalyzer";

jest.mock("@xenova/transformers", () => ({
  pipeline: jest.fn(),
}));

const mockedPipeline = pipeline as jest.Mock;

describe("MoodAnalyzer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("computes a scaled score for positive sentiment", () => {
    const analyzer = new MoodAnalyzer();

    expect(
      analyzer.computeScore([{ label: "POSITIVE", score: 0.8 }])
    ).toBeCloseTo(4.6);
  });

  it("blends the text mood score with the emoji score", async () => {
    const analyzer = new MoodAnalyzer();
    jest.spyOn(analyzer, "getMoodScore").mockResolvedValue(4);

    await expect(
      analyzer.getAugmentedMoodScore("productive day", 2)
    ).resolves.toBeCloseTo(2.6);
  });

  it("throws when computeScore receives an invalid classifier result", () => {
    const analyzer = new MoodAnalyzer();

    expect(() => analyzer.computeScore([])).toThrow(TypeError);
  });

  it("reuses the classifier after the first initialization", async () => {
    const classifier = jest
      .fn()
      .mockResolvedValue([{ label: "POSITIVE", score: 0.5 }]);

    mockedPipeline.mockResolvedValue(classifier);

    const analyzer = new MoodAnalyzer();

    await expect(analyzer.getMoodScore("first entry")).resolves.toBeCloseTo(4);
    await expect(analyzer.getMoodScore("second entry")).resolves.toBeCloseTo(4);

    expect(mockedPipeline).toHaveBeenCalledTimes(1);
    expect(classifier).toHaveBeenNthCalledWith(1, "first entry", { top_k: null });
    expect(classifier).toHaveBeenNthCalledWith(2, "second entry", { top_k: null });
  });
});

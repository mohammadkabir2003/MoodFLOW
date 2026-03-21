import express from "express";
import cors from "cors";
import { MoodAnalyzer } from "./services/MoodAnalyzer";

export interface MoodAnalyzerLike {
  getAugmentedMoodScore(text: string, emojiScore: number): Promise<number>;
}

export function createApp(analyzer: MoodAnalyzerLike = new MoodAnalyzer()) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("MoodFLOW Backend API");
  });

  app.post("/analyzeMood", async (req, res) => {
    try {
      const { text, emojiScore } = req.body;
      const score = await analyzer.getAugmentedMoodScore(text, emojiScore);

      res.json({ moodScore: score });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Mood analysis failed" });
    }
  });

  return app;
}

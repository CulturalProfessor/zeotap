import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Rule from "./models.js";
import { Engine } from "json-rules-engine";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
  })
);

app.use(express.json());

const create_rule = (ruleString) => {
  return {
    conditions: {
      any: [
        {
          fact: "age",
          operator: "greaterThan",
          value: 30,
        },
        {
          fact: "department",
          operator: "equal",
          value: "Sales",
        },
      ],
    },
    event: {
      type: "eligibility",
      params: {
        message: "The user is eligible.",
      },
    },
  };
};

app.get("/", (req, res) => {
  res.send("Rule Engine API");
});

app.post("/create_rule", async (req, res) => {
  const { ruleString } = req.body;

  const ast = create_rule(ruleString);

  const rule = new Rule({ ruleString, ast });
  await rule.save();
  res.json({ rule });
});

app.post("/evaluate_rule", async (req, res) => {
  const { ruleId, data } = req.body;

  const ruleDoc = await Rule.findById(ruleId);
  if (!ruleDoc) {
    return res.status(404).json({ error: "Rule not found" });
  }

  if (!ruleDoc.ast || !ruleDoc.ast.event || !ruleDoc.ast.conditions) {
    return res.status(400).json({
      error: "Rule is missing the required 'conditions' or 'event' properties",
    });
  }

  const engine = new Engine();

  try {
    engine.addRule(ruleDoc.ast);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  engine
    .run(data)
    .then(({ events }) => {
      if (events.length > 0) {
        res.json({ eligible: true });
      } else {
        res.json({ eligible: false });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.get("/rules", async (req, res) => {
  try {
    const rules = await Rule.find({});
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose
  .connect("mongodb://mongo:27017/rule-engine-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

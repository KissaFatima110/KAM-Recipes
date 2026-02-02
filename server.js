const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// ================================
// SAMPLE RECIPE DATA
// ================================
const recipes = [
  {
    id: "1",
    name: "Spaghetti Carbonara",
    ingredients: "Spaghetti, eggs, pancetta, parmesan, black pepper",
    instructions: "Cook pasta, fry pancetta, mix with eggs and cheese.",
    tips: "Use freshly grated parmesan.",
    note: "Classic Italian comfort food."
  },
  {
    id: "2",
    name: "Chicken Tikka Masala",
    ingredients: "Chicken, yogurt, spices, tomato sauce, cream",
    instructions: "Marinate chicken, grill, simmer in sauce.",
    tips: "Marinate overnight for best flavor.",
    note: "Rich and creamy Indian dish."
  }
];

// ================================
// VIEW RECIPES
// ================================

// Get all recipes
app.get("/recipes", (req, res) => {
  res.json(recipes);
});

// Get recipe by ID
app.get("/recipes/:id", (req, res) => {
  const recipe = recipes.find(r => r.id === req.params.id);
  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }
  res.json(recipe);
});

// ================================
// SEND RECIPES BY EMAIL
// ================================
app.post("/send-recipes", async (req, res) => {
  const { email, cart } = req.body;

  if (!email || !cart || cart.length === 0) {
    return res.status(400).json({ success: false, error: "Invalid request" });
  }

  let message = cart.map((r, i) => `
${i + 1}. ${r.name || "Recipe"}

INGREDIENTS:
${r.ingredients || "Not available"}

INSTRUCTIONS:
${r.instructions || "No instructions provided."}

TIPS:
${r.tips || "No tips available."}

NOTE:
${r.note || "Cook with love and passion!"}

`).join("\n----------------------------------\n");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourgmail@gmail.com",   // ⚠️ hardcoded
        pass: "yourapppassword"        // ⚠️ hardcoded
      }
    });

    await transporter.sendMail({
      from: "KAM Recipes <yourgmail@gmail.com>",
      to: email,
      subject: "Your Recipe from KAM Recipes 🍽️",
      text: message
    });

    res.json({ success: true });

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================================
// START SERVER
// ================================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});









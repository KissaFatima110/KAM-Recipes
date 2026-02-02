// ================================
// GET RECIPE SLUG FROM URL
// ================================
const params = new URLSearchParams(window.location.search);
const recipeSlug = params.get("id"); // e.g. "chicken-biryani"

// Store the currently opened recipe
let currentRecipe = null;

// ================================
// FETCH RECIPES & DISPLAY ONE
// ================================
fetch("recipes.json")
  .then(res => res.json())
  .then(data => {
    const recipe = data.find(r =>
      r.title.toLowerCase().replace(/\s+/g, "-") === recipeSlug
    );

    if (!recipe) {
      document.getElementById("title").textContent = "Recipe not found";
      return;
    }

    // Save recipe for email sending
    currentRecipe = recipe;

    // TITLE
    document.getElementById("title").textContent = recipe.title;

    // INGREDIENTS
    const ingredientsList = document.getElementById("ingredients");
    ingredientsList.innerHTML = "";
    recipe.ingredients.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ingredientsList.appendChild(li);
    });

    // INSTRUCTIONS
    document.getElementById("instructions").textContent = recipe.instructions;

    // TIPS
    document.getElementById("tips").textContent =
      recipe.tips || "No tips available for this recipe.";

    // Chef's Note (with fallback for motivation)
    document.getElementById("note").textContent =
      recipe.note || recipe.motivation || "Cook with love and passion — every dish tells a story!";
  })
  .catch(err => {
    console.error("Error loading recipe:", err);
    document.getElementById("title").textContent = "Error loading recipe";
  });

// ================================
// SEND FULL RECIPE TO EMAIL
// ================================
function sendRecipes() {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("⚠️ Please enter your email");
    return;
  }

  if (!currentRecipe) {
    alert("⚠️ Recipe not loaded yet");
    return;
  }

  // Send FULL recipe (matches backend expectations)
  const recipeForEmail = [{
    name: currentRecipe.title,
    ingredients: currentRecipe.ingredients.join(", "),
    instructions: currentRecipe.instructions,
    tips: currentRecipe.tips || "No tips available.",
    note: currentRecipe.note || currentRecipe.motivation || "Cook with love and passion — every dish tells a story!"
  }];

  fetch("http://localhost:3000/send-recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      cart: recipeForEmail
    })
  })
    .then(async res => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Server error while sending recipe");
      }
      alert("📧 Full recipe sent to your email successfully!");
    })
    .catch(err => {
      console.error("Recipe email error:", err);
      alert(`❌ Failed to send email. ${err.message || "Please try again later."}`);
    });
}

// ================================
// SEND FEEDBACK (Frontend only)
// ================================
function sendFeedback() {
  const feedback = document.getElementById("feedback").value;

  if (!feedback.trim()) {
    alert("⚠️ Please enter your feedback before submitting.");
    return;
  }

  // Show professional popup without backend call
  alert("✅ Thank you! Your feedback has been submitted successfully. We appreciate your input.");

  // Clear the input after showing popup
  document.getElementById("feedback").value = "";
}







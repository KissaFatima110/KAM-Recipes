const recipeContainer = document.getElementById("recipeContainer");

/* =======================
   RECIPE DATA (for cards only)
   Full details are in recipes.json
======================= */
const recipes = [
    { id: 1, title: "Chicken Biryani", category: "asian" },
    { id: 2, title: "Beef Korma", category: "asian" },
    { id: 3, title: "Chowmein", category: "asian" },
    { id: 4, title: "Chicken Karahi", category: "asian" },
    { id: 5, title: "Spring Rolls", category: "quick" },
    { id: 6, title: "Egg Fried Rice", category: "asian" },

    { id: 7, title: "Pizza Margherita", category: "italian" },
    { id: 8, title: "Lasagna", category: "italian" },
    { id: 9, title: "Alfredo Pasta", category: "italian" },
    { id: 10, title: "Caprese Salad", category: "italian" },
    { id: 11, title: "Cannelloni", category: "italian" },

    { id: 12, title: "Chicken Tacos", category: "mexican" },
    { id: 13, title: "Quesadillas", category: "mexican" },
    { id: 14, title: "Chilaquiles", category: "mexican" },
    { id: 15, title: "Enchiladas Mole", category: "mexican" },

    { id: 16, title: "Kheer", category: "desserts" },
    { id: 17, title: "Gulab Jamun", category: "desserts" },
    { id: 18, title: "Cheesecake", category: "desserts" },
    { id: 19, title: "Oreo Cake", category: "desserts" },
    { id: 20, title: "Vanilla Custard", category: "desserts" },
    { id: 21, title: "Strawberry Ice Cream", category: "desserts" },
    { id: 22, title: "Butterscotch Pudding", category: "desserts" },

    { id: 23, title: "Espresso", category: "beverages" },
    { id: 24, title: "Latte", category: "beverages" },
    { id: 25, title: "Hot Chocolate", category: "beverages" },
    { id: 26, title: "Mango Peach Delight", category: "beverages" },
    { id: 27, title: "Pomegranate Power", category: "beverages" },
    { id: 28, title: "Cucumber Cooler", category: "beverages" },
    { id: 29, title: "Berry Burst", category: "quick" },
    { id: 30, title: "Pineapple Punch", category: "quick" }
];

/* =======================
   IMAGES
======================= */
const images = [];
for (let i = 1; i <= 30; i++) {
    images.push(`images/${i}.jpg`);
}

/* =======================
   Helper: Slugify title
======================= */
function slugify(title) {
    return title.toLowerCase().replace(/\s+/g, "-");
}

/* =======================
   OPEN RECIPE (redirect to detail page)
======================= */
function openRecipe(recipeTitle) {
    const slug = slugify(recipeTitle);
    window.location.href = `recipe.html?id=${slug}`;
}

/* =======================
   GENERATE CARDS
======================= */
function generateCards(filter = "all") {
    recipeContainer.innerHTML = "";

    recipes.forEach((recipe, index) => {
        if (filter === "all" || recipe.category === filter) {
            const card = document.createElement("div");
            card.className = "recipe-card";

            card.innerHTML = `
                <span class="favorite-heart">&#9825;</span>
                <img src="${images[index % images.length]}" alt="${recipe.title}">
                <div class="card-info">
                    <p class="card-tag">${recipe.category}</p>
                    <h3>${recipe.title}</h3>
                    <button>View Recipe</button>
                </div>
            `;

            // Favorite toggle
            const heart = card.querySelector(".favorite-heart");
            heart.addEventListener("click", () => {
                heart.classList.toggle("active");
                heart.innerHTML = heart.classList.contains("active") ? "&#10084;" : "&#9825;";
            });

            // Click actions (pass title instead of numeric ID)
            card.querySelector("img").addEventListener("click", () => openRecipe(recipe.title));
            card.querySelector("button").addEventListener("click", () => openRecipe(recipe.title));
            card.querySelector(".card-tag").addEventListener("click", () => openRecipe(recipe.title));

            recipeContainer.appendChild(card);
        }
    });
}

/* =======================
   CATEGORY FILTER
======================= */
document.querySelectorAll(".sub-navbar a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        generateCards(link.dataset.category);
    });
});

/* =======================
   SEARCH
======================= */
document.getElementById("recipeSearch").addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll(".recipe-card").forEach(card => {
        const title = card.querySelector("h3").innerText.toLowerCase();
        card.style.display = title.includes(term) ? "flex" : "none";
    });
});

/* =======================
   INITIAL LOAD
======================= */
generateCards();


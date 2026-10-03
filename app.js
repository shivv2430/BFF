// BFF: Build For a Friend — Simple Application Script

// --- 1. Tab Switching Function ---
function showTab(tabId) {
  // Hide all panels
  const panels = document.querySelectorAll('.idea-panel');
  panels.forEach(panel => {
    panel.style.display = 'none';
    panel.classList.remove('active');
  });

  // Remove active class from all buttons
  const buttons = document.querySelectorAll('.tab-button');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Show the selected panel
  const selectedPanel = document.getElementById(tabId);
  if (selectedPanel) {
    selectedPanel.style.display = 'block';
    selectedPanel.classList.add('active');
  }

  // Highlight the clicked tab button
  event.target.classList.add('active');
}

// --- 2. Idea 1: Roommate Allergy Meal Planner ---
const MEALS_DATABASE = [
  {
    name: "Crispy Sweet Potato & Black Bean Tacos",
    allergens: [], // Free of peanuts, gluten, dairy
    description: "Corn tortillas with avocado and black beans. 100% safe for Alex!"
  },
  {
    name: "Coconut Thai Curry with Rice Noodles",
    allergens: [], // Nut-free, uses sesame tahini instead of peanut
    description: "Creamy coconut milk and vegetables. Uses sesame instead of peanut butter."
  },
  {
    name: "Chicken & Wild Rice Herb Soup",
    allergens: [], 
    description: "Warm broth, carrots, celery and wild rice. Naturally gluten-free."
  },
  {
    name: "Avocado Sourdough Toast with Olive Oil",
    allergens: ["gluten"],
    description: "Contains gluten from the wheat bread. Alex needs certified gluten-free loaf."
  },
  {
    name: "Dark Chocolate Sunflower Butter Cups",
    allergens: [],
    description: "Tastes just like peanut butter cups, but 100% peanut-free!"
  },
  {
    name: "Garlic Butter Shrimp Skillet",
    allergens: ["dairy"],
    description: "Cooked in dairy butter. Swap for olive oil if Alex is dairy-free."
  }
];

function filterMeals() {
  const checkPeanuts = document.getElementById('allergy-peanuts').checked;
  const checkGluten = document.getElementById('allergy-gluten').checked;
  const checkDairy = document.getElementById('allergy-dairy').checked;

  const resultsDiv = document.getElementById('meal-results');
  resultsDiv.innerHTML = '';

  let safeCount = 0;

  MEALS_DATABASE.forEach(meal => {
    // Check if this meal hits any selected allergy
    const hasPeanut = checkPeanuts && meal.allergens.includes('peanuts');
    const hasGluten = checkGluten && meal.allergens.includes('gluten');
    const hasDairy = checkDairy && meal.allergens.includes('dairy');

    const isConflict = hasPeanut || hasGluten || hasDairy;

    if (!isConflict) {
      safeCount++;
    }

    const card = document.createElement('div');
    card.className = 'meal-card';
    card.innerHTML = `
      <h4>${meal.name}</h4>
      <span class="meal-badge ${isConflict ? 'badge-danger' : 'badge-safe'}">
        ${isConflict ? '⚠️ Contains Allergen' : '🛡️ Safe for Alex'}
      </span>
      <p class="meal-desc">${meal.description}</p>
    `;
    resultsDiv.appendChild(card);
  });

  const msg = document.getElementById('meal-message');
  if (msg) {
    msg.textContent = `${safeCount} out of ${MEALS_DATABASE.length} meals are safe for Alex!`;
  }
}

function pickRandomSafeMeal() {
  const checkPeanuts = document.getElementById('allergy-peanuts').checked;
  const checkGluten = document.getElementById('allergy-gluten').checked;
  const checkDairy = document.getElementById('allergy-dairy').checked;

  const safeMeals = MEALS_DATABASE.filter(meal => {
    const hasPeanut = checkPeanuts && meal.allergens.includes('peanuts');
    const hasGluten = checkGluten && meal.allergens.includes('gluten');
    const hasDairy = checkDairy && meal.allergens.includes('dairy');
    return !hasPeanut && !hasGluten && !hasDairy;
  });

  if (safeMeals.length > 0) {
    const randomPick = safeMeals[Math.floor(Math.random() * safeMeals.length)];
    alert(`🎉 Tonight's Dinner Pick for Alex:\n\n"${randomPick.name}"\n${randomPick.description}`);
  } else {
    alert("No safe meals found with all those active allergies. Try unchecking one!");
  }
}

// --- 3. Idea 2: Patient Practice Partner ---
function sendMateoMessage(spanishText, englishText) {
  const chatBox = document.getElementById('chat-box');
  
  // Add Mateo's message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `<strong>Mateo:</strong> ${spanishText} <span class="translation">(${englishText})</span>`;
  chatBox.appendChild(userMsg);

  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;

  // Bot replies with patience after a short delay
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot';
    botMsg.innerHTML = `<strong>Café Bot ☕:</strong> ¡Marchando! Aquí tienes tu bebida bien calentita. ¡Buen trabajo con tu español! 
    <span class="translation">(Coming right up! Here is your warm drink. Great job with your Spanish!)</span>`;
    chatBox.appendChild(botMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Encouragement tip
    const encouragement = document.getElementById('partner-encouragement');
    if (encouragement) {
      encouragement.innerHTML = `💖 <strong>Coach note for Mateo:</strong> You asked clearly and the barista understood right away! Confidence +10.`;
    }
  }, 600);
}

function handleCustomChat(event) {
  event.preventDefault();
  const input = document.getElementById('custom-message');
  const text = input.value.trim();
  if (!text) return;

  sendMateoMessage(text, "custom message");
  input.value = '';
}

// --- 4. Idea 3: Grandpa's Voice Memo Recipe Book ---
let memoTimer = null;
let isMemoPlaying = false;
let currentMemoStep = 0;

const MEMO_LINES = [
  "Grandpa: 'Alright kiddo, you asked for the Sunday gravy recipe. First rule: do NOT rush the onions.'",
  "Grandpa: 'Your cousin Tommy turned the stove on high and burnt it. Keep it on low heat, nice and slow.'",
  "Grandpa: 'Dice one sweet yellow onion, sweat it in good olive oil for 20 minutes until it looks like gold.'",
  "Grandpa: 'And don't forget to toss the hard Parmesan cheese rind right into the sauce to melt. That's the secret!'"
];

function playVoiceMemo() {
  const btn = document.getElementById('btn-play-memo');
  const transcriptBox = document.getElementById('memo-transcript-box');

  if (isMemoPlaying) {
    clearInterval(memoTimer);
    isMemoPlaying = false;
    btn.textContent = "▶️ Resume Memo";
    return;
  }

  isMemoPlaying = true;
  btn.textContent = "⏸️ Pause Memo";
  transcriptBox.innerHTML = `<p>🎙️ <em>Listening to Grandpa Joe...</em></p>`;

  memoTimer = setInterval(() => {
    if (currentMemoStep < MEMO_LINES.length) {
      transcriptBox.innerHTML = `<p>${MEMO_LINES[currentMemoStep]}</p>`;
      currentMemoStep++;
    } else {
      clearInterval(memoTimer);
      isMemoPlaying = false;
      currentMemoStep = 0;
      btn.textContent = "🔄 Replay Memo";
      transcriptBox.innerHTML = `<p>✨ <em>Grandpa's memo finished. The family recipe card below is ready!</em></p>`;
    }
  }, 2200);
}

function copyRecipeCard() {
  const text = `GRANDPA JOE'S SUNDAY SAUCE RECIPE:
1. Cook diced yellow onions in olive oil on the lowest flame for 20 minutes.
2. Add tomatoes, garlic, and drop the dry Parmesan cheese rind into the sauce.
3. Simmer slow, and test with sourdough bread before serving!`;

  navigator.clipboard.writeText(text).then(() => {
    alert("Grandpa's recipe copied to your clipboard! 🍝");
  });
}

// --- 5. Project Creator & LocalStorage ---
const DEFAULT_PROJECTS = [
  {
    id: 1,
    person: "Alex (Roommate)",
    problem: "Has severe peanut & gluten allergies, so finding shared dinners is stressful.",
    solution: "A simple 1-click meal planner that only shows recipes Alex can safely eat.",
    touch: "Sound effect plays when a recipe is 100% safe.",
    gifted: false
  },
  {
    id: 2,
    person: "Mateo (Best Friend)",
    problem: "Moving to Spain and freezes up when trying to order drinks at a café.",
    solution: "A zero-pressure chat partner that practices conversational phrases with him.",
    touch: "Custom cheer message celebrating each phrase.",
    gifted: false
  },
  {
    id: 3,
    person: "Grandpa Joe (Family)",
    problem: "Leaves 8-minute WhatsApp voice memos with family cooking secrets that get lost.",
    solution: "A tool that turns his voice notes into a printed recipe card.",
    touch: "Made in a retro 1968 index card style.",
    gifted: true
  }
];

function getProjects() {
  const saved = localStorage.getItem('bff_projects_list');
  if (!saved) {
    localStorage.setItem('bff_projects_list', JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return DEFAULT_PROJECTS;
  }
}

function saveProjects(list) {
  localStorage.setItem('bff_projects_list', JSON.stringify(list));
  renderProjects();
}

function renderProjects() {
  const list = getProjects();
  const container = document.getElementById('projects-list');
  const countSpan = document.getElementById('project-count');

  if (countSpan) {
    countSpan.textContent = list.length;
  }

  if (!container) return;
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No projects saved yet! Fill out the form above to plan a gift for someone.</p>
      </div>
    `;
    return;
  }

  list.forEach(project => {
    const card = document.createElement('div');
    card.className = `project-card ${project.gifted ? 'gifted' : ''}`;
    card.innerHTML = `
      <div>
        <div class="project-card-header">
          <span class="project-person">💛 For: ${project.person}</span>
          <span>${project.gifted ? '🎁 Given as Gift!' : '🔨 In Progress'}</span>
        </div>
        <h4 class="project-title">${project.solution}</h4>
        <p class="project-problem"><strong>Their struggle:</strong> ${project.problem}</p>
        ${project.touch ? `<div class="project-touch">"✨ ${project.touch}"</div>` : ''}
      </div>

      <div class="project-card-footer">
        <button class="btn btn-secondary btn-sm" onclick="toggleGifted(${project.id})">
          ${project.gifted ? '↩️ Mark in progress' : '🎁 Mark as Gifted!'}
        </button>
        <button class="btn-delete" onclick="deleteProject(${project.id})" title="Delete project">
          🗑️ Remove
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function handleCreateProject(event) {
  event.preventDefault();

  const person = document.getElementById('input-person').value.trim();
  const problem = document.getElementById('input-problem').value.trim();
  const solution = document.getElementById('input-solution').value.trim();
  const touch = document.getElementById('input-touch').value.trim();

  if (!person || !problem || !solution) return;

  const list = getProjects();
  const newProject = {
    id: Date.now(),
    person: person,
    problem: problem,
    solution: solution,
    touch: touch,
    gifted: false
  };

  list.unshift(newProject);
  saveProjects(list);

  // Clear inputs
  document.getElementById('create-project-form').reset();
  alert(`Saved! You're ready to build "${solution}" for ${person}! 🚀`);

  // Scroll to projects list
  document.getElementById('my-projects').scrollIntoView({ behavior: 'smooth' });
}

function toggleGifted(id) {
  const list = getProjects();
  const project = list.find(p => p.id === id);
  if (project) {
    project.gifted = !project.gifted;
    saveProjects(list);
  }
}

function deleteProject(id) {
  if (confirm("Are you sure you want to remove this project idea?")) {
    const list = getProjects().filter(p => p.id !== id);
    saveProjects(list);
  }
}

function fillExampleProject() {
  document.getElementById('input-person').value = "My Mom";
  document.getElementById('input-problem').value = "She loves her potted herbs on the balcony but constantly forgets when she last watered the basil.";
  document.getElementById('input-solution').value = "A 1-button reminder page with photos of her basil and rosemary.";
  document.getElementById('input-touch').value = "Shows a cute picture of our family dog when all herbs are checked off.";
}

// --- 6. Initialize Page on Load ---
document.addEventListener('DOMContentLoaded', () => {
  filterMeals();
  renderProjects();
});

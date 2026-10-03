// BFF (Build For a Friend) - Core Seed & Inspiration Data

const STARTER_RECIPES = [
  {
    id: "r1",
    title: "Crispy Sweet Potato & Black Bean Tacos",
    time: "quick",
    prepTime: "15 mins",
    allergens: [], // Free of peanuts, gluten, dairy, shellfish
    tags: ["Vegetarian", "Gluten-Free", "Nut-Free"],
    story: "Alex's absolute favorite late-night craving, perfected with warm corn tortillas.",
    ingredients: ["Corn tortillas (100% certified GF)", "Black beans", "Roasted sweet potatoes", "Avocado salsa", "Lime & cilantro"],
    alexSafetyNotes: "100% Safe! Corn tortillas are naturally gluten-free and zero nut cross-contact."
  },
  {
    id: "r2",
    title: "Creamy Coconut Thai Red Curry Noodle Bowl",
    time: "dinner",
    prepTime: "25 mins",
    allergens: [], // Nut-free, peanut-free, dairy-free
    tags: ["Dairy-Free", "Nut-Free", "Comfort Food"],
    story: "Traditional satay uses peanut butter, but this recipe swaps in toasted sesame butter (Tahini) for total peace of mind.",
    ingredients: ["Rice noodles", "Coconut milk", "Thai red curry paste", "Tofu or chicken", "Bok choy", "Toasted sesame oil"],
    alexSafetyNotes: "Safe! Uses pure sunflower/sesame butter instead of crushed peanuts."
  },
  {
    id: "r3",
    title: "Grandma's Golden Chicken & Wild Rice Soup",
    time: "dinner",
    prepTime: "30 mins",
    allergens: [], 
    tags: ["Warm & Cozy", "Gluten-Free", "Nut-Free"],
    story: "Made with aromatic mirepoix, wild brown rice, and rosemary broth when Alex had the flu in November.",
    ingredients: ["Shredded rotisserie chicken", "Wild brown rice", "Carrots, celery, onion", "Herbed vegetable broth", "Lemon zest"],
    alexSafetyNotes: "100% Safe. No wheat flour thickeners; starch from rice creates natural silkiness."
  },
  {
    id: "r4",
    title: "10-Minute Dark Chocolate & SunButter Cups",
    time: "snack",
    prepTime: "10 mins",
    allergens: [],
    tags: ["Sweet Tooth", "Peanut-Free Copycat"],
    story: "Alex missed Reese's cups so badly after the allergy diagnosis. This sunflower seed version blew their mind.",
    ingredients: ["Organic Sunflower Seed Butter", "Dark dairy-free chocolate chips", "A pinch of Maldon flaky salt", "Pure maple syrup"],
    alexSafetyNotes: "100% Safe! Manufactured in a dedicated peanut-free and tree-nut-free facility."
  },
  {
    id: "r5",
    title: "Garlic Butter Shrimp Zucchini Ribbons",
    time: "dinner",
    prepTime: "20 mins",
    allergens: ["shellfish", "dairy"], // Has shellfish and dairy
    tags: ["Keto-Friendly", "Rich & Savory"],
    story: "Amazing dish, but requires caution if shellfish or dairy allergies are active.",
    ingredients: ["Fresh wild shrimp", "Zucchini ribbons", "Grass-fed butter", "Minced garlic", "Parsley & white wine"],
    alexSafetyNotes: "⚠️ WARNING: Contains Shellfish and Dairy. Swap shrimp for chicken & butter for olive oil if needed."
  },
  {
    id: "r6",
    title: "Rustic Sourdough Avocado Toast with Za'atar",
    time: "snack",
    prepTime: "5 mins",
    allergens: ["gluten"], // Contains gluten
    tags: ["Quick Crunch"],
    story: "Tasty quick bite for roommate who can tolerate gluten, or use certified GF artisan loaf for Alex.",
    ingredients: ["Rustic artisan sourdough", "Hass avocado", "Za'atar spices", "Cold-pressed olive oil", "Chili flakes"],
    alexSafetyNotes: "⚠️ Contains Gluten: Must use Alex's toaster and dedicated gluten-free sourdough loaf."
  }
];

const LANGUAGE_SCENARIOS = {
  cafe: {
    title: "Ordering at a bustling café",
    goal: "Order a café con leche with oat milk, and ask if they have gluten-free pastries.",
    promptSpeaker: "Barista Carlos",
    messages: [
      {
        speaker: "Barista Carlos ☕",
        es: "¡Hola buenas! ¿Qué te pongo hoy, amigo?",
        en: "Hello there! What can I get you today, my friend?",
        tips: "Keep it simple. You can say 'Un café con leche, por favor'."
      }
    ],
    replies: [
      {
        text: "Un café con leche de avena, por favor.",
        en: "A coffee with oat milk, please.",
        botResponse: "¡Marchando! Con leche de avena calentita. ¿Quieres algo para picar?",
        botEn: "Coming right up! With warm oat milk. Would you like a snack to eat?",
        coachTip: "¡Genial! Perfect pronunciation of 'café con leche'. You sounded like a native local!"
      },
      {
        text: "¿Tienen algún pastel o croissant sin gluten?",
        en: "Do you have any gluten-free cake or pastry?",
        botResponse: "Sí, tenemos una tarta de almendras deliciosa sin gluten. ¿Te la pongo?",
        botEn: "Yes, we have a delicious gluten-free almond cake. Shall I get you a slice?",
        coachTip: "Super helpful phrase! Using 'sin gluten' is clear and instantly understood anywhere in Spain."
      },
      {
        text: "¿Cuánto es en total con la tarjeta?",
        en: "How much is that in total with card?",
        botResponse: "Son dos con cincuenta euros. Puedes acercar la tarjeta cuando quieras.",
        botEn: "That's 2.50 euros. You can tap your card whenever you're ready.",
        coachTip: "Smooth transaction phrase! You mastered the entire café interaction without breaking a sweat."
      }
    ]
  },
  market: {
    title: "Asking for fresh produce at the market",
    goal: "Buy half a kilo of sweet strawberries and ask if the avocados are ripe today.",
    promptSpeaker: "Frutera Elena",
    messages: [
      {
        speaker: "Elena del Mercado 🍓",
        es: "¡Dime cariño! ¿Qué fruta rica te llevas hoy?",
        en: "Tell me darling! What tasty fruit are you taking home today?",
        tips: "Use 'medio kilo' for 500 grams."
      }
    ],
    replies: [
      {
        text: "Medio kilo de fresas bien dulces, por favor.",
        en: "Half a kilo of sweet strawberries, please.",
        botResponse: "¡Mira qué color tienen! Te pongo las más frescas de la huerta.",
        botEn: "Look at this color! I'll pick the freshest ones from the farm.",
        coachTip: "Spot on! In Spain market vendors love friendly direct orders."
      },
      {
        text: "¿Los aguacates están listos para comer hoy?",
        en: "Are the avocados ready to eat today?",
        botResponse: "Estos dos están en su punto perfecto, mantequilla pura.",
        botEn: "These two are at their absolute peak, pure butter.",
        coachTip: "Asking 'listos para comer' is way more natural than asking if they are ripe!"
      }
    ]
  },
  metro: {
    title: "Getting lost in the metro station",
    goal: "Ask which line goes to Sol station without feeling embarrassed.",
    promptSpeaker: "Metro Assistant",
    messages: [
      {
        speaker: "Asistente Metro 🚇",
        es: "Disculpa, ¿necesitas ayuda con tu trayecto?",
        en: "Excuse me, do you need help with your route?",
        tips: "Start with 'Perdona' (informal) or 'Perdone' (formal)."
      }
    ],
    replies: [
      {
        text: "Perdona, ¿para ir a Sol tengo que hacer transbordo?",
        en: "Excuse me, to go to Sol do I have to transfer lines?",
        botResponse: "No, la Línea 1 azul te lleva directo en cuatro paradas.",
        botEn: "No, the blue Line 1 takes you directly in four stops.",
        coachTip: "Brilliant! 'Hacer transbordo' is the exact local term for transferring trains."
      }
    ]
  },
  smalltalk: {
    title: "Casual elevator small talk",
    goal: "Compliment your neighbor's dog and talk about the autumn weather.",
    promptSpeaker: "Vecina Lucía",
    messages: [
      {
        speaker: "Vecina Lucía 🐕",
        es: "¡Vaya día de lluvia que tenemos hoy, eh!",
        en: "What a rainy day we're having today, huh!",
        tips: "Acknowledge the weather or ask about the dog."
      }
    ],
    replies: [
      {
        text: "¡Sí, no para de llover! Pero qué perrito más simpático tienes.",
        en: "Yes, it won't stop raining! But what a lovely dog you have.",
        botResponse: "¡Se llama Rocky! Le encanta la gente simpática.",
        botEn: "His name is Rocky! He loves kind people.",
        coachTip: "Warm and charming! Neighbor small talk unlocked."
      }
    ]
  }
};

const GRANDPA_TRANSCRIPTS = [
  {
    sec: 0,
    text: "So listen, honey... You asked about the Sunday gravy. First thing, you do NOT touch high heat."
  },
  {
    sec: 5,
    text: "Your cousin Tommy used to crank the stove to 8. Burnt garlic tastes like dirty pennies, okay? Keep it on 2."
  },
  {
    sec: 12,
    text: "You take one big sweet yellow onion. Dice it nice and fine. Olive oil—good olive oil—coat the bottom of the Dutch oven."
  },
  {
    sec: 18,
    text: "Let that onion sweat for 20 minutes until it looks like spun gold and smells like heaven. Don't rush it."
  },
  {
    sec: 24,
    text: "And here's the family secret your Aunt Rosa never told anyone: toss the Parmesan cheese rind right into the sauce to melt slow."
  }
];

const COMMUNITY_PROJECTS = [
  {
    id: "cp-1",
    name: "Roommate Allergy-Safe Kitchen Board",
    recipient: "Alex (Roommate)",
    relation: "Roommate",
    category: "Micro-Tool",
    quote: "A meal planner that knows your roommate's allergies so we stop debating takeout for an hour.",
    scope: [
      "Allergy cross-checker for nuts and gluten",
      "One-click safe grocery list",
      "Dinner decider wheel"
    ],
    touch: "Sound effect plays when an allergy-safe dinner is chosen: 'Alex Approved!'",
    builtIn: "1 Afternoon",
    delivered: true,
    likes: 342
  },
  {
    id: "cp-2",
    name: "Patient Spanish Practice Partner",
    recipient: "Mateo (Best Friend)",
    relation: "Best Friend",
    category: "Practice Buddy",
    quote: "A patient practice partner for a friend learning a new language before moving abroad.",
    scope: [
      "Realistic café and market dialogue simulations",
      "Gentle pronunciation playback",
      "Zero pressure confidence-meter"
    ],
    touch: "Custom cheerleader notes celebrating every attempt.",
    builtIn: "4 Hours",
    delivered: true,
    likes: 421
  },
  {
    id: "cp-3",
    name: "Grandpa Joe's Audio Recipe Book",
    recipient: "Grandpa Joe (Age 84)",
    relation: "Parent / Grandparent",
    category: "Personal Keepsake",
    quote: "A tool that turns your grandpa's rambling voice memos into a printable family recipe book.",
    scope: [
      "Audio transcription extractor",
      "Heirloom vintage recipe card formatter",
      "Secret family tips & lore highlighter"
    ],
    touch: "Preserves his exact jokes and voice clips alongside the measurements.",
    builtIn: "1 Weekend",
    delivered: true,
    likes: 512
  },
  {
    id: "cp-4",
    name: "Dad's Backyard Birdsong Identifier",
    recipient: "Dad (Age 62)",
    relation: "Parent / Grandparent",
    category: "Micro-Tool",
    quote: "Dad loves spotting cardinals but has bad eyesight for small phone apps.",
    scope: [
      "Giant high-contrast buttons",
      "Plays real backyard audio bird calls",
      "One-tap 'Spotted Today!' journal"
    ],
    touch: "Includes a photo of his favorite wooden birdhouse in the banner.",
    builtIn: "3 Hours",
    delivered: true,
    likes: 219
  },
  {
    id: "cp-5",
    name: "Sister's Bar Exam Hype Machine",
    recipient: "Priya (Sister)",
    relation: "Sibling",
    category: "Inside Joke App",
    quote: "My sister was studying 12 hours a day and crying from stress.",
    scope: [
      "Giant red button: 'Emergency Pep Talk'",
      "Plays 10-second voice memos from mom, dad, and her cat",
      "Count-down to freedom pizza party"
    ],
    touch: "A tiny dancing cartoon of her wearing a judge's wig.",
    builtIn: "2 Hours",
    delivered: true,
    likes: 388
  },
  {
    id: "cp-6",
    name: "Partner's Migraine Dark-Mode Sanctuary",
    recipient: "Sam (Partner)",
    relation: "Partner",
    category: "Micro-Tool",
    quote: "Sam gets severe migraines from screen glare but needs to track symptoms for the neurologist.",
    scope: [
      "Ultra-low nits pure black OLED UI",
      "One-tap icon logging without bright popups",
      "Doctor-friendly summary export"
    ],
    touch: "Haptic vibration feedback instead of loud sounds.",
    builtIn: "5 Hours",
    delivered: true,
    likes: 467
  }
];

const IDEA_SPARKS_MAP = {
  "Roommate": [
    {
      title: "The Zero-Friction Chore Roulette",
      scope: ["Fair randomized chore picker with funny consequences", "Tracks who bought toilet paper last", "Celebratory gif when trash is taken out"],
      touch: "Includes soundboard of roommate's favorite meme sounds."
    },
    {
      title: "Shared Kitchen Allergy & Snack Decider",
      scope: ["Safe food scanner tailored to their specific allergy", "Quick pantry inventory tracker", "Late night shared recipe recommendations"],
      touch: "Golden badge for '100% Allergy Certified Safe'."
    },
    {
      title: "Quiet Hours 'Are You Awake?' Beacon",
      scope: ["Simple one-click status (Sleeping / Studying / Open for tea)", "No loud notifications", "Tea kettle invite button"],
      touch: "Cute sleeping kitten avatar that snores softly."
    }
  ],
  "Best Friend": [
    {
      title: "The Friday Night Movie Veto Decider",
      scope: ["Tinder-style swipe for movies both of you have queued", "Veto limit of 2 per person to prevent endless browsing", "Random takeout pairing suggestion"],
      touch: "Easter egg of your worst shared movie memory."
    },
    {
      title: "Friendship Habit & Streak High-Fiver",
      scope: ["One-tap 'Did you take your meds / go for your walk?'", "Zero toxic guilt mechanics", "Confetti explosion when you both hit a goal"],
      touch: "Personalized voice note unlocked on day 7."
    },
    {
      title: "Inside Joke Soundboard & Quote Vault",
      scope: ["Archive of funniest late-night group chat quotes", "Audio button sampler", "Search by year or road-trip"],
      touch: "Retro cassette tape aesthetic with custom tape labels."
    }
  ],
  "Partner": [
    {
      title: "The 'Where Should We Eat?' Solver",
      scope: ["Eliminates 'I don't know, what do you want?' loop", "Presents 3 curated local favorites based on weather & mood", "One-tap directions and phone call"],
      touch: "Automatically adds their favorite dessert spot as a stop."
    },
    {
      title: "Long-Distance Cozy Heartbeat Lamp Tool",
      scope: ["Tap screen to send soft glowing light to partner's phone", "Displays both time zones and weather side-by-side", "Virtual coffee date countdown"],
      touch: "Plays gentle lo-fi chime when they tap back."
    },
    {
      title: "Love Letter & Milestone Capsule",
      scope: ["Timeline of memorable trips and dates", "Secret hidden messages unlocked on specific calendar days", "Photo slideshow with your song"],
      touch: "Wax-seal animation when opening a love letter."
    }
  ],
  "Parent / Grandparent": [
    {
      title: "Grandpa's Voice Memo to Family Recipe Book",
      scope: ["WhatsApp audio file to formatted recipe converter", "Highlights grandfather's unique jokes and wisdom", "Printable one-page heirloom card"],
      touch: "Vintage handwritten recipe card aesthetic with grandpa's photo."
    },
    {
      title: "Tech Support Without Tears (Giant Button Guide)",
      scope: ["Huge high-contrast guides for FaceTime and WiFi", "One-tap video call connect to family members", "No confusing settings or small text"],
      touch: "Friendly family photos replace confusing tech icons."
    },
    {
      title: "Grandchild Photo Stream & Postcard Creator",
      scope: ["Auto-advancing fullscreen photo slideshow", "Leaves voice audio messages alongside pictures", "One-click 'Order physical print'"],
      touch: "Digital refrigerator magnet frame style."
    }
  ],
  "Sibling": [
    {
      title: "The Ultimate Sibling Scoreboard & Truce Machine",
      scope: ["Playful tracker for petty sibling debates", "Random referee decider with hilarious quotes", "Emergency peace offering coupon generator (e.g., 'Free Boba')"],
      touch: "Cites childhood arguments from 2012 for comedic effect."
    },
    {
      title: "Study Sprint & Hype Companion",
      scope: ["Pomodoro timer with custom sibling insults & encouragement", "Spotify lofi playlist sync", "Virtual snack break reminder"],
      touch: "Voice memo plays: 'Get off TikTok and study!' every 25 mins."
    }
  ],
  "Coworker": [
    {
      title: "The Meeting That Could Have Been An Email Checker",
      scope: ["3-question quiz before booking a calendar slot", "Generates concise bulleted email draft", "Calculates money and minutes saved for the team"],
      touch: "Celebratory 'You spared 5 people an hour of torture' trophy."
    },
    {
      title: "Coffee Run Order Collator",
      scope: ["Single shareable link for everyone's exact oat/syrup customizations", "Summarizes total cups and cost for the barista", "Venmo split integration"],
      touch: "Barista-friendly order ticket format."
    }
  ]
};

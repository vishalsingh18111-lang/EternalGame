/* =========================================
   ETERNAL GAMES — games.js
   Catalogue data. Add a game here and it shows up everywhere.
   Artwork lives in img/games/<slug>.jpg (+ img/games/thumb/<slug>.jpg)
   `tint` is the accent colour picked from the game's key art.
   ========================================= */
(function () {
  "use strict";

  var GAMES = [
    { id: 1,  slug: "shadow-realms",   title: "Shadow Realms",   genre: "RPG",           rating: 4.9, year: 2025, platform: "PC",          developer: "DarkForge Studios",   tint: "#9a6bff", featured: "Featured Game",  desc: "Dive into a dark fantasy RPG where every choice reshapes destiny. 100+ hours of epic storytelling." },
    { id: 2,  slug: "neon-pursuit",    title: "Neon Pursuit",    genre: "Racing",        rating: 4.7, year: 2026, platform: "PC",          developer: "SpeedCore Labs",      tint: "#ff3fb4", featured: "New Release",    desc: "High-speed futuristic racing through neon-lit megacities. Feel the rush at 300 km/h." },
    { id: 3,  slug: "iron-battalion",  title: "Iron Battalion",  genre: "Strategy",      rating: 4.8, year: 2025, platform: "PC",          developer: "WarMap Interactive",  tint: "#e0a04a", featured: "Top Rated",      desc: "Lead your squad through explosive tactical battles. Strategy meets action in the ultimate war game." },
    { id: 4,  slug: "void-frontier",   title: "Void Frontier",   genre: "Adventure",     rating: 4.6, year: 2024, platform: "PlayStation", developer: "Stellar Arc Games",   tint: "#5aa9ff", featured: "Staff Pick",     desc: "Explore uncharted alien worlds in this breathtaking space adventure." },
    { id: 5,  slug: "apex-blitz",      title: "Apex Blitz",      genre: "Battle Royale", rating: 4.5, year: 2025, platform: "PC",          developer: "StormByte Inc.",      tint: "#4f8cff", desc: "100 players enter, only one walks out. The most intense battle royale ever made." },
    { id: 6,  slug: "city-architect",  title: "City Architect",  genre: "Simulation",    rating: 4.4, year: 2024, platform: "PC",          developer: "BluePrint Digital",   tint: "#38bdf8", desc: "Build and manage sprawling cities in this in-depth urban simulation." },
    { id: 7,  slug: "thunder-kick",    title: "Thunder Kick",    genre: "Sports",        rating: 4.3, year: 2026, platform: "PlayStation", developer: "Goal Rush Studios",   tint: "#8b6cff", desc: "The most realistic football simulation with full career and multiplayer modes." },
    { id: 8,  slug: "dungeon-eclipse", title: "Dungeon Eclipse", genre: "RPG",           rating: 4.7, year: 2025, platform: "PC",          developer: "Mythic Gate Games",   tint: "#b06bff", desc: "Descend into ancient dungeons filled with treasures, traps, and terrifying bosses." },
    { id: 9,  slug: "steel-horizon",   title: "Steel Horizon",   genre: "Action",        rating: 4.6, year: 2026, platform: "Xbox",        developer: "IronCore Studios",    tint: "#ff8a3d", desc: "A cinematic action thriller set in a near-future dystopia. Explosive non-stop combat." },
    { id: 10, slug: "planet-dash",     title: "Planet Dash",     genre: "Racing",        rating: 4.2, year: 2023, platform: "Mobile",      developer: "Turbo Pixel Labs",    tint: "#4b8dff", desc: "Race across alien planets in gravity-defying vehicles. Pure arcade fun." },
    { id: 11, slug: "wild-jungle",     title: "Wild Jungle",     genre: "Adventure",     rating: 4.5, year: 2025, platform: "PlayStation", developer: "Terra Wild Studios",  tint: "#b7c940", desc: "Survive and explore a massive open-world jungle teeming with wildlife." },
    { id: 12, slug: "omni-strike",     title: "Omni Strike",     genre: "Battle Royale", rating: 4.4, year: 2024, platform: "PC",          developer: "Nexus Fire Games",    tint: "#ff9f1c", desc: "Squad-based battle royale with advanced weapon crafting and dynamic environments." },
    { id: 13, slug: "astro-builder",   title: "Astro Builder",   genre: "Simulation",    rating: 4.1, year: 2023, platform: "PC",          developer: "Cosmos Labs",         tint: "#4aa3ff", desc: "Build space stations and manage colonies across the solar system." },
    { id: 14, slug: "blaze-court",     title: "Blaze Court",     genre: "Sports",        rating: 4.0, year: 2024, platform: "Xbox",        developer: "Hoop Nation Studios", tint: "#ff6a1a", desc: "Street basketball with a fiery twist. Dunk, crossover, and dominate the court." },
    { id: 15, slug: "crimson-cross",   title: "Crimson Cross",   genre: "Action",        rating: 4.8, year: 2026, platform: "PC",          developer: "RedByte Interactive", tint: "#f0404d", featured: "Just Dropped",   desc: "High-octane action with deep skill trees and brutal combo systems." },
    { id: 16, slug: "quantum-quest",   title: "Quantum Quest",   genre: "RPG",           rating: 4.3, year: 2023, platform: "Mobile",      developer: "Pixel Horizon Games", tint: "#5b82ff", desc: "A mobile RPG with full controller support and console-quality graphics." }
  ];

  GAMES.forEach(function (game) {
    game.img = "img/games/" + game.slug + ".jpg";
    game.thumb = "img/games/thumb/" + game.slug + ".jpg";
  });

  // Order here is the order of the category tiles and genre chips
  var GENRES = [
    { name: "Action",        icon: "bi-lightning-charge-fill", tint: "#f0404d" },
    { name: "Adventure",     icon: "bi-compass-fill",          tint: "#5aa9ff" },
    { name: "RPG",           icon: "bi-shield-shaded",         tint: "#9a6bff" },
    { name: "Racing",        icon: "bi-speedometer2",          tint: "#ff3fb4" },
    { name: "Sports",        icon: "bi-trophy-fill",           tint: "#ff7a1a" },
    { name: "Strategy",      icon: "bi-flag-fill",             tint: "#e0a04a" },
    { name: "Battle Royale", icon: "bi-crosshair",             tint: "#4f8cff" },
    { name: "Simulation",    icon: "bi-buildings-fill",        tint: "#2ec4b6" }
  ];

  angular
    .module("eternalApp")
    .constant("GAMES", GAMES)
    .constant("GENRES", GENRES);
})();

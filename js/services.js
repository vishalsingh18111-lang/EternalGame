/* =========================================
   ETERNAL GAMES — services.js
   Shared state: storage, wishlist, ratings, toasts,
   catalogue filters and the two modals
   ========================================= */
(function () {
  "use strict";

  angular
    .module("eternalApp")

    /* ---- localStorage wrapper (never throws) ---- */
    .factory("Storage", function () {
      return {
        get: function (key, fallback) {
          try {
            var raw = window.localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
          } catch (e) {
            return fallback;
          }
        },
        set: function (key, value) {
          try {
            window.localStorage.setItem(key, JSON.stringify(value));
          } catch (e) { /* private mode / storage full: keep working in memory */ }
        }
      };
    })

    /* ---- Toast notifications ---- */
    .factory("Toast", ["$timeout", function ($timeout) {
      var service = {
        items: [],
        show: function (message, icon) {
          var toast = { message: message, icon: icon || "bi-check-circle-fill" };
          service.items.push(toast);
          if (service.items.length > 3) service.items.shift();
          $timeout(function () { service.dismiss(toast); }, 2800);
        },
        dismiss: function (toast) {
          var i = service.items.indexOf(toast);
          if (i > -1) service.items.splice(i, 1);
        }
      };
      return service;
    }])

    /* ---- Wishlist (saved as a list of game ids) ---- */
    .factory("Wishlist", ["GAMES", "Storage", "Toast", function (GAMES, Storage, Toast) {
      var KEY = "egs_wishlist";

      // The old site stored whole game objects; accept both shapes.
      var ids = Storage.get(KEY, [])
        .map(function (entry) { return entry && typeof entry === "object" ? entry.id : entry; })
        .filter(function (id) { return GAMES.some(function (g) { return g.id === id; }); });

      var service = {
        games: [],
        has: function (id) { return ids.indexOf(id) > -1; },
        count: function () { return ids.length; },
        toggle: function (game) {
          var i = ids.indexOf(game.id);
          if (i > -1) {
            ids.splice(i, 1);
            Toast.show(game.title + " removed from wishlist", "bi-heartbreak-fill");
          } else {
            ids.push(game.id);
            Toast.show(game.title + " added to wishlist", "bi-heart-fill");
          }
          sync();
        },
        clear: function () {
          ids.length = 0;
          sync();
          Toast.show("Wishlist cleared", "bi-trash3-fill");
        }
      };

      function sync() {
        Storage.set(KEY, ids);
        service.games = ids.map(function (id) {
          return GAMES.filter(function (g) { return g.id === id; })[0];
        });
      }
      sync();

      return service;
    }])

    /* ---- The visitor's own star ratings ---- */
    .factory("Ratings", ["Storage", function (Storage) {
      var KEY = "egs_ratings";
      var ratings = Storage.get(KEY, {});
      return {
        get: function (id) { return ratings[id] || 0; },
        set: function (id, value) {
          if (ratings[id] === value) delete ratings[id];
          else ratings[id] = value;
          Storage.set(KEY, ratings);
        },
        count: function () { return Object.keys(ratings).length; }
      };
    }])

    /* ---- Catalogue filters, shared by navbar search, categories and the grid ---- */
    .factory("CatalogueState", function () {
      // null (not "") so the <select>s fall back to their "All …" option
      var defaults = { query: "", genre: "", platform: null, year: null, minRating: null, sort: "featured" };
      var state = angular.copy(defaults);
      state.reset = function () { angular.extend(state, defaults); };
      state.isFiltered = function () {
        return !!(state.query || state.genre || state.platform || state.year || state.minRating);
      };
      return state;
    })

    /* ---- Game detail modal ---- */
    .factory("GameModal", function () {
      var service = {
        game: null,
        open: function (game) {
          service.game = game;
          bootstrap.Modal.getOrCreateInstance(document.getElementById("gameModal")).show();
        }
      };
      return service;
    })

    /* ---- Trailer modal ---- */
    .factory("Trailer", ["DEFAULT_TRAILER", function (DEFAULT_TRAILER) {
      var service = {
        game: null,
        url: null,
        open: function (game) {
          var gameModalEl = document.getElementById("gameModal");
          var trailerModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("trailerModal"));
          service.game = game;
          service.url = game.trailer || DEFAULT_TRAILER;

          // Bootstrap can't stack modals: close the detail modal first if it is open
          if (gameModalEl.classList.contains("show")) {
            gameModalEl.addEventListener("hidden.bs.modal", function () { trailerModal.show(); }, { once: true });
            bootstrap.Modal.getInstance(gameModalEl).hide();
          } else {
            trailerModal.show();
          }
        },
        stop: function () { service.url = null; }
      };
      return service;
    }]);
})();

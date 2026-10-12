/* =========================================
   ETERNAL GAMES — app.js
   AngularJS module, config and shared helpers
   ========================================= */
(function () {
  "use strict";

  angular
    .module("eternalApp", [])

    // Placeholder trailer used for every game. Give a game its own
    // `trailer` field in js/data/games.js to override it.
    .constant("DEFAULT_TRAILER", "https://www.youtube.com/embed/dQw4w9WgXcQ")

    .config(["$sceDelegateProvider", "$compileProvider", function ($sceDelegateProvider, $compileProvider) {
      // Allow YouTube embeds inside the trailer <iframe>
      $sceDelegateProvider.resourceUrlWhitelist(["self", "https://www.youtube.com/embed/**"]);
      $compileProvider.debugInfoEnabled(false);
    }])

    // Helpers every section of the page needs in its template
    .run(["$rootScope", "Wishlist", "GameModal", "Trailer", function ($rootScope, Wishlist, GameModal, Trailer) {
      var PLATFORM_ICONS = {
        "PC": "bi-pc-display",
        "PlayStation": "bi-playstation",
        "Xbox": "bi-xbox",
        "Mobile": "bi-phone"
      };

      $rootScope.wishlist = Wishlist;
      $rootScope.openGame = GameModal.open;
      $rootScope.playTrailer = Trailer.open;
      $rootScope.platformIcon = function (platform) {
        return PLATFORM_ICONS[platform] || "bi-controller";
      };
      $rootScope.scrollTo = function (id) {
        var el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    }]);
})();

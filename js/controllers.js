/* =========================================
   ETERNAL GAMES — controllers.js
   One controller per section of the page
   ========================================= */
(function () {
  "use strict";

  angular
    .module("eternalApp")

    /* ---- Navbar: search box + wishlist counter ---- */
    .controller("NavController", ["$scope", "CatalogueState", function ($scope, CatalogueState) {
      var vm = this;
      vm.state = CatalogueState;

      // Typing in the navbar search jumps to the results
      vm.onSearch = function () {
        if (vm.state.query) $scope.scrollTo("games");
      };
    }])

    /* ---- Hero: featured games slider ---- */
    .controller("HeroController", ["GAMES", function (GAMES) {
      var vm = this;
      vm.slides = GAMES.filter(function (g) { return g.featured; });
      vm.index = 0;
      vm.active = vm.slides[0];

      vm.go = function (i) {
        var n = vm.slides.length;
        vm.index = (i + n) % n;
        vm.active = vm.slides[vm.index];
      };
      vm.next = function () { vm.go(vm.index + 1); };
      vm.prev = function () { vm.go(vm.index - 1); };
    }])

    /* ---- Categories: genre tiles ---- */
    .controller("CategoriesController", ["$scope", "GAMES", "GENRES", "CatalogueState", function ($scope, GAMES, GENRES, CatalogueState) {
      var vm = this;
      vm.genres = GENRES.map(function (genre) {
        return angular.extend({}, genre, {
          games: GAMES.filter(function (g) { return g.genre === genre.name; })
        });
      });

      vm.pick = function (name) {
        CatalogueState.reset();
        CatalogueState.genre = name;
        $scope.scrollTo("games");
      };
    }])

    /* ---- Catalogue: filters, sorting, grid, load more ---- */
    .controller("CatalogueController", ["$scope", "GAMES", "GENRES", "CatalogueState", function ($scope, GAMES, GENRES, CatalogueState) {
      var vm = this;
      var PAGE_SIZE = 8;

      var SORTERS = {
        featured: function (a, b) { return a.id - b.id; },
        rating:   function (a, b) { return b.rating - a.rating || a.id - b.id; },
        newest:   function (a, b) { return b.year - a.year || b.rating - a.rating; },
        title:    function (a, b) { return a.title.localeCompare(b.title); }
      };

      vm.state = CatalogueState;
      vm.total = GAMES.length;
      vm.genres = GENRES.map(function (genre) {
        return {
          name: genre.name,
          count: GAMES.filter(function (g) { return g.genre === genre.name; }).length
        };
      });
      vm.platforms = unique("platform").sort();
      vm.years = unique("year").sort().reverse();
      vm.ratings = [
        { value: 4.5, label: "4.5 & up" },
        { value: 4,   label: "4.0 & up" },
        { value: 3.5, label: "3.5 & up" }
      ];
      vm.sorts = [
        { value: "featured", label: "Featured" },
        { value: "rating",   label: "Top rated" },
        { value: "newest",   label: "Newest" },
        { value: "title",    label: "A to Z" }
      ];

      vm.limit = PAGE_SIZE;
      vm.results = [];

      vm.setGenre = function (name) { vm.state.genre = name; };
      vm.loadMore = function () { vm.limit += PAGE_SIZE; };
      vm.reset = function () { vm.state.reset(); };

      function unique(field) {
        return GAMES
          .map(function (g) { return g[field]; })
          .filter(function (value, i, all) { return all.indexOf(value) === i; });
      }

      function applyFilters() {
        var s = vm.state;
        var query = (s.query || "").toLowerCase().trim();

        vm.results = GAMES
          .filter(function (g) {
            return (!s.genre     || g.genre === s.genre) &&
                   (!s.platform  || g.platform === s.platform) &&
                   (!s.year      || g.year === s.year) &&
                   (!s.minRating || g.rating >= s.minRating) &&
                   (!query       || (g.title + " " + g.genre + " " + g.developer).toLowerCase().indexOf(query) > -1);
          })
          .sort(SORTERS[s.sort] || SORTERS.featured);

        vm.limit = PAGE_SIZE;
      }

      // Re-run whenever any filter changes (navbar search and category tiles included)
      $scope.$watchGroup([
        function () { return vm.state.query; },
        function () { return vm.state.genre; },
        function () { return vm.state.platform; },
        function () { return vm.state.year; },
        function () { return vm.state.minRating; },
        function () { return vm.state.sort; }
      ], applyFilters);
    }])

    /* ---- Wishlist section ---- */
    .controller("WishlistController", ["Wishlist", function (Wishlist) {
      this.list = Wishlist;
    }])

    /* ---- Gamer profile ---- */
    .controller("ProfileController", ["Wishlist", "Ratings", function (Wishlist, Ratings) {
      var vm = this;
      vm.user = {
        name: "EternalGamer_X",
        initials: "EG",
        level: 42,
        xp: 8450,
        xpNext: 10000,
        bio: "Elite gamer · RPG & Strategy enthusiast · 2,340 hours played",
        badges: [
          { label: "Legendary",    icon: "bi-gem",          tone: "gold" },
          { label: "Champion",     icon: "bi-trophy-fill",  tone: "blue" },
          { label: "Streak 30",    icon: "bi-fire",         tone: "red" },
          { label: "Top Reviewer", icon: "bi-star-fill",    tone: "green" }
        ]
      };
      vm.xpPercent = Math.round(vm.user.xp / vm.user.xpNext * 100);
      vm.wishlist = Wishlist;
      vm.ratings = Ratings;
    }])

    /* ---- Footer: newsletter form ---- */
    .controller("FooterController", ["Toast", function (Toast) {
      var vm = this;
      vm.email = "";
      vm.year = new Date().getFullYear();

      vm.subscribe = function (form) {
        if (form.$invalid) {
          Toast.show("Please enter a valid email address", "bi-exclamation-triangle-fill");
          return;
        }
        Toast.show("Subscribed! Welcome to Eternal Games.", "bi-envelope-check-fill");
        vm.email = "";
        form.$setPristine();
        form.$setUntouched();
      };
    }])

    /* ---- Game detail modal ---- */
    .controller("GameModalController", ["GameModal", "Ratings", "Toast", function (GameModal, Ratings, Toast) {
      var vm = this;
      vm.modal = GameModal;
      vm.ratings = Ratings;
      vm.stars = [1, 2, 3, 4, 5];
      vm.hover = 0;

      vm.requirements = [
        { label: "OS",      value: "Windows 10/11 64-bit" },
        { label: "CPU",     value: "Intel Core i5-8400 / AMD Ryzen 5 2600" },
        { label: "RAM",     value: "16 GB" },
        { label: "GPU",     value: "NVIDIA GTX 1060 6GB / AMD RX 5500 XT" },
        { label: "Storage", value: "50 GB SSD" },
        { label: "DirectX", value: "Version 12" }
      ];

      vm.rate = function (value) {
        var game = vm.modal.game;
        Ratings.set(game.id, value);
        var mine = Ratings.get(game.id);
        Toast.show(mine ? "You rated " + game.title + " " + mine + "/5" : "Rating removed", "bi-star-fill");
      };
    }])

    /* ---- Trailer modal ---- */
    .controller("TrailerController", ["Trailer", function (Trailer) {
      this.trailer = Trailer;
    }])

    /* ---- Toast stack ---- */
    .controller("ToastController", ["Toast", function (Toast) {
      this.toast = Toast;
    }]);
})();

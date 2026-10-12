/* =========================================
   ETERNAL GAMES — directives.js
   Small reusable DOM behaviours
   ========================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  angular
    .module("eternalApp")

    /* eg-reveal — fade a block in the first time it scrolls into view */
    .directive("egReveal", function () {
      return {
        restrict: "A",
        link: function (scope, element) {
          var el = element[0];
          if (reduceMotion || !("IntersectionObserver" in window)) return;
          el.classList.add("reveal");
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              el.classList.add("is-visible");
              observer.disconnect();
            }
          }, { threshold: 0.12 });
          observer.observe(el);
          scope.$on("$destroy", function () { observer.disconnect(); });
        }
      };
    })

    /* eg-count-up="5000" data-suffix="+" data-decimals="0" — animated counter */
    .directive("egCountUp", function () {
      return {
        restrict: "A",
        link: function (scope, element, attrs) {
          var el = element[0];
          var target = parseFloat(attrs.egCountUp) || 0;
          var decimals = parseInt(attrs.decimals, 10) || 0;
          var suffix = attrs.suffix || "";

          function render(value) {
            el.textContent = value.toLocaleString("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            }) + suffix;
          }

          if (reduceMotion || !("IntersectionObserver" in window)) { render(target); return; }

          render(0);
          var observer = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting) return;
            observer.disconnect();
            var start = null;
            var duration = 1600;
            function frame(now) {
              if (start === null) start = now;
              var p = Math.min((now - start) / duration, 1);
              render(target * (1 - Math.pow(1 - p, 3))); // ease-out
              if (p < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
          }, { threshold: 0.6 });
          observer.observe(el);
          scope.$on("$destroy", function () { observer.disconnect(); });
        }
      };
    })

    /* eg-animation-end="expr" — run expr when the element's CSS animation finishes.
       The hero uses the progress bar's animation as its autoplay timer, so pausing
       the animation (hover / focus) pauses the slider too. */
    .directive("egAnimationEnd", ["$parse", function ($parse) {
      return {
        restrict: "A",
        link: function (scope, element, attrs) {
          var handler = $parse(attrs.egAnimationEnd);
          element.on("animationend", function (event) {
            if (event.target !== element[0]) return;
            scope.$apply(function () { handler(scope); });
          });
        }
      };
    }])

    /* eg-modal-hidden="expr" — run expr after a Bootstrap modal has closed */
    .directive("egModalHidden", ["$parse", function ($parse) {
      return {
        restrict: "A",
        link: function (scope, element, attrs) {
          var handler = $parse(attrs.egModalHidden);
          element.on("hidden.bs.modal", function () {
            scope.$apply(function () { handler(scope); });
          });
        }
      };
    }])

    /* eg-scrolled — adds .is-scrolled once the page has moved (navbar background)
       and marks the nav link of the section currently on screen as .active */
    .directive("egScrolled", function () {
      return {
        restrict: "A",
        link: function (scope, element) {
          var links = Array.prototype.slice.call(element[0].querySelectorAll('.nav-link[href^="#"]'));
          var sections = links.map(function (link) {
            return document.getElementById(link.getAttribute("href").slice(1));
          });

          function update() {
            element.toggleClass("is-scrolled", window.pageYOffset > 24);

            // The active section is the last one whose top has passed 40% of the viewport
            var line = window.innerHeight * 0.4;
            var current = 0;
            sections.forEach(function (section, i) {
              if (section && section.getBoundingClientRect().top <= line) current = i;
            });
            links.forEach(function (link, i) {
              link.classList.toggle("active", i === current);
              if (i === current) link.setAttribute("aria-current", "true");
              else link.removeAttribute("aria-current");
            });
          }
          window.addEventListener("scroll", update, { passive: true });
          update();
          scope.$on("$destroy", function () { window.removeEventListener("scroll", update); });
        }
      };
    })

    /* eg-back-top — show the button after scrolling, scroll to top on click */
    .directive("egBackTop", function () {
      return {
        restrict: "A",
        link: function (scope, element) {
          function update() {
            element.toggleClass("is-visible", window.pageYOffset > 600);
          }
          window.addEventListener("scroll", update, { passive: true });
          update();
          element.on("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
          scope.$on("$destroy", function () { window.removeEventListener("scroll", update); });
        }
      };
    })

    /* eg-collapse-on-click — close the mobile nav menu after picking a link */
    .directive("egCollapseOnClick", function () {
      return {
        restrict: "A",
        link: function (scope, element) {
          element.on("click", function (event) {
            if (!event.target.closest("a")) return;
            var menu = element[0].closest(".navbar-collapse");
            if (menu && menu.classList.contains("show")) {
              bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
          });
        }
      };
    });
})();

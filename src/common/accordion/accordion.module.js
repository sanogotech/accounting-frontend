// 'accordion' module, extracted from https://codepen.io/anayarojo/pen/JRmvAW
var accordMod = angular.module('accordion', ['ngMaterial']);

accordMod.directive("slideable", function () {
	return {
		restrict: "C",
		compile: function (element, attr) {
			// wrap tag
			var contents = element.html();
			element.html(
				'<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' +
				contents +
				"</div>"
			);

			return function postLink(scope, element, attrs) {
				// default properties
				attrs.duration = !attrs.duration ? "0.5s" : attrs.duration;
				attrs.easing = !attrs.easing ? "ease-in-out" : attrs.easing;
				element.bind("click", function ($event) {
					$event.stopPropagation();
				});
				element.css({
					overflow: "hidden",
					height: "0px",
					transitionProperty: "height",
					transitionDuration: attrs.duration,
					transitionTimingFunction: attrs.easing
				});
			};
		}
	};
});

accordMod.directive("slideToggle", function () {
	return {
		restrict: "A",
		link: function (scope, element, attrs) {
			var target = document.querySelector(attrs.slideToggle);
			attrs.expanded = false;
			element.bind("click", function () {
				//optional
				if (element.hasClass("opened")) {
					element.removeClass("opened");
				} else {
					element.addClass("opened");
				}
				//

				var content = target.querySelector(".slideable_content");
				if (!attrs.expanded) {
					content.style.border = "1px solid rgba(0,0,0,0)";
					var y = content.clientHeight;
					content.style.border = 0;
					target.style.height = y + "px";
				} else {
					target.style.height = "0px";
				}
				attrs.expanded = !attrs.expanded;
			});
		}
	};
});
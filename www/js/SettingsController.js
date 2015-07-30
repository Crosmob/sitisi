angular.module('LesxhModule')  //Here we must not use ionic.

.controller('SettingsController',
['$scope',
function($scope) {
  if(typeof analytics !== "undefined") {
    analytics.trackView("Settings Controller");
  }

}])

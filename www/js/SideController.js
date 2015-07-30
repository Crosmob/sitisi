angular.module('LesxhModule') //Here we must not use ionic.

.controller('SideController',
['$scope', '$ionicSideMenuDelegate', '$controller',
function($scope, $ionicSideMenuDelegate, $controller) {

  $controller('ParentController', {$scope: $scope});

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  //In order to show the refresh button in the bar.
  $scope.refresh = {fun: ''};
  $scope.isRefreshFunctionDefined = function () {
    if (typeof $scope.refresh.fun == 'function') {
      return true;
    }
    return false;
  };
}])

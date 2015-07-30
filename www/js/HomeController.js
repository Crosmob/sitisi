angular.module('LesxhModule')  //Here we must not use ionic.

.controller('HomeController',
['$scope', 'myDownloadService',
function($scope, myDownloadService) {

  if(typeof analytics !== "undefined") {
    analytics.trackView("Home Controller");
  }

  if($scope.data.myUniversity=='') {
    $scope.openModal();
  }
  $scope.$watch('data.myUniversity', function(newValue, oldValue) {
    //This is necessary the very first time that opens the application, in order to download the dishes imediatelly after he selects the university.
    if(newValue!=oldValue) {
      $scope.dishes = myDownloadService.getDishes($scope.data.myUniversity);
    }
  });

  //Download the dishes and set a watcher on them.
  //$scope.dishes = {};
  if($scope.data.myUniversity!='') {
    $scope.dishes = myDownloadService.getDishes($scope.data.myUniversity);
  }
  $scope.$watchCollection('dishes', function(newValues, oldValues) {
    if( typeof $scope.dishes !== 'undefined'
    && typeof $scope.dishes.data !== 'undefined'
    && typeof $scope.dishes.data.shmera !== 'undefined') {
      $scope.menu = $scope.dishes.data.shmera;
      $scope.selectedButton = 1;
    }
  });

  $scope.selectToday = function() {
    $scope.menu = $scope.dishes.data.shmera;
    $scope.selectedButton = 1;
  }

  $scope.selectTomorrow = function() {
    $scope.menu = $scope.dishes.data.ayrio;
    $scope.selectedButton = 2;
  }

  //If the user wants it, he can download the dishes again.
  $scope.refresh.fun = function() {
    $scope.dishes = myDownloadService.getDishes($scope.data.myUniversity, true);
  }

  //Cleanup unregister the refresh function when the controller is removed.
  $scope.$on('$destroy', function() {
    $scope.refresh.fun = '';
    console.log("Home controller destroyed.");
  });
}])

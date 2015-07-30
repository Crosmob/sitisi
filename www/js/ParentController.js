angular.module('LesxhModule')  //Here we must not use ionic.

.controller('ParentController',
['$scope', '$ionicModal', 'myLocalstorage', 'myDownloadService',
function($scope, $ionicModal, myLocalstorage, myDownloadService) {

  //Used by myLocalstorage to store them in a key-value persistant storage
  //in the browser.
  var keyName = 'myUniversity';
  var defaultValue = '';

  //We need to set it inside data. If we put it simply as $scope.myUniversity,
  //it can now be shared between the modal and the view.
  $scope.data = {
    myUniversity: myLocalstorage.get(keyName, defaultValue)
  };

  //Multiline string hack.
  var modalTempleteString =
  '<ion-modal-view>' +
    '<header class="bar bar-header bar-positive">' +
      '<h1 class="title">Επιλογή</h1>' +
      '<div class="button button-clear" ng-show="data.myUniversity" ng-click="modal.hide()">' +
        '<span class="icon ion-close"></span>' +
      '</div>' +
    '</header>' +
    '<ion-content class="padding has-header">' +
      '<div class="list" ng-hide="universityList.data.length==0">' +
        '<ion-radio ng-repeat="item in universityList.data"' +
        'ng-value="item" ng-model="data.myUniversity" ng-click="closeModal()">' +
          '{{item}}' +
        '</ion-radio>' +
      '</div>' +
      '<div class="list" ng-show="universityList.data.length==0">' +
        '<center><button class="button" ng-click="openModal()">' +
          'Ανανέωση <i class="icon ion-loop"></i>' +
        '</button> </center>' +
      '</div>' +
    '</ion-content>' +
  '</ion-modal-view>';

  //We do not use fromTemplateUrl, as it returns a promise and can not be used
  //imediatelly in the controller.
  $scope.modal = $ionicModal.fromTemplate(modalTempleteString, {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  });

  //When we want to open the modal, this function is called.
  $scope.openModal = function() {
    $scope.universityList = myDownloadService.getInstitutions();
    $scope.modal.show();
  }

  //When we want to close the modal, this function is called.
  $scope.closeModal = function() {
    myLocalstorage.set(keyName, $scope.data.myUniversity);
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
    console.log("Parent controller destroyed.");
  });
}])

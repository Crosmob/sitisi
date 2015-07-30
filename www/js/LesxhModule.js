angular.module('LesxhModule', ['ionic'])

.run(
['$ionicPlatform', '$http', 'Base64',
function($ionicPlatform, $http, Base64) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    if(window.plugins && window.plugins.AdMob) {
      var android_key = "ca-app-pub-???";
      var ios_key = "ca-app-pub-???";
      var admob_key = device.platform == "Android" ? android_key : ios_key;
      var admob = window.plugins.AdMob;
      admob.createBannerView({
        'publisherId': admob_key,
        'adSize': admob.AD_SIZE.BANNER,
        'bannerAtTop': false
      }, function() {
        admob.requestAd({
          'isTesting': false
        }, function() {
            admob.showAd(true);
        }, function() {
            console.log('failed to request ad');
        });
      }, function() {
        console.log('failed to create banner view');
      });
    }

    if(typeof analytics !== "undefined") {
      var android_id = "UA-???";
      var ios_id = "UA-???";
      var analytics_id = device.platform == "Android" ? android_id : ios_id;
      analytics.startTrackerWithId(analytics_id);
    } else {
      console.log("Google Analytics Unavailable");
    }
  });

  $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('user???' + ':' + 'pass???');
}])

.config(
['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    //state is used with ui-sref="home"
    //url is used with href="#/home"
    .state('home', {
      url: "/home",
      templateUrl: "views/home.html",
      controller: 'HomeController'
    })
    .state('settings', {
      url: "/settings",
      templateUrl: "views/settings.html",
      controller: 'SettingsController'
    });

   $urlRouterProvider.otherwise("/home");
}])

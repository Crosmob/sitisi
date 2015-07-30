angular.module('LesxhModule') //Here we must not use ionic.

.constant('mySharedConstants', {
  //urlBase: "http://sitisicachedev-developertest.rhcloud.com"  //Development
  urlBase: "http://sitisicacheprod-backendops.rhcloud.com"  //Production
})

.factory('myLocalstorage',
['$window',
function($window) {
  //Example: http://learn.ionicframework.com/formulas/localstorage/
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('myDownloadService',
['$http', 'mySharedConstants', '$ionicLoading', '$ionicPopup',
function($http, mySharedConstants, $ionicLoading, $ionicPopup) {
  var urlBase = mySharedConstants.urlBase;

  var myDownloadService = {};

  //Institutions.
  var institutions = {data: []};
  myDownloadService.getInstitutions = function() {
    console.log("getInstitutions: started.");
    if(institutions.data.length==0) {
      $ionicLoading.show({
        template: '<i class="button-icon icon ion-loading-a"></i>'
      });
      console.log("getInstitutions: start http get.");
      $http.get(urlBase + '/institutions.json')
      .success(function(data, status, headers) {
        console.log("getInstitutions: download ok.");
        $ionicLoading.hide();
        institutions.data = data;
      }).error(function(data, status, headers) {
        console.log("getInstitutions: download error.");
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Πρόβλημα δικτύου',
          template: 'Προσπαθήστε ξανά'
        });
      });
    } else {
      $ionicLoading.hide();
      console.log("getInstitutions: return previous results.");
    }
    return institutions;
  };

  var dishes = {data: {}};
  myDownloadService.getDishes = function(myInstitution, downloadAnyway) {
    downloadAnyway = typeof downloadAnyway !== 'undefined' ? downloadAnyway : false;

    var dt = new Date();
    var nowDay = ("0" + dt.getDate()).slice(-2);  //Keep the last 2 characters of the string.
    var nowMonth = ("0" + (dt.getMonth()+1)).slice(-2);
    var dateString = dt.getFullYear() + "-" + nowMonth + "-" + nowDay;
    //dateString ="2014-10-31";

    console.log("getDishes: started (day:" + dateString + ").");
    //Chech if the download is not needed.
    if (!downloadAnyway
    && typeof dishes.data.institution !== 'undefined'
    && dishes.data.institution == myInstitution
    && dishes.data.shmera.day == dateString) {
      //Return previous results.
      console.log("getDishes: return previous results.");
      return dishes;
    }
    $ionicLoading.show({
      template: '<i class="button-icon icon ion-loading-a"></i>'
    });
    console.log("getDishes: start http get.");
    $http.get(urlBase + "/" + myInstitution + ".json")
    .success(function(data, status, headers) {
      console.log("getDishes: download ok.");
      $ionicLoading.hide();
      dishes.data = data;
    }).error(function(data, status, headers) {
      console.log("getDishes: download error.");
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Πρόβλημα δικτύου',
        template: 'Προσπαθήστε ξανά'
      });
    });
    return dishes;
  };

  return myDownloadService;
}])

.factory('Base64', function() {
  var keyStr = 'ABCDEFGHIJKLMNOP' +
  'QRSTUVWXYZabcdef' +
  'ghijklmnopqrstuv' +
  'wxyz0123456789+/' +
  '=';
  return {
    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);

      return output;
    },

    decode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
        "Expect errors in decoding.");
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

      } while (i < input.length);

      return output;
    }
  };
})

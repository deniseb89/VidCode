

  function VideosCtrl($scope) {
    console.log('here we go. here we go');

    $.ajax('/getVideos',{
      success: function(data, textStatus, jqXHR){
        if (data.error) {
          console.log('data error');
          $scope.error = data.error;
        } else {
          $scope.videos = [{
            'title' : data[130].title,
            'desc' : data[130].desc
          }]
          console.log($scope.videos);
        }
      },
      error: function (data, textStatus, jqXHR){
        console.log('something went wrong getting your vidcodes!')
      }
    });

  };

      // $scope.videos = data;
      // $scope.num_orders = data.num_orders;
      // $scope.total_funded = data.total_funded.toFixed(2);
      // $scope.unit_symbol = data.unit_symbol;
      // $scope.target = data.target;
      // $scope.days_left = data.days_left ? data.days_left : 0;
      // $scope.percentage_funded = Math.min($scope.total_funded / $scope.target * 100.0, 100);

// var phonecatApp = angular.module('phonecatApp', []);

// phonecatApp.controller('PhoneListCtrl', function ($scope) {
//   $scope.phones = [
//     {'name': 'Nexus S',
//      'snippet': 'Fast just got faster with Nexus S.'},
//     {'name': 'Motorola XOOM™ with Wi-Fi',
//      'snippet': 'The Next, Next Generation tablet.'},
//     {'name': 'MOTOROLA XOOM™',
//      'snippet': 'The Next, Next Generation tablet.'}
//   ];
// });
(function (angular) {
   angular.module('institutionAddImageApp', ['ui.bootstrap','ui.router'])
       .config(function($stateProvider){
           $stateProvider
               .state("institutionSideBar.institution_addimage",{
                   url:"institution_addimage",
                   templateUrl:"partialview/institutions/institution_addimage.html"
               })
       })
    .controller('institution_addImageCtrl', ['$scope', '$state', function ($scope, $state) {
        //$scope.logName = '李晓明';
        //$scope.backToImg = function () {
        //    $state.go('sidebar.image');
        //};
        //$scope.iscurrented = true;
        //$scope.show = "local";
        //$scope.ChangeShowLocal = function () {
        //    $scope.iscurrented = true;
        //    $scope.show = "local";
        //};
        //$scope.ChangeShowCloud = function () {
        //    $scope.iscurrented = false;
        //    $scope.show = "cloud";
        //};
    }]);
    //.directive('addresize', function ($window) {
    //    //内容的高度后边高度
    //    return {
    //        restrict:'AE',
    //        scope: {},
    //        link: function (scope, element) {
    //            var body = angular.element($window);
    //            var changeSize = function(){
    //                element.css('height',body.height()-224+'px')
    //            };
    //            changeSize();
    //        }
    //    }
    //});


})(angular);
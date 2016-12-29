(function (angular) {
    var app = angular.module('addImageApp', ['ui.bootstrap']);
    app.controller('addImageController', ['$scope', '$state',
        function ($scope, $state) {
        var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
        //user姓名
        if(userMessage){
            $scope.logName = userMessage[0].truename;
        }else{
            $state.go("login");
        }
        $scope.backToImg = function () {
            $state.go('sidebar.image');
        };
        $scope.iscurrented = true;
        $scope.show = "local";
        $scope.ChangeShowLocal = function () {
            $scope.iscurrented = true;
            $scope.show = "local";
        };
        $scope.ChangeShowCloud = function () {
            $scope.iscurrented = false;
            $scope.show = "cloud";
        };
    }]);
    app.directive('addresize', function ($window) {
        //内容的高度后边高度
        return {
            restrict:'AE',
            scope: {},
            link: function (scope, element) {
                var body = angular.element($window);
                var changeSize = function(){
                    element.css('height',body.height()-224+'px')
                };
                changeSize();
            }
        }
    });


})(angular);
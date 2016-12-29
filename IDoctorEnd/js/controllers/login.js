(function (angular) {
    angular.module("loginApp", ['ui.router'])
        .controller("loginCtrl", ["$q", "$http", "$scope", "$state", "doctorService",
            function ($q, $http, $scope, $state, doctorService) {
            //获得登录页数据
            $scope.doctorLoginSubmit = function (isValid) {
                if (isValid) {
                    var info = {
                        "username": $scope.userdata.phone,
                        "password": $scope.userdata.password
                    };
                    doctorService.getLoginData(info).then(function (response) {
                        var loginData = angular.fromJson(response.message);
                        //登录者信息
                        var userInfo = loginData;
                        //登录者基本信息存入本地储存
                        localStorage.setItem("ueserMessage", angular.toJson(userInfo));
                        var userType = loginData[0].usertype;
                        //usertype用户类型，1患者2医生3机构4专家

                        if (userType == 2) {
                            $state.go("sidebar.main");
                        }
                        if (userType == 3) {
                            $state.go("institutionSideBar.institution_main");
                        }
                    }, function (error) {

                    });
                } else {
                    $scope.submitted = true;
                }
            };
            //$scope.loginTo = function(){
            //    //医生端
            //        var info = {
            //            "username":"15901331759",
            //            "password":"123456"
            //        };

            //机构端
            //var info = {
            //    "username":"demo",
            //    "password":"demo"
            //};


        }]);

})(angular);
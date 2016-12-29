(function (angular) {
    var app = angular.module('addIllnessApp', ['ui.bootstrap']);
    app.controller('addIllnessController', ['$scope', '$state', 'fileReader', '$timeout', 'doctorService',
        function ($scope, $state, fileReader, $timeout, doctorService) {
            //从localStorage得到登录者的基本信息
            var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
            //user姓名
            if(userMessage){
                $scope.logName = userMessage[0].truename;
            }else{
                $state.go("login");
            }
            $scope.backToIllness = function () {
                $state.go("sidebar.illnesscase");
            };
            $scope.visitTimeOptions = {
                maxDate: new Date(),
                startingDay: 1,
                showWeeks: false
            };
            $scope.visitOpen = function () {
                $scope.visitPopupOpened = true;
            };
            var getGroup = function () {
                var info = {
                    "userid": userMessage[0].userid
                };
                doctorService.getCardGroup(info).then(function (response) {
                    var groupMessage = JSON.parse(response.message);
                    console.log("groupMessage", groupMessage);
                    $scope.cardGroup = groupMessage;
                    //doctorService.setCardDetailGroup(groupMessage);
                    //$scope.group = groupMessage;
                }, function (error) {

                });
            };
            getGroup();

            $scope.reader = new FileReader();   //创建一个FileReader接口
            //定义一个图像文件
            var file = {};
            $scope.img_upload = function (files) {       //单次提交图片的函数
                //$scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
                $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
                console.log('files[0]===', files[0]);
                file = files[0];
                $scope.reader.onload = function (ev) {
                    $scope.$apply(function () {
                        $scope.imgSrc = ev.target.result; //接收base64
                    });
                };
            };
            $scope.addCardFormSubmit = function (isValid) {
                if (isValid) {
                    var formData = new FormData();
                    formData.append('adduser', userMessage[0].userid);
                    formData.append('userid', userMessage[0].userid);
                    formData.append('patientname', $scope.patientname);
                    formData.append('groupid', $scope.groupName);
                    formData.append('headpicfile', file);
                    formData.append('gender', $scope.gender);
                    formData.append('age', $scope.age);
                    if ($scope.visitTime) {
                        formData.append('visittime', doctorService.dataFormat($scope.visitTime));
                    }
                    if ($scope.tel) {
                        formData.append('tel', $scope.tel);
                    }
                    if ($scope.address) {
                        formData.append('address', $scope.address);
                    }
                    if ($scope.memo) {
                        formData.append('memo', $scope.memo);
                    }
                    doctorService.newCard(formData).then(function (response) {
                        var result = response.result;
                        if (result == 0) {
                            alert("病例创建成功,点击确认后2秒后返回病例列表页");
                            var timer = $timeout(
                                function() {
                                    $scope.backToIllness();
                                },
                                2000
                            );
                        }
                    }, function () {

                    });
                }

                //    $http({
                //        method: 'POST',
                //        url: "http://192.168.1.104:8088/idoctor/service/card/new",
                //        data: formData,
                //        headers: {
                //            'Content-Type': undefined
                //        },
                //        transformRequest: angular.identity
                //    }).success(function (data) {
                //        console.log("DATA", data);
                //    }).error(function (error) {
                //
                //    });
            }

        }]);
})(angular);
/**
 * Created by HYHY on 2016/12/2.
 */

(function (angular) {
    var app = angular.module('institution_installApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap','ui.router']);

    app.controller('institution_installController', ['$scope', '$location','$state','$filter','doctorService',function ($scope, $location,$state,$filter,doctorService,fileReader) {
        $scope.logName = "李晓明";
        $scope.group = [{groupName: "机构信息维护"},
            {groupName: "密码设置"},
            {groupName: "隐私设置"}
        ];

        $scope.firstState={show:true};
        //点击病例分组
        $scope.current = 0;

        $scope.changeList = function (index) {
            $scope.current = index;
            console.log($scope.current);
            if($scope.current==0){
                $scope.firstState={show:true};
                $scope.secondState={show:false};
                $scope.thirdState={show:false};
            }else if($scope.current==1){
                $scope.firstState={show:false};
                $scope.secondState={show:true};
                $scope.thirdState={show:false};
            }else if($scope.current==2){
                $scope.firstState={show:false};
                $scope.secondState={show:false};
                $scope.thirdState={show:true};
            }

        };

        //得到选择框里面的值
        var selectBox = function () {
            var info ={
            };

            doctorService.selectBox(info).then(function (response) {
                console.log(response);
                $scope.hispotials = response.data.inHostipal;
                $scope.keshis = response.data.keshi;
                $scope.doctors = response.data.docCall;
                $scope.posts = response.data.highCall;
            }, function (error) {

            });
        }

        selectBox();

        //上传时间戳配置
        $scope.upload = {
            startTime: '',
            endTime: ''
        };
        $scope.startUploadOptions = {
            maxDate: $scope.upload.endTime,
            stsrtingDay: 1,
            showWeeks: false
        };
        $scope.startUploadOpen = function () {
            $scope.startUploadPop = true;
        };
        $scope.$watch('upload.startTime', function (newValue, oldValue) {
            $scope.endUploadOptions.minDate = newValue;
        });
        $scope.$watch('upload.endTime', function (newValue, oldValue) {
            $scope.startUploadOptions.maxDate = newValue;
        });
        $scope.endUploadOptions = {
            minDate: $scope.upload.startTime,
            maxDate: new Date(),
            showWeeks: false,
            stsrtingDay: 1
        };
        $scope.endUploadOpen = function () {
            $scope.endUploadPop = true;
        };
        $scope.endScreenOpen = function () {
            $scope.endScreenPop = true;
        };

        //点击提交密码设置
        $scope.postPasswordmangerset = function () {
            postPassword();
        };

        var postPassword = function () {
            var info ={
                "passwordAgain":$scope.passwordAgain,
                "oldPassword":$scope.oldPassword,
                "newPassword":$scope.newPassword
            };
            doctorService.setPassword(info).then(function (response) {
                console.log(info);
            }, function (error) {

            });
        }

        //点击提交隐私设置
        $scope.postPrivacymangerset = function () {
            setPrivacy();
        };

        var setPrivacy = function () {
            var info ={
            };
            if($scope.isDICOMimg!= undefined){
                angular.extend(info,{"isDICOMimg":true});
            }
            if($scope.isDoctorfind!= undefined){
                angular.extend(info,{"isDoctorfind":true});
            }
            if($scope.isDoctormes!= undefined){
                angular.extend(info,{"isDoctormes":true});
            }
            if($scope.isHostipalmes!= undefined){
                angular.extend(info,{"isHostipalmes":true});
            }
            if($scope.isHostpitailfind!= undefined){
                angular.extend(info,{"isHostpitailfind":true});
            }
            if($scope.isJPGimg!= undefined){
                angular.extend(info,{"isJPGimg":true});
            }
            if($scope.isOtherfind!= undefined){
                angular.extend(info,{"isOtherfind":true});
            }
            if($scope.isOthermes!= undefined){
                angular.extend(info,{"isOthermes":true});
            }

            doctorService.setPassword(info).then(function (response) {
                console.log(info);
            }, function (error) {

            });
        }

        //点击提交个人信息管理设置
        $scope.postMesmangerset = function () {
            postMes();
        };

        var postMes = function () {
            var info ={
                "userName":$scope.userName,
                "radiosex":$scope.radiosex,
                "email":$scope.email,
                "adress":$scope.adress,
                "trueName":$scope.	trueName,
                "hostipalName":$scope.hostipalName,
                "like":$scope.like,
                "careerExperience":$scope.careerExperience
            };
            // 1男2女 不选的话是男
            if($scope.radiosex== undefined){
                angular.extend(info,{"radiosex":1});
            }
            //加入出生日期 格式化时间
            var formatTime = function (date1) {
                var date2 = $filter("date")(date1, "yyyyMMdd");
                return date2;
            };
            if($scope.birthdayDate!= undefined){
                angular.extend(info,{"birthday":formatTime($scope.birthdayDate)});
            }

            doctorService.setMesManger(info).then(function (response) {
                console.log(info);
            }, function (error) {

            });
        }
        $scope.visitTimeOptions = {
            maxDate : new Date(),
            startingDay: 1,
            showWeeks: false
        };
        $scope.visitOpen = function(){
            $scope.visitPopupOpened = true;
        };


        $scope.reader = new FileReader();   //创建一个FileReader接口
        $scope.form = {     //用于绑定提交内容，图片或其他数据
            image:{}
        };
        //$scope.thumb = {};
        $scope.img_uploadcard = function(files) {       //单次提交图片的函数
            //$scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
            $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
            console.log('files[0]===',files[0]);

            $scope.reader.onload = function(ev) {
                $scope.$apply(function(){
                    //$scope.thumb[$scope.guid] = {
                    $scope.cardimgSrc = ev.target.result; //接收base64
                    console.log(ev);
                    //}
                });
            };
        };

        $scope.img_uploadzhi = function(files) {       //单次提交图片的函数
            //$scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
            $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
            console.log('files[0]===',files[0]);

            $scope.reader.onload = function(ev) {
                $scope.$apply(function(){
                    //$scope.thumb[$scope.guid] = {
                    $scope.zhiimgSrc = ev.target.result; //接收base64
                    console.log(ev);
                    //}
                });
            };
        };

        $scope.img_uploadqian = function(files) {       //单次提交图片的函数
            //$scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
            $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
            console.log('files[0]===',files[0]);

            $scope.reader.onload = function(ev) {
                $scope.$apply(function(){
                    //$scope.thumb[$scope.guid] = {
                    $scope.qianimgSrc = ev.target.result; //接收base64
                    console.log(ev);
                    //}
                });
            };
        };

        $scope.img_uploadcard = function(files) {       //单次提交图片的函数
            //$scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
            $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
            console.log('files[0]===',files[0]);

            $scope.reader.onload = function(ev) {
                $scope.$apply(function(){
                    //$scope.thumb[$scope.guid] = {
                    $scope.cardimgSrc = ev.target.result; //接收base64
                    console.log(ev);
                    //}
                });
            };
        };

        $scope.img_uploadicon = function(files) {       //单次提交图片的函数
            //$scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
            $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
            console.log('files[0]===',files[0]);

            $scope.reader.onload = function(ev) {
                $scope.$apply(function(){
                    //$scope.thumb[$scope.guid] = {
                    $scope.iconimgSrc = ev.target.result; //接收base64
                    console.log(ev);
                    //}
                });
            };
        };
    }]);
})(angular);

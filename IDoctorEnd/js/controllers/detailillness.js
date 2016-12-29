(function (angular) {
    var app = angular.module('detailIllnessApp', ['ui.bootstrap', 'ui.router']);
    app.controller('detailIllnessController', ['$scope', '$state', 'doctorService', '$http',
        function ($scope, $state, doctorService, $http) {
            $scope.backToIllness = function () {
                $state.go("sidebar.illnesscase");
            };

            //编辑按钮
            $scope.edit = function () {
                $scope.disabled = false;
                $scope.hide = false;
            };
            //取消按钮
            $scope.cancel = function () {
                $state.go("sidebar.illnesscase");
            };
            //确定按钮
            //$scope.ensure = function () {
            //    //$scope.disabled = true;
            //    //$scope.hide = true;
            //};

            //编辑病例中改变病例的所属分组
            $scope.selected = function () {
                $scope.user.groupid = $scope.groupName;
            };

            $scope.editCardFormSubmit = function (isVaild) {
                //if (isVaild) {
                //    //console.log("user", $scope.user);
                //    var info = {};
                //    //var info = {
                //    //    "cardid": 87
                //    //};
                //    if($scope.user.gender == "男"){
                //        $scope.user.gender =1
                //    }else{
                //        $scope.user.gender =2
                //    }
                //    info = $scope.user;
                //    console.log("info", info);
                //
                //}
                console.log("file",file);
                var formData = new FormData();
                formData.append('cardid', '60');
                formData.append('groupid', '12');
                formData.append('userid', '179');
                formData.append('headpic', 'bki-20120929093258-1094064735.jpg');
                formData.append('patientname', '152');
                formData.append('visittime', '');
                formData.append('tel', '');
                formData.append('address', '');
                formData.append('gname', '分组一');
                formData.append('age', '23');
                formData.append('updateuser', '179');
                formData.append('memo', '');
                formData.append('headpicfile', file);
                $http({
                    method: 'POST',
                    url: "http://59.110.29.44:8088/idoctor/service/card/update",
                    data: formData,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function (data) {
                    console.log("DATA", data);
                }).error(function (error) {
                });
                //$http({
                //    method: "post",
                //    url:"http://101.201.82.44:8088/idoctor/service/card/update",
                //    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                //    data: $.param({cardid: 89, groupid: 90,patientname:'test',age:'23',updateuser:'179',gname:'我的病例'})
                //}).success(function(result){
                //    console.log(result);
                //})

            };

            //从病例列表页获得的病例数据
            var cardInfo = doctorService.getCardDetailData();
            var cardGroup = doctorService.getCardDetailGroup();
            if (cardGroup.length <= 0) {
                $state.go("sidebar.illnesscase");
            }
            console.log("cardInfo", cardInfo);
            console.log("cardGroup", cardGroup);
            $scope.user = cardInfo.data;
            console.log("$scope.user", $scope.user);
            $scope.cardGroup = cardGroup;
            $scope.groupName = cardInfo.gname;

            //$scope.user = {
            //    "name": "name",
            //    "sex": "男",
            //    "age": 30,
            //    "data": "2016-01-01",
            //    "phone": "13856547856",
            //    "address": "测试地址",
            //    "group": "所属分组",
            //    "tips":"备注备注"
            //}
        }]);
})(angular);
/**
 * Created by HYHY on 2016/12/1.
 */
/**
 * Created by HYHY on 2016/12/1.
 */
(function (angular) {
    var app = angular.module('institution_consultApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
    app.controller('institution_consultController', ['$scope','$state','institutionService',function ($scope,$state,institutionService) {
        var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
        // 配置文件中的file_url
        var file_url = "";
        // 获取地址ip
        institutionService.getImgHTTP().then(function (response) {
            var urls = response.message.split(";");
            file_url = urls[0];
        }, function (error) {
            alert("获取地址失败");
        });
        // 分页代码
        $scope.pageList = [
            {id: 1, pagesize: "5"},
            {id: 2, pagesize: "10"},
            {id: 3, pagesize: "20"},
            {id: 4, pagesize: "50"}
        ];
        $scope.selectValue = $scope.pageList[0];
        $scope.itemsPerPage = $scope.selectValue.pagesize;//每页显示多少条数据
        $scope.currentPage=1;
        $scope.maxSize = 5;//最大显示几条页码
        //选择每页显示几条数据
        $scope.getPagesize = function () {
            $scope.currentPage=1;
            initAsklist($scope.currentPage,$scope.selectValue.pagesize,0);
        };
        // 点击改变页码时
        $scope.setNumPage = function () {
            initAsklist($scope.currentPage,$scope.selectValue.pagesize,0);
        };

        //输入页面点击确认事件
        $scope.setInputPage = function () {
            if(parseInt($scope.jumpTo)>$scope.numPages){
                $scope.jumpTo = $scope.numPages;
            }
            $scope.currentPage = $scope.jumpTo;
            initAsklist($scope.currentPage,$scope.selectValue.pagesize,0);
        };

        // 点击搜索
        $scope.asksearch = function () {
            initAsklist($scope.currentPage,$scope.selectValue.pagesize,0);
        }
        $scope.mainSearch = function () {
            initAsklist($scope.currentPage,$scope.selectValue.pagesize,0);
        }
        $scope.jumpToConsult = function () {
            $state.go("institutionSideBar.institution_common_detail");
        }
        // 首次进入页面初始化数据
        initAsklist(1,5,0);//列表数据
        initComplete();//完成数量
        $scope.totalCount = initAsklist(1,5,0);
        // 数量初始化
        $scope.getAskAll = function(){
            $("#totalCount").addClass("active").parent().siblings().children("button").removeClass("active");
            initAsklist($scope.currentPage,$scope.selectValue.pagesize, 0);
        }
        // 已完成
        $scope.getCompletedAsk = function(){
            $("#hasCompleted").addClass("active").parent().siblings().children("button").removeClass("active");
            initAsklist($scope.currentPage,$scope.selectValue.pagesize, 4);
        }
        //未完成咨询
        $scope.getUnfinishedAsk = function(){
            $("#unCompleted").addClass("active").parent().siblings().children("button").removeClass("active");
            initAsklist($scope.currentPage,$scope.selectValue.pagesize, -1);
        }

        // 初始化专家咨询列表数据和总条数
        function initAsklist(page, pageSize,status) {
            var data = {
                userid: userMessage[0].userid,
                status: status
            };
            data.asktype = 1;
            if ($scope.patientInfo!=undefined) {
                data.term = $scope.patientInfo;
            }
            var count;
            institutionService.getInstExpAskListCount(data).then(function (res) {
                var result = res.result;
                if (result == 0) {
                    $scope.totalItems = JSON.parse(res.message);
                    count = JSON.parse(res.message);
                } else if (result == -1) {
                    alert("获取咨询数据失败");
                } else {
                    alert("未知错误");
                }
            }),function (error) {alert("服务器异常");}
            if (count < 1) {
                return;
            }
            data.curpage=page;
            data.pagesize = pageSize;
            institutionService.getInstExpAskListDetail(data).then(function (res) {
                var result = res.result;
                if (result == 0) {
                    var message = JSON.parse(res.message);
                    if (message) {
                        for (var i = 0; i < message.length; i++) {
                            var obj = message[i];
                            obj.imagePath = file_url+'public/thumb/' + obj.imageid + '/' + obj.thumb;
                            obj.patientAge = institutionService.getAge(obj.birthday);
                            obj.gender = obj.sex ==0?($scope.gender="男"):($scope.gender="女")
                        }
                        $scope.expAskLists = message;
                    }
                }
            })
                ,function (error) {
                alert("服务器异常");
            }

            return count;
        }
        // 初始化数量统计
        function initComplete() {
            var data={
                userid :userMessage[0].userid,
                asktype:1
            };
            institutionService.getInstExpCompleteAskCount(data)
                .then(function (res) {
                    var result = res.result;
                    if (result == 0) {
                        var message = JSON.parse(res.message);
                        console.log("====",message);
                        if (message) {
                            $scope.totalCount = message.askCount;
                            $scope.hasCompleted = message.completedAskCount;
                            $scope.unCompleted = message.unfinishedAskCount;
                        }else if (result == -1) {
                            alert("获取咨询数据失败");
                        } else {
                            alert("未知错误");
                        }
                    }
                })
                ,function (error) {alert("服务器异常");}
        }

    }]);

})(angular);
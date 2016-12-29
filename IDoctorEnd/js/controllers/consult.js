(function (angular) {
    var app = angular.module('consultApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
    app.controller('consultController', ['$scope', '$state', 'doctorService',
        function ($scope, $state, doctorService) {
            //从localStorage得到登录者的基本信息
            var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
            //user姓名
            if(userMessage){
                $scope.logName = userMessage[0].truename;
            }else{
                $state.go("login");
            }
            var file_url = "";
            // 获取地址ip
            doctorService.getImgHTTP().then(function (response) {
                var urls = response.message.split(";");
                file_url = urls[0];
            }, function (error) {
                alert("获取地址失败");
            });
            //跳转到专家咨询页面
            $scope.jumpToConsult = function () {
                $state.go("sidebar.expertconsult");
            };

            //分页下拉菜单
            $scope.pageList = [
                {id: 1, pagesize: "20"},
                {id: 2, pagesize: "50"},
                {id: 3, pagesize: "100"},
                {id: 4, pagesize: "150"}
            ];
            $scope.selectValue = $scope.pageList[0];
            $scope.itemsPerPage = $scope.selectValue.pagesize;
            $scope.currentPage = 1;
            $scope.maxSize = 5;
            //选择每页显示几条数据
            $scope.getPagesize = function () {
                $scope.currentPage = 1;
                getConsultTableData($scope.currentPage, $scope.selectValue.pagesize, 0);
            };
            // 点击改变页码时
            $scope.setNumPage = function () {
                getConsultTableData($scope.currentPage, $scope.selectValue.pagesize, 0);
            };

            //输入页面点击确认事件
            $scope.setInputPage = function () {
                if (parseInt($scope.jumpTo) > $scope.numPages) {
                    $scope.jumpTo = $scope.numPages;
                }
                $scope.currentPage = $scope.jumpTo;
                getConsultTableData($scope.currentPage, $scope.selectValue.pagesize, 0);
            };

            $scope.mainSearch = function () {
                getConsultTableData($scope.currentPage, $scope.selectValue.pagesize, 0);
                // initComplete();
            };
// 首次进入页面初始化数据
            getConsultTableData($scope.currentPage, $scope.selectValue.pagesize, 0);//列表数据
            initComplete();//完成数量
            $scope.totalCount = getConsultTableData($scope.currentPage, $scope.selectValue.pagesize, 0);
            // 点击搜索
            $scope.asksearch = function () {
                getConsultTableData($scope.currentPage, $scope.selectValue.pagesize, 0);//列表数据
            };
            // 数量初始化
            $scope.getAskAll = function () {
                $("#totalCount").addClass("active").parent().siblings().children("button").removeClass("active");
                getConsultTableData($scope.currentPage, $scope.selectValue.pagesize, 0);
            };
            // 已完成
            $scope.getCompletedAsk = function () {
                $("#hasCompleted").addClass("active").parent().siblings().children("button").removeClass("active");
                getConsultTableData($scope.currentPage, $scope.selectValue.pagesize, 4);
            };
            //未完成咨询
            $scope.getUnfinishedAsk = function () {
                $("#unCompleted").addClass("active").parent().siblings().children("button").removeClass("active");
                getConsultTableData($scope.currentPage, $scope.selectValue.pagesize, -1);
            };

            // 初始化专家咨询列表数据和总条数
            function getConsultTableData(page, pageSize, status) {
                //表格中影像图片的缩略图的地址
                var data = {
                    userid: userMessage[0].userid,
                    status: status
                };
                data.asktype = 0;
                if ($scope.patientInfo != undefined) {
                    data.term = $scope.patientInfo;
                }

                var count;
                doctorService.getConsultCount(data).then(function (res) {
                    var result = res.result;
                    console.log("============", res);
                    if (result == 0) {
                        $scope.totalItems = JSON.parse(res.message);
                        count = JSON.parse(res.message);
                    } else if (result == -1) {
                        alert("获取咨询数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function (error) {
                    alert("服务器异常");
                });
                if (count < 1) {
                    return;
                }
                data.curpage = page;
                data.pagesize = pageSize;

                doctorService.getConsultData(data).then(function (res) {
                    var result = res.result;
                    console.log("=======22====22=========2", file_url);
                    if (result == 0) {
                        var message = JSON.parse(res.message);
                        if (message) {
                            for (var i = 0; i < message.length; i++) {
                                var obj = message[i];
                                obj.imagePath = file_url + 'public/thumb/' + obj.imageid + '/' + obj.thumb;
                                obj.patientAge = doctorService.getAge(obj.birthday);
                                obj.gender = obj.sex == 0 ? (obj.gender = "男") : (obj.gender = "女")
                            }
                            $scope.expAskLists = message;
                        }
                    }
                }, function (error) {
                    alert("服务器异常");
                });
                return count;
            }

            // 初始化数量统计
            function initComplete() {
                var data = {
                    userid: userMessage[0].userid,
                    asktype: 0
                };
                doctorService.getConsultCompleteAskCount(data).then(function (res) {
                    var result = res.result;
                    console.log("message==================",JSON.parse(res.message));
                    if (result == 0) {
                        var message = JSON.parse(res.message);
                        if (message) {
                            $scope.totalCount = message.askCount;
                            $scope.hasCompleted = message.completedAskCount;
                            $scope.unCompleted = message.unfinishedAskCount;
                        } else if (result == -1) {
                            alert("获取咨询数据失败");
                        } else {
                            alert("未知错误");
                        }
                    }
                }, function (error) {
                    alert("服务器异常");
                })
            }

        }]);

})(angular);
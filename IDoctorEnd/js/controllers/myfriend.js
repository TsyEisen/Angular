(function (angular) {
    var app = angular.module('myFriendApp', ['ui.bootstrap', 'ui.router']);
    app.config(function ($stateProvider) {
        $stateProvider
            .state("sidebar.addfriend", {
                url: "/addfriend",
                templateUrl: "partialview/addfriend.html"
            });
    });
    app.controller('myFriendController', ['$scope', '$state', '$document', '$uibModal', 'doctorService',
        function ($scope, $state, $document, $uibModal, doctorService) {
            $scope.jumpToAddFriend = function () {
                $state.go("sidebar.addfriend");
            };
            //从localStorage得到登录者的基本信息
            var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
            //user姓名
            if(userMessage){
                $scope.logName = userMessage[0].truename;
            }else{
                $state.go("login");
            }
            $scope.pageList = [
                {id: 1, pagesize: "20"},
                {id: 2, pagesize: "50"},
                {id: 3, pagesize: "100"},
                {id: 4, pagesize: "150"}
            ];
            $scope.selectValue = $scope.pageList[0];
            $scope.itemsPerPage = $scope.selectValue.pagesize;
            //选择每页显示多少条数据
            $scope.maxSize = 5;//最大显示几条页码
            //定义一个groupID
            var groupID = "";
            var getGroup = function () {
                var info = {
                    "instid": userMessage[0].userid
                };
                console.log("INFO", info);
                doctorService.getFriendGroup(info).then(function (response) {
                    console.log("getFriendGroup", response);
                    var result = response.result;
                    if (result == 0) {
                        var groupMessage = JSON.parse(response.message);
                        console.log("groupMessage", groupMessage);
                        $scope.group = groupMessage;
                        ////初始换选择第一组
                        if (groupMessage.length > 0 && $scope.group.gname !== "") {
                            $scope.groupname = $scope.group[0].gname;
                        }
                        groupID = $scope.group[0].groupid;
                        getAllListData(1);
                    } else if (result == -1) {
                        alert("获取分组数据失败")
                    } else {
                        alert("未知错误")
                    }
                }, function (error) {

                });
            };
            getGroup();
            $scope.current = 0;
            $scope.changeList = function (index) {
                $scope.current = index;
                $scope.friendTerm = "";
                groupID = $scope.group[index].groupid;
                var groupname = $scope.group[index].gname;
                $scope.groupname = groupname;
                getAllListData(1)
            };

            //删除好友分组
            $scope.removeGroup = function (groupid) {
                if (!confirm("确定要删除分组吗？")) {
                    return false;
                }
                var info = {
                    "groupid": groupid,
                    "instid": userMessage[0].userid
                };
                doctorService.removeFriendGroup(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        alert("删除分组成功");
                        getGroup();
                    } else if (result == -1) {
                        alert("删除分组失败");
                    } else {
                        alert("未知错误");
                    }
                }, function (error) {
                    alert("服务器异常");
                })
            };

            //编辑朋友圈分组模态框模块
            $scope.editGroup = function (groupid, gname) {
                var editGroupModalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'editFriendGruopModal.html',
                    controller: 'editFriendGroupModalInstanceCtrl',
                    backdrop: "static",
                    resolve: {
                        groupInfo: function () {
                            var info = {
                                "instid": userMessage[0].userid,
                                "groupid": groupid,
                                "gname": gname
                            };
                            return info
                        }
                    }
                });
                editGroupModalInstance.result.then(function (result) {
                    if(result==0){
                        getGroup();
                    }
                }, function () {

                });
            };
            //编辑朋友圈分组模态框模块


            //获取病例列表总数
            var getFriendCount = function (info) {
                doctorService.getFriendCount(info).then(function (response) {
                    var result = response.result;
                    //console.log("getFriendCountresponse",response);
                    if (result == 0) {
                        var message = JSON.parse(response.message);
                        if (message) {
                            $scope.totalItems = message;
                        } else {
                            $scope.totalItems = 0
                        }
                    } else if (result == -1) {
                        alert("获取分组数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function (error) {

                });
            };
            //获取病例列表数据
            var getFriendData = function (info) {
                //表格中影像图片的缩略图的地址
                var file_url = "";
                doctorService.getImgHTTP().then(function (response) {
                    var urls = response.message.split(";");
                    file_url = urls[0];
                }, function (error) {

                });
                doctorService.getFriendData(info).then(function (response) {
                    console.log("getFriendDatamessage", JSON.parse(response.message));
                    var result = response.result;
                    if (result == 0) {
                        var message = JSON.parse(response.message);
                        if (message) {
                            for (var i = 0; i < message.length; i++) {
                                //gender=0为男，否则为女
                                if (message[i].gender == 1) {
                                    message[i].gender = "男"
                                } else {
                                    message[i].gender = "女"
                                }
                                message[i].birthday = doctorService.getAge(message[i].birthday);
                                //    //患者头像
                                if (message[i].headpic) {
                                    message[i].headpic = file_url + 'public/pic/' + message[i].userid + '/'
                                        + message[i].headpic;
                                } else {
                                    message[i].headpic = '/IDoctorEnd/image/errorPatientHeaderPic.png';
                                }
                            }
                            $scope.friendList = message;
                        }
                    } else if (result == -1) {
                        alert("获取分组数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function (error) {

                });
            };

            var getAllListData = function (curpage,message) {
                //初始化当前页为第一页
                if (curpage == undefined) {
                    curpage = 1;
                    $scope.currentPage = 1;
                }
                var info = {
                    "instid": userMessage[0].userid,
                    "groupid": groupID,
                    "curpage": curpage,
                    "pagesize": $scope.selectValue.pagesize
                };
                //搜索框搜索，不传groupid
                if($scope.friendTerm){
                    info.term = $scope.friendTerm;
                    info.groupid = "";
                    $scope.current = 999999999999999;
                    $scope.groupname = "所有分组";
                }
                if(message){
                    info.groupid = "";
                    $scope.current = 999999999999999;
                    $scope.groupname = "所有分组";
                    if(message.gender){
                        info.gender = message.gender;
                    }
                    if(message.term){
                        info.term = message.term;
                    }
                }
                getFriendData(info);
                getFriendCount(info);

            };
            getAllListData();
            $scope.getPagesize = function () {
                $scope.itemsPerPage = $scope.selectValue.pagesize;
                getAllListData($scope.currentPage);
            };
            //点击页码事件
            $scope.setNumPage = function () {
                getAllListData($scope.currentPage);
                $scope.jumpTo = '';
            };
            //输入页面点击确认事件
            $scope.setInputPage = function () {
                if(!isNaN($scope.jumpTo)){
                    //输入页码不能大与最大页码
                    if (parseInt($scope.jumpTo) > $scope.numPages) {
                        $scope.jumpTo = $scope.numPages
                    }
                    $scope.currentPage = $scope.jumpTo;
                    getAllListData($scope.currentPage);
                }else{
                    alert("请输入正确页码")
                }

            };
            //回车事件
            $scope.pageKeyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                if (keycode == 13) {
                    $scope.setInputPage();//如果等于回车键编码执行方法
                }
            };
            //搜索框搜索
            $scope.friendTermData=function(){
                getAllListData(1);
            };
            //删除医生
            $scope.removeDoctor = function(groupid,userid,username){
                if (!confirm("确定要删除医生朋友(" + username + ")吗？")) {
                    return false;
                }
                var info = {
                    "groupid":groupid,
                    "doctorid": userid
                };
                doctorService.removeDoctor(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        alert("删除医生成功");
                        getAllListData($scope.currentPage);
                    } else if (result == -1) {
                        alert("删除分组失败");
                    } else {
                        alert("未知错误");
                    }
                }, function (error) {
                    alert("服务器异常");
                })
            };
            //新建分组模态框模块
            $scope.newFriendGroup = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'newBuildFriendGruopModal.html',
                    controller: 'newFriendGroupModalInstanceCtrl',
                    backdrop: "static",
                    resolve: {
                        userid: function () {
                            return userMessage[0].userid
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result == 0) {
                        getGroup();
                    }
                }, function () {

                });
            };
//新建分组模态框模块

            //高级搜索
            $scope.highSerach = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'doctorFriendHighSearchModal.html',
                    controller: 'doctorFriendHighSearchInstanceCtrl',
                    backdrop: "static"
                });
                modalInstance.result.then(function (message) {
                    getAllListData($scope.currentPage,message);
                }, function () {

                });
            }
        }]);

    //新建分组模态窗口的实例
    app.controller('newFriendGroupModalInstanceCtrl', ['$scope', '$uibModalInstance', 'userid', 'doctorService',
        function ($scope, $uibModalInstance, userid, doctorService) {
            $scope.ensure = function () {
                if ($scope.newGroupName) {
                    var info = {
                        "gname": $scope.newGroupName,
                        "instid": userid
                    };
                    console.log("info", info);
                    doctorService.addFriendGroup(info).then(function (response) {
                        var result = response.result;
                        console.log("response", response);
                        if (result == 0) {
                            alert("添加分组成功");
                            $uibModalInstance.close(result);
                        } else if (result == 1) {
                            alert("分组名已存在")
                        } else if (result == -1) {
                            alert("添加分组失败");
                        }
                    }, function (error) {

                    });
                } else {
                    alert("请输入分组名称！")
                }
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]);

    //编辑分组模态窗口的实例
    app.controller('editFriendGroupModalInstanceCtrl', ['$scope', '$uibModalInstance', 'groupInfo', 'doctorService',
        function ($scope, $uibModalInstance, groupInfo, doctorService) {
            //$scope.groupName = groupInfo.gname;
            $scope.groupEditName = groupInfo.gname;
            $scope.ensure = function () {
                if ($scope.groupEditName) {
                    var info = {
                        "instid": groupInfo.instid,
                        "gname": $scope.groupEditName,
                        "groupid": groupInfo.groupid
                    };

                    doctorService.editFriendGroup(info).then(function (response) {
                        var result = response.result;
                        if (result == 0) {
                            alert("编辑分组成功");
                            $uibModalInstance.close(result);
                        } else if (result == 1) {
                            alert("分组名已存在");
                        } else if (result == -1) {
                            alert("编辑分组失败");
                        } else {
                            alert("编辑分组失败");
                        }
                    }, function () {

                    });
                } else {
                    alert("请输入分组名称")
                }
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]);
    //高级搜索弹出框实例
    app.controller('doctorFriendHighSearchInstanceCtrl', ['$scope', '$uibModalInstance', 'doctorService',
        function ($scope, $uibModalInstance, doctorService) {
            $scope.ensure = function () {
                $uibModalInstance.close($scope.high);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]);
})(angular);
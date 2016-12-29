/**
 * Created by Administrator on 2016/12/27.
 */
(function (angular) {
   angular.module('InstshareApp', [ 'ui.router'])
    .controller('Inst_shareController', ['$scope', '$state', '$location', '$window', '$state', '$uibModal', 'doctorService',
        function ($scope, $state, $location, $window, $state, $uibModal, doctorService) {
            //跳转到新增分享页面
            $scope.jumpToAdd = function () {
                $state.go("institutionSideBar.institution_addshare");
            };
            //从localStorage得到登录者的基本信息
            var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
            //user姓名
            if (userMessage) {
                $scope.logName = userMessage[0].truename;
            } else {
                $state.go("login");
            }

            //分页下拉菜单
            $scope.pageList = [
                {id: 1, pagesize: "20"},
                {id: 2, pagesize: "50"},
                {id: 3, pagesize: "100"},
                {id: 4, pagesize: "150"}
            ];
            $scope.selectValue = $scope.pageList[0];
            $scope.itemsPerPage = $scope.selectValue.pagesize;
            $scope.maxSize = 5;

            function getShareCount(info) {
                doctorService.getShareCount(info).then(function (response) {
                    console.log("getShareCount===", response);
                    console.log("getShareCount.message===", JSON.parse(response.message));
                    var result = response.result;
                    if (result == 0) {
                        var message = JSON.parse(response.message);
                        if (message) {
                            $scope.totalItems = message
                        } else {
                            $scope.totalItems = 0
                        }
                    } else if (result == -1) {
                        alert("获取用户数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function () {

                });

            }

            function getShareTableData(info) {
                //表格中影像图片的缩略图的地址
                var file_url = "";
                doctorService.getImgHTTP().then(function (response) {
                    var urls = response.message.split(";");
                    file_url = urls[0];
                }, function (error) {

                });
                doctorService.getShareData(info).then(function (response) {
                    console.log("getShareData===", response);
                    console.log("getShareData.message===", JSON.parse(response.message));
                    var result = response.result;
                    if (result == 0) {
                        var getArr = JSON.parse(response.message);
                        if (getArr) {
                            for (var i = 0; i < getArr.length; i++) {
                                //影像缩略图
                                getArr[i].image = file_url + 'public/thumb/' + getArr[i].imageid + '/'
                                    + 'thumb.jpg';
                                //二维码
                                getArr[i].qrfile = file_url + 'public/qrcode/' + getArr[i].qrfile;
                                getArr[i].urlA = "/idoctor/s/" + getArr[i].url;
                            }
                        }
                        $scope.sharedetail = getArr;
                    } else if (result == -1) {
                        alert("获取用户数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function () {
                    alert("服务器异常");
                });
            }

            function getAllShareData(curpage, message) {
                //初始化当前页为第一页
                if (curpage == undefined) {
                    curpage = 1;
                    $scope.currentPage = 1;
                }
                var info = {
                    "userid": userMessage[0].userid + "",
                    "curpage": curpage,
                    "pagesize": $scope.selectValue.pagesize
                };
                if ($scope.shareTerm) {
                    info.term = $scope.shareTerm;
                }
                if ($scope.shareTotalTerm) {
                    info.term = $scope.shareTotalTerm;
                }
                //message高级搜索返回结果
                if (message) {
                    if (message.term) {
                        info.term = message.term
                    }
                    if (message.sharetime) {
                        info.sharetime = message.sharetime
                    }
                    if (message.endtime) {
                        info.endtime = message.endtime
                    }
                }
                getShareTableData(info);
                getShareCount(info);
            }

            getAllShareData();
            //搜索
            $scope.search = function () {
                getAllShareData(1);
            };
            //模糊搜索
            $scope.mainSearch = function () {
                getAllShareData(1);
            };
            //改变footer下拉菜单
            $scope.getPagesize = function () {
                $scope.itemsPerPage = $scope.selectValue.pagesize;
                getAllShareData($scope.currentPage);
            };
            //点击页码
            $scope.setNumPage = function () {
                getAllShareData($scope.currentPage);
                $scope.jumpTo = '';
            };
            //输入页面点击确认事件
            $scope.setInputPage = function () {
                //输入页码不能大与最大页码
                if (parseInt($scope.jumpTo) > $scope.numPages) {
                    $scope.jumpTo = $scope.numPages
                }
                $scope.currentPage = $scope.jumpTo;
                getAllShareData($scope.currentPage);
            };
            //回车事件
            $scope.pageKeyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                if (keycode == 13) {
                    $scope.setInputPage();//如果等于回车键编码执行方法
                }
            };

            //删除分享
            $scope.removeShare = function (shareid) {
                if (!confirm("确定要删除分享吗？")) {
                    return false;
                }
                var info = {
                    "shareid": shareid
                };
                doctorService.deleteShare(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        alert("删除分享成功");
                        getAllShareData($scope.currentPage);
                    } else if (result == -1) {
                        alert("删除分享失败");
                    } else {
                        alert("未知错误");
                    }
                }, function () {
                    alert("服务器异常");
                });
            };

            //点击链接地址事件
            $scope.jumpToLink = function (shareid) {
                if (shareid) {
                    $window.location.href = "http://localhost:8088/idoctor/html/imageshare.html?shareid=" + shareid;
                }
            };
            //高级搜索功能
            $scope.highSearch = function () {
                var highSearchModalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'highSearchModal.html',
                    controller: 'highSearchModalInstanceCtrl',
                    backdrop: "static"
                });
                highSearchModalInstance.result.then(function (message) {
                    getAllShareData(1, message);
                }, function () {

                });

            };

            $scope.changeShare = function (sharemessage) {
                var changeShareModalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'changeShareModal.html',
                    controller: 'changeShareModalInstanceCtrl',
                    backdrop: "static",
                    resolve: {
                        shareMessage: function () {
                            return {
                                "data": sharemessage,
                                "curpage": $scope.currentPage
                            }
                        }
                    }
                });
                changeShareModalInstance.result.then(function (message) {//这是一个接收模态框返回值的函数
                    console.log("returnMessage", message);
                    //status=1,删除分享，status=2，修改分享
                    if (message.status == 1) {
                        $scope.removeShare(message.shareid);
                    }
                    if (message.status == 2) {
                        getAllShareData(message.curpage);
                    }

                }, function () {

                });

            };
        }])
    //高级搜索的模态窗口的实例
   .controller('highSearchModalInstanceCtrl', ['$scope', '$uibModalInstance', 'doctorService',
        function ($scope, $uibModalInstance, doctorService) {
            //时间选择器初始化
            $scope.shareStartPlaceholder = "分享开始时间";
            $scope.shareEndPlaceholder = "分享截止时间";
            $scope.shareStartOptions = {
                startingDay: 1,
                showWeeks: false,
                maxDate: $scope.shareEndTime
            };
            $scope.shareEndOptions = {
                startingDay: 1,
                showWeeks: false,
                minDate: $scope.shareStartTime
            };
            $scope.$watch('shareEndTime', function (newValue, oldValue) {
                $scope.shareStartOptions.maxDate = newValue;
            });
            $scope.$watch('shareStartTime', function (newValue, oldValue) {
                $scope.shareEndOptions.minDate = newValue;
            });
            //取消关闭高级搜索框
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $scope.ensure = function () {
                var message = {};
                message.term = $scope.shareTit;
                message.sharetime = doctorService.dataFormat($scope.shareStartTime);
                message.endtime = doctorService.dataFormat($scope.shareEndTime);
                $uibModalInstance.close(message);
            }

        }])
    //分享详细模态框实例
    .controller('changeShareModalInstanceCtrl', ['$scope', '$state', '$window', '$uibModalInstance', 'shareMessage', 'doctorService',
        function ($scope, $state, $window, $uibModalInstance, shareMessage, doctorService) {
            $scope.share = {};
            var init = {};
            init.checkcode = shareMessage.data.checkcode;
            init.privacy = shareMessage.data.privacy;
            init.anonymous = shareMessage.data.anonymous;
            init.endtime = shareMessage.data.endtime;
            $scope.sharePrivacy = [
                {"privacyCon": "完全公开", "privacyValue": 0},
                //{"privacyCon":"只有本网站的注册医生才可以查看","privacyValue":1},
                //{"privacyCon":"只有本网站的用户才可以查看","privacyValue":2},
                {"privacyCon": "只有获得验证码的才可以查看", "privacyValue": 3}
            ];
            $scope.shareAnonymous = [
                {"anonymousCon": "否", "anonymousValue": 0},
                {"anonymousCon": "是", "anonymousValue": 1}
            ];
            $scope.endOptions = {
                startingDay: 1,
                showWeeks: false
            };
            $scope.endTimeOpen = function () {
                $scope.endOpened = true;
            };
            //分享设置内容不可编辑
            $scope.disabled = true;
            $scope.editShare = function () {
                $scope.disabled = false;
                $scope.show = true;
            };
            $scope.save = function () {
                $scope.show = false;
                $scope.disabled = true;
            };
            $scope.cancelEdit = function () {
                $scope.share.checkcode = init.checkcode;
                $scope.share.privacy = init.privacy;
                $scope.share.anonymous = init.anonymous;
                $scope.endtime = init.endtime;
                $scope.disabled = true;
                $scope.show = false;
            };
            //分享信息,$scope.share
            //var shareInfo = shareMessage;

            $scope.share = shareMessage.data;
            $scope.endtime = shareMessage.data.endtime;
            var info = shareMessage.data.imageid;
            //$scope.share = shareMessage.data;
            //$scope.endtime = shareMessage.data.endtime;
            //影像信息内容,$scope.imgInfo
            doctorService.ShareDetailImgData(info).then(function (response) {
                var result = response.result;
                if (result == 0) {
                    var message = JSON.parse(response.message);
                    if (message) {
                        $scope.imgInfo = message
                    }
                } else if (result == -1) {
                    alert("获取影像数据失败");
                } else {
                    alert("无影像数据");
                }
            }, function () {
                alert("服务器异常");
            });

            $scope.detailRemoveShare = function (shareid) {
                //status==1为删除分享
                var message = {
                    "status": 1,
                    "shareid": shareid,
                    "curpage": shareMessage.curpage
                };
                $uibModalInstance.close(message);
            };
            $scope.save = function () {
                var info = $scope.share;
                delete info.image;
                delete info.urlA;
                var index = info.qrfile.lastIndexOf("\/");
                info.qrfile = info.qrfile.substring(index + 1, info.qrfile.length);
                info.endtime = doctorService.dataFormat($scope.endtime);
                if (!info.endtime) {
                    alert("请选择分享截止时间");
                    return
                }
                doctorService.updateShareSet(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        alert("修改分享设置成功");
                        var message = {
                            "status": 2,
                            "curpage": shareMessage.curpage
                        };
                        $uibModalInstance.close(message);
                    } else if (result == -1) {
                        alert("修改分享设置失败");
                    } else {
                        alert("未知错误");
                    }
                }, function () {
                    alert("服务器异常");
                });

            };
            $scope.cancel = function () {
                $scope.share.checkcode = init.checkcode;
                $scope.share.privacy = init.privacy;
                $scope.share.anonymous = init.anonymous;
                $scope.endtime = init.endtime;
                $uibModalInstance.dismiss('cancel');
            };
            //新分享
            $scope.newShare = function () {
                $uibModalInstance.dismiss('cancel');
                $state.go("sidebar.addshare");
            };
            //转发到
            $scope.forwardShare = function (url) {
                var share_url = "http://" + document.location.host + "/idoctor/s/"
                    + url;
                var p = {
                    url: share_url,
                    showcount: '1', /*是否显示分享总数,显示：'1'，不显示：'0' */
                    desc: '', /*默认分享理由(可选)*/
                    summary: '', /*分享摘要(可选)*/
                    title: '', /*分享标题(可选)*/
                    site: '', /*分享来源 如：腾讯网(可选)*/
                    pics: '', /*分享图片的路径(可选)*/
                    style: '203',
                    width: 98,
                    height: 22
                };
                var s = [];
                for (var i in p) {
                    s.push(i + '=' + encodeURIComponent(p[i] || ''));
                }
                var qzoneShareUrl = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?"
                    + s.join('&');

                $window.location.href = qzoneShareUrl;
            };
            //链接地址
            $scope.shareLink = function (url) {
                $window.location.href = "/idoctor/s/" + url;
            }
        }]);
})(angular);




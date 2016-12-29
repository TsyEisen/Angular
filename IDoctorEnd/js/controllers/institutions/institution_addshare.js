/**
 * Created by Administrator on 2016/12/27.
 */
(function (angular) {
    var app = angular.module('inst_addShareApp', ['ui.bootstrap']);
    app.controller('inst_addShareController', ['$scope', '$state', '$window', '$uibModal', 'doctorService', 'institutionService', '$filter',
        function ($scope, $state, $window, $uibModal, doctorService, institutionService, $filter) {
            //从localStorage得到登录者的基本信息
            var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
            //user姓名
            $scope.logName = userMessage[0].truename;

            $scope.backToImg = function () {
                $state.go('sidebar.addShareApp');
            };

            //影像分页下拉菜单
            $scope.pageImgList = [
                {id: 1, pagesize: "5"},
                {id: 2, pagesize: "10"},
                {id: 3, pagesize: "20"},
                {id: 4, pagesize: "30"}
            ];
            $scope.selectImgValue = $scope.pageImgList[0];
            $scope.itemsImgPerPage = $scope.selectImgValue.pagesize;
            $scope.maxSize = 5;

            //病例分页下拉菜单
            $scope.pageCardList = [
                {id: 1, pagesize: "5"},
                {id: 2, pagesize: "10"},
                {id: 3, pagesize: "20"},
                {id: 4, pagesize: "30"}
            ];
            $scope.selectCardValue = $scope.pageCardList[0];
            $scope.itemsCardPerPage = $scope.selectCardValue.pagesize;


            function getImageList(info) {
                //表格中影像图片的缩略图的地址
                var file_url = "";
                doctorService.getImgHTTP().then(function (response) {
                    var urls = response.message.split(";");
                    file_url = urls[0];
                }, function (error) {

                });
                doctorService.getMyImgListData(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        var message = JSON.parse(response.message);
                        console.log("message", message);
                        if (message) {
                            for (var i = 0; i < message.length; i++) {
                                var obj = message[i];
                                //影像缩略图
                                obj.image = file_url + 'public/thumb/' + obj.imageid + '/'
                                    + 'thumb.jpg';
                                //sex=0为男，否则为女
                                obj.sex = obj.sex == 0 ? "男" : "女";
                                //年龄
                                obj.birthday = doctorService.getAge(obj.birthday);
                                getBigAskStatus(obj, i);
                                getNormalAskStatus(obj, i);
                                console.log("message", message);
                                console.log("obj", obj);
                            }
                        }
                        $scope.imageTableData = message;
                    } else if (result == -1) {
                        alert("获取影像数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function (error) {
                    alert("服务器异常");
                });
            }

            // 影像列表常专家询数量
            function getBigAskStatus(imageObj, index) {
                var data = {};
                data.imageid = imageObj.imageid;
                data.curpage = 1;
                data.pagesize = 100;
                data.asktype = 0;
                data.adduser = userMessage[0].userid;
                doctorService.getInstExpAskStatus(data).then(function (res) {
                    var result = res.result;
                    console.log("res.message", res.message);
                    if (result == 0) {
                        var message = JSON.parse(res.message);
                        if (message) {
                            var totalAsk = message.length;
                            imageObj.expCount = totalAsk;
                            return imageObj.expCount
                        } else if (result == -1) {
                            alert("获取影像数据失败");
                        } else {
                            alert("未知错误");
                        }
                    }
                }, function (error) {
                    //alert("服务器异常");
                })

            }

            // 影像列表常规咨询数量
            function getNormalAskStatus(imageObj, index) {
                var data = {};
                data.imageid = imageObj.imageid;
                data.curpage = 1;
                data.pagesize = 100;
                data.asktype = 0;
                data.adduser = userMessage[0].userid;
                doctorService.getInstComAskStatus(data).then(function (res) {
                    var result = res.result;
                    if (result == 0) {
                        var message = JSON.parse(res.message);
                        if (message) {
                            var totalAsk = message.length;
                            imageObj.commonAskCount = totalAsk;
                        } else if (result == -1) {
                            alert("获取影像数据失败");
                        } else {
                            alert("未知错误");
                        }
                    }
                }, function (error) {
                    alert("服务器异常");
                })

            }

            function getImageCount(info) {
                doctorService.getMyImgListCount(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        var message = JSON.parse(response.message);
                        if (message) {
                            $scope.totalImgItems = message
                        } else {
                            $scope.totalImgItems = 0
                        }
                    } else if (result == -1) {
                        alert("获取影像数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function (error) {
                    alert("服务器异常");
                });

            }

            function getAllImageData(curpage, message) {
                //初始化当前页为第一页
                if (curpage == undefined) {
                    curpage = 1;
                    $scope.currentImgPage = 1;
                }
                var sortorduploadtime = 'desc';
                var sortord = 'uploadtime ' + sortorduploadtime;
                var info = {
                    "userid": userMessage[0].userid + "",
                    "havereport": -1,
                    "haveask": -1,
                    "sortord": sortord,
                    "curpage": curpage,
                    "pagesize": $scope.selectImgValue.pagesize
                };
                if ($scope.imgAskTerm) {
                    info.term = $scope.imgAskTerm;
                }
                if (message) {
                    if (message.truename) {
                        info.truename = message.truename
                    }
                    if (message.patientid) {
                        info.patientid = message.patientid
                    }
                    if (message.uploadstarttime) {
                        info.uploadstarttime = message.uploadstarttime
                    }
                    if (message.uploadendtime) {
                        info.uploadendtime = message.uploadendtime
                    }
                    if (message.studystarttime) {
                        info.studystarttime = message.studystarttime
                    }
                    if (message.studyendtime) {
                        info.studyendtime = message.studyendtime
                    }
                }
                getImageList(info);
                getImageCount(info);
            }

            getAllImageData();


            //imgList搜索
            $scope.imgSearch = function () {
                getAllImageData($scope.currentImgPage);
            };
            //改变imageList下拉菜单
            $scope.getImgPagesize = function () {
                $scope.itemsImgPerPage = $scope.selectImgValue.pagesize;
                getAllImageData($scope.currentImgPage);
            };
            //点击imageList页码
            $scope.setImgNumPage = function () {
                getAllImageData($scope.currentImgPage);
                $scope.jumpImgTo = '';
            };
            //imageList输入页面点击确认事件
            $scope.setInputImgPage = function () {
                //输入页码不能大与最大页码
                if (parseInt($scope.jumpImgTo) > $scope.numImgPages) {
                    $scope.jumpImgTo = $scope.numImgPages
                }
                $scope.currentImgPage = $scope.jumpImgTo;
                getAllImageData($scope.currentImgPage);
            };
            //imageList回车事件
            $scope.pageImgKeyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                if (keycode == 13) {
                    $scope.setInputImgPage();//如果等于回车键编码执行方法
                }
            };


            function getCardList(info) {
                //表格中影像图片的缩略图的地址
                var file_url = "";
                doctorService.getImgHTTP().then(function (response) {
                    var urls = response.message.split(";");
                    file_url = urls[0];
                }, function (error) {
                });
                doctorService.getCardData(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        var message = JSON.parse(response.message);
                        console.log("messageDATA", message);
                        if (message) {
                            for (var i = 0; i < message.length; i++) {
                                //患者头像
                                if (message[i].headpic) {
                                    message[i].headpic = file_url + 'public/card/' + message[i].cardid + '/'
                                        + message[i].headpic;
                                } else {
                                    message[i].headpic = '/IDoctorEnd/image/errorPatientHeaderPic.png';
                                }
                                //gender=0为男，否则为女
                                if (message[i].gender == 1) {
                                    message[i].gender = "男"
                                } else {
                                    message[i].gender = "女"
                                }
                            }
                            $scope.cardTableData = message;
                        }
                    } else if (result == -1) {
                        alert("获取病例数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function (error) {
                    alert("服务器异常");
                });
            }

            function getCardCount(info) {
                doctorService.getCardCount(info).then(function (response) {
                    console.log("getCardCount===", response);
                    console.log("getCardCount.message===", JSON.parse(response.message));
                    var result = response.result;
                    if (result == 0) {
                        var message = JSON.parse(response.message);
                        if (message) {
                            $scope.totalCardItems = message
                        } else {
                            $scope.totalCardItems = 0
                        }
                    } else if (result == -1) {
                        alert("获取病例数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function (error) {
                    alert("服务器异常");
                });

            }

            function getAllCardData(curpage, message) {
                //初始化当前页为第一页
                if (curpage == undefined) {
                    curpage = 1;
                    $scope.currentCardPage = 1;
                }
                var sortorduploadtime = 'desc';
                var sortord = 'uploadtime ' + sortorduploadtime;
                var info = {
                    "userid": userMessage[0].userid + "",
                    "curpage": curpage,
                    "pagesize": $scope.selectCardValue.pagesize
                };
                if ($scope.cardAskTerm) {
                    info.term = $scope.cardAskTerm;
                }
                if (message) {
                    if (message.patientname) {
                        info.patientname = message.patientname;
                    }
                    if (message.patientid) {
                        info.patientid = message.patientid;
                    }
                    if (message.age) {
                        info.age = message.age;
                    }
                    if (message.gender) {
                        info.gender = message.gender;
                    }
                    if (message.visittime) {
                        info.visittime = doctorService.dataFormat(message.visittime);
                    }
                }
                getCardList(info);
                getCardCount(info);
            }

            getAllCardData();


            //cardList搜索
            $scope.cardSearch = function () {
                getAllCardData($scope.currentCardPage);
            };
            //改变cardList下拉菜单
            $scope.getCardPagesize = function () {
                $scope.itemsCardPerPage = $scope.selectCardValue.pagesize;
                getAllCardData($scope.currentCardPage);
            };
            //点击cardList页码
            $scope.setCardNumPage = function () {
                getAllCardData($scope.currentCardPage);
                $scope.jumpToCard = '';
            };
            //cardList输入页面点击确认事件
            $scope.setCardInputPage = function () {
                //输入页码不能大与最大页码
                if (parseInt($scope.jumpToCard) > $scope.numCardPages) {
                    $scope.jumpToCard = $scope.numCardPages
                }
                $scope.currentCardPage = $scope.jumpToCard;
                getAllCardData($scope.currentCardPage);
            };
            //cardList回车事件
            $scope.pageCardKeyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                if (keycode == 13) {
                    $scope.setCardInputPage();//如果等于回车键编码执行方法
                }
            };

            $scope.sharePrivacy = [
                {"con": "完全公开", "id": 0, "checked": true},
                {"con": "只有获得验证码的才可以查看", "id": 3, "checked": false}
            ];
            //默认为完全公开
            //$scope.privacy = 0;
            $scope.onPrivaryChange = function (value) {
                $scope.privacy = value;
                if ($scope.privacy == 0) {
                    $scope.showCheckcode = false;
                }
                if ($scope.privacy == 3) {
                    $scope.showCheckcode = true;
                }
            };

            //选择一条影像
            $scope.onImgChange = function (imageid) {
                $scope.checkedImgId = imageid;
            };
            //选择一条病例
            $scope.onCardChange = function (cardid) {
                $scope.checkedCardId = cardid;
            };
            $scope.anonymousChange = function () {
                //0否1是
                if ($scope.anonymous == 0 || $scope.anonymous == undefined) {
                    $scope.anonymous = 1;
                } else {
                    $scope.anonymous = 0;
                }
            };
            $scope.shareOptions = {
                startingDay: 1,
                showWeeks: false
            };

            $scope.beginShare = function () {
                var info = {
                    "shareid": 0,
                    "shareuser": userMessage[0].userid
                };
                if ($scope.privacy) {
                    info.privacy = $scope.privacy;
                } else {
                    info.privacy = 0;
                }

                if ($scope.checkedImgId) {
                    info.imageid = $scope.checkedImgId;
                } else {
                    alert("请选择一条影像");
                    return
                }
                if ($scope.shareName == undefined) {
                    alert("请输入分享名称");
                    return
                } else {
                    info.sharename = $scope.shareName;
                }
                if ($scope.showCheckcode == true && $scope.shareCheckcode == undefined) {
                    alert("请输入验证码");
                    return
                } else if ($scope.showCheckcode == true && $scope.shareCheckcode.length != 4) {
                    alert("验证码长度必须为4位");
                    return
                } else {
                    info.checkcode = $scope.shareCheckcode;
                }

                //if ($scope.shareCheckcode == undefined) {
                //    alert("请输入4位验证码");
                //    return
                //} else if ($scope.shareCheckcode.length != 4) {
                //    alert("验证码长度必须为4位");
                //    return
                //} else {
                //    info.checkcode = $scope.shareCheckcode;
                //}
                if ($scope.shareTime == undefined) {
                    alert("请选择分享截止日期");
                    return
                } else {
                    info.endtime = doctorService.dataFormat($scope.shareTime);
                }
                if ($scope.checkedCardId) {
                    info.checkcode = $scope.checkedCardId;
                }
                if ($scope.anonymous) {
                    info.anonymous = $scope.anonymous;
                }
                console.log("INFO", info);
                doctorService.newShareSet(info).then(function (response) {
                    var result = response.result;
                    console.log("result", result);
                    if (result == 0) {
                        console.log("response.message", JSON.parse(response.message));
                        var message = JSON.parse(response.message);
                        if (message) {
                            $scope.addShareSuccess(message);
                        }

                    } else if (result == -1) {
                        alert("操作失败");
                    } else {
                        alert("未知错误");
                    }
                }, function () {
                    alert("服务器异常");
                });


            };

            //影像列表高级搜索按钮
            $scope.imgHighSearch = function () {
                var imgModalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'addShareImgHighSearchModal.html',
                    controller: 'addShareImgModalInstanceCtrl',
                    backdrop: "static"
                });
                imgModalInstance.result.then(function (message) {
                    getAllImageData($scope.currentImgPage, message);
                }, function () {

                });
            };


            //病例列表高级搜索按钮
            $scope.cardHighSearch = function () {
                var cardModalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'addShareCardHighSearchModal.html',
                    controller: 'addShareCardModalInstanceCtrl',
                    backdrop: "static"
                });
                cardModalInstance.result.then(function (message) {
                    console.log("returnINFO", message);
                    getAllCardData($scope.currentCardPage, message);
                    //console.log("curpage", $scope.currentImgPage);
                }, function () {

                });
            };

            //分享成功模态框
            $scope.addShareSuccess = function (message) {
                var shareSuccessModalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'addShareQRModal.html',
                    controller: 'addShareQRModalInstanceCtrl',
                    backdrop: "static",
                    resolve: {
                        qrmessage: function () {
                            return message
                        }
                    }
                });
            };


        }]);
    //影像列表高级搜索模态窗口的实例
    app.controller('addShareImgModalInstanceCtrl', ['$scope', '$uibModalInstance', 'doctorService',
        function ($scope, $uibModalInstance, doctorService) {
            $scope.ImgHighForm = function (isVaild) {
                if (isVaild) {
                    var message = {};
                    if ($scope.truename) {
                        message.truename = $scope.truename;
                    }
                    if ($scope.patientid) {
                        message.patientid = $scope.patientid;
                    }
                    if ($scope.startUploaderDate) {
                        message.uploadstarttime = doctorService.dataFormat($scope.startUploaderDate);
                    }
                    if ($scope.endUploaderDate) {
                        message.uploadendtime = doctorService.dataFormat($scope.endUploaderDate);
                    }
                    if ($scope.startScreenDate) {
                        message.studystarttime = doctorService.dataFormat($scope.startScreenDate);
                    }
                    if ($scope.endScreenDate) {
                        message.studyendtime = doctorService.dataFormat($scope.endScreenDate);
                    }
                    console.log("info", message);
                    $uibModalInstance.close(message);

                }
            };
            //时间配置
            $scope.startUploaderPlaceholder = "上传开始";
            $scope.endUploaderPlaceholder = "上传结束";
            $scope.startScreenPlaceholder = "拍摄开始";
            $scope.endScreenPlaceholder = "拍摄结束";
            $scope.startUploaderOptions = {
                startingDay: 1,
                showWeeks: false,
                maxDate: $scope.endUploaderDate
            };
            $scope.endUploaderOptions = {
                startingDay: 1,
                showWeeks: false,
                minDate: $scope.startUploaderDate,
                maxDate: new Date()
            };
            $scope.startScreenOptions = {
                startingDay: 1,
                showWeeks: false,
                maxDate: $scope.endScreenDate
            };
            $scope.endScreenOptions = {
                startingDay: 1,
                showWeeks: false,
                minDate: $scope.startScreenDate,
                maxDate: new Date()
            };
            $scope.$watch('endUploaderDate', function (newValue, oldValue) {
                $scope.startUploaderOptions.maxDate = newValue;
            });
            $scope.$watch('startUploaderDate', function (newValue, oldValue) {
                $scope.endUploaderOptions.minDate = newValue;
            });
            $scope.$watch('endScreenDate', function (newValue, oldValue) {
                $scope.startScreenOptions.maxDate = newValue;
            });
            $scope.$watch('startScreenDate', function (newValue, oldValue) {
                $scope.endScreenOptions.minDate = newValue;
            });
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);


    //病例列表高级搜索模态窗口的实例
    app.controller('addShareCardModalInstanceCtrl', ['$scope', '$uibModalInstance', 'doctorService',
        function ($scope, $uibModalInstance, doctorService) {
            $scope.visittimeOpen = function () {
                $scope.visittimeOpened = true;
            };
            $scope.visittimeOptions = {
                startingDay: 1,
                showWeeks: false,
                maxDate: new Date()
            };
            $scope.CardHighForm = function (isVaild) {
                if (isVaild) {
                    $uibModalInstance.close($scope.card);
                }
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);


    //分享成功模态窗口的实例
    app.controller('addShareQRModalInstanceCtrl', ['$scope', '$window', '$uibModalInstance', 'doctorService', 'qrmessage',
        function ($scope, $window, $uibModalInstance, doctorService, qrmessage) {
            console.log("message", qrmessage);
            //二维码图的地址
            var file_url = "";
            doctorService.getImgHTTP().then(function (response) {
                var urls = response.message.split(";");
                file_url = urls[0];
                $scope.qrfile = file_url + "public/qrcode/" + qrmessage.qrfile;
            }, function (error) {
            });
            $scope.qrurl = qrmessage.url;
            var shareid = qrmessage.shareid;
            //点击链接地址事件
            $scope.jumpToLink = function () {
                if (shareid) {
                    $window.location.href = "http://localhost:8088/idoctor/html/imageshare.html?shareid=" + shareid;
                }
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
})(angular);
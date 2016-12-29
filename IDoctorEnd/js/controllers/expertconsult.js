(function (angular) {
    angular.module('expertconsultApp', ['ui.bootstrap','institutionServiceApp',"ngFileUpload"])
        .controller('expertconsultController', ['$scope', '$state', '$uibModal', 'doctorService','institutionService',
'$filter', 'Upload','$timeout','$rootScope',
            function ($scope, $state, $uibModal,doctorService,institutionService, $filter,Upload,$timeout,$rootScope){

                /*初始化*/
                $scope.file_url = "";
                doctorService.getImgHTTP().then(function (response) {
                    var urls = response.message.split(";");
                    $scope.file_url = urls[0];
                }, function (error) {
                });

                $scope.user = angular.fromJson(localStorage.getItem("ueserMessage"))[0];

            }])
        .controller('doctor_ImageSelectController', ['$scope', '$state', '$uibModal', 'doctorService','institutionService',
            '$filter', 'Upload','$timeout','$rootScope',
            function ($scope, $state, $uibModal,doctorService,institutionService, $filter,Upload,$timeout,$rootScope){

                /***********初始化*************/

                $scope.consultLevels =[
                    {id:1,level:"一般"},
                    {id:2,level:"一般紧急"},
                    {id:3,level:"特殊紧急"}
                ]
                $scope.selectLevel = $scope.consultLevels[0];

                // 影像的分页
                $scope.pageList = [
                    {id: 1, pagesize: "5"},
                    {id: 2, pagesize: "10"},
                    {id: 3, pagesize: "20"},
                    {id: 4, pagesize: "50"}
                ];
                $scope.selectPagesize = $scope.pageList[0];
                $scope.itemsPerPage = $scope.selectPagesize.pagesize;//每页显示多少条数据
                $scope.maxSize = 5;//最大显示几条页码

                /*变量*/
                $scope.currentPage=1;
                $scope.selectedImages = [];

                /*首次初始化信息*/
                initImageList();

                /***********点击事件*************/

                $scope.getPagesize = function () {
                    $scope.currentPage=1;
                    $scope.jumpImgTo = '';
                    initImageList();
                };

                $scope.setNumPage = function () {
                    initImageList();
                };

                $scope.setInputPage = function () {
                    if(parseInt($scope.jumpTo)>$scope.numPages){
                        $scope.jumpTo = $scope.numPages;
                    }
                    $scope.currentPage = $scope.jumpTo;
                    initImageList();
                };

                $scope.pageKeyup = function (e) {
                    var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                    if (keycode == 13) {
                        $scope.setInputPage();//如果等于回车键编码执行方法
                    }
                };

                $scope.normalSearch = function () {
                    initImageList();
                }

                /***********网络请求*************/
                // 获取影像列表
                function initImageList() {
                    //用于处理发起专家咨询时选择影像后切换页面后记住之前的选择的影像
                    var data = {
                        userid:$scope.user.userid,
                        havereport:-1,
                        haveask:-1
                    };
                    var Img_advanceddataStr = localStorage.getItem("advanceddataKey");
                    var Img_advanceddata = JSON.parse(Img_advanceddataStr);
//                    if (imageFlag) {
//                        data = angular.extend(data,Img_advanceddata);
//                    } else {
//                        if ($scope.expImageCondition!=undefined) {
//                            data.term = $scope.expImageCondition;
//                        }
//                    }

                    if ($scope.expImageCondition!= undefined) {
                        data.term = $scope.expImageCondition;
                    }

                    data.curpage = $scope.currentPage;
                    data.pagesize = $scope.selectPagesize.pagesize;

                    institutionService.getInstExpAskImage(data).then(function (res) {
                        var result = res.result;
                        var message = JSON.parse(res.message);
                        if (result == 0) {
                            // 总条数
                            $scope.totalItems = JSON.parse(res.message);
                        }
                        else if (result == -1) {
                            alert("获取用户数据失败");
                        } else {
                            alert("未知错误");
                        }
                    }), function (error) {
                        alert("服务器异常");
                    }

                    institutionService.getInstExpAskImageList(data).then(function (res) {
                        var result = res.result;
                        if (result == 0) {
                            var message = JSON.parse(res.message);
                            if (message) {
                                for (var i = 0; i < message.length; i++) {
                                    var obj = message[i];
                                    obj.imageurl =  $scope.file_url+"public/thumb/"+ obj.imageid+"/"+obj.thumb;
                                    obj.gender  = obj.sex==0?"男":"女";
                                    obj.age = institutionService.getAge(obj.birthday);
                                    var studydate = obj.studydate;
                                    studydate = studydate.substr(0, 4) + '-' + studydate.substr(4, 2) + '-' + studydate.substr(6, 2);
                                    obj.studydate = studydate;
                                    obj.selected = $scope.selectedImages.indexOf(obj.imageid+"")>-1;
                                    //专家和常规咨询个数
                                    getBigAskStatus(obj, i);
                                    getNormalAskStatus(obj, i);
                                }
                                $scope.expAskImages = message;
                            }


                        }
                    }), function (error) {
                    }
                }

                // 影像列表常专家询数量
                function getBigAskStatus(imageObj, index) {
                    var data = {};
                    data.imageid = imageObj.imageid;
                    data.curpage = 1;
                    data.pagesize = 100;
                    data.asktype = 0;
                    data.adduser = $scope.user.userid;
                    institutionService.getInstExpAskStatus(data).then(function (res) {
                        var result = res.result;
                        if (result == 0) {
                            var message = JSON.parse(res.message);
                            if (message) {
                                var totalAsk = message.length;
                                imageObj.expCount = totalAsk;
                            }else if (result == -1) {
                                alert("获取影像数据失败");
                            } else {
                                alert("未知错误");
                            }
                        }
                    })
                        ,function (error) {
                        alert("服务器异常");
                    }
                }

                // 影像列表常规咨询数量
                function getNormalAskStatus(imageObj, index) {
                    var data = {};
                    data.imageid = imageObj.imageid;
                    data.curpage = 1;
                    data.pagesize = 100;
                    data.asktype = 0;
                    data.adduser = $scope.user.userid ;
                    institutionService.getInstComAskStatus(data).then(function (res) {
                        var result = res.result;
                        if (result == 0) {
                            var message = JSON.parse(res.message);
                            if (message) {
                                var totalAsk = message.length;
                                imageObj.commonAskCount = totalAsk;
                            }else if (result == -1) {
                                alert("获取影像数据失败");
                            } else {
                                alert("未知错误");
                            }
                        }
                    })
                        ,function (error) {
                        alert("服务器异常");
                    }
                }

            }])
        .controller('doctor_doctorSelectController', ['$scope', '$state', '$uibModal', 'doctorService','institutionService',
            '$filter', 'Upload','$timeout','$rootScope',
            function ($scope, $state, $uibModal,doctorService,institutionService, $filter,Upload,$timeout,$rootScope){

                /*初始化*/

                $scope.consultLevels =[
                    {id:1,level:"一般"},
                    {id:2,level:"一般紧急"},
                    {id:3,level:"特殊紧急"}
                ]
                $scope.selectLevel = $scope.consultLevels[0];



            }])
        .controller('doctor_askInfoController', ['$scope', '$state', '$uibModal', 'doctorService','institutionService',
            '$filter', 'Upload','$timeout','$rootScope',
            function ($scope, $state, $uibModal,doctorService,institutionService, $filter,Upload,$timeout,$rootScope){

                /*初始化*/

                $scope.consultLevels =[
                    {id:1,level:"一般"},
                    {id:2,level:"一般紧急"},
                    {id:3,level:"特殊紧急"}
                ]
                $scope.selectLevel = $scope.consultLevels[0];



            }])
        .controller("docExpAsk_ImageModalCtrl",["$scope",'$uibModalInstance','$uibModalInstance','$rootScope',function ($scope,$uibModalInstance,$uibModalInstance,$rootScope) {
            // 高级搜索时间
            $scope.uploadstartOptions = {
                startingDay: 1,
                showWeeks: false,
                maxDate: $scope.uploadendtime,

            };
            $scope.uploadendOptions = {
                startingDay: 1,
                showWeeks: false,
                minDate: $scope.uploadstarttime,
                maxDate: new Date()
            };

            $scope.studystarttimeOptions = {
                startingDay: 1,
                showWeeks: false,
                maxDate: $scope.studyendtime,

            };
            $scope.studyendtimeOptions = {
                startingDay: 1,
                showWeeks: false,
                minDate: $scope.studystarttime,
                maxDate: new Date()
            };

            $scope.$watch('uploadendtime', function (newValue, oldValue) {
                $scope.uploadstartOptions.maxDate = newValue;
            });
            $scope.$watch('uploadstarttime', function (newValue, oldValue) {
                $scope.uploadendOptions.minDate = newValue;
            });

            $scope.$watch('studyendtime', function (newValue, oldValue) {
                $scope.studystarttimeOptions.maxDate = newValue;
            });
            $scope.$watch('studystarttime', function (newValue, oldValue) {
                $scope.studyendtimeOptions.minDate = newValue;

            });
            var Img_advanceddata ={};
            $scope.ensureSearch = function () {
                var uploadstarttime = $("#uploadstarttime").val();
                var uploadendtime = $("#uploadendtime").val();
                var studystarttime = $("#studystarttime").val();
                var studyendtime = $("#studyendtime").val();
                var havereport = $("#image-havereport").val();
                var haveask = $("#image-haveask").val();
                Img_advanceddata = {
                    truename:$scope.image_truename == undefined ?'':$scope.image_truename,
                    patientid:$scope.image_imageid==undefined?'':$scope.image_imageid,
                    havereport:havereport,
                    haveask:haveask
                }
                if (uploadstarttime) {
                    uploadstarttime = uploadstarttime.substr(0, 4) + uploadstarttime.substr(5, 2) + uploadstarttime.substr(8, 2);
                    Img_advanceddata.uploadstarttime=uploadstarttime;
                }
                if (uploadendtime) {
                    uploadendtime = uploadendtime.substr(0, 4) + uploadendtime.substr(5, 2) + uploadendtime.substr(8, 2);
                    Img_advanceddata.uploadendtime=uploadendtime;
                }
                if (studystarttime) {
                    studystarttime = studystarttime.substr(0, 4) + studystarttime.substr(5, 2) + studystarttime.substr(8, 2);
                    Img_advanceddata.studystarttime=studystarttime;
                }
                if (studyendtime) {
                    studyendtime = studyendtime.substr(0, 4) + studyendtime.substr(5, 2) + studyendtime.substr(8, 2);
                    Img_advanceddata.studyendtime=studyendtime;
                }
                // $scope.$on("refreshimageData", function () {
                //     initImage(1, 5);
                // });
                $uibModalInstance.dismiss("高级搜索");
                localStorage.setItem("advanceddataKey",JSON.stringify(Img_advanceddata));
                $rootScope.$broadcast("refreshimageData");

            }
            $scope.cancelSearch = function () {
                $uibModalInstance.dismiss("取消高级搜索");
            }

            // 时间插件代码
            $scope.format = "yyyy-MM-dd ";
            $scope.altInputFormats = ['yyyy-M!/d!'];
            $scope.popup1 = {
                opened: false
            };
            $scope.popup2 = {
                opened: false
            };
            $scope.popup3 = {
                opened: false
            };
            $scope.popup4 = {
                opened: false
            };
            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };
            $scope.open2 = function () {
                $scope.popup2.opened = true;
            };
            $scope.open3 = function () {
                $scope.popup3.opened = true;
            };
            $scope.open4 = function () {
                $scope.popup4.opened = true;
            };
        }])
        .controller("docExpConsultSureCtrl", ["$scope", '$uibModalInstance', 'allSendInfo', 'institutionService',
            function ($scope, $uibModalInstance, allSendInfo, institutionService) {
                $scope.closeConsultSure = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.cancelExpConsult = function () {
                    $uibModalInstance.dismiss('cancel');
                }
                console.log("allSendInfo==",allSendInfo);
                $scope.asknumber = allSendInfo.asknumber;
                $scope.askexpert = allSendInfo.hospital + allSendInfo.truename + allSendInfo.title;
                $scope.askequestion = allSendInfo.askquestion;
                $scope.patitentHistory = allSendInfo.memo;
                $scope.ensureExpConsult = function () {
                    submitAsk();
                    $uibModalInstance.dismiss("cancel");

                }
                console.log("allSendInfo",allSendInfo);
                var sendExpConsultdata = {
                    asknumber:allSendInfo.asknumber,
                    imagestr: allSendInfo.imagestr,
                    doctorid: allSendInfo.userid,
                    cardid: allSendInfo.cardid,
                    title: allSendInfo.title,
                    targetuser: allSendInfo.userid,
                    memo: allSendInfo.memo,
                    adduser: allSendInfo.userid,
                    askid: allSendInfo.askid,
                    recommend: allSendInfo.recommend,
                    askquestion: allSendInfo.askquestion,
                    degree: allSendInfo.degree,
                    status: allSendInfo.status
                }

                function submitAsk() {
                    institutionService.InstMainsendExpConsult(JSON.stringify(sendExpConsultdata)).then(function (res) {
                        var result = res.result;
                        if (result == 0) {
                            alert("发送专家咨询成功！");
                            $uibModalInstance.close("发送专家咨询成功")
                        } else if (result == -1) {
                            alert("发送失败");
                        } else {
                            alert("未知错误");
                        }
                    })
                }

            }])
})(angular);

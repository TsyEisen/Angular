
    (function (angular) {
        angular.module("institutionMainAPP",['ui.router','institutionServiceApp','ui.bootstrap'])
            .controller("institutionMainCtrl",["$scope","institutionService","$uibModal","$state",function ($scope,institutionService,$uibModal,$state) {
                var file_url = "";
                //从localStorage得到登录者的基本信息
                var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
                $scope.logName = userMessage[0].truename;
                //tab按钮的值
                $scope.tabs = [
                    {title: '全部', id: '1'},
                    {title: '今天', id: '2'},
                    {title: '昨天', id: '3'},
                    {title: '3天内', id: '4'},
                    {title: '一周内', id: '5'}
                ];
                $scope.doctorLists = [
                    {list: '全部', id: '1'},
                    {list: '今天', id: '2'},
                    {list: '昨天', id: '3'},
                    {list: '3天内', id: '4'},
                    {list: '一周内', id: '5'}
                ];
                //时间戳placehoder
                $scope.startPlaceholder = "拍摄开始";
                $scope.endPlaceholder = "拍摄结束";
                $scope.startOptions = {
                    startingDay: 1,
                    showWeeks: false,
                    maxDate: $scope.endDate
                };
                $scope.endOptions = {
                    startingDay: 1,
                    showWeeks: false,
                    minDate:$scope.startDate,
                    maxDate: new Date()
                };
                $scope.$watch('endDate', function (newValue, oldValue) {
                    $scope.startOptions.maxDate = newValue;
                });
                $scope.$watch('startDate',function(newValue,oldValue){
                    $scope.endOptions.minDate=newValue;
                });

                // 初始化时间参数（传参）
                $scope.startTime = "";
                $scope.endTime = "";

                // 影像类型的选择
                $scope.imageTypes= [
                    {id:1,type:"全部"},
                    {id:2,type:"DX"},
                    {id:3,type:"MR"},
                    {id:4,type:"CR"},
                    {id:5,type:"CT"},
                    {id:6,type:"OT"},
                    {id:7,type:"DR"},
                    {id:8,type:"US"},
                    {id:9,type:"NM"},
                    {id:9,type:"RF"},
                    {id:9,type:"PX"}
                ];
                $scope.selectImgType = $scope.imageTypes[0];

                $scope.mainSearch = function () {
                    getInstitutionMainListData();
                }

                $scope.getType= function (index) {
                    $scope.startDate = undefined;
                    $scope.endDate = undefined;
                    switch(index){
                        case 0 :
                            $scope.startTime = "";
                            $scope.endTime = "";
                            break;
                        case 1:
                            $scope.startTime = institutionService.getNowFormatDate();
                            $scope.endTime = institutionService.getNowFormatDate();
                            break;
                        case 2:
                            $scope.startTime = institutionService.getbeforeDayData(1);
                            $scope.endTime = institutionService.getbeforeDayData(1);
                            break;
                        case 3:
                            $scope.startTime = institutionService.getbeforeDayData(3);
                            $scope.endTime = institutionService.getNowFormatDate();
                            break;
                        case 4:
                            $scope.startTime = institutionService.getbeforeDayData(7);
                            $scope.endTime = institutionService.getNowFormatDate();
                            break;
                        default:
                            break;
                    }
                    institutionService.bgcChangeBlue("timeBg","li","#E7E7E9","#4887DC","#000",index);
                    getInstitutionMainListData();
                }
                $scope.search = function () {
                    if($scope.startDate == undefined){
                        alert("请选择时间");
                        return;
                    }
                    if($scope.endDate == undefined){
                        alert("请选择时间");
                        return;
                    }
                    $scope.currentPage = 1;
                    //在这里把前面的按钮都置灰

                    institutionService.bgcChangeGray("timeBg","li","#E7E7E9","#000");
                    $scope.startTime = institutionService.dataFormat($scope.startDate);
                    $scope.endTime = institutionService.dataFormat($scope.endDate);
                    getInstitutionMainListData();

                }
                $scope.pageList = [
                    {id: 1, pagesize: "10"},
                    {id: 2, pagesize: "20"},
                    {id: 3, pagesize: "50"},
                    {id: 4, pagesize: "100"}
                ];
                $scope.selectValue = $scope.pageList[0];
                $scope.itemsPerPage = $scope.selectValue.pagesize;//每页显示多少条数据
                $scope.currentPage=1;
                //选择每页显示几条数据
                $scope.getPagesize = function () {
                    $scope.currentPage = 1;
                    getInstitutionMainListData();
                };
                //点击页码事件
                $scope.setNumPage = function () {
                    getInstitutionMainListData();
                    $scope.jumpTo = '';
                };
                //输入页面点击确认事件
                $scope.setInputPage = function () {
                    if (parseInt($scope.jumpTo) > $scope.numPages) {
                        $scope.jumpTo = $scope.numPages
                    }
                    $scope.currentPage = $scope.jumpTo;
                    getInstitutionMainListData();
                };
                //回车事件
                $scope.pageKeyup = function (e) {
                    var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                    if (keycode == 13) {
                        $scope.setInputPage();//如果等于回车键编码执行方法
                    }
                };

                //选择每页显示多少条数据
                $scope.maxSize = 5;//最大显示几条页码
                institutionService.getImgHTTP().then(function (response) {
                    var urls = response.message.split(";");
                    file_url = urls[0];
                }, function (error) {
                    alert("获取地址失败");
                });
                //获取主页列表数据
                var getInstitutionMainListData = function () {
                    var info = {
                        userid:userMessage[0].userid,
                        pagesize: parseInt( $scope.selectValue.pagesize),
                        curpage:parseInt($scope.currentPage),
                        havereport: -1,
                        haveask : -1,
                        studystarttime:$scope.startTime,
                        studyendtime:$scope.endTime
                    };

                    if($scope.selectValue.type!= undefined){
                        angular.extend(info,{"imagetype": $scope.selectImgType.type});
                    }
                    if($scope.totalSearch!= undefined){
                        angular.extend(info,{"totalsearch":$scope.totalSearch});
                    }
                    institutionService.getMainListCount(info).then(function (response) {
                        if(response.result == 0){
                           $scope.totalItems = response.message;
                       }else if (result == -1) {
                           alert("获取用户数据失败");
                       } else {
                           alert("未知错误");
                       }
                    }, function (error) {
                        alert("服务器异常");
                    });
                    institutionService.getMainListdata(info).then(function (response) {
                        var  message = JSON.parse(response.message);
                        if(response.result == 0){
                            if(message){
                                for (var i = 0; i < message.length; i++) {
                                    var obj = message[i];
                                    obj.imageurl =  file_url+"public/thumb/"+ obj.imageid+"/"+obj.thumb;
                                    obj.gender = obj.sex == 0 ? ($scope.gender = "男") : ($scope.gender = "女");
                                    obj.patientAge = institutionService.getAge(obj.birthday);
                                    obj.studydate = institutionService.getTimeFormate(obj.studydate);
                                    //专家和常规咨询个数
                                    getBigAskStatus(obj, i);
                                    getNormalAskStatus(obj, i);
                                    
                                }
                                $scope.tableTabs = message;
                            }
                        }else if (result == -1) {
                            alert("获取用户数据失败");
                        } else {
                            alert("未知错误");
                        }
                    }, function (error) {
                        alert("服务器异常");
                    });

                    var data = {
                        userid:userMessage[0].userid,
                    };

                    institutionService.getMainImageTypeCount(data).then(function (response){
                        $scope.count_total= parseInt(response.message);
                    }, function (error) {

                        });

                    institutionService.getMainImageTypeCount(angular.extend(data,{ imagetype: 'CT'})).then(function (response){
                        $scope.count_CT = parseInt(response.message);
                    }, function (error) {

                    });
                    institutionService.getMainImageTypeCount(angular.extend(data,{ imagetype: 'MR'})).then(function (response){

                        $scope.count_MR = parseInt(response.message);
                    }, function (error) {

                    });
                    institutionService.getMainImageTypeCount(angular.extend(data,{ imagetype: 'DX'})).then(function (response){
                        $scope.count_DX = parseInt(response.message);
                    }, function (error) {

                    });
                    institutionService.getMainImageTypeCount(angular.extend(data,{ imagetype: 'CR'})).then(function (response){
                        $scope.count_CR = parseInt(response.message);
                    }, function (error) {

                    });
                    var askcount_data = {
                        "userid":userMessage[0].userid
                    }
                    institutionService.getMainAskcount(angular.extend(askcount_data,{asktype:0})).then(function (response){
                        $scope.exp_askCount = JSON.parse(response.message).askCount;
                        $scope.exp_completedAskCount = JSON.parse(response.message).completedAskCount;
                        $scope.exp_unfinishedAskCount = JSON.parse(response.message).unfinishedAskCount;

                    }, function (error) {

                    });
                    institutionService.getMainAskcount(angular.extend(askcount_data,{  asktype:1})).then(function (response){
                        $scope.common_askCount = JSON.parse(response.message).askCount;
                        $scope.common_completedAskCount = JSON.parse(response.message).completedAskCount;
                        $scope.common_unfinishedAskCount = JSON.parse(response.message).unfinishedAskCount;

                    }, function (error) {

                    });

                    var DoctorCountByLevel_data = {
                        "instid":userMessage[0].userid
                    };
                    // 平台医生总数
                    institutionService.getMainDoctorCountByLevel(angular.extend(DoctorCountByLevel_data,{"userlevel":-1}))
                        .then(function (response){
                            $scope.platformDoctorCount = response.message;
                        }, function (error) {

                        });

                    // 平台专家总数
                    institutionService.getMainDoctorCountByLevel(angular.extend(DoctorCountByLevel_data,{"userlevel":0}))
                        .then(function (response){
                            $scope.platformExportCount = response.message;
                        }, function (error) {

                        });

                    var mydoctorgrouplist_data = {
                        "instid":userMessage[0].userid
                    }
                    // 获取我的医生
                    institutionService.getMainMydoctorgroup(mydoctorgrouplist_data)
                        .then(function (response){
                            $scope.myDoctorCount = 0;
                            var _data = JSON.parse(response.message);
                            for (var i = 0; i < _data.length; i++) {
                                var group = _data[i];
                                if (group.gname == "我的医生") {
                                    var myDoctorCount_data = {
                                        groupid: group.groupid,
                                        instid: userMessage[0].userid
                                    }
                                    institutionService.getMainMydoctorcount(myDoctorCount_data).then(function (response) {
                                      $scope.myDoctorCount = JSON.parse(response.message)
                                    }),function (error) {
                                    };
                                }
                            }

                        }, function (error) {

                        });
                };
                getInstitutionMainListData();
                $scope.selected = '';
                $scope.onChange = function (item) {

                    if (item.checked) {
                        if (!$scope.selected) $scope.selected = item;
                        if ($scope.selected !== item) item.checked = false;
                    } else {
                        $scope.selected = '';
                    }

                    localStorage.setItem("instMainInfo",JSON.stringify($scope.selected));
                    // 编辑  弹出模态框
                    $scope.editImage = function () {
                        if ($scope.selected == '') {
                            alert("请选择一条影像！");
                        } else {
                            var modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: 'InstImageEditModal.html',
                                controller: 'InstImageModalInstanceCtrl',
                                backdrop: "static",
                                resolve: {
                                    imageInfo: function () {
                                        return $scope.selected
                                    }
                                }
                            });
                        }
                    };
                    // 打印电子单
                    $scope.electronicReport = function () {
                        if ($scope.selected == '') {
                            alert("请选择一条影像！");
                        }else{
                            printMyImage($scope.selected.imageid);
                        }
                     }
                    // 分享  弹出模态框
                    $scope.shareImage = function () {
                        if ($scope.selected == '') {
                            alert("请选择一条影像！");
                        } else {
                            var modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: 'InstShareQRcodeModal.html',
                                controller: 'InstShareQRcodeModalCtrl',
                                backdrop: "static",
                                resolve: {
                                    imageInfo: function () {
                                        return $scope.selected
                                    }
                                }
                            });
                        }
                    }
                    // 专家咨询 页面跳转
                    $scope.expConsult = function () {
                        $state.go("institutionSideBar.institution_main_expertConsult");
                    }
                    $scope.commonConsult = function () {
                        $state.go("institutionSideBar.institution_main_commonConsult");
                    }

                }
                // 没选择数据时的提示信息
                $scope.editImage = function () {
                    if ($scope.selected == '') {
                        alert("请选择一条影像！");
                    }
                }
                $scope.electronicReport = function () {
                    if ($scope.selected == '') {
                        alert("请选择一条影像！");
                    }
                }
                // 分享
                $scope.shareImage = function () {
                    if ($scope.selected == '') {
                        alert("请选择一条影像！");
                    }
                }
                // 专家咨询
                 $scope.expConsult  = function () {
                     alert("请选择一条影像！");
                 }
                // 常规咨询
                $scope.commonConsult= function () {
                    alert("请选择一条影像！");
                }

               // 机构端打印电子单
                function printMyImage(imageid) {
                    var newData = {
                        "imageId" : imageid
                    };
                    institutionService.getInstElectronicReport(newData).then(function (response) {
                        var result = response.result;
                        //message：字符串，对result的解释，分别为：0删除成功、1影像已经删除、-1删除失败
                        if (result == 0) {
                            var pdfurl = "/idoctor/pdf/" +  response.message + ".pdf";
                            window.location.href = file_url+"/idoctor/pdf/pdf.js-master/web/viewer.html?file=" + pdfurl;
                        } else {
                            alert("打印影像失败");
                        }
                    }, function (error) {
                            alert("服务器异常");
                    });
                }

                $scope.$broadcast("editRefresh");
                // 影像列表常专家询数量
                function getBigAskStatus(imageObj, index) {
                    var data = {};
                    data.imageid = imageObj.imageid;
                    data.curpage = 1;
                    data.pagesize = 100;
                    data.asktype = 0;
                    data.adduser = userMessage[0].userid;
                    institutionService.getInstExpAskStatus(data).then(function (res) {
                        var result = res.result;
                        if (result == 0) {
                            var message = JSON.parse(res.message);
                            if (message) {
                                var totalAsk = message.length;
                                for (var i = 0; i < message.length; i++) {
                                    var obj = message[i];
                                    imageObj.expStatusNow = obj.status;
                                }
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
                    data.adduser = userMessage[0].userid ;
                    institutionService.getInstComAskStatus(data).then(function (res) {
                        var result = res.result;
                        if (result == 0) {
                            var message = JSON.parse(res.message);
                            if (message) {
                                var totalAsk = message.length;
                                for (var i = 0; i < message.length; i++) {
                                    var obj = message[i];
                                    imageObj.commonStatusNow = obj.status;
                                }
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
            .controller('InstImageModalInstanceCtrl', ['$scope',  '$uibModalInstance','imageInfo','institutionService',
            function ($scope, $uibModalInstance,imageInfo,institutionService) {
                $scope.user={};
                //影像类型
                $scope.imageTypes = [
                    {type: "CT", id: "CT"},
                    {type: "MR", id: "MR"},
                    {type: "DR", id: "DR"},
                    {type: "US", id: "US"},
                    {type: "NM", id: "NM"},
                    {type: "CR", id: "CR"},
                    {type: "DX", id: "DX"},
                    {type: "RF", id: "RF"},
                    {type: "OT", id: "OT"},
                    {type: "PX", id: "PX"},
                    {type: "OT", id: "OT"}
                ];
                $scope.user.type = $scope.imageTypes[0];
                $scope.user.name = imageInfo.patientname;
                $scope.user.age = imageInfo.age;
                $scope.user.sex = imageInfo.sex;
                $scope.user.type = imageInfo.modality;
                $scope.user.organization = imageInfo.institutionname;
                $scope.date = imageInfo.studydate;
                $scope.visitOpen = function () {
                    $scope.visitPopupOpened = true;
                };


                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.ensure = function () {
                    var data = {
                        "imageid" : imageInfo.imageid,
                        "patientname" : $scope.user.name,
                        "birthday" : $scope.user.age,
                        "studydate" : $scope.date,
                        "institutionname" : $scope.user.organization==undefined?"":$scope.user.organization,
                        "modality" :  $scope.user.type
                    };
                    if ($scope.user.sex) {
                        data.sex = $scope.user.sex;
                    }
                    institutionService.editInstMainListData(data).then(function (response) {
                        if(response.result == 0){
                            alert("编辑影像成功");
                            $uibModalInstance.close("编辑影像成功");
                            $scope.$on("editRefresh", function () {
                                getInstitutionMainListData();
                            });
                        }
                    }, function (error) {
                        alert("编辑影像失败");
                    });
                   
                }
            }])
            .controller('InstShareQRcodeModalCtrl', ['$scope','$uibModalInstance','imageInfo','institutionService',
            function ($scope, $uibModalInstance,imageInfo,institutionService) {
                var file_url = "";
                institutionService.getImgHTTP().then(function (response) {
                    var urls = response.message.split(";");
                    file_url = urls[0];
                }, function (error) {
                });
                var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
                var data = {
                    imageid : imageInfo.imageid,
                    userid : userMessage[0].userid
                };
                institutionService.InstMainShareData(data).then(function (response){
                    $scope.shareURL = JSON.parse(response.message).url;
                    $scope.shareQRcodeImg = file_url+"public/qrcode/"+JSON.parse(response.message).qrfile;
                })
                $scope.cancelShare = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.ensureShare = function () {
                    $uibModalInstance.close("分享成功")
                };
                $scope.closeShare = function () {
                    $uibModalInstance.dismiss('cancel');
                }
            }])
    })(angular);
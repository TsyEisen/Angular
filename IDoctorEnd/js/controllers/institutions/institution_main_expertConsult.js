/**
 * Created by Administrator on 2016/12/8.
 */
(function (angular) {
    angular.module("institution_main_expertConsultApp", ["institutionServiceApp", "ui.bootstrap", "ngFileUpload"])
        .controller("instMain_expertConsult", ["$scope", "institutionService", 'Upload', '$timeout', "$uibModal",
            function ($scope, institutionService, Upload, $timeout, $uibModal) {
                var getInstMaindata = JSON.parse(localStorage.getItem("instMainInfo"));
                var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
                var doctorlist;
                var file_url = "";
                var askFlag = false; // 用于发起咨询选择专家通过高级查询的判断
                var askDoctorId = 0;
                // 获取地址ip
                institutionService.getImgHTTP().then(function (response) {
                    var urls = response.message.split(";");
                    file_url = urls[0];
                }, function (error) {
                    alert("获取地址失败");
                });
                $scope.user = getInstMaindata;
                $scope.user.gender = getInstMaindata.sex == 0 ? ($scope.user.gender = "男") : ($scope.user.gender = "女");
                $scope.user.age = institutionService.getAge(getInstMaindata.birthday);
//专家和常规咨询个数
                getBigAskStatus(getInstMaindata);
                getNormalAskStatus(getInstMaindata);
                // 影像列表常专家询数量
                function getBigAskStatus(imageObj) {
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
                                $scope.expCount = message.length;
                            } else if (result == -1) {
                                alert("获取影像数据失败");
                            } else {
                                alert("未知错误");
                            }
                        }
                    })
                        , function (error) {
                        alert("服务器异常");
                    }
                }

                // 影像列表常规咨询数量
                function getNormalAskStatus(imageObj) {
                    var data = {};
                    data.imageid = imageObj.imageid;
                    data.curpage = 1;
                    data.pagesize = 100;
                    data.asktype = 0;
                    data.adduser = userMessage[0].userid;
                    institutionService.getInstComAskStatus(data).then(function (res) {
                        var result = res.result;
                        if (result == 0) {
                            var message = JSON.parse(res.message);
                            if (message) {
                                $scope.comCount = message.length;
                            } else if (result == -1) {
                                alert("获取影像数据失败");
                            } else {
                                alert("未知错误");
                            }
                        }
                    })
                        , function (error) {
                        alert("服务器异常");
                    }
                }

                $scope.imageData = getInstMaindata;
                var imageId = getInstMaindata.imageid;//获取影像传递的参数
                // 职称
                $scope.consultCalls = [
                    {id: "001", name: "主任医师"},
                    {id: "002", name: "副主任医师"},
                    {id: "003", name: "主治医师"},
                    {id: "004", name: "住院医师"},
                    {id: "005", name: "其它"}
                ];
                $scope.professionalPost = $scope.consultCalls[0];
                // 科室
                $scope.engineer = {
                    name: "Dani",
                    currentActivity: {
                        id: 1,
                        type: "内科",
                        name: "神经内科"
                    }
                };
                $scope.activities = [
                    {id: 1, type: "内科", name: "神经内科"},
                    {id: 2, type: "内科", name: "呼吸科"},
                    {id: 3, type: "内科", name: "外科"},
                    {id: 4, type: "内科", name: "骨科"},
                    {id: 5, type: "内科", name: "神经外科"},
                    {id: 6, type: "内科", name: "普通外科"},
                    {id: 7, type: "内科", name: "肝胆外科"},
                    {id: 8, type: "内科", name: "泌尿外科"},
                    {id: 9, type: "内科", name: "胸外科"},
                    {id: 10, type: "内科", name: "创伤骨科"},
                    {id: 11, type: "内科", name: "功能神经外科"},

                    {id: 12, type: "其他", name: "放射科"},
                    {id: 13, type: "其他", name: "口腔科"},
                    {id: 14, type: "其他", name: "超声医学科"},
                    {id: 15, type: "其他", name: "介入放射科"},
                    {id: 16, type: "其他", name: "放疗科"},
                    {id: 17, type: "其他", name: "病理科"}
                ];
            // 地区选择
                $scope.clickProvince = function () {
                    $scope.citys = [];
                    var subStrProvince = $scope.selectProvince.code.slice(0, 2);
                    for (var i = 0; i < $scope.allCitys.length; i++) {
                        var citycode = $scope.allCitys[i].code;
                        var subStrCity = citycode.slice(0, 2);
                        if (subStrProvince == subStrCity) {
                            $scope.citys.push($scope.allCitys[i]);
                        }
                    }
                    $scope.selectCity = $scope.citys[0];
                    $scope.clickCity();
                }
                $scope.clickCity = function () {
                    $scope.districts = [];
                    if ($scope.selectCity != null) {
                        var subStrCity = $scope.selectCity.code.slice(0, 4);
                    }

                    for (var i = 0; i < $scope.allDistrict.length; i++) {
                        var districtcode = $scope.allDistrict[i].code;
                        var subStrDistrict = districtcode.slice(0, 4);
                        if (subStrDistrict == subStrCity) {
                            $scope.districts.push($scope.allDistrict[i]);
                        }
                    }
                    $scope.selectDistrict = $scope.districts[0];

                }
                $scope.clickDistrict = function () {
                }
                institutionService.getProvinceData().then(function (res) {
                    $scope.provinces = res;
                    $scope.selectProvince = $scope.provinces[0];
                })
                institutionService.getCityData().then(function (res) {
                    $scope.allCitys = res;
                })
                institutionService.getDistrictData().then(function (res) {
                    $scope.allDistrict = res;
                })

                $scope.pageList = [
                    {id: 1, pagesize: "5"},
                    {id: 2, pagesize: "10"},
                    {id: 3, pagesize: "20"},
                    {id: 4, pagesize: "50"}
                ];
                $scope.selectValue = $scope.pageList[0];
                $scope.itemsPerPage = $scope.selectValue.pagesize;//每页显示多少条数据
                $scope.currentPage = 1;
                $scope.maxSize = 5;//最大显示几条页码
                //选择每页显示几条数据
                $scope.getPagesize = function () {
                    $scope.currentPage = 1;
                    initExpertList($scope.currentPage, $scope.selectValue.pagesize, 0);
                };

                //点击页码事件
                $scope.setNumPage = function () {
                    initExpertList($scope.currentPage, $scope.selectValue.pagesize, 0);
                    $scope.currentPage = 1;
                };
                //输入页面点击确认事件
                $scope.setInputPage = function () {
                    if (parseInt($scope.jumpTo) > $scope.numPages) {
                        $scope.jumpTo = $scope.numPages;
                    }
                    $scope.currentPage = $scope.jumpTo;
                    initExpertList($scope.currentPage, $scope.selectValue.pagesize, 0);
                };
                //回车事件
                $scope.pageKeyup = function (e) {
                    var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                    if (keycode == 13) {
                        $scope.setInputPage();//如果等于回车键编码执行方法
                    }
                };
                // 首次进入页面获取医生数据
                initExpertList($scope.currentPage, $scope.selectValue.pagesize, 0);
                // 选择医生模块

                $scope.expertDocSearch = function () {
                    askFlag = true;
                    initExpertList(1, 5, 0);
                }
                $scope.getExpLevel = function (index) {
                    initExpertList(1, 5, index);
                }

                $("#changeExpertBg > button").click(function () {
                    $(this).css("backgroundColor", "#4887DC").siblings().css("backgroundColor", "#E6E6E6")
                });
                function initExpertList(page, pageSize, expertLevel) {
                    var searchData = {
                        // instid: user.userid
                        instid: 4,
                        sortord: undefined
                    };
                    if (askFlag) {
                        if ($scope.selectProvince != undefined && $scope.selectProvince.code > 0) {
                            searchData.province = $scope.selectProvince.code;
                        }
                        if ($scope.selectCity != undefined && $scope.selectCity.code > 0) {
                            searchData.city = $scope.selectCity.code;
                        }
                        if ($scope.selectDistrict != undefined && $scope.selectDistrict.code > 0) {
                            searchData.area = $scope.selectDistrict.code;
                        }
                        // 所在医院 输入框 模糊查询
                        if ($scope.hospital) {
                            searchData.hospital = $scope.hospital;
                        }
                        // 科室
                        var deparmentVal = document.getElementById("ask-department").value;
                        if (deparmentVal != '') {
                            searchData.department = $scope.engineer.currentActivity.name;
                        }
                        // 医生职称
                        if ($scope.doctor_title) {
                            searchData.doctor_title = $scope.doctor_title;
                        }
                        // 医生名称
                        if ($scope.doctorname) {
                            searchData.truename = $scope.doctorname;
                        }
                    }
                    else {
                    }
                    // 表示查询所有专家
                    searchData.userlevel = expertLevel;
                    var count;
                    institutionService.getInstExpertDoctor(searchData).then(function (res) {
                        if (res.result == 0) {
                            var message = JSON.parse(res.message);
                            count = message;
                            initPageExpert(page, count, pageSize, searchData, expertLevel);
                        } else if (res.result == -1) {
                            alert("获取医生数据失败");
                        } else {
                            alert("未知错误");
                        }
                    }),
                        function (error) {
                            alert("服务器异常");
                        }
                }
                // 专家分页
                function initPageExpert(startPage, count, pageSize, data, expertLevel) {
                    generateExpertList(data, startPage, pageSize, expertLevel);
                }
                function generateExpertList(data, page, pageSize, expertLevel) {
                    data.curpage = page;
                    data.pagesize = pageSize;
                    data.userlevel = expertLevel;
                    institutionService.getGenerateExpertList(data).then(function (res) {
                        if (res.result == 0) {
                            var message = JSON.parse(res.message);
                            if (message) {
                                for (var i = 0; i < message.length; i++) {
                                    var obj = message[i];
                                    if (obj.headpic == null || obj.headpic == "") {
                                        obj.doctorHeadpic = "../../image/institution/avator.png";
                                    }
                                    obj.doctorHeadpic = file_url + "public/pic/" + obj.userid + "/" + obj.headpic;
                                    // 级别
                                    if (obj.userlevel == 1) {
                                        obj.level = "海外专家";
                                    } else if (obj.userlevel == 2) {
                                        obj.level = "全国顶级";
                                    } else if (obj.userlevel == 3) {
                                        obj.level = "全国知名";
                                    } else if (obj.userlevel == 4) {
                                        obj.level = "省级知名";
                                    }
                                    // 性别
                                    if (obj.gender == 1) {
                                        obj.sex = '男';
                                    } else if (obj.gender == 2) {
                                        obj.sex = '女';
                                    }
                                }
                                $scope.consultExpDoctors = message;
                            }
                        }
                    })
                }
                $scope.consultLevels = [
                    {id: 1, level: "一般"},
                    {id: 2, level: "一般紧急"},
                    {id: 3, level: "特殊紧急"}
                ]
                $scope.selectLevel = $scope.consultLevels[0];

                $scope.selected = '';
                $scope.imageData.checked = true;
                $scope.onChange = function (imageData) {
                    if (imageData.selected) {
                        if (!$scope.selected) $scope.selected = imageData;
                        if ($scope.selected !== imageData) imageData.selected = false;
                    } else {
                        $scope.selected = '';
                    }
                }

                $scope.selected2 = '';
                $scope.ChangeDoctor = function (item) {
                    if (item.checked) {
                        if (!$scope.selected2) $scope.selected2 = item;
                        if ($scope.selected2 !== item) item.checked = false;
                    } else {
                        $scope.selected2 = '';
                    }
                }


                $scope.stratBigConsult = function () {
                    addAsk();
                }
                function addAsk() {
                    var imagestr = "";
                    imagestr = $scope.imageData.imageid;
                    if (imagestr == "" || imagestr == 'undefined') {
                        alert("请选择影像");
                        return;
                    }
                    if ($scope.selected2.checked === undefined) {
                        alert('请选择咨询医生');
                        return;
                    }
                    var doctorid = $scope.selected2.userid;
                    var cardid = "";//????什么参数
                    // var title = $scope.asktitle;
                    if ($scope.asktitle == undefined) {
                        alert('请输入咨询标题');
                        return;
                    }
                    if (parseInt($scope.patientAge) > 0 && parseInt($scope.patientAge) < 150 && !isNaN($scope.patientAge)) {

                    } else {
                        alert('请输入正确的年龄');
                        return;
                    }
                    if ($scope.patitentHistory == undefined) {
                        alert('请输入基本病史');
                        return;
                    }
                    if ($scope.askquestion == undefined) {
                        alert('请输入咨询的问题');
                        return;
                    }
                    var consultInfo = {
                        title: $scope.asktitle == undefined ? '' : $scope.asktitle,
                        targetuser: doctorid,
                        imagestr: imagestr,
                        cardid: cardid,
                        memo: $scope.patitentHistory == undefined ? '' : $scope.patitentHistory,
                        adduser: 4,// adduser: user.userid,
                        askid: 0,
                        recommend: $scope.recommend == undefined ? '' : $scope.recommend,
                        askquestion: $scope.askquestion == undefined ? '' : $scope.askquestion,
                        degree: $scope.selectLevel.level,
                        status: 1
                    };

                    institutionService.InstExpSure(doctorid).then(function (data) {
                        var result = data.result;
                        var userDoctor = null, allSendMsg = {};
                        if (result == 0) {
                            userDoctor = JSON.parse(data.message)[0];
                            allSendMsg = angular.extend(consultInfo, userDoctor)
                            var modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: 'InstExpConsultSureModal.html',
                                controller: 'InstExpConsultSureCtrl',
                                backdrop: "static",
                                resolve: {
                                    allSendInfo: function () {
                                        return allSendMsg
                                    }
                                }
                            });
                        } else {

                        }

                    })
                }

                // 上传附件
                $scope.$watch('files', function () {
                    $scope.upload($scope.files);
                });
                $scope.$watch('file', function () {
                    if ($scope.file != null) {
                        $scope.files = [$scope.file];
                    }
                });
                $scope.log = '';

                $scope.upload = function (files) {
                    if (files && files.length) {
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            if (!file.$error) {
                                Upload.upload({
                                    url: file_url + '/idoctor/service/card/uploadAttachment',
                                    data: {
                                        file: file,
                                        userid: 4
                                    }
                                }).then(function (resp) {
                                    var result = resp.data.result;
                                    if (result == 0) {
                                        var message = JSON.parse(resp.data.message);
                                        $scope.uploadMsg = "文件上传成功"
                                    }
                                    $timeout(function () {
                                        $scope.log = 'file: ' +
                                            resp.config.data.file.name +
                                            ', Response: ' + JSON.stringify(resp.data) +
                                            '\n' + $scope.log;
                                    });
                                }, null, function (evt) {
                                    var progressPercentage = parseInt(100.0 *
                                        evt.loaded / evt.total);
                                    $scope.log = 'progress: ' + progressPercentage +
                                        '% ' + evt.config.data.file.name + '\n' +
                                        $scope.log;
                                });
                            }
                        }
                    }
                };

            }])
        .controller("InstExpConsultSureCtrl", ["$scope", '$uibModalInstance', 'allSendInfo', 'institutionService',
            function ($scope, $uibModalInstance, allSendInfo, institutionService) {
                $scope.closeConsultSure = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.cancelExpConsult = function () {
                    $uibModalInstance.dismiss('cancel');
                }
                $scope.asknumber = allSendInfo.asknumber;
                $scope.askexpert = allSendInfo.hospital + allSendInfo.truename + allSendInfo.title;
                $scope.askequestion = allSendInfo.askquestion;
                $scope.patitentHistory = allSendInfo.memo;
                $scope.ensureExpConsult = function () {
                    submitAsk();
                }
                var sendExpConsultdata = {
                    imagestr: allSendInfo.imagestr,
                    doctorid: allSendInfo.userid,
                    cardid: allSendInfo.cardid,
                    title: allSendInfo.title,
                    targetuser: allSendInfo.userid,
                    memo: allSendInfo.memo,
                    adduser: 4,//user.userid,
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
})(angular)
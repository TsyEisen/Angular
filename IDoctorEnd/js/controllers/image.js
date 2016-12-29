(function (angular) {
    var app = angular.module('imageApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngFileUpload', 'ui.router']);
    //跳转配置
    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("sidebar.addimage", {
                url: "/addimage",
                templateUrl: "partialview/addimage.html"
            });
    });
    app.controller('imageController', ['$scope', '$window', '$filter', '$state', '$uibModal', 'Upload', 'doctorService',
        function ($scope, $window, $filter, $state, $uibModal, Upload, doctorService) {
            var httpUrl = "http://59.110.29.44";
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

            //定义获取表格数据总数函数
            var getCount = function (info) {
                doctorService.getMyImgListCount(info).then(function (response) {
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
                }, function (error) {
                    alert("服务器异常");
                });
            };
            //定义获取表格数据函数
            var getTableData = function (info) {

                //表格中影像图片的缩略图的地址
                var file_url = "";
                doctorService.getImgHTTP().then(function (response) {
                    var urls = response.message.split(";");
                    file_url = urls[0];
                }, function (error) {

                });
                doctorService.getMyImgListData(info).then(function (response) {
                    console.log("getMyImgListData===", response);
                    console.log("getMyImgListmessage===", JSON.parse(response.message));
                    var result = response.result;
                    if (result == 0) {

                        var getArr = JSON.parse(response.message);
                        if (getArr) {
                            for (var i = 0; i < getArr.length; i++) {
                                //sex=0为男，否则为女
                                if (getArr[i].sex == 0) {
                                    getArr[i].sex = "男"
                                } else {
                                    getArr[i].sex = "女"
                                }
                                //年龄
                                getArr[i].birthday = doctorService.getAge(getArr[i].birthday);
                                ////影像缩略图
                                getArr[i].image = file_url + 'public/thumb/' + getArr[i].imageid + '/'
                                    + getArr[i].thumb;
                                if (getArr[i].studydate != "") {
                                    getArr[i].studydate = getArr[i].studydate.substring(0, 4) + "-" + getArr[i].studydate.substring(4, 6) + "-" + getArr[i].studydate.substring(6, 8);
                                }
                            }
                            $scope.tableTabs = getArr;
                        }
                    } else if (result == -1) {
                        alert("获取用户数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function (error) {

                });
            };
            $scope.getAllTableData = function (curpage) {
                //初始化当前页为第一页
                if (curpage == undefined) {
                    curpage = 1;
                    $scope.currentPage = 1;
                }
                var info = {
                    "userid": userMessage[0].userid + "",
                    "curpage": curpage,
                    "pagesize": $scope.selectValue.pagesize,
                    "havereport": -1,
                    "haveask": -1
                };
                //上传开始
                if ($scope.startUploaderDate != undefined) {
                    info.uploadstarttime = doctorService.dataStrFormat($scope.startUploaderDate);
                }
                //上传结束
                if ($scope.endUploaderDate != undefined) {
                    info.uploadendtime = doctorService.dataStrFormat($scope.endUploaderDate);
                }
                //拍摄开始
                if ($scope.startScreenDate != undefined) {
                    info.studystarttime = doctorService.dataStrFormat($scope.startScreenDate);
                }
                //拍摄结束
                if ($scope.endScreenDate != undefined) {
                    info.studyendtime = doctorService.dataStrFormat($scope.endScreenDate);
                }
                //模糊搜索
                if ($scope.totalSearch != undefined) {
                    info.term = $scope.totalSearch;
                }
                console.log("info",info);
                getCount(info);
                getTableData(info);
            };
            //封装表格总数加表格数据
            $scope.getAllTableData();
            //跳转到新增影像页面
            $scope.jumpToAdd = function () {
                $state.go("sidebar.addimage");
            };

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

            //搜索
            $scope.search = function () {
                $scope.getAllTableData(1);
            };
            //模糊搜索
            $scope.mainSearch = function () {
                $scope.getAllTableData(1);
            };
            //改变footer下拉菜单
            $scope.getPagesize = function () {
                $scope.itemsPerPage = $scope.selectValue.pagesize;
                $scope.getAllTableData($scope.currentPage);
            };
            //点击页码
            $scope.setNumPage = function () {
                $scope.getAllTableData($scope.currentPage);
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
                    $scope.getAllTableData($scope.currentPage);
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

            $scope.NewWindow=function(image) {
                var isDicomOrJpg = userMessage.isDicomOrJpg;
                var url = '';
                //当用户设置里面为dicom时，访问dicom类型，否则为jpg类型
                if (isDicomOrJpg != null && isDicomOrJpg == 1) {
                    url = '?imageid=' + image.imageid + '&patientID=' + image.patientid
                        + '&' + 'studyUID=' + image.studyid + '&reportFlag=0'
                        + '&type=dicom';
                } else {
                    url = '?imageid=' + image.imageid + '&patientID=' + image.patientid
                        + '&' + 'studyUID=' + image.studyid + '&reportFlag=0'
                        + '&type=jpg';
                }
                var path = '';
                if (document.body.clientWidth >= document.body.clientHeight) {
                    path = httpUrl+'/idoctor/html/imageViewer/viewer_landscape.html' + url;
                } else {
                    path = httpUrl+'/idoctor/html/imageViewer/viewer_vertical.html' + url;
                }
                var config = "toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no";
                config += "height="+window.screen.height;
                config += "width="+window.screen.width;
                $window.location.href = path;
            };

            //选中的影像
            var setImageID = {};
            var _radioChecked = {};
            $scope.onChange = function (item,event) {
                _radioChecked = event;
                setImageID = item;
            };

            //删除影像
            $scope.removeMyImage = function () {
                console.log('setImageID==', setImageID);
                var defaultimage = setImageID.defaultimage;
                if ('1' == defaultimage) {
                    alert("默认影片不能删除！");
                    return;
                }
                if (!confirm("确定要删除影像吗？")) {
                    return false;
                }
                var info = {
                    "userid": userMessage[0].userid,
                    "imageid": setImageID.imageid
                };
                console.log("defaultimage", defaultimage);
                console.log("info", info);
                doctorService.removeImg(info).then(function (response) {
                    //console.log("finalRes", response);
                    var result = response.result;
                    if (result == 0) {
                        $scope.getAllTableData($scope.currentPage);
                    } else {
                        alert("删除我的影像失败");
                    }
                }, function (error) {
                    alert("服务器异常");
                });

            };
            //判断是否为空对象
            function isEmptyObject(obj) {
                for (var k in obj) {
                    return true;
                }
                return false
            }

            $scope.printMyImage = function () {
                var isEmptyObj = isEmptyObject(setImageID);
                console.log('setImageID==', setImageID);
                if (!isEmptyObj) {
                    alert("请选择一条影像！");
                } else {
                    var info = {
                        "imageId": setImageID.imageid
                    };
                    doctorService.printImg(info).then(function (response) {
                        console.log("finalRes", response);
                        var result = response.result;
                        //PDF地址
                        var PDFurl = response.message;
                        if (result == 0) {
                            var pdfurl = "/idoctor/pdf/" + PDFurl + ".pdf";
                            $window.location.href = "http://localhost:8088/idoctor/pdf/pdf.js-master/web/viewer.html?file=" + pdfurl;
                        } else {
                            alert("打印影像失败");
                        }
                    }, function (error) {
                        alert("服务器异常");
                    })
                }

            };


            //编辑影像，模态框模块
            $scope.editModal = function () {
                var isEmptyObj = isEmptyObject(setImageID);
                if (!isEmptyObj) {
                    alert("请选择一条影像！");
                } else {
                    //将选中的单选框取消选中
                    _radioChecked.currentTarget.checked = false;

                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'imageEditModal.html',
                        controller: 'imageModalInstanceCtrl',
                        backdrop: "static",
                        resolve: {
                            editImgMessage: function () {
                                return setImageID
                            },
                            curpage: function () {
                                return $scope.currentPage
                            }

                        }
                    });
                    setImageID = {};
                    modalInstance.result.then(function (curpage) {//这是一个接收模态框返回值的函数
                        $scope.getAllTableData(curpage);
                    }, function () {

                    });
                }
            };

        }]);
    //$uibModalInstance是模态窗口的实例
    app.controller('imageModalInstanceCtrl', ['$scope', '$filter', '$uibModalInstance', 'editImgMessage', 'curpage', 'doctorService',
        function ($scope, $filter, $uibModalInstance, editImgMessage, curpage, doctorService) {
            console.log("cur!!", curpage);
            $scope.user = {};
            //影像类型
            $scope.imgModality = [
                {mdality: "CT", id: "CT"},
                {mdality: "MR", id: "MR"},
                {mdality: "DR", id: "DR"},
                {mdality: "US", id: "US"},
                {mdality: "NM", id: "NM"},
                {mdality: "CR", id: "CR"},
                {mdality: "DX", id: "DX"},
                {mdality: "RF", id: "RF"},
                {mdality: "OT", id: "OT"},
                {mdality: "PX", id: "PX"},
                {mdality: "OT", id: "OT"}
            ];
            $scope.user.editModality = $scope.imgModality[0];
            $scope.user.editName = editImgMessage.patientname;
            $scope.user.editAge = editImgMessage.birthday;
            //性别
            if (editImgMessage.sex == "男") {
                $scope.female = true;
                $scope.user.editSex = "0"
            } else {
                $scope.female = false;
                $scope.user.editSex = "1"
            }
            $scope.user.editInstitutionname = editImgMessage.institutionname;
            $scope.user.editStudydate = editImgMessage.studydate;
            //影像类型
            $scope.user.editModality = editImgMessage.modality;
            $scope.studyTimeOpen = function () {
                $scope.studyOpened = true;
            };
            $scope.format = "yyyy-MM-dd";
            $scope.studyTimeOptions = {
                startingDay: 1,
                showWeeks: false,
                maxDate: new Date()
            };
            $scope.ensure = function () {
                if ($scope.user.editStudydate != "") {
                    var studyDate = doctorService.dataStrFormat($scope.user.editStudydate);
                }
                //通过age计算birthday
                var birthday = "";
                if ($scope.user.editAge !== "") {
                    var age = $scope.user.editAge;
                    var aDate = new Date();
                    var thisYear = aDate.getFullYear();
                    var temp = thisYear - age;
                    birthday = temp + "0101";
                }
                var info = {
                    "imageid": editImgMessage.imageid,
                    "patientname": $scope.user.editName,
                    "birthday": birthday,
                    "studydate": studyDate,
                    "institutionname": $scope.user.editInstitutionname,
                    "modality": $scope.user.editModality,
                    "sex": $scope.user.editSex
                };
                console.log("INFO", info);
                doctorService.editImg(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        alert("编辑影像成功,即将返回影像列表页！");
                        $uibModalInstance.close(curpage);
                    } else {
                        alert("编辑影像失败");
                    }
                }, function (error) {
                    alert("服务器异常");
                });
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);

})(angular);
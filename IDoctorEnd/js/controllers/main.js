(function (angular) {
    var app = angular.module('mainApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
    app.controller('mainController', ['$scope', '$state','$stateParams','$location', '$filter', '$window', '$timeout','doctorService',
        function ($scope,$state, $stateParams,$location, $filter, $window, $timeout,doctorService) {
            var httpUrl = "http://59.110.29.44";
            //从localStorage得到登录者的基本信息
            var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
            //user姓名
            if(userMessage){
                $scope.logName = userMessage[0].truename;
            }else{
                $state.go("login");
            }

            var file_url = "";
            doctorService.getImgHTTP().then(function (response) {
                var urls = response.message.split(";");
                file_url = urls[0];
            }, function (error) {

            });

            //时间戳placehoder
            $scope.startPlaceholder = "咨询开始";
            $scope.endPlaceholder = "咨询结束";
            $scope.startOptions = {
                startingDay: 1,
                showWeeks: false,
                maxDate: $scope.endDate
            };
            $scope.endOptions = {
                startingDay: 1,
                showWeeks: false,
                minDate: $scope.startDate,
                maxDate: new Date()
            };
            $scope.$watch('endDate', function (newValue, oldValue) {
                $scope.startOptions.maxDate = newValue;
            });
            $scope.$watch('startDate', function (newValue, oldValue) {
                $scope.endOptions.minDate = newValue;
            });
            //tab按钮的值
            $scope.tabs = [
                {title: '全部', id: '0'},
                {title: '未接受', id: '1'},
                {title: '进行中', id: '2'},
                {title: '已完成', id: '4'}
            ];

            //影像状态，初始化为1
            $scope.imgType = "0";
            $scope.getType = function (index) {
                $scope.imgType = $scope.tabs[index].id;
                $scope.currentPage = 1;
                getAllTableData();
            };

            //搜索功能
            $scope.search = function () {
                getAllTableData();
            };

            //header搜索框
            $scope.mainSearch = function () {
                getAllTableData();
            };
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

            //选择每页显示几条数据
            $scope.getPagesize = function () {
                $scope.itemsPerPage = $scope.selectValue.pagesize;
                getAllTableData();
            };
            //翻页
            $scope.currentPage = 1;     //当前页
            //点击页码事件
            $scope.setNumPage = function () {
                getAllTableData();
                $scope.jumpTo = '';
            };
            //输入页面点击确认事件
            $scope.setInputPage = function () {
                if(!isNaN($scope.jumpTo)){
                    //输入页码不能大与最大页码
                    if(parseInt($scope.jumpTo)>$scope.numPages){
                        $scope.jumpTo = $scope.numPages
                    }
                    $scope.currentPage = $scope.jumpTo;
                    getAllTableData();
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

            //定义获取表格内容数据函数
            var getTableData = function (info) {
                //表格中影像图片的缩略图的地址

                doctorService.getMainTableData(info).then(function (response) {
                    var getArr = JSON.parse(response.message);
                    console.log("important",JSON.parse(response.message));
                    var tabMain = [];
                    var tabTip = [];
                    var dataList = [];
                    for (var i = 0; i < getArr.length; i++) {
                        //表格主要内容
                        var tabMainObj = {};
                        //咨询标题对象
                        var tabTipObj = {};
                        var dataObj = {};
                        //患者年龄
                        tabMainObj.age = doctorService.getAge(getArr[i].birthday);
                        //患者姓名
                        tabMainObj.patientname = getArr[i].patientname;
                        //操作个按钮需要的参数
                        tabMainObj.image2askid = getArr[i].image2askid;
                        tabMainObj.askid = getArr[i].askid;
                        tabMainObj.imageid = getArr[i].imageid;
                        tabMainObj.asktype = getArr[i].asktype;
                        //患者性别，0为男，否则为女
                        if (getArr[i].sex == 0) {
                            tabMainObj.sex = "男";
                        } else {
                            tabMainObj.sex = "女";
                        }
                        //咨询类型,0为专家，否则为常规
                        if (getArr[i].asktype == 0) {
                            tabMainObj.asktype ="专家";
                        } else {
                            tabMainObj.asktype ="常规";
                        }
                        //影像缩略图
                        tabMainObj.image = file_url + 'public/thumb/' + getArr[i].imageid + '/'
                            + getArr[i].thumb;
                        //发起医院
                        tabMainObj.hospital = getArr[i].hospital;
                        //咨询发起时间
                        tabMainObj.addtime = getArr[i].addtime;
                        //影像上传时间
                        tabMainObj.uploadtime = getArr[i].uploadtime;
                        //咨询状态，status：// 0付款中（已经取消了）1未接受2已接受/阅片中3已拒绝 4已完成5审核中6已取消未完成
                        if (getArr[i].status == 1) {
                            tabMainObj.handle = "接受咨询";
                        } else if (getArr[i].status == 2) {
                            tabMainObj.handle = "继续阅片";
                        } else if (getArr[i].status == 3) {
                            tabMainObj.handle = "对方取消";
                        } else if (getArr[i].status == 4) {
                            tabMainObj.handle = "打开报告";
                        } else if (getArr[i].status == 5) {
                            tabMainObj.handle = "已审核,无法操作";
                        } else if (getArr[i].status == 6) {
                            tabMainObj.handle = "已拒绝";
                        }

                        //咨询标题
                        tabTipObj.title = getArr[i].title;
                        //基本病史
                        tabTipObj.memo = getArr[i].memo;
                        tabMain[i] = tabMainObj;

                        tabTip[i] = tabTipObj;
                        dataObj.tabMain = [tabMain[i]];

                        dataObj.tabTip = [tabTip[i]];
                        dataList.push(dataObj);
                    }
                    $scope.tableTabs = dataList;
                    console.log('dataList==', dataList);
                }, function (error) {
                    alert("服务器异常");
                });
            };
            //定义获取表格总数函数
            var getCount = function (info) {
                doctorService.getMainCountData(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        var message = JSON.parse(response.message);
                        if (message) {
                            $scope.totalItems = message
                        }else{
                            $scope.totalItems=0
                        }
                    } else if (result == -1) {
                        alert("获取咨询数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function (error) {
                    alert("服务器异常");
                });
            };
            var getAllTableData = function(){
                var info = {
                    "userid": userMessage[0].userid + "",
                    "doctorid": userMessage[0].userid + "",
                    "curpage": $scope.currentPage,
                    "pagesize": parseInt($scope.selectValue.pagesize),
                    "status": $scope.imgType
                };
                //咨询开始
                if ($scope.startDate != undefined) {
                    info.addstartime = doctorService.dataFormat($scope.startDate);
                }
                //咨询结束
                if ($scope.endDate != undefined) {
                    info.addendtime = doctorService.dataFormat($scope.endDate);
                }
                //咨询标题
                if ($scope.askTit != undefined) {
                    info.title = $scope.askTit;
                }
                //模糊搜索
                if ($scope.totalSearch != undefined) {
                    info.term = $scope.totalSearch;
                }
                getCount(info);
                getTableData(info);
            };
            getAllTableData();

            //点击打开报告
            $scope.imageReport = function (askid) {
                var info = {
                    "askid": askid,
                    "curpage": 1,
                    "pagesize": 5
                };
                doctorService.getOpenReportMessage(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        var message = JSON.parse(response.message);
                        if (message) {
                            printReport(message[0].imageid, message[0].askid, message[0].id);
                        }
                    } else if (result == -1) {
                        alert("获取影像数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function () {
                    alert("服务器异常");
                });
            };

            //调用打开报告接口
            function printReport(imageid, askid, image2askid) {
                var info = {
                    imageid: imageid,
                    askid: askid,
                    image2askid: image2askid
                };
                doctorService.getOpenReportUrl(info).then(function (response) {
                    var PDFurl = response.message;
                    var result = response.result;
                    if (result == 0) {
                        var pdfurl = "/idoctor/pdf/" + PDFurl + ".pdf";
                        console.log('pdfurl', pdfurl);
                        //$window.location.href = "http://101.201.82.44:8088/idoctor/pdf/pdf.js-master/web/viewer.html?file=" + pdfurl;
                        $window.location.href = httpUrl+"/idoctor/pdf/pdf.js-master/web/viewer.html?file=" + pdfurl;
                    } else {
                        alert("暂无报告！");
                    }
                }, function () {
                    alert("服务器异常");
                });
            }


            //点击打开报告
            $scope.readImage = function (askid) {
                var info = askid;
                doctorService.getMainReadImage(info).then(function (response) {
                    //console.log("response====",response);
                    //console.log("response====",JSON.parse(response.message));
                    var result = response.result;
                    if (result == 0) {
                        var message = JSON.parse(response.message);
                        if (message) {
                            getImage(askid, message)
                        }
                    } else if (result == -1) {
                        alert("获取咨询数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function () {
                    alert("服务器异常");
                });
            };

            //获取进入阅片页的信息
            function getImage(askid, askdata){
                askData = askdata;
                var info = {
                    "askid":askid,
                    "curpage":1,
                    "pagesize":5
                };
                doctorService.getMainGetImage(info).then(function (response) {
                    //console.log("response",response)
                    var result = response.result;
                    if (result == 0) {
                        var message = JSON.parse(response.message);
                        if (message) {
                            initImagedata(message, askData);
                        }
                    } else if (result == -1) {
                        alert("获取影像数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function () {
                    alert("服务器异常");
                });
            }



            //医生接收后 进入  继续阅片 写报告
            function initImagedata(data, askdata) {
                //$('#modalProgressGlobal').modal('show');
                var url ='';
                var isDicomOrJpg = userMessage.isDicomOrJpg;
                //mobile 手机端
                //if ($.browser.mobile == true){
                //    url = '?&patientID=' + data[0].patientid+ '&studyUID=' + data[0].studyid + '&imageid=' + data[0].imageid
                //        + '&askId=' + data[0].askid + '&image2askid=' + data[0].id + '&askType=' + askdata.asktype
                //        + '&reportFlag=1&accept=1' + '&type=jpg';
                //}

                //if ($.browser.desktop == true){
                    //当用户设置里面为dicom时，访问dicom类型，否则为jpg类型
                    if(isDicomOrJpg !=null && isDicomOrJpg ==1){
                        url = '?&patientID=' + data[0].patientid+ '&studyUID=' + data[0].studyid + '&imageid=' + data[0].imageid
                            + '&askId=' + data[0].askid + '&image2askid=' + data[0].id + '&askType=' + askdata.asktype
                            + '&reportFlag=1&accept=1' + '&type=dicom';
                    }else{
                        url = '?&patientID=' + data[0].patientid+ '&studyUID=' + data[0].studyid + '&imageid=' + data[0].imageid
                            + '&askId=' + data[0].askid + '&image2askid=' + data[0].id + '&askType=' + askdata.asktype
                            + '&reportFlag=1&accept=1' + '&type=jpg';
                    }

                //}
//	var path = '#/app/imageViewer/viewer' + url;
//	var path = '/idoctor/html/imageViewer/viewer2.html' + url;
                var path = '';
                if(document.body.clientWidth >= document.body.clientHeight){
                    path = httpUrl+'/idoctor/html/imageViewer/viewer_landscape.html'+ url;
                } else {
                    path = httpUrl+'/idoctor/html/imageViewer/viewer_vertical.html'+ url;
                }

                var config = "toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no";
                config += "height="+window.screen.height;
                config += "width="+window.screen.width;
                console.log("windows.open config:"+config);

                $window.location.href = path;

                //setcurrentQueryString(path);
            }

            //点击接受咨询事件，status=2
            $scope.changeAskStatus = function(status,askid,asktype){
                if(asktype=="专家"){
                    asktype=0;
                }else{
                    asktype=1;
                }
                var info = {
                    askid : askid,
                    status : status,
                    asktype: asktype,
                    doctorid : userMessage[0].userid
                };
                //console.log(info)
                doctorService.getMainReceiveAdvice(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        if (status == 3) {
                            alert("拒绝请求成功");

                        } else if (status == 4) {
                            alert("已完成");
                        } else {
                            $scope.readImage(askid);
                        }
                    } else if (result == -1) {
                        if (status == 3) {
                            alert("拒绝请求失败");
                        } else if (status == 4) {
                            alert("完成阅片失败");
                        } else {
                            alert("接收请求失败");
                        }
                    } else if (result == 1) {
                        if (status == 4) {
                            alert("未写完所有咨询影像的报告！");
                        }
                    }else if(result ==2){
                        if(status ==2){
                            alert("已被其他医生抢先接收！");
                        }
                    }else {
                        if (status == 3) {
                            alert("拒绝请求失败");
                        } else {
                            alert("接收请求失败");
                        }
                    }
                }, function (error) {
                    alert("服务器异常");
                });
            }


        }]);
})(angular);
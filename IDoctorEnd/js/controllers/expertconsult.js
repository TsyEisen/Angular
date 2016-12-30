(function (angular) {
    angular.module('expertconsultApp', ['ui.bootstrap', 'institutionServiceApp', "ngFileUpload"])
        .controller('expertconsultController', ['$scope', '$state', '$uibModal', 'doctorService', 'institutionService',
            '$filter', 'Upload', '$timeout', '$rootScope',
            function ($scope, $state, $uibModal, doctorService, institutionService, $filter, Upload, $timeout, $rootScope) {

                /***********初始化*************/
                $scope.file_url = "";
                doctorService.getImgHTTP().then(function (response) {
                    var urls = response.message.split(";");
                    $scope.file_url = urls[0];
                }, function (error) {
                });

                $scope.user = angular.fromJson(localStorage.getItem("ueserMessage"))[0];

                $scope.selectedImages = [];

                $scope.selectedDoctor = {};

            }])
        .controller('doctor_ImageSelectController', ['$scope', '$state', '$uibModal', 'doctorService', 'institutionService',
            '$filter', 'Upload', '$timeout', '$rootScope',
            function ($scope, $state, $uibModal, doctorService, institutionService, $filter, Upload, $timeout, $rootScope) {

                /***********初始化*************/

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
                $scope.currentPage = 1;
                $scope.isHigherSearch = false;

                /*首次初始化信息*/
                initImageList();

                /***********点击事件*************/

                $scope.getPagesize = function () {
                    $scope.currentPage = 1;
                    $scope.jumpImgTo = '';
                    initImageList();
                };

                $scope.setNumPage = function () {
                    initImageList();
                };

                $scope.setInputPage = function () {
                    if (parseInt($scope.jumpTo) > $scope.numPages) {
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
                    $scope.currentPage = 1;
                    $scope.isHigherSearch = false;
                    initImageList();
                }

                $scope.experthighsearch = function (size) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'docExpAsk_ImageModal.html',
                        controller: 'docExpAsk_ImageModalCtrl',
                        backdrop: "static",
                        size: size,
                        resolve: {
                        }
                    });
                }

                $scope.onChange = function (index) {
                    var imageId = $('input[name="imagecheck"]').eq(index).val();
                    var index = $scope.selectedImages.indexOf(imageId);
                    if (index > -1) {
                        $scope.selectedImages.splice(index, 1);
                    }else {
                        $scope.selectedImages.push(imageId);
                    }
                    $scope.lastSelectImage = imageId;
                    sendImageId = $scope.lastSelectImage;
                    institutionService.getInstMainExpImage(sendImageId).then(function (res) {
                        var imageObj = JSON.parse(res.message);

                        var asktitle = imageObj.patientid+' '+ imageObj.patientname + ' '
                            + (imageObj.gender  = imageObj.sex==0?"男":"女")+' '+institutionService.getAge(imageObj.birthday)
                            +' ' + (imageObj.consultStatus = imageObj.status == 0? "专家咨询":"常规咨询")

                        var patientAge = parseInt(institutionService.getAge(imageObj.birthday));

                        $rootScope.$broadcast("selectedImageBroadcast",{asktitle:asktitle,patientAge:patientAge});
                    })
                }

                //接收广播
                $scope.$on("refreshimageData", function () {
                    $scope.isHigherSearch = true;
                    initImageList();
                });

                /***********网络请求*************/

                /**
                 * 获取影像列表
                 */
                function initImageList() {

                    var data = {
                        userid: $scope.user.userid,
                        havereport: -1,
                        haveask: -1
                    };

                    if ($scope.isHigherSearch) {
                        //如果是高级搜索加入高级搜索的参数
                        var Img_advanceddataStr = localStorage.getItem("advanceddataKey");
                        var Img_advanceddata = JSON.parse(Img_advanceddataStr);
                        data = angular.extend(data, Img_advanceddata);
                    } else {
                        if ($scope.expImageCondition != undefined) {
                            data.term = $scope.expImageCondition;
                        }
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
                                    obj.imageurl = $scope.file_url + "public/thumb/" + obj.imageid + "/" + obj.thumb;
                                    obj.gender = obj.sex == 0 ? "男" : "女";
                                    obj.age = institutionService.getAge(obj.birthday);
                                    var studydate = obj.studydate;
                                    studydate = studydate.substr(0, 4) + '-' + studydate.substr(4, 2) + '-' + studydate.substr(6, 2);
                                    obj.studydate = studydate;
                                    obj.selected = $scope.selectedImages.indexOf(obj.imageid + "") > -1;
                                    //专家和常规咨询个数
                                    getConsultCount(obj,0);
                                    getConsultCount(obj,1);
                                }
                                $scope.expAskImages = message;
                            }
                        }
                    }), function (error) {
                    }
                }

                /**
                 * 获取咨询条数
                 * @param imageObj 影像对象
                 * @param type 0 常规咨询 1 专家咨询
                 */
                function getConsultCount(imageObj,type) {

                    var data = {};
                    data.imageid = imageObj.imageid;
                    data.curpage = 1;
                    data.pagesize = 100;
                    data.asktype = type;
                    data.adduser = $scope.user.userid;

                    institutionService.getInstExpAskStatus(data).then(function (res) {
                        var result = res.result;
                        if (result == 0) {
                            var message = JSON.parse(res.message);
                            if (message){
                                if(type == 0) {
                                    //专家咨询
                                   imageObj.expCount = message.length;
                                }else if (type == 1){
                                    //常规咨询
                                   imageObj.commonAskCount = message.length;
                                }

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

            }])

        .controller('doctor_doctorSelectController', ['$scope', '$state', '$uibModal', 'doctorService', 'institutionService',
            '$filter', 'Upload', '$timeout', '$rootScope',
            function ($scope, $state, $uibModal, doctorService, institutionService, $filter, Upload, $timeout, $rootScope) {

                /***********初始化*************/

                // 选择医生分页初始化
                $scope.doctor_pageList = [
                    {id: 1, pagesize: "5"},
                    {id: 2, pagesize: "10"},
                    {id: 3, pagesize: "20"},
                    {id: 4, pagesize: "50"}
                ];
                $scope.doctor_selectValue = $scope.doctor_pageList[0];
                $scope.doctor_maxSize = 5;//最大显示几条页码

                //筛选信息设置
                $scope.consultCalls = [
                    {id:"002",name:"主任医师"},
                    {id:"003",name:"副主任医师"},
                    {id:"004",name:"主治医师"},
                    {id:"005",name:"住院医师"},
                    {id:"006",name:"其它"}
                ];
                $scope.professionalPost= $scope.consultCalls[0];
                $scope.engineer = {
                    name: "Dani" ,
                    currentActivity: {
                        id: 1,
                        type: "内科" ,
                        name: "神经内科"
                    }
                };
                $scope.activities = [
                    { id: 1, type: "内科" , name: "神经内科" },
                    { id: 2, type: "内科" , name: "呼吸科" },
                    { id: 3, type: "内科" , name: "外科" },
                    { id: 4, type: "内科" , name: "骨科" },
                    { id: 5, type: "内科" , name: "神经外科"},
                    { id: 6, type: "内科" , name: "普通外科" },
                    { id: 7, type: "内科" , name: "肝胆外科" },
                    { id: 8, type: "内科" , name: "泌尿外科" },
                    { id: 9, type: "内科" , name: "胸外科" },
                    { id: 10, type: "内科" , name: "创伤骨科" },
                    { id: 11, type: "内科" , name: "功能神经外科" },

                    { id: 12, type: "其他" , name: "放射科" },
                    { id: 13, type: "其他" , name: "口腔科" },
                    { id: 14, type: "其他" , name: "超声医学科" },
                    { id: 15, type: "其他" , name: "介入放射科"},
                    { id: 16, type: "其他" , name: "放疗科" },
                    { id: 17, type: "其他" , name: "病理科" }
                ];

                //变量
                $scope.doctor_currentPage = 1;//当前页
                $scope.doctor_docotrLevel = 0;//医生等级

                //初始化页面
                initExpertList();

                /***********点击事件*************/
                //分页事件
                $scope.doctor_getPagesize = function () {
                    $scope.doctor_currentPage = 1;
                    initExpertList();
                };

                $scope.doctor_setNumPage = function () {
                    initExpertList();
                };

                $scope.doctor_setInputPage = function () {
                    if(parseInt($scope.doctor_jumpTo)>$scope.doctor_numPages){
                        $scope.doctor_jumpTo = $scope.doctor_numPages;
                    }
                    $scope.doctor_currentPage = $scope.doctor_jumpTo;
                    initExpertList();
                };

                $scope.doctor_pageKeyup = function (e) {
                    var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                    if (keycode == 13) {
                        $scope.doctor_setInputPage();//如果等于回车键编码执行方法
                    }
                };

                //选择医生
                $scope.changeDoctor = function (item) {
                    if (item.checked) {
                        $scope.selectedDoctor.checked = false;
                        $scope.selectedDoctor = item;
                    } else {
                        $scope.selectedDoctor = {};
                    }
                }
                //点击医生等级查询
                $scope.searchByLevel = function (index) {
                    $scope.doctor_currentPage = 1;
                    $scope.doctor_docotrLevel = index;
                    initExpertList();
                };

                //城市选择设置
                $scope.clickProvince = function () {
                    $scope.citys = [];
                    var subStrProvince = $scope.selectProvince.code.slice(0,2);
                    for (var i = 0; i < $scope.allCitys.length; i++) {
                        var citycode = $scope.allCitys[i].code;
                        var subStrCity =citycode.slice(0,2);
                        if(subStrProvince==subStrCity){
                            $scope.citys.push( $scope.allCitys[i]);
                        }
                    }
                    $scope.selectCity = {};
                }

                $scope.clickCity = function () {
                    $scope.districts=[];
                    if( $scope.selectCity!=null){
                        var subStrCity = $scope.selectCity.code.slice(0,4);
                    }

                    for (var i = 0; i <  $scope.allDistrict.length; i++) {
                        var districtcode =  $scope.allDistrict[i].code;
                        var subStrDistrict=districtcode.slice(0,4);
                        if(subStrDistrict==subStrCity){
                            $scope.districts.push( $scope.allDistrict[i]);
                        }
                    }
                    $scope.selectDistrict = {};

                }

                //开始搜索
                $scope.expertDocSearch = function () {
                    initExpertList();
                };

                /***********网络请求*************/
                /**
                 * 选择医生列表
                 */
                function initExpertList(){
                    var searchData = {
                        instid: $scope.user.userid ,
                        userlevel: $scope.doctor_docotrLevel,
                        curpage: $scope.doctor_currentPage,
                        pagesize: $scope.doctor_selectValue.pagesize,
                    };

                    if ($scope.selectProvince!=undefined && $scope.selectProvince.code > 0) {
                        searchData.province = $scope.selectProvince.code;
                    }
                    if ($scope.selectCity!=undefined &&  $scope.selectCity.code > 0) {
                        searchData.city = $scope.selectCity.code;
                    }
                    if ($scope.selectDistrict!=undefined &&  $scope.selectDistrict.code > 0) {
                        searchData.area = $scope.selectDistrict.code;
                    }
                    // 所在医院 输入框 模糊查询
                    if ($scope.hospital) {
                        searchData.hospital = $scope.hospital;
                    }
                    // 科室
                    var deparmentVal = document.getElementById("ask-department").value;
                    if(deparmentVal!=''){
                        searchData.department = $scope.engineer.currentActivity.name;
                    }
                    // 医生职称
                    if($scope.doctor_title){
                        searchData.title = $scope.doctor_title;
                    }
                    // 医生名称
                    if ($scope.doctorname) {
                        searchData.truename = $scope.doctorname;
                    }

                    console.log("医生列表参数",searchData);

                    institutionService.getGenerateExpertList(searchData).then(function (res) {
                        if (res.result == 0) {
                            var message = JSON.parse(res.message);
                            if (message) {
                                console.log("列表返回值",message);
                                for (var i = 0; i <  message.length; i++) {
                                    var obj =  message[i];

                                    if(obj.headpic == null || obj.headpic == ""){
                                        obj.doctorHeadpic = "../../image/institution/avator.png" ;
                                    }else{
                                        obj.doctorHeadpic = $scope.file_url+"public/pic/"+ obj.userid+"/"+obj.headpic;
                                    }

                                    // 级别
                                    if (obj.userlevel == 1){
                                        obj.level = "海外专家";
                                    }else if (obj.userlevel == 2){
                                        obj.level = "全国顶级";
                                    } else if (obj.userlevel == 3) {
                                        obj.level = "全国知名";
                                    } else if (obj.userlevel == 4){
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

                /**
                 * 加载城市数据
                 */
                institutionService.getProvinceData().then(function (res) {
                    $scope.provinces = res;
                    $scope.selectProvince= $scope.provinces[0];
                })

                institutionService.getCityData().then(function (res) {
                    $scope.allCitys = res;
                })

                institutionService.getDistrictData().then(function (res) {
                    $scope.allDistrict = res;
                })

            }])

        .controller('doctor_askInfoController', ['$scope', '$state', '$uibModal', 'doctorService', 'institutionService',
            '$filter', 'Upload', '$timeout', '$rootScope',
            function ($scope, $state, $uibModal, doctorService, institutionService, $filter, Upload, $timeout, $rootScope) {

                /***********初始化*************/
                $scope.consultLevels =[
                    {id:1,level:"一般"},
                    {id:2,level:"一般紧急"},
                    {id:3,level:"特殊紧急"}
                ]
                $scope.selectLevel = $scope.consultLevels[0];

                /***********点击事件*************/

                //发起咨询
                $scope.stratBigConsult = function () {
                    addAsk();
                }

                //附件上传
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
                                    url: hostUrl +'/idoctor/service/card/uploadAttachment',
                                    data: {
                                        file: file,
                                        userid:userMessage[0].userid
                                    }
                                }).then(function (resp) {
                                    var result = resp.data.result;
                                    if(result == 0){
                                        var message = JSON.parse(resp.data.message);
                                        $scope.uploadMsg = "文件上传成功"
                                    }
                                    $timeout(function() {
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

                //监听广播
                $scope.$on("selectedImageBroadcast", function (event, response) {
                    $scope.asktitle = response.asktitle;
                    $scope.patientAge = parseInt(response.patientAge);

                });

                /*************网络请求***************/
                function addAsk(){
                    var imagestr = $scope.selectedImages.join(";")
                    if (imagestr == "" || imagestr == 'undefined') {
                        alert("请选择影像");
                        return;
                    }
                    if ($scope.selectedDoctor.checked == undefined) {
                        alert('请选择咨询医生');
                        return;
                    }
                    if($scope.asktitle == undefined){
                        alert('请输入咨询标题');
                        return;
                    }
                    if(parseInt($scope.patientAge)>0 &&parseInt($scope.patientAge)<150 &&!isNaN($scope.patientAge) ){

                    }else{
                        alert('请输入正确的年龄');
                        return;
                    }
                    if($scope.patitentHistory == undefined){
                        alert('请输入基本病史');
                        return;
                    }
                    if($scope.askquestion == undefined){
                        alert('请输入咨询的问题');
                        return;
                    }
                    var consultInfo = {
                        title:$scope.asktitle==undefined?'':$scope.asktitle,
                        targetuser:$scope.selectedDoctor.userid,
                        imagestr:imagestr,
                        memo:$scope.patitentHistory == undefined?'':$scope.patitentHistory,
                        adduser: $scope.user.userid ,
                        askid:0,
                        recommend:$scope.recommend == undefined?'':$scope.recommend,
                        askquestion:$scope.askquestion == undefined?'':$scope.askquestion,
                        degree:$scope.selectLevel.level,
                        status:1
                    };
                    console.log("发起咨询的参数",consultInfo);
                    institutionService.InstExpSure({doctorid:$scope.selectedDoctor.userid}).then(function (data){
                        console.log("发起咨询的结果",data);
                        if(data.result == 0){
                            var userDoctor = JSON.parse(data.message)[0];
                            var allSendMsg = angular.extend(consultInfo,userDoctor);
                            var modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: 'docExpConsultSureModal.html',
                                controller: 'docExpConsultSureCtrl',
                                backdrop: "static",
                                resolve: {
                                    allSendInfo: function () {
                                        return allSendMsg
                                    }
                                }
                            });
                        }
                    })
                }
            }])

        .controller("docExpAsk_ImageModalCtrl", ["$scope", '$uibModalInstance', '$uibModalInstance', '$rootScope', function ($scope, $uibModalInstance, $uibModalInstance, $rootScope) {
            // 搜索时间设置
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

            // 时间插件初始化
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

            var Img_advanceddata = {};
            $scope.ensureSearch = function () {
                var uploadstarttime = $("#uploadstarttime").val();
                var uploadendtime = $("#uploadendtime").val();
                var studystarttime = $("#studystarttime").val();
                var studyendtime = $("#studyendtime").val();
                var havereport = $("#image-havereport").val();
                var haveask = $("#image-haveask").val();
                Img_advanceddata = {
                    truename: $scope.image_truename == undefined ? '' : $scope.image_truename,
                    patientid: $scope.image_imageid == undefined ? '' : $scope.image_imageid,
                    havereport: havereport,
                    haveask: haveask
                }
                if (uploadstarttime) {
                    uploadstarttime = uploadstarttime.substr(0, 4) + uploadstarttime.substr(5, 2) + uploadstarttime.substr(8, 2);
                    Img_advanceddata.uploadstarttime = uploadstarttime;
                }
                if (uploadendtime) {
                    uploadendtime = uploadendtime.substr(0, 4) + uploadendtime.substr(5, 2) + uploadendtime.substr(8, 2);
                    Img_advanceddata.uploadendtime = uploadendtime;
                }
                if (studystarttime) {
                    studystarttime = studystarttime.substr(0, 4) + studystarttime.substr(5, 2) + studystarttime.substr(8, 2);
                    Img_advanceddata.studystarttime = studystarttime;
                }
                if (studyendtime) {
                    studyendtime = studyendtime.substr(0, 4) + studyendtime.substr(5, 2) + studyendtime.substr(8, 2);
                    Img_advanceddata.studyendtime = studyendtime;
                }
                // $scope.$on("refreshimageData", function () {
                //     initImage(1, 5);
                // });
                $uibModalInstance.dismiss("高级搜索");
                localStorage.setItem("advanceddataKey", JSON.stringify(Img_advanceddata));
                $rootScope.$broadcast("refreshimageData");
            }
            $scope.cancelSearch = function () {
                $uibModalInstance.dismiss("取消高级搜索");
            }

        }])

        .controller("docExpConsultSureCtrl", ["$scope", '$uibModalInstance', 'allSendInfo', 'institutionService',
            function ($scope, $uibModalInstance, allSendInfo, institutionService) {
                $scope.closeConsultSure = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.cancelExpConsult = function () {
                    $uibModalInstance.dismiss('cancel');
                }
                console.log("allSendInfo==", allSendInfo);
                $scope.asknumber = allSendInfo.asknumber;
                $scope.askexpert = allSendInfo.hospital + allSendInfo.truename + allSendInfo.title;
                $scope.askequestion = allSendInfo.askquestion;
                $scope.patitentHistory = allSendInfo.memo;
                $scope.ensureExpConsult = function () {
                    submitAsk();
                    $uibModalInstance.dismiss("cancel");

                }
                console.log("allSendInfo", allSendInfo);
                var sendExpConsultdata = {
                    asknumber: allSendInfo.asknumber,
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



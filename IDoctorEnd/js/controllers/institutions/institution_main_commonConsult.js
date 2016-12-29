/**
 * Created by Administrator on 2016/12/16.
 */
(function (angular) {
    angular.module("institution_main_commonConsultApp",["institutionServiceApp","ui.bootstrap"])
        .controller("instMain_commonConsult",["$scope","institutionService", '$timeout',"$uibModal",
            function ($scope,institutionService,$timeout,$uibModal) {
                var getInstMaindata = JSON.parse(localStorage.getItem("instMainInfo"));
                var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
                var doctorlist;
                var file_url = "";
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
                    data.adduser = 4,//userMessage[0].userid;
                    institutionService.getInstExpAskStatus(data).then(function (res) {
                        var result = res.result;
                        if (result == 0) {
                            var message = JSON.parse(res.message);
                            if (message) {
                                $scope.expCount = message.length;
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
                function getNormalAskStatus(imageObj) {
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
                                $scope.comCount = message.length;
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
                var imageId = getInstMaindata.imageid;
                var askFlag = false;
                // 选择影像
                $scope.onChange = function (imageData) {

                    if (imageData.selected) {
                        if (!$scope.selected) $scope.selected = imageData;
                        if ($scope.selected !== imageData) imageData.selected = false;
                    } else {
                        $scope.selected = '';
                    }
                }

                // 分页代码
                $scope.pageList = [
                    {id: 1, pagesize: "5"},
                    {id: 2, pagesize: "10"},
                    {id: 3, pagesize: "20"},
                    {id: 4, pagesize: "50"}
                ];
                $scope.selectValue = $scope.pageList[0];
                $scope.itemsPerPage = $scope.selectValue.pagesize;//每页显示多少条数据
                $scope.currentPage=1;
                $scope.maxSize = 5;//最大显示几条页码
                //选择每页显示几条数据
                $scope.getPagesize = function () {
                    $scope.currentPage = 1;
                    initDoctorList($scope.currentPage,$scope.selectValue.pagesize);
                };

                // 点击改变页码时
                $scope.setNumPage = function () {
                    initDoctorList($scope.currentPage,$scope.selectValue.pagesize);
                };
                //输入页面点击确认事件
                $scope.setInputPage = function () {
                    if(parseInt(scope.jumpTo)>$scope.numPages){
                        $scope.jumpTo = $scope.numPages;
                    }
                    $scope.currentPage = $scope.jumpTo;
                    initDoctorList($scope.currentPage,$scope.selectValue.pagesize);
                };

                var inviteListN = $("#show_doctorlist");
                $scope.inviteList = function () {
                    var asktype = $("input[name='asktype']:checked").val();
                    if (asktype == 3) {
                        $("#show_doctorlist").show();
                    } else {
                        $("#show_doctorlist").hide();
                    }
                }
                var askFlag = false;
                $scope.askSearch = function () {
                    askFlag = false;
                    initDoctorList( $scope.currentPage,$scope.selectValue.pagesize);
                }
                // 高级搜索
                $scope.doctorModel = function (size) {
                    askFlag = true;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'InstCommonAsk_DoctorModal.html',
                        controller: 'InstCommonAsk_DoctorModalCtrl',
                        backdrop: "static",
                        size: size,
                        resolve: {
                        }
                    });
                    initDoctorList(1,5);
                }
               // 我的医生
                $scope.quickAskSearch = function () {
                    doctorlist1(1, 5);
                }
                 $scope.tasks =[];
                $scope.inviteadd = function () {
                    var id;
                    if ($scope.tasks.length == 0) {
                        id = 1;
                    } else {
                        id = $scope.tasks[$scope.tasks.length - 1].id + 1;
                    }
                    if ($("input[name='userid']:checked").length == 0) {
                        alert("请选择医生");
                        return;
                    }
                    $("input[name='userid']:checked")
                        .each(
                            function() {
                                var userid = $(this).val();
                                $scope.doctorlist = doctorlist;
                                for (var i = 0; i < doctorlist.length; i++) {
                                    var obj = doctorlist[i];
                                    if (obj.userid == userid) {
                                        var result = invitelistcheck(obj.userid);
                                        if (result) {
                                            alert("医生已存在");
                                            return false;
                                        }
                                        var headpic = '../../image/avatar.png';
                                        if (obj.headpic) {
                                            headpic = file_url + 'public/pic/'
                                                + obj.userid + '/'
                                                + obj.headpic;
                                        }
                                        var sex = '';
                                        if (obj.gender == 1) {
                                            sex = '男';
                                        } else if (obj.gender == 2) {
                                            sex = '女';
                                        }else{
                                            sex = '性别未知';
                                        }

                                        $scope.tasks.push(
                                            {id: id, headpic: headpic,truename:obj.truename,age:obj.age,
                                                sex:sex,userid:obj.userid, completed: false})
                                    }

                                }
                            })

                }
                $scope.removeInvite = function (id) {
                    for (var i = 0; i < $scope.tasks.length; i++) {
                        var item = $scope.tasks[i];
                        if(item.id==id){
                            // 从数组中删除一个元素
                            $scope.tasks.splice(i,1);
                            return;

                        }
                    }
                }

                institutionService.getInstCommonConsult(imageId).then(function (res) {
                   var result = res.result;
                   if(result == 0){
                       var message = JSON.parse(res.message);
                       if(message){
                           initNormalConsult(message);
                       }
                   }
                });
                 // 初始化常规咨询
                function initNormalConsult(message){
                    var data={};
                    data.date=institutionService.getNowIntDate();
                    institutionService.initNormalConsult(data).then(function (res) {
                        var result = res.result;
                        if(result == 0){
                            $scope.asknumber = res.message;
                        }else if(result == 1){
                            alert("获取用户数据失败");
                        } else {
                            alert("未知错误");
                        }

                    },function (error) {
                        alert("服务器异常");
                    });
                    // 初始咨询的标题
                    if (message != null){
                        var gender = '';
                        if (message.sex == 0) {
                            gender = '男';
                        } else {
                            gender = '女';
                        }

                        $scope.askTitle = institutionService.dataFormat2(new Date())+' '+message.patientname + ' '+gender+''+
                            institutionService.getAge(message.birthday);
                        if (institutionService.getAge(message.birthday)== '岁' || institutionService.getAge(message.birthday)==''){
                            $('#normalAskAgeGroup').show();
                        }
                        // 2天后的时间
                        var later  = institutionService.getDaysLater(parseInt(2,10));
                        $scope.endtime = new Date(later);
                        initDoctorList(1, 5)
                    }

                }
                function initDoctorList(page,pageSize) {
                   doctorlist = null;
                    var data = {
                        instid:4,//user.userid,
                        userlevel:-1 //userlevel=0 表示是所有的专家，不包括医生
                    };
                    var advancedDataStr = localStorage.getItem("advanceddataKey");
                    var advancedData = JSON.parse(advancedDataStr);
                    if(askFlag){
                        var province = advancedData.province;
                        if (province > 0) {
                            data.province = province;
                        }
                        var city = advancedData.city;
                        if (city > 0) {
                            data.city = city;
                        }
                        var area = advancedData.area;
                        if (area > 0) {
                            data.area = area;
                        }
                        var hospital = advancedData.hospital;
                        if (hospital) {
                            data.hospital = hospital;
                        }
                        var department = advancedData.department;
                        if (department != undefined) {
                            data.department = department;
                        }
                        var title = advancedData.title;
                        if (title != undefined) {
                            data.title = title;
                        }
                    }else{
                        var term = $scope.inviteCondition;
                        if (term)
                        {
                            data.truename = term;
                        }

                    }

                    var count;
                    institutionService.initDoctorList(data)
                        .then(function (res) {

                        var result = res.result;
                        if(result ==0 ){
                            count =  JSON.parse(res.message);//多少条医生列表 9条
                            $scope.totalItems = count ;
                        }
                        else if (result == -1) {
                            alert("获取用户数据失败");
                        }
                        else {
                            alert("未知错误");
                        }
                    })
                        , function (error) {
                        alert("服务器异常");
                    }

                    data.curpage = page;
                    data.pagesize = pageSize;
                    institutionService.initDoctorListDetails(data).then(function (res) {
                        var result = res.result;
                        if(result == 0){
                            var message = JSON.parse(res.message);
                            if(message){
                                $scope.consultComDoctors = message;
                                doctorlist = message;
                            }
                        }else if (result == -1) {
                            alert("获取用户数据失败");
                        }
                        else{
                            alert("未知错误");
                        }
                    }),function (error) {
                       alert("服务器异常");
                    }
                }
                function doctorlist1(page,pageSize) {
                    doctorlist = null;
                    var data = {};
                    data.instid = 4;
                    institutionService.getInstCommondoctorcount(data)
                        .then(function (res) {
                        var result = res.result;
                        if (result == 0) {
                            var message = JSON.parse(res.message);
                        } else if (result == -1) {
                           alert("获取分组数据失败");
                        } else {
                            alert("未知错误");
                        }

                    })
                    ,function (error) {
                        alert("服务器异常");
                    }
                    data.curpage = page;
                    data.pagesize = pageSize;
                    institutionService.getInstCommondoctorList(data).then(function (res) {
                        var result = res.result;
                        if(result==0){
                            var message =JSON.parse(res.message);
                            if(message){
                                $scope.consultComDoctors = message;
                                doctorlist = message;
                            }
                        }
                    })

                }
                function invitelistcheck(id) {
                    var flag = false;
                    $(".invitelistid").each(function() {
                        var userid = $(this).children(0).val();
                        if (id == userid) {
                            flag = true;
                        }
                    });
                    return flag;
                }
                // 发起咨询
                function addCommonAsk() {
                    var data = {};
                    var hasupload = '1';
                    if(!$scope.imageData){
                        alert("请选择影像");
                        return;
                    }
                    if($scope.patitentHistory==undefined){
                        alert("基本病史不能为空");
                        return;
                    }else if($scope.patitentHistory.lenght<20){
                        alert("基本病史不能少于20个字符");
                        return;
                    }
                    var asktype = $('input[name="asktype"]:checked').val();
                    if (asktype == 3)
                    {
                        var targetUserstr = invitelistquery();
                        if (targetUserstr == '')
                        {
                            alert("请添加邀请的医生");
                            return;
                        }
                        data.targetuserstr = targetUserstr;
                    }

                    data.imagestr = getInstMaindata.imageid;
                    data.endtime = $("#endtimeId").val();
                    data.adduser = 4;//user.userid;
                    data.hasupload = hasupload;
                    data.memo = $scope.patitentHistory;
                    data.asktype = asktype;
                    data.status = 1;
                    data.asknumber=$scope.asknumber;
                    data.title = $scope.askTitle;
                    $("#btnLaunchAsk").attr("disabled",true);
                    var dataStr=JSON.stringify(data);
                    institutionService.getInstCommonAsk(dataStr).then(function (res) {
                        var result = res.result;
                        if (result == 0) {
                            alert("发送咨询成功，请耐心等待");
                        } else if (result == -1) {
                            alert("发送失败");
                        } else {
                           alert("未知错误");
                        }
                    }),function (error) {
                        alert("服务器异常");
                    }
                }
                function invitelistquery()
                {
                    var targetUserstr = "";
                    $( ".invitelistid").each( function(){
                        var userid = $( this).children(0).val();
                        targetUserstr += userid + ";";
                    });
                    return targetUserstr;
                }

                // 时间插件代码
                $scope.format = "yyyy-MM-dd HH:mm:ss";
                $scope.altInputFormats = ['yyyy-M!/d!'];
                $scope.popup1 = {
                    opened: false
                };
                $scope.open1 = function () {
                    $scope.popup1.opened = true;
                };
            }])
        .controller("InstCommonAsk_DoctorModalCtrl",["$scope",'$uibModalInstance','institutionService','$uibModalInstance',function ($scope,$uibModalInstance,institutionService,$uibModalInstance) {
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
                $scope.selectCity = $scope.citys[0];
                $scope.clickCity();
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
                $scope.selectDistrict = $scope.districts[0];

            }
            $scope.clickDistrict = function () {}
            $scope.consultCalls = [
                {id:"001",name:"主任医师"},
                {id:"002",name:"副主任医师"},
                {id:"003",name:"主治医师"},
                {id:"004",name:"住院医师"},
                {id:"005",name:"其它"}
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
            var advanceddata ={};
            $scope.ensureSearch = function () {
                   advanceddata = {
                    province:$scope.selectProvince == undefined ?'':$scope.selectProvince.code,
                    city:$scope.selectCity==undefined?'':$scope.selectCity.code,
                    area:$scope.selectDistrict==undefined?'':$scope.selectDistrict.code,
                    hospital:$scope.hospital,
                    department:$scope.engineer.currentActivity.name,
                    title:$scope.professionalPost.name
                }

                $uibModalInstance.dismiss("高级搜索");
               localStorage.setItem("advanceddataKey",JSON.stringify(advanceddata));

            }
            $scope.cancelSearch = function () {
                $uibModalInstance.dismiss("取消高级搜索");
            }
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



})(angular)
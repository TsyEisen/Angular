(function (angular) {
    var app = angular.module('addFriendApp', []);
    app.controller('addFriendController', ['$scope', '$state', '$uibModal', 'doctorService',
        function ($scope, $state, $uibModal, doctorService) {
            $scope.backToMyfriend = function () {
                $state.go("sidebar.myfriend");
            };
//从localStorage得到登录者的基本信息
            var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
            //user姓名
            if(userMessage){
                $scope.logName = userMessage[0].truename;
            }else{
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
            var getDoctorCount = function (info) {
                doctorService.getExpertListCount(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        var message = JSON.parse(response.message);
                        console.log("message", message);
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

                });
            };
            //定义获取表格数据函数
            var getDoctorListData = function (info) {
                //表格中影像图片的缩略图的地址
                var file_url = "";
                doctorService.getImgHTTP().then(function (response) {
                    var urls = response.message.split(";");
                    file_url = urls[0];
                }, function (error) {

                });
                doctorService.getExpertListData(info).then(function (response) {
                    console.log("getExpertListData===", response);
                    console.log("getExpertListData===", JSON.parse(response.message));
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
                            $scope.addFriendTable = message;
                        }
                    } else if (result == -1) {
                        alert("获取医生数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function (error) {

                });
            };

            var getAllDoctorTableData = function (curpage, message) {
                //初始化当前页为第一页
                if (curpage == undefined) {
                    curpage = 1;
                    $scope.currentPage = 1;
                }
                //userlevel == -1 时，得到的是专家和普通医生所有的人员记录
                var info = {
                    "instid": userMessage[0].userid + "",
                    "curpage": curpage,
                    "pagesize": $scope.selectValue.pagesize,
                    "userlevel": -1
                };
                if ($scope.doctorTerm) {
                    info.truename = $scope.doctorTerm;
                }
                if (message) {
                    if (message.province) {
                        info.province = message.province;
                    }
                    if (message.hospital) {
                        info.hospital = message.hospital;
                    }
                    if (message.department) {
                        info.department = message.department;
                    }

                }

                getDoctorCount(info);
                getDoctorListData(info);
            };
            //封装表格总数加表格数据
            getAllDoctorTableData();
            //搜索框搜索
            $scope.search = function () {
                getAllDoctorTableData(1);
            };
            $scope.getPagesize = function () {
                $scope.itemsPerPage = $scope.selectValue.pagesize;
                getAllDoctorTableData($scope.currentPage);
            };
            //点击页码事件
            $scope.setNumPage = function () {
                getAllDoctorTableData($scope.currentPage);
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
                    getAllDoctorTableData($scope.currentPage);
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

            //添加医生按钮
            $scope.addDoctor = function (doctorid) {
                console.log("doctorid", doctorid);
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'addDoctorModal.html',
                    controller: 'addDoctorModalInstanceCtrl',
                    backdrop: "static",
                    resolve: {
                        usermessage: function () {
                            return {
                                "userid": userMessage[0].userid,
                                "doctorid": doctorid
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {//这是一个接收模态框返回值的函数
                    if(result == 0){
                        getAllDoctorTableData($scope.currentPage);
                    }
                }, function () {

                });
            };

            //高级搜索模态框模块
            $scope.advancedSearch = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'addDoctorAdvancedSearchModal.html',
                    controller: 'addDoctorAdvancedModalInstanceCtrl',
                    backdrop: "static"
                });
                modalInstance.result.then(function (message) {//这是一个接收模态框返回值的函数
                    getAllDoctorTableData($scope.currentPage, message);
                }, function () {

                });
            };
//高级搜索模态框模块
        }]);

    //医生列表高级搜索模态窗口的实例
    app.controller('addDoctorAdvancedModalInstanceCtrl', ['$scope', '$uibModalInstance', 'doctorService',
        function ($scope, $uibModalInstance, doctorService) {
            var message = {};

            //一级地区
            $scope.region = [
                {
                    "name": '全部',
                    "id": '0'
                },
                {
                    "name": '北京市',
                    "id": '110000'
                },
                {
                    "name": '天津市',
                    "id": '120000'
                },
                {
                    "name": '河北省',
                    "id": '130000'
                },
                {
                    "name": '山西省',
                    "id": '140000'
                },
                {
                    "name": '内蒙古自治区',
                    "id": '150000'
                },
                {
                    "name": '辽宁省',
                    "id": '210000'
                },
                {
                    "name": '吉林省',
                    "id": '220000'
                },
                {
                    "name": '黑龙江省',
                    "id": '230000'
                },
                {
                    "name": '上海市',
                    "id": '310000'
                },
                {
                    "name": '江苏省',
                    "id": '320000'
                },
                {
                    "name": '浙江省',
                    "id": '330000'
                },
                {
                    "name": '安徽省',
                    "id": '340000'
                },
                {
                    "name": '福建省',
                    "id": '350000'
                },
                {
                    "name": '江西省',
                    "id": '360000'
                },
                {
                    "name": '山东省',
                    "id": '370000'
                },
                {
                    "name": '河南省',
                    "id": '410000'
                },
                {
                    "name": '湖北省',
                    "id": '420000'
                },
                {
                    "name": '湖南省',
                    "id": '430000'
                },
                {
                    "name": '广东省',
                    "id": '440000'
                },
                {
                    "name": '广西壮族自治区',
                    "id": '450000'
                },
                {
                    "name": '海南省',
                    "id": '460000'
                },
                {
                    "name": '重庆市',
                    "id": '500000'
                },
                {
                    "name": '四川省',
                    "id": '510000'
                },
                {
                    "name": '贵州省',
                    "id": '520000'
                },
                {
                    "name": '云南省',
                    "id": '530000'
                },
                {
                    "name": '西藏自治区',
                    "id": '540000'
                },
                {
                    "name": '陕西省',
                    "id": '610000'
                },
                {
                    "name": '甘肃省',
                    "id": '620000'
                },
                {
                    "name": '青海省',
                    "id": '630000'
                },
                {
                    "name": '宁夏回族自治区',
                    "id": '640000'
                },
                {
                    "name": '新疆维吾尔自治区',
                    "id": '650000'
                },
                {
                    "name": '台湾省',
                    "id": '710000'
                },
                {
                    "name": '香港特别行政区',
                    "id": '810000'
                },
                {
                    "name": '澳门特别行政区',
                    "id": '820000'
                }
            ];

            $scope.ensure = function () {
                if ($scope.regionValue) {
                    //选择全部地区时
                    if (parseInt($scope.regionValue.id) == 0) {
                        delete message.province;
                    } else {
                        message.province = $scope.regionValue.id;
                    }
                }
                if ($scope.departmentValue) {
                    //科室
                    if ($scope.departmentValue.name == "全部科室") {
                        delete message.department;
                    } else {
                        message.department = $scope.departmentValue.name;
                    }
                }
                if ($scope.hospital) {
                    message.hospital = $scope.hospital;
                }
                $uibModalInstance.close(message);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            //科室
            $scope.department = [
                {id: 0, type: "全部", name: "全部科室"},
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


        }]);
    //医生列表添加医生模态窗口的实例
    app.controller('addDoctorModalInstanceCtrl', ['$scope', '$uibModalInstance', 'doctorService', 'usermessage',
        function ($scope, $uibModalInstance, doctorService, usermessage) {
            var message = {};
            message.doctorid = usermessage.doctorid;

            function getGroup() {
                var info = {
                    "instid": usermessage.userid
                };
                doctorService.getFriendGroup(info).then(function (response) {
                    console.log("getFriendGroup", response);
                    var result = response.result;
                    if (result == 0) {
                        var groupMessage = JSON.parse(response.message);
                        console.log("groupMessage", groupMessage);
                        $scope.doctorGroup = groupMessage;
                    } else if (result == -1) {
                        alert("获取分组数据失败")
                    } else {
                        alert("未知错误")
                    }
                }, function (error) {

                });
            }

            getGroup();
            $scope.ensure = function () {
                if ($scope.doctorGroupValue == undefined) {
                    alert("请选择一个分组");
                    return
                } else {
                    message.groupid = $scope.doctorGroupValue.groupid;
                    doctorService.myFriendAddDoctorGroup(message).then(function (response) {
                        console.log("response", response);
                        var result = response.result;
                        if (result == 0){
                            alert("添加医生成功");
                            $uibModalInstance.close(result);
                        }else if(result ==1){
                            alert("不能重复添加医生！");
                        }else
                        {
                            alert("添加医生失败");
                        }
                    }, function (error) {
                        alert("服务器异常");
                    });
                }

                //$uibModalInstance.close(message);
            };
            $scope.cancel = function(){
                $uibModalInstance.dismiss('cancel');
            }

        }]);
})(angular);
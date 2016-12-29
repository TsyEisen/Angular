(function (angular) {
    var app = angular.module('installApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.router']);
    app.controller('installController', ['$scope', '$state','$location', '$filter', 'doctorService', 'fileReader',
        function ($scope,$state, $location, $filter, doctorService, fileReader) {
            //从localStorage得到登录者的基本信息
            var userMessage = angular.fromJson(localStorage.getItem("ueserMessage"));
            if(userMessage){
                $scope.logName = userMessage[0].truename;
            }else{
                $state.go("login");
            }
            $scope.group = [{groupName: "个人信息管理"},
                {groupName: "密码设置"},
                {groupName: "隐私设置"}
            ];

            // 初始化个人信息管理数据

            $scope.firstState = {show: true};
            //点击病例分组
            $scope.current = 0;
            $scope.changeList = function (index) {
                $scope.current = index;
                console.log($scope.current);
                if ($scope.current == 0) {
                    $scope.firstState = {show: true};
                    $scope.secondState = {show: false};
                    $scope.thirdState = {show: false};
                } else if ($scope.current == 1) {
                    $scope.firstState = {show: false};
                    $scope.secondState = {show: true};
                    $scope.thirdState = {show: false};
                } else if ($scope.current == 2) {
                    $scope.firstState = {show: false};
                    $scope.secondState = {show: false};
                    $scope.thirdState = {show: true};
                }

            };
            $scope.birthdayOptions = {
                startingDay: 1,
                showWeeks: false,
                maxDate: new Date()
            };
            //医院
            doctorService.getProvinceData().then(function (res) {
                $scope.provinces = res;
                $scope.selectProvince = $scope.provinces[0];
            });
            doctorService.getDistrictData().then(function (res) {
                $scope.allDistrict = res;
            });
            doctorService.getCityData().then(function (res) {
                $scope.allCitys = res;
            });
            $scope.clickProvince = function () {
                $scope.citys = [];
                //省份code
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
            };
            $scope.clickCity = function () {
                $scope.districts=[];
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
            //职称
            $scope.doctorTitleList = [
                {"title": "不限", "id": 0},
                {"title": "主任医师", "id": 1},
                {"title": "副主任医师", "id": 2},
                {"title": "主治医师", "id": 3},
                {"title": "住院医师", "id": 4},
                {"title": "其他", "id": 5}
            ];

            $scope.doctorPost = [
                {"name": "教授", "id": 0},
                {"name": "副教授", "id": 1},
                {"name": "讲师", "id": 2},
                {"name": "博士后", "id": 3},
                {"name": "其他", "id": 4}
            ];

            // 初始化个人信息
            function personalMessage() {
                //表格中影像图片的缩略图的地址
                var file_url = localStorage.getItem("fileUrl");
                var info = userMessage[0].userid;
                doctorService.getPersonalInfor(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        var message = JSON.parse(response.message)[0];
                        if (message) {
                            if (message.username == "") {
                                alert("获取用户数据失败");
                                return;
                            }
                            console.log("message===",message);
                            var birthday = message.birthday;
                            if (birthday) {
                                birthday = birthday.substr(0, 4) + "-" + birthday.substr(4, 2)
                                    + "-" + birthday.substr(6, 2);
                            }
                            message.birthday =  birthday;
                            $scope.selectProvince = getProvinceName(message.province);
                            $scope.clickProvince();
                            $scope.selectCity = getCityName(message.city);
                            $scope.clickCity();
                            $scope.selectDistrict = getDistrictName(message.area);


                            //头像
                            message.headpic = file_url + 'public/pic/' + message.userid + '/'
                                + message.headpic;
                            //工牌
                            message.card = file_url + 'public/pic/' + message.userid + '/'
                                + message.card;
                            //执业证书
                            message.cert = file_url + 'public/pic/' + message.userid + '/'
                                + message.cert;
                            //执业证书
                            message.signature = file_url + 'public/pic/' + message.userid + '/'
                                + message.signature;
                            $scope.user = message;
                        }
                    } else if (result == -1) {
                        alert("获取用户数据失败");
                    } else {
                        alert("未知错误");
                    }
                }, function () {
                    alert("服务器异常");
                });
            }
            personalMessage();

            //密码设置模块
            $scope.submitPasswordForm = function (isVlid) {
                if (isVlid) {
                    var info = {
                        "userid": userMessage[0].userid,
                        "password": $scope.userpassword.oldpassword,
                        "newpass": $scope.userpassword.newpassword
                    };
                    doctorService.setNewPassWord(info).then(function (response) {
                        var result = response.result;
                        if (result == 0) {
                            alert("修改密码成功");
                        } else if (result == 1) {
                            alert("用户不存在");
                        } else if (result == 2) {
                            alert("原密码错误");
                        } else if (result == -1) {
                            alert("修改密码失败");
                        } else {
                            alert("未知错误");
                        }
                    }, function () {
                        alert("服务器异常");
                    });
                }
            };

            $scope.reader = new FileReader();   //创建一个FileReader接口
            $scope.form = {     //用于绑定提交内容，图片或其他数据
                image: {}
            };
            // 上传头像
            $scope.getfile_headpic = function (files) {       //单次提交图片的函数
                $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
                $scope.reader.onload = function (ev) {
                    $scope.$apply(function () {
                        $scope.user.headpic = ev.target.result; //接收base64
                    });
                };
            };
            // 上传工牌
            $scope.getfile_workingCard = function (files) {
                $scope.reader.readAsDataURL(files[0]);
                $scope.reader.onload = function (ev) {
                    $scope.$apply(function () {
                        $scope.user.workingCard = ev.target.result;
                    });
                };
            };
            // 上传职业证书
            $scope.getfile_certificate = function (files) {
                $scope.reader.readAsDataURL(files[0]);
                $scope.reader.onload = function (ev) {
                    $scope.$apply(function () {
                        $scope.user.certificate = ev.target.result;
                    });
                };
            };
            // 上传签名
            $scope.getfile_signature = function (files) {
                $scope.reader.readAsDataURL(files[0]);
                $scope.reader.onload = function (ev) {
                    $scope.$apply(function () {
                        $scope.user.signature = ev.target.result;
                    });
                };
            };

                // 确认信息提交
            $scope.personInfo_Submit = function (isValid) {
                if (isValid) {
                    var formData = new FormData();
                    if($scope.user.headpic != undefined){
                        formData.append('headpic', $scope.user.headpic);
                    }
                    if($scope.user.workingCard != undefined){
                        formData.append('card', $scope.user.workingCard);
                    }
                    if($scope.user.certificate != undefined){
                        formData.append('cert', $scope.user.certificate);
                    }
                    if($scope.user.signature != undefined){
                        formData.append('signature', $scope.user.signature);
                    }
                    var birthday = $scope.birthday;
                    if (birthday) {
                        birthday = birthday.substr(0, 4) + birthday.substr(5, 2)
                            + birthday.substr(8, 2);
                        formData.append("birthday", birthday);
                    }
                    doctorService.updataPersonInfo(formData).then(function (response) {
                        var result = response.result;
                        if(result == 1){
                            alert("个人信息修改成功");
                            alert("审核中");
                        } else if (result == -1) {
                            if (user.status == 1 || user.status == 3) {
                               alert("提交审核失败");
                            } else {
                               alert("修改失败")
                            }
                        } else {
                           alert("未知错误");
                        }
                    }, function (error) {
                        alert("服务器异常");
                    });
                }
            }

            //获取省份
            function getProvinceName(code) {
                for (var i = 0; i < $scope.provinces.length; i++) {
                    var provinceCode = $scope.provinces[i].code;
                    if (code == provinceCode) {
                        return $scope.provinces[i];
                    }
                }
            }

            //获取市
            function getCityName(code) {
                for (var i = 0; i < $scope.citys.length; i++) {
                    var citycode = $scope.citys[i].code;
                    if (citycode == code) {
                        return $scope.citys[i];
                    }
                }
            }
            //获取区县
            function getDistrictName(code) {
                for (var i = 0; i < $scope.districts.length; i++) {
                    var citycode = $scope.districts[i].code;
                    if (citycode == code) {
                        return $scope.districts[i];
                    }
                }
            }



            //隐私设置模块js代码
            function initPrivacyData() {
                var info = userMessage[0].userid;
                $scope.privacy = {};
                doctorService.getPrivacy(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        console.log("response.message", JSON.parse(response.message));
                        var message = JSON.parse(response.message);
                        if (message) {
                            /*userfind; 0允许用户查找1禁止 */
                            $scope.privacy.userfind = message[0].userfind;
                            /* doctorfind;0允许医生查找1禁止 */
                            $scope.privacy.doctorfind = message[0].userfind;
                            /* instfind;0允许机构查找1禁止 */
                            $scope.privacy.instfind = message[0].instfind;
                            /* usermsg;0允许用户消息1禁止*/
                            $scope.privacy.usermsg = message[0].usermsg;
                            /* doctormsg;0允许医生消息1禁止*/
                            $scope.privacy.doctormsg = message[0].doctormsg;
                            /* instmsg;0允许医生消息1禁止*/
                            $scope.privacy.instmsg = message[0].instmsg;
                            /* isDicomOrJpg;设置为 1 则读取的是dicom原图,设置为0 则读取的是jpg */
                            $scope.privacy.isDicomOrJpg = message[0].isDicomOrJpg;
                        }


                    } else if (result == -1) {
                        alert("获取隐私数据失败")
                    } else {
                        alert("未知错误")
                    }
                }, function (error) {
                    alert("服务器异常");
                });
            }

            initPrivacyData();

            $scope.updatePrivate = function () {
                var info = $scope.privacy;
                info.userid = userMessage[0].userid;
                doctorService.updatePrivacy(info).then(function (response) {
                    var result = response.result;
                    if (result == 0) {
                        alert("设置成功")
                    } else if (result == -1) {
                        alert("设置失败");
                    } else {
                        alert("未知错误")
                    }
                }, function (error) {
                    alert("服务器异常");
                });
            }

        }]);
})(angular);

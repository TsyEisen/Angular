(function (angular) {
    var app = angular.module('serviceApp', []);
        //医生端service
        app.service('doctorService', ['$q', '$http', '$filter', function ($q, $http, $filter) {
            //var baseUrl = "http://192.168.1.122:8088/";
            var baseUrl = "http://59.110.29.44:8088/";
            var paramesString = function (info) {
                var str = '?';
                for (var k in info) {
                    str += k + "=" + info[k] + "&";
                }
                str = str.slice(0, -1);
                console.log(str);
                return str;
            };
            //post拼接参数形式接口
            this.postRequest = function(info,url) {
                var deferred = $q.defer();
                $http.post(baseUrl+url+ paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
         
            };
            // 获取数据url形式
            this.getRequest2= function (info,url) {
                var deferred = $q.defer();
                $http.get(baseUrl+url+info)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            }


            //获得登录页数据
            this.getLoginData = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/user/login",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };

            //主页数据总数
            this.getMainCountData = function (info) {
                console.log('getMainCountDatainfo===', info);
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/ask/count" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };


            //主页表格数据
            this.getMainTableData = function (info) {
                console.log('getMainTableDatainfo===', info);
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/ask/list" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            //主页表格打开报告操作获取imageid，askid，id
            this.getOpenReportMessage = function (info) {
                console.log('getMainOpenReportinfo===', info);
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(baseUrl + "idoctor/service/ask/imagelist" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            //主页表格打开报告操作报告跳转地址
            this.getOpenReportUrl = function (info) {
                console.log('getMainOpenReportinfo===', info);
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/imageReport/searchPrint" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            //主页表格继续阅片操作
            this.getMainReadImage = function (info) {
                console.log('getMainReadImageinfo===', info);
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(baseUrl + "idoctor/service/ask/" + info)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };


            //主页表格继续阅片操作
            this.getMainGetImage = function (info) {
                console.log('getMainGetImageinfo===', info);
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(baseUrl + "idoctor/service/ask/imagelist" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            //主页表格接受咨询操作
            this.getMainReceiveAdvice = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/ask/change",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };


            //我的影像列表页count接口
            this.getMyImgListCount = function (info) {
                console.log('getMyImgListCountinfo===', info);
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/image/count" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };


            //我的影像列表页数据接口
            this.getMyImgListData = function (info) {
                console.log('getMyImgListData===', info);
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/image/list" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            //我的影像编辑影像数据接口
            this.editImg = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/image/update",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };

            //我的影像删除影像数据接口
            this.removeImg = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/image/unbinduser",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };

            //我的影像查看电子单数据接口
            this.printImg = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/imageReport/printElectronImage" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            //我的病例分组接口
            this.getCardGroup = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(baseUrl + "idoctor/service/card/mycardgrouplist" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };
            //我的病例列表Count接口
            this.getCardCount = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/card/mycardcount" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };
            //我的病例列表数据接口
            this.getCardData = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/card/mycardlist" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            //删除病例分组数据接口
            this.removeCardGroup = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/card/deletecardgroup",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };
            //编辑病例分组数据接口
            this.editCardGroup = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/card/updatecardgroup",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };

            //删除病例数据接口
            this.removeCard = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/card/delete",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };

            //我的病例点击详细将数据传到详细列表
            //病例详情表格数据
            var _cardDetailInfo={};
            //病例详情分组数据
            var _cardGroup = [];
            //病例表格
            this.setCardDetailData = function(carddata){
                _cardDetailInfo = carddata;
                console.log("cardDetailInfo==",_cardDetailInfo);
            };
            this.getCardDetailData = function(){
                return _cardDetailInfo;
            };
            //病例分组
            this.setCardDetailGroup = function(group){
                _cardGroup = group;
                console.log("setCardGroup==",_cardGroup);
            };
            this.getCardDetailGroup = function(){
                var data = _cardGroup;
                var groupData = [];
                console.log("getCardDetailGroupdata", data);
                for (var i = 0; i < data.length; i++) {
                    var group = {};
                    group.gid = data[i].groupid;
                    group.gname = data[i].gname;
                    groupData.push(group);
                }
                return groupData;
            };

            //我的病例新增病例分组
            this.addCardGroup = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/card/newcardgroup",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };

            //我的病例新增病例接口
            this.newCard = function (formdata) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/card/new",
                    method: 'POST',
                    data: formdata,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };


            //我的分享列表Count接口
            this.getShareCount = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/share2image/count" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            //我的分享列表表格数据接口
            this.getShareData = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/share2image/list" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };
            //我的分享删除分享数据接口
            this.deleteShare = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/share2image/delete",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };

            //我的分享详细中影像信息据接口
            this.ShareDetailImgData= function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(baseUrl + "idoctor/service/image/" + info)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };


            //我的分享修改分享设置接口
            this.updateShareSet = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/share2image/update",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };

            //我的分享新增分享设置接口
            this.newShareSet = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/share2image/new",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };


            //我的咨询列表Count接口
            this.getConsultCount = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/ask/count" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            //我的咨询列表表格数据接口
            this.getConsultData = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/ask/list" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            //我的咨询咨询数量接口
            this.getConsultCompleteAskCount = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/ask/completeaskcount" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };
            //专家咨询医生Conut接口
            this.getExpertListCount = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/user/getDoctorCountByLevel" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };
            //专家咨询医生List接口
            this.getExpertListData = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/user/getDoctorByLevel" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };
        // 我的咨询专家咨询状态条数

            this.getInstExpAskStatus= function (info) {
                return this.postRequest(info,"idoctor/service/ask/getAskByImageId")
            };
            //我的咨询详情页常规咨询状态条数idoctor/service/ask/getAskByImageId
            this.getInstComAskStatus= function (info) {
                return this.postRequest(info,"idoctor/service/ask/getAskByImageId")
            };
            // 专家咨询获取医生接口1   /idoctor/service/user/getDoctorCountByLevel
            this.getInstExpertDoctor= function (info) {
                return this.postRequest(info,"user/getDoctorCountByLevel");
            };
            // 专家咨询获取医生接口2 /idoctor/service/user/getDoctorByLevel
            this.getGenerateExpertList= function (info) {
                return this.postRequest(info,"user/getDoctorByLevel");
            };
            // 发生咨询弹出弹框调取的接口/idoctor/service/user/" + doctorid
            this.InstExpSure = function (info) {
                return this.getRequest2(info,"user/");
            };

            //我的朋友圈分组接口
            this.getFriendGroup = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(baseUrl + "idoctor/service/inst/mydoctorgrouplist" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };
            //删除我的朋友圈分组数据接口
            this.removeFriendGroup = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/inst/deletedoctorgroup",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };
            //我的朋友圈新增病例分组
            this.addFriendGroup = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/inst/newdoctorgroup",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };
            //编辑朋友圈分组数据接口
            this.editFriendGroup = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/inst/updatedoctorgroup",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };
            //我的朋友圈列表数据接口
            this.getFriendData = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/inst/mydoctorlist" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };
            //我的朋友圈列表Count接口
            this.getFriendCount = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post(baseUrl + "idoctor/service/inst/mydoctorcount" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };
            //我的朋友圈删除医生接口
            this.removeDoctor = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/inst/unbinddoctor",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };
            //我的朋友圈添加医生接口
            this.myFriendAddDoctorGroup = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/inst/binddoctor",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };



           
            //设置个人信息管理/idoctor/service/user/" + userid
            this.getPersonalInfor = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(baseUrl + "idoctor/service/user/" + info)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            // this.getPersonalInfor= function (info) {
            //     return this.getRequest2(info,"user/");
            // }

            //我的个人信息设置
            this.updataPersonInfo = function (formdata) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/user/update",
                    method: 'POST',
                    data: formdata,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise;
            };

            //设置密码修接口
            this.setNewPassWord = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/user/updatepassword",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise
            };



            //设置密码修接口
            this.setNewPassWord = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/user/updatepassword",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise
            };

            //设置获取隐私设置信息接口
            this.getPrivacy = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(baseUrl + "idoctor/service/user/" + info+"/privacy")
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };
            //设置更新隐私设置信息接口
            this.updatePrivacy = function (info) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    url: baseUrl + "idoctor/service/user/updateprivacy",
                    method: "POST",
                    data: info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return promise
            };


            //格式化时间
            this.dataFormat = function (date1) {
                var date2 = $filter("date")(date1, "yyyy-MM-dd");
                return date2;
            };

            this.dataStrFormat = function (date1) {
                var date2 = $filter("date")(date1, "yyyyMMdd");
                return date2;
            };


            //根据生日计算年龄
            this.getAge = function (birth) {
                if (birth == '' || birth == Number.NaN || birth == 'NaN') {
                    return '';
                }
                var age;
                var aDate = new Date();
                var thisYear = aDate.getFullYear();
                var thisMonth = aDate.getMonth() + 1;
                var thisDay = aDate.getDate();

                brithy = birth.substr(0, 4);
                brithm = birth.substr(4, 2);
                brithd = birth.substr(6, 2);
                if (thisMonth - brithm < 0) {
                    age = thisYear - brithy - 1;
                } else {
                    if (thisDay - brithd >= 0) {
                        age = thisYear - brithy;
                    } else {
                        age = thisYear - brithy - 1;
                    }
                }
                return age;
            };
            //表格影像缩略图图像地址服务器头
            this.getImgHTTP = function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
                //var hostport = document.location.host;
                //hosturl = 'http://' + hostport;
                $http.get(baseUrl + 'idoctor/service/OpenFire/getConfig')
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            // 获取数据形式3 从本地数据获取地区三级联动
            this.getLocalData = function (url) {
                var deferred = $q.defer();
                $http.get(url)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };
            // 医生端专家咨询地区三级联动
            //获取省份
            this.getProvinceData = function () {
                return this.getLocalData("json/address_json/province.json");
            };
            // 获取市
            this.getCityData = function () {
                return this.getLocalData("json/address_json/city.json");
            };
            // 获取区县
            this.getDistrictData = function () {
                return this.getLocalData("json/address_json/district.json");
            };


        }])
        app.factory('fileReader', ["$q", "$log", function ($q, $log) {
            var onLoad = function (reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.resolve(reader.result);
                    });
                };
            };
            var onError = function (reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.reject(reader.result);
                    });
                };
            };
            var getReader = function (deferred, scope) {
                var reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                return reader;
            };
            var readAsDataURL = function (file, scope) {
                var deferred = $q.defer();
                var reader = getReader(deferred, scope);
                reader.readAsDataURL(file);
                return deferred.promise;
            };
            return {
                readAsDataUrl: readAsDataURL
            };
        }])
})(angular);

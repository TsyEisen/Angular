(function (angular) {
    var app = angular.module('institutionServiceApp', [])
        //机构端service
        .service('institutionService', ['$q', '$http', '$filter', function ($q, $http, $filter) {
             var baseUrl = "http://59.110.29.44/idoctor/service/";
            var paramesString = function (info) {
                var str = '?';
                for (var k in info) {
                    str += k + "=" + info[k] + "&";
                }
                str = str.slice(0, -1);
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
            }
            //post传递JSON对象形式接口
            this.postRequestMethod2 = function(info,url) {
                var deferred = $q.defer();
                $http({
                    url:baseUrl+url,
                    method:"POST",
                    data:info
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            // get获取数据接口
            this.getRequest = function(info,url) {
                var deferred = $q.defer();
                $http.get(baseUrl+url+ paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            }

            // 获取数据url形式2
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
            // 获取数据形式3 从本地数据获取
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
            }
                // 配置参数
            //表格影像缩略图图像地址服务器头
            this.getImgHTTP = function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(baseUrl + 'OpenFire/getConfig')
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };


            // 机构端主页接口
            // 获取主页列表数据详细信息
            this.getMainListdata = function (info) {
                return this.postRequest(info,"image/list")
            }
            // 获取主页列表数据的总数
            this.getMainListCount = function (info) {
                return this.postRequest(info,"image/count")
            }

            // 机构端主页影像数量
            this.getMainImageTypeCount = function (info) {
                return this.postRequest(info,"image/dashboardcount")
            }
            // 机构端专家咨询已完成和未完成/idoctor/service/ask/completeaskcount
            this.getMainAskcount = function (info) {
                return this.postRequest(info,"image/completeaskcount")
            }
            // 机构端主页我的医生平台专家和医生/idoctor/service/user/getDoctorCountByLevel
            this.getMainDoctorCountByLevel = function (info) {
                return this.postRequest(info,"user/getDoctorCountByLevel")
            }
                // 机构端主页我的医生/idoctor/service/inst/mydoctorgrouplist
            this.getMainMydoctorgroup = function (info) {
                return this.getRequest(info,"inst/mydoctorgrouplist");

            }
                // /idoctor/service/inst/mydoctorcount
            this.getMainMydoctorcount = function (info) {
                return this.postRequest(info,"inst/mydoctorcount");

            }
            // 机构段编辑影像/idoctor/service/image/update
            this.editInstMainListData = function (info) {
                return this.postRequestMethod2(info,"image/update");

            }
            // 机构端主页电子单/idoctor/service/imageReport/printElectronImage
            this.getInstElectronicReport = function (info) {
                return this.postRequest(info,"imageReport/printElectronImage");
            }
            // 机构端主页分享/idoctor/service/image/quickShare
            this.InstMainShareData = function (info) {
                return this.postRequest(info,"image/quickShare");
            }

            // 机构端专家咨询选择影像 url : "/idoctor/service/image/"+ imageId ,
            this.getInstMainExpImage = function (info) {
                return this.getRequest2(info,"image/");
            }


            // 机构端专家咨询 获取省
            this.getProvinceData = function () {
                return this.getLocalData("json/address_json/province.json");
            }
            // 获取市
            this.getCityData = function () {
                return this.getLocalData("json/address_json/city.json");
            }
            // 获取区县
            this.getDistrictData = function () {
                return this.getLocalData("json/address_json/district.json");
            }

             // 机构端专家咨询获取医生接口1   /idoctor/service/user/getDoctorCountByLevel
            this.getInstExpertDoctor= function (info) {
                return this.postRequest(info,"user/getDoctorCountByLevel");
            };
            // 机构端专家咨询获取医生接口2 /idoctor/service/user/getDoctorByLevel
            this.getGenerateExpertList= function (info) {
                return this.postRequest(info,"user/getDoctorByLevel");
            };

            // 机构端发起咨询的接口/idoctor/service/ask/new

            // 机构端点击发生咨询弹出弹框调取的接口/idoctor/service/user/" + doctorid

            this.InstExpSure = function (info) {
                return this.getRequest2(info,"user/");
            };

            // 机构端点击发生咨询弹出弹框点击确认调取的接口/idoctor/service/ask/new 
            this.InstMainsendExpConsult = function (info) {
               return this.postRequestMethod2(info,"ask/new");
            };

            // 机构端常规咨询  /idoctor/service/image/
            this.getInstCommonConsult = function (info) {
                return this.getRequest2(info,"image/");
            };
            
            // 机构端常规咨询初始化/idoctor/service/ask/asknumber
            this.initNormalConsult = function (info) {
                return this.getRequest(info,"ask/asknumber");
            };

            //常规咨询初始化邀请医生列表个数 /idoctor/service/user/getDoctorCountByLevel
            this.initDoctorList = function (info) {
                return this.postRequest(info,"user/getDoctorCountByLevel");
            };
            this.initDoctorListDetails = function (info) {
                return this.postRequest(info,"user/getDoctorByLevel");
            };

               // 常规咨询我的医生 /idoctor/service/inst/mydoctorcount
            this.getInstCommondoctorcount = function (info) {
                return this.postRequest(info,"inst/mydoctorcount");
            };

            // 我的医生列表具体数据接口idoctor/service/inst/mydoctorlist?curpage=" + page+ "&pagesize=" + pageSize,
            this.getInstCommondoctorList = function (info) {
                return this.postRequest(info,"inst/mydoctorlist");
            };

            // 机构端发起常规咨询初始化idoctor/service/ask/asknumber
            this.getInstCommonasknumber= function (info) {
                return this.getRequest(info,"ask/asknumber");
            };

            // 机构端发起常规咨询/idoctor/service/ask/new
            this.getInstCommonAsk= function (info) {
                return this.postRequestMethod2(info,"ask/new");
            };

            // 机构端专家咨询模块
            // 1、专家咨询主页接口/idoctor/service/ask/count
            this.getInstExpAskListCount = function (info) {
                return this.postRequest(info,"ask/count")
            };

              // 2.专家咨询列表具体数据  /idoctor/service/ask/list
            this.getInstExpAskListDetail= function (info) {
                return this.postRequest(info,"ask/list")
            };

            // 3.专家咨询完成数量统计  /idoctor/service/ask/completeaskcount
            this.getInstExpCompleteAskCount= function (info) {
                return this.postRequest(info,"ask/completeaskcount")
            };

            //4.专家咨询详情页的影像总数接口/idoctor/service/image/count
            this.getInstExpAskImage= function (info) {
                return this.postRequest(info,"image/count")
            };

            //5.专家咨询详情页影像列表 /idoctor/service/image/list
            this.getInstExpAskImageList= function (info) {
                return this.postRequest(info,"image/list")
            };
            //6.专家咨询详情页专家咨询状态条数/idoctor/service/ask/getAskByImageId
            this.getInstExpAskStatus= function (info) {
                return this.postRequest(info,"ask/getAskByImageId")
            };
            //7.专家咨询详情页常规咨询状态条数idoctor/service/ask/getAskByImageId
            this.getInstComAskStatus= function (info) {
                return this.postRequest(info,"ask/getAskByImageId")
            };



            //我的医生医生分组数据接口
            this.getDoctorGroupData = function (info) {
                console.log('getDoctorGroupinfo===', info);
                var deferred = $q.defer();
                $http.post("json/institutions/institution_mydoctor/mydoctor.json" + paramesString(info))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return  deferred.promise;
            };



            //我的医生医医生列表数据接口
            this.getDoctorData = function (info) {
                console.log('getDoctorinfo===', info);
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post("json/institutions/institution_mydoctor/doctorTable.json" + paramesString(info))
                    .success(function (data) {
                        var response = data;
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return promise;
            };

            //格式化时间
            this.dataFormat = function (date1) {
                var date2 = $filter("date")(date1, "yyyyMMdd");
                return date2;
            };

            this.dataFormat2 = function (date2) {
                return $filter("date")(date2,"yyyy-MM-dd HH:mm:ss");
            };
// 获取当前时间 年月日
            this.getNowFormatDate=function() {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                return year +'' + month+ '' + strDate;
            }
            // 获取当前时间 年月日时分秒
          this.getNowIntDate = function() {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                var millisecond=date.getMilliseconds();
                var hours=date.getHours();
                var min=date.getMinutes();
                var second=date.getSeconds() ;
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }

                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }

                if (hours >= 0 && hours <= 9) {
                    hours = "0" + hours;
                }

                if (min >= 0 && min <= 9) {
                    min = "0" + min;
                }
                if (second >= 0 && second <= 9) {
                    second = "0" + second;
                }
                if(millisecond>=0 && millisecond<=9){
                    millisecond="00"+millisecond;
                }
                if(millisecond>=10 && millisecond<=99){
                    millisecond="0"+millisecond;
                }

                var currentdate =""+ year + month + strDate+ hours  + min + second + millisecond;
                var currentdate =""+ year + month + strDate+ hours  + min + second ;
                return currentdate;
            };

            this.getNowIntDate2 = function() {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                var millisecond=date.getMilliseconds();
                var hours=date.getHours();
                var min=date.getMinutes();
                var second=date.getSeconds() ;
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }

                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }

                if (hours >= 0 && hours <= 9) {
                    hours = "0" + hours;
                }

                if (min >= 0 && min <= 9) {
                    min = "0" + min;
                }
                if (second >= 0 && second <= 9) {
                    second = "0" + second;
                }

                var currentdate =""+ year + month + strDate+ hours  + min + second ;
                return currentdate;
            };

            // 获取几天前的时间
            this.getbeforeDayData = function (count) {
                var now = new Date();
                var date = new Date(now.getTime() - count * 24 * 3600 * 1000);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                return year +'' + month+ '' + day;
            };
            // 获取几天后的时间 年月日十分秒
            this.getDaysLater = function(DaysToAdd) {
                var newdate=new Date();
                var newtimems = newdate.getTime()+(DaysToAdd*24*60*60*1000);
                newdate.setTime(newtimems);

                var year = newdate.getFullYear();
                var month = newdate.getMonth() + 1;
                var strDate = newdate.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }

                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }

                var hours = newdate.getHours();
                if (hours >= 0 && hours <= 9) {
                    hours = "0" + hours;
                }

                var minutes = newdate.getMinutes();
                if (minutes >= 0 && minutes <= 9) {
                    minutes = "0" + minutes;
                }

                var seconds = newdate.getSeconds();
                if (seconds >= 0 && seconds <= 9) {
                    seconds = "0" + seconds;
                }

                var currentdate = year + '-' + month + '-' + strDate + " "
                    + hours + ':' + minutes + ':' + seconds;
                return currentdate;
            };
            this.getAge = function (birth) {
                if (birth=='')
                {
                    return birth;
                }
                var age;
                var aDate = new Date();
                var thisYear = aDate.getFullYear();
                var thisMonth = aDate.getMonth() + 1;
                var thisDay = aDate.getDate();

                birthy = birth.substr(0, 4);
                birthm = birth.substr(4, 2);
                birthd = birth.substr(6, 2);

                if (thisMonth - birthm < 0) {
                    age = thisYear - birthy - 1;
                } else {
                    if (thisDay - birthd >= 0) {
                        age = thisYear - birthy;
                    } else {
                        age = thisYear - birthy - 1;
                    }
                }

                if (isNaN(age)){
                    return '';
                }
                if(age>200){
                    return '';
                }
                return age + '岁';
            };
                // 获取的时间格式化
            this.getTimeFormate = function (data) {
                return data.substr(0, 4) + '-' + data.substr(4, 2) + '-' + data.substr(6, 2);
            }
            // 浏览器兼容获取第一个子节点
            this.getFirstElement = function(element) {
                if (element.firstElementChild) {
                    return element.firstElementChild;
                } else {
                    var el = element.firstChild;
                    while (el && 1 !== el.nodeType) {
                        el = el.nextSibling;
                        //找子元素，未找到接着找该非子元素的下个兄弟节点
                    }
                    return el;
                }
            };


            this.bgcChangeGray = function (parentNodeId,childTagName,bgcolor,fontcolor) {
                var timeNodes  = this.getFirstElement(document.getElementById(parentNodeId));
                // 获取所有li
                var lis =  timeNodes.getElementsByTagName(childTagName);

                for (var i = 0; i < lis.length; i++) {
                    var liNode = lis[i];
                    // console.log("li",liNode);
                    var aNode = this.getFirstElement(liNode);
                    console.log("aNode",aNode);
                    aNode.style.backgroundColor=bgcolor;
                    aNode.style.color=fontcolor;
                }
            };

            this.bgcChangeBlue = function (parentNodeId,childTagName,bgcolor1,bgcolor2,fontcolor,index) {
                var timeNodes  = this.getFirstElement(document.getElementById(parentNodeId));
                // 获取所有li
                var lis =  timeNodes.getElementsByTagName(childTagName);
                for (var i = 0; i < lis.length; i++) {
                    var liNode = lis[i];
                    // console.log("li",liNode);
                    var aNode = this.getFirstElement(liNode);
                    console.log("aNode",aNode);
                    aNode.style.backgroundColor=bgcolor1;
                    aNode.style.color=fontcolor;
                    this.getFirstElement(lis[index]).style.backgroundColor=bgcolor2;
                }
            };




        }]);

})(angular);
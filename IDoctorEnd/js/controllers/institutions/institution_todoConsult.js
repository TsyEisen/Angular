/**
 * Created by HYHY on 2016/12/1.
 */
/**
 * Created by HYHY on 2016/12/1.
 */
(function (angular) {
    var app = angular.module('institution_todoconsultApp', ['ui.bootstrap']);
    app.controller('institution_consultDetailsController', ['$scope', '$state','$uibModal','doctorService','$filter',function ($scope, $state,$uibModal,doctorService,$filter) {
        $scope.logName = '李晓';

        $scope.backToImg = function () {
            $state.go('sidebar.expertconsultApp');
        };

        $scope.menuState={show:false};

        $scope.hideDiv = function () {
            $scope.menuState={show:false}
        };

        $scope.showDiv = function () {
            $scope.menuState={show:true}
        };

        $scope.tabs = [
            {title: '全部', id: '1'},
            {title: '未接受', id: '2'},
            {title: '进行中', id: '3'},
            {title: '已完成', id: '4'}
        ];

        //上传时间戳配置
        $scope.upload = {
            startTime: '',
            endTime: ''
        };
        $scope.startUploadOptions = {
            maxDate: $scope.upload.endTime,
            stsrtingDay: 1,
            showWeeks: false
        };
        $scope.startUploadOpen = function () {
            $scope.startUploadPop = true;
        };
        $scope.$watch('upload.startTime', function (newValue, oldValue) {
            $scope.endUploadOptions.minDate = newValue;
        });
        $scope.$watch('upload.endTime', function (newValue, oldValue) {
            $scope.startUploadOptions.maxDate = newValue;
        });
        $scope.endUploadOptions = {
            minDate: $scope.upload.startTime,
            maxDate: new Date(),
            showWeeks: false,
            stsrtingDay: 1
        };
        $scope.endUploadOpen = function () {
            $scope.endUploadPop = true;
        };
        $scope.endScreenOpen = function () {
            $scope.endScreenPop = true;
        };


        //新建分组模态框模块
        $scope.experthighsearch = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'expertEditModal.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: 'vm',
                backdrop: "static",
                resolve: {}
            });
        };
        //暂时显示
//新建分组模态框模块

        //获取表格数据(影像)
        $scope.$on('consultchooseimgTab',function(event,response){
            $scope.chooseimgTab = response.data.chooseimgTab;
        });

        //搜索功能
        $scope.sharechooseImg = function () {
            if($scope.ilessIdorName!=undefined){
                $scope.$broadcast("chooseimg",$scope.ilessIdorName);
            }
        };

        //获取选择医生数据
        $scope.$on('setchooseDoctTabelData',function(event,response){
            $scope.consultdoctor = response.data.consultdoctor;
        });

        //搜索功能2
        $scope.sharechooseDoc = function () {
            if($scope.isilessOrhos!=undefined){
                $scope.$broadcast("choosedoc",$scope.isilessOrhos);
            }
        };

        //得到选择框里面的值
        var selectBox = function () {
            var info ={
            };

            doctorService.selectBox(info).then(function (response) {
                console.log(response);
                $scope.consultPlaces = response.data.consultPlace;
                $scope.consultCalls = response.data.consultCall;
                $scope.consultKeshis = response.data.consultKeshi;
                $scope.consultjinjiLevels = response.data.consultjinjiLevel;
            }, function (error) {

            });
        }

        selectBox();

        //格式化时间
        var formatTime = function (date1) {
            var date2 = $filter("date")(date1, "yyyyMMdd");
            return date2;
        };

        //根据查询的数据新增一条咨询
        $scope.pushConsult = function () {
            var info ={
                "consultTitle":$scope.consultTitle,
                "ilessAge":$scope.ilessAge,
                "congsultAsk":$scope.congsultAsk,
                "medicalHistory":$scope.medicalHistory,
                "recommendedPerson":$scope.recommendedPerson
            };

            if($scope.inputSharetitle ==undefined){
                return;
            }
            if($scope.isNoname!= undefined){
                angular.extend(info,{"isNoname":true});
            }else{
                angular.extend(info,{"isNoname":false});
            }
            // 1完全公开 2只有本网站的注册医生才可以查看 3只有本网站的用户才可以查看 4只有获得验证码的才可以查看
            if($scope.radioSize== undefined){
                angular.extend(info,{"radioSize":1});
            }
            if($scope.shareOption!=undefined){
                angular.extend(info,{"shareObject":$scope.shareOption});
            }
            if($scope.verificationCode!=undefined){
                angular.extend(info,{"verificationCode":$scope.verificationCode});
            }
            if($scope.shareEndTime!=undefined){
                angular.extend(info,{"shareEndTime":formatTime($scope.shareEndTime)});
            }
            doctorService.getMainShareilessData(info).then(function (response) {
                console.log("aa");
            }, function (error) {

            });
        }
    }]);

    //选择影像接口
    app.controller('consultchooseImgPaginationCtrl', ['$scope', '$filter','doctorService', function ($scope,$filter, doctorService) {
        //pageSize下拉菜单
        $scope.pageList = [
            {id: 1, pagesize: "20"},
            {id: 2, pagesize: "50"},
            {id: 3, pagesize: "100"},
            {id: 4, pagesize: "150"}
        ];
        $scope.selectValue = $scope.pageList[0];
        //选择每页显示多少条数据

        $scope.maxSize = 5;//最大显示几条页码

        //选择每页显示几条数据
        $scope.getPagesize = function () {
            getTableData();
        };
        //翻页
        $scope.currentPage = 1;     //当前页
        //点击页码事件
        $scope.setNumPage = function () {
            getTableData();
            $scope.jumpTo = $scope.currentPage;
        };
        //输入页面点击确认事件
        $scope.setInputPage = function () {
            $scope.currentPage = $scope.jumpTo;
            getTableData();
        };
        //回车事件
        $scope.pageKeyup = function (e) {
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.setInputPage();//如果等于回车键编码执行方法
            }
        };

        //格式化时间
        var formatTime = function (date1) {
            var date2 = $filter("date")(date1, "yyyyMMdd");
            return date2;
        };


        //表格数据
        var getTableData = function () {
            console.log("进入方法");
            console.log($scope.ilessIdorName);
            var info = {
                "pageno": parseInt($scope.currentPage),
                "pagesize": parseInt($scope.selectValue.pagesize)
            };
            if($scope.startdata!= undefined){
                angular.extend(info,{"startdate":formatTime($scope.startdata)});
            }
            if($scope.enddata!= undefined){
                angular.extend(info,{"enddate":formatTime($scope.enddata)});
            }

            // if($scope.shareName!= undefined){
            //     info.sharetitle=$scope.shareName;
            // }

            console.log(info);
            doctorService.getMainConsultIMGData(info).then(function (response) {
                //数据总数
                $scope.totalItems = response.data.dataCnt;
                $scope.$emit("consultchooseimgTab",response);
            }, function (error) {

            });
        };

        // 搜索
        getTableData();

        $scope.$on("chooseimg",function(){
            getTableData();
        })

    }]);

    // 选择医生接口
    app.controller('consultchooseDocPaginationCtrl', ['$scope', '$filter','doctorService', function ($scope,$filter, doctorService) {
        //pageSize下拉菜单
        $scope.pageList = [
            {id: 1, pagesize: "20"},
            {id: 2, pagesize: "50"},
            {id: 3, pagesize: "100"},
            {id: 4, pagesize: "150"}
        ];
        $scope.selectValue = $scope.pageList[0];
        //选择每页显示多少条数据

        $scope.maxSize = 5;//最大显示几条页码

        //选择每页显示几条数据
        $scope.getPagesize = function () {
            getTableData();
        };
        //翻页
        $scope.currentPage = 1;     //当前页
        //点击页码事件
        $scope.setNumPage = function () {
            getTableData();
            $scope.jumpTo = $scope.currentPage;
        };
        //输入页面点击确认事件
        $scope.setInputPage = function () {
            $scope.currentPage = $scope.jumpTo;
            getTableData();
        };
        //回车事件
        $scope.pageKeyup = function (e) {
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.setInputPage();//如果等于回车键编码执行方法
            }
        };

        //格式化时间
        var formatTime = function (date1) {
            var date2 = $filter("date")(date1, "yyyyMMdd");
            return date2;
        };


        //表格数据
        var getTableData = function () {
            var info = {
                "pageno": parseInt($scope.currentPage),
                "pagesize": parseInt($scope.selectValue.pagesize)
            };
            if($scope.startdata!= undefined){
                angular.extend(info,{"startdate":formatTime($scope.startdata)});
            }
            if($scope.enddata!= undefined){
                angular.extend(info,{"enddate":formatTime($scope.enddata)});
            }

            doctorService.getMainConsultDOCData(info).then(function (response) {
                //数据总数
                $scope.totalItems = response.data.dataCnt;
                $scope.$emit("setchooseDoctTabelData",response);
            }, function (error) {

            });
        };

        // 搜索
        getTableData();

        $scope.$on("choosedoc",function(){
            getTableData();
        })

    }]);

    //$uibModalInstance是模态窗口的实例
    app.controller('ModalInstanceCtrl', function ($uibModalInstance) {
        this.ensure = function () {
            $uibModalInstance.close();
        };
        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });


})(angular);
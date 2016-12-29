(function (angular) {
    angular.module("institutionDoctorAPP", ['ui.bootstrap', 'ui.router'])
    .config(function ($stateProvider) {
            $stateProvider
                .state("institutionSideBar.institution_adddoctor", {
                    url: "/institution_adddoctor",
                    templateUrl: "partialview/institutions/institution_adddoctor.html"
                })
        })
    .controller('institutionDoctorCtrl', ['$scope', '$state', '$document', '$uibModal', 'institutionService',
            function ($scope, $state, $document, $uibModal, institutionService) {
                $scope.jumpToAddDoctor = function () {
                    $state.go("institutionSideBar.institution_adddoctor");
                };
                var getGroup = function () {
                    var info = {
                        "id": '123456'
                        //医生id
                    };
                    institutionService.getDoctorGroupData(info).then(function (response) {
                        $scope.group = response.data.groupData;
                        //初始换选择第一组
                        $scope.groupname = $scope.group[0].groupName;
                        var groupid = $scope.group[0].groupid;
                        getDoctorData();
                    }, function (error) {

                    });

                };
                getGroup();
                $scope.current = 0;
                var groupID = "";
                $scope.changeList = function (index) {
                    $scope.current = index;
                    groupID = $scope.group[index].groupid;
                    var groupname = $scope.group[index].groupName;
                    $scope.groupname = groupname;
                    getDoctorData();
                };


                $scope.pageList = [
                    {id: 1, pagesize: "20"},
                    {id: 2, pagesize: "50"},
                    {id: 3, pagesize: "100"},
                    {id: 4, pagesize: "150"}
                ];
                $scope.selectValue = $scope.pageList[0];
                //选择每页显示多少条数据
                $scope.maxSize = 5;//最大显示几条页码
                $scope.getPagesize = function () {
                    getDoctorData();
                };
                //点击页码事件
                $scope.setNumPage = function () {
                    getDoctorData();
                    $scope.jumpTo = '';
                };
                //输入页面点击确认事件
                $scope.setInputPage = function () {
                    $scope.currentPage = $scope.jumpTo;
                    getDoctorData();
                };
                //回车事件
                $scope.pageKeyup = function (e) {
                    var keycode = window.event ? e.keyCode : e.which;//获取按键编码
                    if (keycode == 13) {
                        $scope.setInputPage();//如果等于回车键编码执行方法
                    }
                };
                $scope.currentPage = 1;     //当前页
                var getDoctorData = function () {
                    if (groupID == "") {
                        var groupid = $scope.group[0].groupid;
                    } else {
                        var groupid = groupID;
                    }
                    var info = {
                        "pageno": parseInt($scope.currentPage),
                        "pagesize": parseInt($scope.selectValue.pagesize),
                        "groupid": groupid
                    };
                    institutionService.getDoctorData(info).then(function (response) {
                        console.log('response===', response);
                        $scope.friendGroup = response.data.responseData;
                        $scope.totalItems = response.data.dataCnt
                    }, function (error) {

                    });
                };

                //新建分组模态框模块
                $scope.newBuildGroup = function () {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'newBuildGruopModal.html',
                        controller: 'ModalInstanceCtrl',
                        controllerAs: 'vm',
                        backdrop: "static",
                        resolve: {}
                    });
                };
                //暂时显示
//新建分组模态框模块
            }]);

})(angular);
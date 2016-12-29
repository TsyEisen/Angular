(function (angular) {
    angular.module("institutionSidebarApp", ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.when("", "/institution_main");
            // 机构端路由
            $stateProvider
                .state("institutionSideBar", {
                    url: "/institution",
                    templateUrl: "partialview/institutions/institution_sidebar.html"
                })
                .state("institutionSideBar.institution_main", {
                    cache:false,
                    url: "/institution_main",
                    templateUrl: "partialview/institutions/institution_main.html"
                })
                .state("institutionSideBar.institution_main_expertConsult", {
                    url: "/institution_main_expertConsult",
                    templateUrl: "partialview/institutions/institution_main_expertConsult.html",
                    controller: 'instMain_expertConsult'
                })
                .state("institutionSideBar.institution_main_commonConsult", {
                    url: "/institution_main_commonConsult",
                    templateUrl: "partialview/institutions/institution_main_commonConsult.html",
                    controller: 'instMain_commonConsult'
                })
                .state("institutionSideBar.institution_doctor", {
                    url: "/institution_doctor",
                    templateUrl: "partialview/institutions/institution_mydoctor.html"
                })
                .state("institutionSideBar.institution_expert", {
                    url: "/institution_expert",
                    templateUrl: "partialview/institutions/institution_expert.html",
                    cache:false
                })
                .state("institutionSideBar.institution_common", {
                    cache:false,
                    url: "/institution_common",
                    templateUrl: "partialview/institutions/institution_common.html",
                    controller: 'institution_consultController'
                })
                .state("institutionSideBar.institution_myshare", {
                    url: "/institution_myshare",
                    templateUrl: "partialview/institutions/institution_myshare.html"
                })
                .state("institutionSideBar.institution_myimage", {
                    url: "/institution_myimage",
                    templateUrl: "partialview/institutions/institution_myimage.html",
                    controller:'Inst_imageController'
                })
                .state("institutionSideBar.institution_share", {
                    url: "/institution_share",
                    templateUrl: "partialview/institutions/institution_share.html",
                    controller:'Inst_shareController'
                })
                .state("institutionSideBar.institution_addshare", {
                    url: "/institution_addshare",
                    templateUrl: "partialview/institutions/institution_addshare.html",
                    controller:'inst_addShareController'
                })
                .state("institutionSideBar.institution_myillness", {
                    url: "/institution_myillness",
                    templateUrl: "partialview/institutions/institution_myillness.html"
                })
                .state("institutionSideBar.institution_setting", {
                    url: "/institution_setting",
                    templateUrl: "partialview/institutions/institution_setting.html"
                })
                .state("institutionSideBar.institution_expertDetails", {
                    url: "/institution_expertDetails",
                    templateUrl: "partialview/institutions/institution_expertDetails.html",
                    controller:"Inst_expert_details"
                })
                .state("institutionSideBar.institution_common_detail", {
                    url: "/institution_common_detail",
                    templateUrl: "partialview/institutions/institution_common_detail.html",
                    controller:'Inst_common_details'
                })
                .state("institutionSideBar.institution_install", {
                    url: "/institution_install",
                    templateUrl: "partialview/institutions/institution_install.html"
                });
        })
        .controller("institutionSidebarCtrl", ["$scope", "$state","$location", function ($scope, $state,$location) {

            //侧边栏的tab栏切换
            $scope.tabs = [
                {
                    title: '主页',
                    url: 'institutions/institution_main.html',
                    path: '.institution_main'
                }, {
                    title: '我的医生',
                    url: 'institutions/institution_mydoctor.html',
                    path: '.institution_doctor'
                },
                {
                    title: '专家咨询',
                    url: 'institutions/institution_expert.html',
                    path: '.institution_expert'
                },
                {
                    title: '常规咨询',
                    url: 'institutions/institution_common.html',
                    path: '.institution_common'
                },
                {
                    title: '我的分享',
                    url: 'institutions/institution_share.html',
                    path: '.institution_share'
                },
                {
                    title: '我的影像',
                    url: 'institutions/institution_myimage.html',
                    path: '.institution_myimage'
                },
                {
                    title: '我的病例',
                    url: 'institutions/institution_myillness.html',
                    path: '.institution_myillness'
                },
                {
                    title: '设置',
                    url: 'institutions/institution_setting.html',
                    path: '.institution_install'
                }
            ];

            //str获取url最后/后的参数为了初始化
            var str = $location.absUrl();
            var index = str.lastIndexOf("\/");
            var str = str.substring(index + 1, str.length) + ".html";
            //初始化
            if ($scope.currentTab == undefined) {
                $scope.currentTab = str;
            }
            $scope.isActiveTab = function (tabUrl) {
                return tabUrl == $scope.currentTab;
            };
            $scope.onClickTab = function (tab, index) {
                var a = index;
                $scope.currentTab = tab.url;
                $scope.item = a;
            };
            //每个不同的icon
            $scope.bgImg = [
                {"backgroundPosition": "-16px -8px"},
                {"backgroundPosition": "-16px -38px"},
                {"backgroundPosition": "-16px -68px"},
                {"backgroundPosition": "-16px -93px"},
                {"backgroundPosition": "-16px -122px"},
                {"backgroundPosition": "-16px -152px"},
                {"backgroundPosition": "-16px -179px"},
                {"backgroundPosition": "-16px -209px"}
            ];
        }])

})(angular);
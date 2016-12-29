(function (angular) {
    var app = angular.module('institutionAddDoctorApp', []);
    app.controller('institutionAddDoctorCtrl', ['$scope', '$state', '$uibModal',
        function ($scope, $state, $uibModal) {
            $scope.backToMyfriend = function () {
                $state.go("institutionSideBar.institution_doctor");
            };
            $scope.addFriend = [
                {
                    "picture": "image/head.jpg",
                    "name": "马大庆",
                    "sex": "男",
                    "age": "70",
                    "hospital": "首都医科大学附属北京友谊医院",
                    "department": "放射科",
                    "position": "主任医师",
                    "goodField": "呼吸系统疾病影像诊断，涉及胸部影像、胸部肿瘤、呼吸系统肿瘤疾病影像诊断及全身CT、MRI等领域。",
                    "experience": "全国著名放射影像学专家，主任医师、教授、博士生导师、前中国放射学会北京放射学会主任委员，多家国家核心影像杂志的编辑，精于全身影像诊断。主要临床学术研究涉及胸部影像、全身CT、MRI等领域。1979年后在首都医科大学附属北京友谊医院放射科，曾任科主任。70年代至今从事医学影像学诊断。擅长呼吸系统疾病的影像诊断。包括肺结核、肺炎、胸部肿瘤、肺间质疾病等的X线、CT、MRI诊断，胸部疑难及少见疾病的医学影像诊断，研究方向:呼吸系统疾病的影像诊断，重点研究支气管肺癌的影像诊断，肺弥漫性间质疾病及肺泡疾病的影像诊断。  发表论文100余篇。主编和参编专著10余部。多次获北京市及卫生局科技成果奖。享受政府特殊津贴。",
                    "loadtime": "2016-06-20  18:00"
                },
                {
                    picture: "image/head.jpg",
                    name: "马大庆",
                    sex: "男",
                    age: "70",
                    hospital: "首都医科大学附属北京友谊医院",
                    department: "放射科",
                    position: "主任医师",
                    goodField: "呼吸系统疾病影像诊断，涉及胸部影像、胸部肿瘤、呼吸系统肿瘤疾病影像诊断及全身CT、MRI等领域。",
                    experience: "全国著名放射影像学专家，主任医师、教授、博士生导师、前中国放射学会北京放射学会主任委员，多家国家核心影像杂志的编辑，精于全身影像诊断。主要临床学术研究涉及胸部影像、全身CT、MRI等领域。1979年后在首都医科大学附属北京友谊医院放射科，曾任科主任。70年代至今从事医学影像学诊断。擅长呼吸系统疾病的影像诊断。包括肺结核、肺炎、胸部肿瘤、肺间质疾病等的X线、CT、MRI诊断，胸部疑难及少见疾病的医学影像诊断，研究方向:呼吸系统疾病的影像诊断，重点研究支气管肺癌的影像诊断，肺弥漫性间质疾病及肺泡疾病的影像诊断。  发表论文100余篇。主编和参编专著10余部。多次获北京市及卫生局科技成果奖。享受政府特殊津贴。",
                    loadtime: "2016-06-20  18:00"
                }, {
                    picture: "image/head.jpg",
                    name: "马大庆",
                    sex: "男",
                    age: "70",
                    hospital: "首都医科大学附属北京友谊医院",
                    department: "放射科",
                    position: "主任医师",
                    goodField: "呼吸系统疾病影像诊断，涉及胸部影像、胸部肿瘤、呼吸系统肿瘤疾病影像诊断及全身CT、MRI等领域。",
                    experience: "全国著名放射影像学专家，主任医师、教授、博士生导师、前中国放射学会北京放射学会"
                }
            ];

            //高级搜索模态框模块
            $scope.advancedSearch = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'advancedSearchModal.html',
                    controller: 'friendModalInstanceCtrl',
                    backdrop: "static",
                    resolve: {}
                });
            };
//高级搜索模态框模块
        }]);

    //$uibModalInstance是模态窗口的实例
    app.controller('friendModalInstanceCtrl', ['$scope', '$uibModalInstance', 'doctorService',
        function ($scope, $uibModalInstance, doctorService) {
            //一级地区
            $scope.region = [
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

            //科室下拉菜单
            doctorService.getDepartmentData().then(function (response) {
                $scope.department = response.data.responsedata;
            }, function (error) {

            });
            $scope.ensure = function () {
                $uibModalInstance.close();
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            //高级搜索表单
            $scope.addFriend = function (isValid) {
                if (isValid) {
                    var info = {
                        "address": $scope.regionValue.id,
                        "hospital": $scope.hospital,
                        "department": $scope.departmentValue.id
                    };
                } else {

                }
            }


        }]);
})(angular);
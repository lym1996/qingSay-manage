<template>
    <div style="padding:20px">
        <el-row>
            <el-col :span="24">
                <el-row>
                    <el-col :span="20" style="font-size:20px">
                        用户名:{{nickName}}
                        文章数:{{userCount.articleCount}}
                        青说数:{{userCount.sayCount}}
                        关注主题数:{{userCount.concernTopicCount}}
                        关注用户数:{{userCount.concernUserCount}}
                        粉丝数:{{userCount.fansCount}}
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row style="padding-top: 20px">
            <el-col :span="24">
                <el-row>
                    <el-col :span="19" style="font-size:25px;background:#FFF">
                        <ve-chart :data="chartData" :settings="chartSettings" style="height:650px;width: 100%;" 
                        :data-zoom="dataZoom" :toolbox="toolbox" :mark-line="markLine" :mark-point="markPoint" :grid="grid" height='600px'></ve-chart>
                    </el-col>
                    <el-col :span="5" style="padding-left:20px">
                        <el-form label-position="top" :model="dataForm" >
                            <el-form-item label="用户名称">
                                <el-select
                                    v-model="dataForm.uqsId"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请输入关键词"
                                    :remote-method="selectNikeName"
                                    :default-first-option='true'
                                    @change="nickNameChange">
                                    <el-option
                                    v-for="item in user"
                                    :key="item.uqsId"
                                    :label="item.nickName"
                                    :value="item.uqsId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="类型">
                                <el-radio v-model="radio" label="0" @change="articleTypeChange">青说</el-radio>
                                <el-radio v-model="radio" label="1" @change="articleTypeChange">文章</el-radio>
                            </el-form-item>
                            <el-form-item v-if="radio == 0" label="青说名称">
                                <el-select v-model="dataForm.articleId" filterable placeholder="请选择" style="width: 100%;" @change="articleChange">
                                    <el-option v-for="item in qingsay" :key="item.id" :label="item.title" :value="item.id" ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="radio == 1" label="文集名称">
                                <el-select v-model="dataForm.articleFloder" filterable placeholder="请选择" style="width: 100%;" @change="articleFloderChange">
                                    <el-option v-for="item in articleFloder" :key="item.id" :label="item.folderName" :value="item.id" ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="radio == 1" label="文章名称">
                                <el-select v-model="dataForm.articleId" filterable placeholder="请选择" style="width: 100%;" @change="articleChange">
                                    <el-option v-for="item in articles" :key="item.id" :label="item.title" :value="item.id" ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="时间">
                                 <el-date-picker
                                    v-model="dataForm.statisticsTime"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="/"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerTime" style="width: 100%;"
                                    @change="articleChange"
                                    v-if="hackReset"
                                    >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="维度">
                                 <el-select v-model="dataForm.timetype" filterable placeholder="请选择" style="width: 100%;" @change="articleChange">
                                    <el-option v-for="item in timetype" :key="item.timetype" :label="item.label" :value="item.timetype" ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import moment from "moment"
// import addUser  from '@/util/api.js'
import axion from "@/util/api.js"
import {sortKey} from '@/util/util.js'
import { type } from 'os';
export default {
    components: {
    },
    data() {

        this.grid = {
            right: 40
        }
        this.dataZoom = [
            {
                type: 'slider',
                start: 0,
                end: 100
            }
        ]
        this.markLine = {
            data: [
            {
                name: '平均线',
                type: 'average'
            }
            ]
        }
        this.markPoint = {
            data: [
            {
                name: '最大值',
                type: 'max'
            }
            ]
        }
        this.toolbox = {
            feature: {
            magicType: {type: ['line', 'bar']},
            saveAsImage: {}
            }
        }
        this.typeArr = ['line', 'histogram']
        return {
            token: sessionStorage.getItem('token'),
            radio: '0',
            activeName:'first',
            nickName: '某人的数据统计',
            userCount: {
                concernTopicCount: 0,
                concernUserCount: 0,
                fansCount: 0,
                sayCount: 0,
                articleCount: 0
            },
            articleFloder: {
                
            },
            articles: {

            },
            qingsay: {

            },
            subscribe: false,
            dataForm: {
                uqsId: '',
                articleFloder: '',
                articleId: '',
                statisticsTime: [new Date() - 3600 * 1000 * 24 * 7, new Date()],
                timetype: 'D',
            },
            user:[],
            timetype:[{
                timetype: 'D',
                label: '天'
            },{
                timetype: 'M',
                label: '月'
            }],
            pickerTime: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '全部',
                    onClick(picker) {
                        const end = new Date();
                        const start = '';
                        picker.$emit('pick', [start, end]);
                    }
                }
                ]
            },
            
            chartData:{
                columns: [],
                rows: [
                ]
            },
            chartSettings: {
                stack: { },
                area: true,
                type: 'line',
                labelMap: {
                    'browseCount': '浏览量',
                    'praiseCount': '点赞量',
                    'commentCount': '评论量',
                    'collectionCount': '收藏量',
                    'hotValue': '热度',
                },
                yAxisType: ['KMB'],
                yAxisName: []
            },
            barChartData:{
            },
            barChartSettings: {
                metrics: ['total'],
                dataOrder: {
                    label: 'total',
                    order: 'desc'
                }
            },
            maxOfItem: '',
            sum: '',
            avg: '',
            dataName:'',
            avgName: '',
            maxOfItemName: '',
            hackReset: true,
        }
    },
    mounted() {
    },
    methods: {
        selectNikeName(query){
            this.articles = [];
            this.articleFloder = [];
            this.dataForm.articleId = '';
            this.dataForm.uqsId = '';
            this.dataForm.articleFloder = '';
            if(query !== '') {
                axion.selectUserByNikeName(this.token, query).then(res => {
                    if(res.data.retCode == 0){
                        this.user = res.data.param;
                    }
                });
            } else {
                this.user = []
            }
            
        },
        nickNameChange(){
            
            
            let nowUser = this.user.find((item) =>{
                return item.uqsId == this.dataForm.uqsId
            });

            this.nickName = nowUser.nickName;
            this.userCount.articleCount = nowUser.articleCount;
            this.userCount.concernTopicCount = nowUser.concernTopicCount;
            this.userCount.concernUserCount = nowUser.concernUserCount;
            this.userCount.fansCount = nowUser.fansCount;
            this.userCount.sayCount = nowUser.sayCount;
            if(this.dataForm.uqsId !== '') {
                if(this.radio == '1') {
                    axion.listArticleFolderByUqsId(this.dataForm.uqsId).then(res => {
                        if(res.data.retCode == 0){
                            this.articleFloder = res.data.param;
                            this.dataForm.articleFloder = this.articleFloder[0].id;
                            this.articleFloderChange();
                        }
                    });
                } else {
                    axion.listArticleByuqsId(this.dataForm.uqsId).then(res => {
                        if(res.data.retCode == 0){
                            this.qingsay = res.data.param.rows;
                            this.dataForm.articleId = this.qingsay[0].id;
                            this.articleChange();
                        }
                    });
                }
            } else {
                this.user = []
            }
            
        },
        articleFloderChange(){
            axion.listArticleByFolderId(this.dataForm.articleFloder).then(res => {
                if(res.data.retCode == 0){
                    this.articles = res.data.param.rows;
                    console.log(this.articles)
                    this.dataForm.articleId = this.articles[0].id;
                    this.articleChange();
                }
            });
        },
        articleChange() {
            let startTime = moment(this.dataForm.statisticsTime[0]).format('YYYY-MM-DD HH:mm:ss');
            let endTime = moment(this.dataForm.statisticsTime[1]).format('YYYY-MM-DD HH:mm:ss');
            let timeType =  this.dataForm.timetype
            if (this.dataForm.articleId == '') {
                return;
            }
            let articleId = this.dataForm.articleId;
            axion.getDailyData(startTime, endTime, articleId, timeType, this.token).then(res => {
                if(res.data.retCode == 0){
                    this.chartData.columns = res.data.param.columns;
                    this.chartData.rows = res.data.param.rows;
                } else {
                    this.chartData.rows = [];
                    this.barChartData.rows = [];
                    this.sum = 0;
                    this.avg = 0;
                    this.maxOfItem = 0;
                }
            });
            
        },
        articleTypeChange(){
            if(this.radio == '1') {
                    axion.listArticleFolderByUqsId(this.dataForm.uqsId).then(res => {
                        if(res.data.retCode == 0){
                            this.articleFloder = res.data.param;
                            this.dataForm.articleFloder = this.articleFloder[0].id;
                            this.articleFloderChange();
                        }
                    });
                } else {
                    axion.listArticleByuqsId(this.dataForm.uqsId).then(res => {
                        if(res.data.retCode == 0){
                            this.qingsay = res.data.param.rows;
                            this.dataForm.articleId = this.qingsay[0].id;
                            this.articleChange();
                        }
                    });
                }
        },
        handleClick(){
        },

        getStratTime() {
            
            
        }
    },
}
</script>
<style>
    @media (min-width:0px) {
        .data-font{
            font-size: 6px;
        }
        .data-name-font{
            font-size: 3px;
        }
    }
    @media (min-width:680px) {
        .data-font{
            font-size: 8px;
        }
        .data-name-font{
            font-size: 4px;
        }
    }
    @media (min-width:1024px) {
        .data-font{
            font-size: 15px;
        }
        .data-name-font{
            font-size: 10px;
        }
    }
    @media (min-width:1280px) {
        .data-font{
            font-size: 20px;
        }
        .data-name-font{
            font-size: 13px;
        }
    }
    @media (min-width:1440px) {
        .data-font{
            font-size: 25px;
        }
        .data-name-font{
            font-size: 15px;
        }
    }
    @media (min-width:1920px) {
        .data-font{
            font-size: 25px;
        }
        .data-name-font{
            font-size: 15px;
        }
    }
</style>
<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="审核" name="first">
                <el-table
                :data="examineArticTableData"
                border
                style="width: 100%">
                    <el-table-column fixed prop="title" label="标题"></el-table-column>
                    <el-table-column fixed prop="topicName" label="主题名"></el-table-column>
                    <el-table-column fixed prop="createTime" label="投稿日期"> </el-table-column>
                    <el-table-column fixed="right" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="gotoArticle(scope.row)" type="text" size="small">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div  style="width: 100%">
                    <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="examineArticletTotal"
                    :current-page="examineArticletPageNum"
                    @current-change="pageChange"
                    class="textAlignCenter">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="主题管理" name="second">
                <el-form ref="form" :model="topicForm" :inline="true" label-width="80px">
                    <el-form-item label="主题名称">
                        <el-input v-model="topicForm.topicName" @change="selectTopic"></el-input>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-button type="primary" @click="selectTopic">搜索</el-button>
                    </el-form-item> -->
                </el-form>
                <el-table
                :data="topicTableData"
                border
                style="width: 100%">
                    <el-table-column fixed prop="topicName" label="主题名"></el-table-column>
                    <el-table-column width="100px" fixed prop="collectArticleCount" label="文章数"></el-table-column>
                    <el-table-column width="100px" fixed prop="collectSayCount" label="青说数"> </el-table-column>
                    <el-table-column width="100px" fixed prop="userConcernCount" label="用户关注"> </el-table-column>
                    <el-table-column fixed prop="description" label="描述"> </el-table-column>
                    <el-table-column fixed prop="createTime" label="创建时间"> </el-table-column>
                    <el-table-column width="100px" fixed prop="qsLock" label="状态"> </el-table-column>
                    <el-table-column fixed="right" label="操作">
                        <template slot-scope="scope">
                            <el-button  @click="gotoTopic(scope.row)" type="text" size="small">查看</el-button>
                            <el-button v-if="scope.row.qsLock == 0" @click="updateTopicLock(scope.row)" type="text" size="small">禁用</el-button>
                            <el-button v-if="scope.row.qsLock == 1" @click="updateTopicLock(scope.row)" type="text" size="small">恢复</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div  style="width: 100%">
                    <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="topicTotal"
                    :current-page="topicPageNum"
                    @current-change="pageChange"
                    class="textAlignCenter">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="文章管理" name="third">
                <el-form ref="form" :model="topicForm" :inline="true" label-width="80px">
                    <el-form-item label="文章搜索">
                        <el-input v-model="articleForm.articleName" @change="selectArticle"></el-input>
                    </el-form-item>
                </el-form>
                <el-table
                :data="articleTableData"
                border
                style="width: 100%">
                    <el-table-column fixed prop="title" label="文章名"></el-table-column>
                    <el-table-column fixed prop="nickName" label="作者"></el-table-column>
                    <el-table-column width="80px" fixed prop="browseCount" label="浏览量"></el-table-column>
                    <el-table-column width="80px" fixed prop="praiseCount" label="点赞量"> </el-table-column>
                    <el-table-column width="80px" fixed prop="commentCount" label="评论量"> </el-table-column>
                    <el-table-column fixed width="80px" prop="collectionCount" label="收藏量"> </el-table-column>
                    <el-table-column fixed prop="createTime" label="创建时间"> </el-table-column>
                    <el-table-column width="60px" fixed prop="deletion" label="状态"> </el-table-column>
                    <el-table-column width="110px" fixed prop="hotValue" label="总热度"> </el-table-column>
                    <el-table-column width="110px" fixed prop="falseHotValue" label="虚假热度"> </el-table-column>
                    <el-table-column width="110px" fixed prop="todayHotValue" label="今日热度"> </el-table-column>
                    <el-table-column width="110px" fixed prop="falseTodayHotValue" label="今日虚假热度"> </el-table-column>
                    <el-table-column fixed="right" label="操作">
                        <template slot-scope="scope">
                            <el-button  @click="gotoArticle(scope.row)" type="text" size="small">查看</el-button>
                            <el-button v-if="scope.row.deletion == 0" @click="updateArticleDeletion(scope.row)" type="text" size="small">删除</el-button>
                            <el-button v-if="scope.row.deletion == 1" @click="updateArticleDeletion(scope.row)" type="text" size="small">恢复</el-button>
                            <el-button v-if="scope.row.deletion == 0" @click="Ariticledialog(scope.row)" type="text" size="small">设置热度</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div  style="width: 100%">
                    <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="articleTotal"
                    :current-page="articlePageNum"
                    @current-change="pageChange"
                    class="textAlignCenter">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog
            title="提示"
            :visible.sync="AriticledialogVisible"
            width="30%"
            :before-close="handleClose">
            虚假热度:
            <el-input
                placeholder="虚假热度"
                v-model="falseHotValue" style="margin-bottom: 20px">
            </el-input>
            今日虚假热度:
            <el-input
                placeholder="今日虚假热度"
                v-model="todayFalseHotValue">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="AriticledialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateArticleHotValue()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axion from "@/util/api.js"
import { fail } from 'assert';
export default {
    data () {
        return {
            token: sessionStorage.getItem('token'),
            userId:sessionStorage.getItem('userId'),
            activeName: 'first',
            examineArticletTotal: 0,
            examineArticletPageNum: 1,
            examineArticTableData: [],
            topicTotal: 0,
            articleTotal: 0,
            topicPageNum: 1,
            articlePageNum: 1,
            topicTableData: [],
            articleTableData: [],
            topicForm: {
                topicName: '',
            },
            articleForm: {
                articleName: '',
            },
            AriticledialogVisible: false,
            articleRow: [],
            falseHotValue: 0,
            todayFalseHotValue: 0,
        }
    },
    mounted() {
        this.getExamineArticle();
    },
    methods: {
        handleClick(tab, event) {
            if(tab.index == '0') {
                if (this.examineArticletTotal == 0) {
                    this.getExamineArticle();
                }
            } else if (tab.index == '1') {
                if(this.topicTotal == 0) {
                    this.listTopic();
                }
                
            } else if (tab.index == '2') {

            } else if (tab.index == '3') {
                console.log(3)
                console.log(this.activeName)
            }
        },
        getExamineArticle() {
            axion.listExamineArticle(this.examineArticletPageNum, 10, this.token).then(res => {
                if(res.data.retCode == 0){
                    this.examineArticletTotal = res.data.param.total;
                    this.examineArticTableData = res.data.param.rows;
                } else {
                }
            });
        },
        pageChange(pageNum) {
            if(this.activeName == 'first') {
                this.examineArticletPageNum = pageNum;
                this.getExamineArticle();
            } else if(this.activeName == 'second') {
                this.topicPageNum = pageNum;
                this.listTopic();
            } else if(this.activeName == 'third') {
                this.articlePageNum = pageNum;
                this.selectArticle();
            }
        },
        listTopic() {
            if (this.topicForm.topicName != '') {
                this.selectTopic();
            } else {
                axion.listTopic(this.topicPageNum, 10, this.token).then(res => {
                    if(res.data.retCode == 0){
                        this.topicTotal = res.data.param.total;
                        this.topicTableData = res.data.param.rows;
                    } else {
                    }
                });
            }
            
        },
        selectTopic(){
            axion.selectTopic(this.topicForm.topicName,this.topicPageNum, 10, this.token).then(res => {
                if(res.data.retCode == 0){
                    this.topicTotal = res.data.param.total;
                    this.topicTableData = res.data.param.rows;
                } else {
                }
            });
        },
        updateTopicLock(row) {
            let type = '';
            if (row.qsLock == 0) {
                type = 1;
            } else {
                type = 0;
            }
            axion.updateTopicLock(row.id, type, this.token).then(res => {
                if(res.data.retCode == 0){
                    if(type == 0) {
                        this.$message.success("解锁成功");
                    } else {
                        this.$message.success("锁定成功");
                    }
                    this.listTopic();
                } else {
                    this.$message.error(res.data.retInfo);
                }
            });
        },
        gotoArticle(data) {
            console.log(data)
            window.open(this.$store.state.jumpUrl+'articleId='+data.id+'&token='+this.token+'&userId='+this.userId+'&from=admin','_blank')
        },
        updateArticleDeletion(row) {
            console.log(row);
            if(row.deletion == "0") {
                axion.removeArticle(row.id, this.token).then(res => {
                    if(res.data.retCode == 0){
                        this.$message.success("删除成功");
                        this.selectArticle();
                    } else {
                        this.$message.error(res.data.retInfo);
                    }
                });
            } else {
                axion.recoveryArticle(row.id, this.token).then(res => {
                    if(res.data.retCode == 0){
                        this.$message.success("恢复成功");
                        this.selectArticle();
                    } else {
                        this.$message.error(res.data.retInfo);
                    }
                });
            }
        },
        selectArticle() {
            axion.selectArticle(this.articleForm.articleName,this.articlePageNum, 10, this.token).then(res => {
                if(res.data.retCode == 0){
                    this.articleTotal = res.data.param.total;
                    this.articleTableData = res.data.param.rows;
                } else {
                }
            });
        },
        updateArticleHotValue() {
            let row = this.articleRow;
            console.log("虚假热度:" + this.falseHotValue);
            axion.setFalseHotValue(row.id, this.token, this.falseHotValue, this.todayFalseHotValue).then(res => {
                if(res.data.retCode == 0){
                    this.selectArticle();
                    this.$message.success("设置虚假热度成功");
                    this.AriticledialogVisible = false;
                } else {
                }
            });
        },
        Ariticledialog(row) {
            this.articleRow = row;
            this.AriticledialogVisible = true;
        },
        handleClose() {
            console.log("aaaaa");
            this.falseHotValue = 0;
            this.todayFalseHotValue = 0;
            this.articleRow = [];
        }
    }

}

</script>
<style scoped>
</style>

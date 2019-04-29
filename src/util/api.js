import axios from 'axios'
import {Message} from 'element-ui'
import { baseURL, objBase, modelBase} from './config'

const errorMsg = '服务器内部错误'
const errorMsg401 = '登陆超时,请重新登录'
const errorFn = err => {
    console.log(err.response.status)
    let status = err.response.status
    if(status == 500) {
        Message.error(errorMsg)
    }
    if(status == 401){
        Message.error(errorMsg401)
    }
    return err
}
const codeerror = d => {
    if (d.data != null && d.data.code == 401) {
        Message.error(d.data.msg)
    }
    return d
}

const post = (_url, obj) => axios.post(_url, obj, objBase).then(codeerror).catch(errorFn)//query参数
const post2 = (_url, body) => axios.post(_url, body, modelBase).then(codeerror).catch(errorFn)//body体
const get = (obj) => axios.get(obj, objBase).then(codeerror).catch(errorFn)
const postfile =  (_url, obj) => axios.post(_url, obj,{ baseURL: baseURL,headers:{'Content-Type':'multipart/form-data'}}).then(codeerror).catch(errorFn)

//需要的接口写下面
const login = (param) => post('/admin/login',param)
const logout = (param) => post('/user/logout',param)
//获取用户信息
const getUserInfo = (param) => post('/user/getUserInfo',param)
const selectUserByNikeName = (token, nikeName) => get('/admin/selectUserByNikeName?token='+token + "&nikeName=" + nikeName)
const listArticleFolderByUqsId = (uqsId) => get('/article/listArticleFolderByUqsId?uqsId='+uqsId)
const listArticleByFolderId = (folderId) => get('/article/listArticleByFolderId?folderId=' + folderId + "&pageNum=1&pageSize=9999")
const listArticleByuqsId = (uqsId) => get('/article/listArticleByFolderId?uqsId=' + uqsId  + "&pageNum=1&pageSize=9999")
const getDailyData = (startDay, endDay, articleId, type, token) => get('/admin/getDailyData?startDay='+startDay + "&endDay="+ endDay +"&articleId=" + articleId + "&type=" + type + "&token=" + token)
const listExamineArticle = (pageNum, pageSize, token) => get('/admin/listExamineArticle?token='+token + "&pageNum="+ pageNum +"&pageSize=" + pageSize)
const listTopic = (pageNum, pageSize, token) => get('/admin/listTopic?token='+token + "&pageNum="+ pageNum +"&pageSize=" + pageSize)
const selectTopic = (keyword, pageNum, pageSize, token) => get('/admin/selectTopic?token='+token + "&pageNum="+ pageNum +"&pageSize=" + pageSize + "&keyword=" + keyword)
const updateTopicLock = (topicId, type, token) => post('/admin/updateTopicLock?token='+token + "&topicId="+ topicId +"&type=" + type)
const selectArticle = (titleOrAuthor, pageNum, pageSize, token) => get('/admin/selectArticle?token='+token + "&pageNum="+ pageNum +"&pageSize=" + pageSize + "&titleOrAuthor=" + titleOrAuthor)
const removeArticle = (articleId, token) => post('/article/remove?token='+token + "&articleId="+ articleId)
const recoveryArticle = (articleId, token) => post('/admin/recoveryArticle?token='+token + "&articleId="+ articleId)
const setFalseHotValue = (articleId, token, falseHotValue, todayFalseHotValue) => post('/admin/setFalseHotValue?token='+token + "&articleId="+ articleId + "&todayFalseHotValue=" + todayFalseHotValue + "&falseHotValue=" + falseHotValue)


//暴露接口
export default {
    baseURL,
    login,
    logout,
    getUserInfo,
    selectUserByNikeName,
    listArticleFolderByUqsId,
    listArticleByFolderId,
    listArticleByuqsId,
    getDailyData,
    listExamineArticle,
    listTopic,
    selectTopic,
    updateTopicLock,
    selectArticle,
    removeArticle,
    recoveryArticle,
    setFalseHotValue
}
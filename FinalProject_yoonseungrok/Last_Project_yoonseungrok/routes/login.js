var express = require('express');
var router = express.Router();
var mysql=require('mysql'); //mysql module load 
var connection = require('../db/mysql');
// var connection =mysql.createConnection({
//     host:'127.0.0.1',
//     port:'3306',
//     user:'seungrok',
//     password:'tmdfhrdl11.',
//     database:'board_db'
// });
//수업2부 
router.get('/logout', function(req, res, next) {
    req.session.destroy();//로그아웃하면 세션 없애야지 
    res.redirect('/');//20191211수정 login계정 생성이랑 인증에서도 빈칸에 대한 검증 추가하기 
});

router.post('/create',function(req,res,next){
    var sql= 'INSERT INTO t_user (login_id,login_pwd,user_name,email) VALUES(?,?,?,?)'; 
    var values=[req.body.login_id,
                req.body.login_pwd, 
                req.body.user_name, 
                req.body.email];
    console.log(sql);
    connection.query('select * from t_user where login_id=?', 
    [req.body.login_id],
        function(err,row,field){
        if (err){
            console.log("Error1")
            res.json({'status':'ERROR'});
        }else{
            if(row.length > 0) {
                console.log("Error2")

                res.json({'status':'ERROR'});
            } else {
                //d여기서 에러가 잡히는데지금. 
                connection.query(sql,values, function(err, row, field) {
                    if(err) {
                        console.log("Error3")
                        res.json({'status':'ERROR'});
                    } else {
                        console.log("데이터베이스에계정정보저장성공")
                        res.json({'status':'OK'});
                    }
                });
            }
        }
    });

});

//계정생성 과정에서 아이디 체크 
router.get('/checkid',function(req,res,next){
    //이거는 get 방식
    console.log("req.query.login_id=",req.query.login_id,'select * from t_user where login_id=\''+req.query.login_id+'\'');
    var sql='SELECT * FROM t_user WHERE login_id=?';
    var values= [req.query.login_id];
    connection.query(sql, values,
        function(err,row,field){
            if(err){
                //DB에서 문제가 생겼을 경우 
                res.send('ERROR'); //send 는 문자열만 날라가는거야
            }else{
                //DB에서 검색을 끝나고 row 결과값을 줌 
                if(row.length > 0 ){
                    //이미 존재하는것 따라서 
                    res.send('Duplicated'); //send 는 문자열만 날라가는거야
                }else{
                    res.send('OK');
              }
            }
    });
});

/* signup page */
router.get('/signup', function(req, res, next) {
    res.render('signup');
});

/* login ajax process -- login.js 자바스크립트 파일이 포스트 방식으로 요청을 보내서 이게 실행이된다.*/
router.post('/process', function(req, res, next) {
    //이거는 post 방식임. 따라서 body.login_id 를 찾으면됨 
    console.log(req.body);
    var sql= "SELECT * FROM t_user WHERE login_id=? and login_pwd=?";
    //아이디가 같고 패스워드도 같은 row 를 db내에서 찾음 
    var values = [req.body.login_id, req.body.login_pwd];
    connection.query(sql, values, function(err,rows){
        if(err){//문법 또는 DB에러 
            res.json({'status':'Fail', 'err_msg':'err please reply'});
        }else{//일단 select 처리는 된 셈. 그치만 row 가 하나 이상 존재할 때만 로그인이 가능하다. 따라서 조건문으로 주자. 
            if(rows.length==1){
                //app.js에서 session을 가져왔으니까
                req.session.logined=true;
                req.session.uid=rows[0].uid; // 나중에 게시물 삭제할때, 등록한 게시자가 삭제자와 같은지 확인할때 사용하는 session 변수 
                req.session.login_id=req.body.login_id; //이 rea.session.login_id 는 우리가 정의한 session 값들임. 
                req.session.user_name= rows[0].user_name;
            
                res.json({'status':'OK', 
                        'user_name':req.session.user_name,
                        'login_id':req.session.login_id, 
                        'login_pwd':req.body.login_pwd});
            }else{
                res.json({'status':'Fail', 'err_msg':'no user or password'});
            }
        }
    });

});

module.exports = router;

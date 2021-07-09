var express = require('express');
var connection=require('../db/mysql');
var router = express.Router();
var rq_url= require('url');

/* board Register page */
router.get('/register', function(req, res, next) {
    res.render('boardRegister');
    console.log("세션:",req.session.login_id);
    //새글등록 버튼을 ejs에서 누르면 
    //board.js 자바스크립트에서 정의된 대로 여기로 오는데, 
    //여기서는 다시 boardRegister.ejs를 뿌려준다. 
});
/* board register process ajax*/
/* board.js 자바스크립트 파일에서 
새글등록 버튼을 누르면 아래와 같은 json정보를 넘겨주기로 했음. 
data:JSON.stringify({'board_title':$('#board_content').val(),
'board_content':$('#board_content').val()}),*/

router.post('/register/process',function(req,res,next){
    //$('#btn_board_register').on('click', function() { 이부분에서 
    //넘어온 JSON 데이터를 DB에 저장을 해야한다. 
    //preparedstatement 를 사용해야 함. 마치 파이썬의 format 사용법과 같이 ㅇㅇ

    var sql='Insert into t_board (user_id,user_name, title, content)'+
    'values(?,?,?,?)';
    var values=[req.session.login_id,req.session.user_name, 
    req.body.board_title, req.body.board_content];

    connection.query(sql, values,function(err,result){
        if(err){
            res.json({'status':'Error'})
        }else{
            if(result.insertId != 0){
                console.log("글 등록 성공!");
                res.json({'status':'OK'});
            }else{
                res.json({'status':'Error'});
            }
         }
    });
});

/* board list page */
router.get('/list', function(req, res, next) {
    connection.query('select * ,date_format(cdate, \'%Y-%m-%d %H:%i:%s\') as cdate2 from t_board',function(err,rows){
        if(err){
            console.log(err)
            res.render('boardList', {'status':'Error'});
            //routes에서 render은 ejs를말함 따라서 boardList를 띄우면서 
            //render 매서드의 두번재인자로 뒤에 Json형식의 'status'정보를 같이 전달함.
            //boardList.ejs에서는 이 status를 변수처럼사용가능  
        }else{
            console.log("글 목록 렌더");
            res.render('boardList',{'status':'OK',
                        'user_name':req.session.user_name,
                        'login_id':req.session.login_id, 
                        'login_pwd':req.body.login_pwd,
                       'data':rows
                    });
            //마찬가지로 여기서도 rows를 json 형식으로 보내준다. 
            //boardList.ejs에서는 이 data를 변수처럼 사용가능하다.
        }
    });
});
/* board search process ajax */
router.post('/list/search', function(req, res, next) {
    //제목과 내용 저자 모두를 찾는 search
    var sql = "select *, date_format(cdate, \'%Y-%m-%d %H:%i:%s\') as cdate2 from t_board where title like ? OR content like ? OR user_id like ?";
    var values = ['\%' + req.body.searchKeyword + '\%','\%' + req.body.searchKeyword + '\%','\%' + req.body.searchKeyword + '\%'];
    console.log(req.body.searchKeyword);

    connection.query(sql, values, function(err, rows){
        if(err) {
            res.render('boardList', {'status':'Error'});
        } else {
            res.render('boardList',{'status':'OK',
            'user_name':req.session.user_name,
            'login_id':req.session.login_id, 
            'login_pwd':req.body.login_pwd,
           'data':rows,});
        }
    })
});

/* board read page */
router.get('/update', function(req, res, next) {
    var bid=req.query.bid;
    console.log(bid);
    console.log("글상세페이지");
    var sql='select * ,date_format(cdate, \'%Y-%m-%d %H:%i:%s\') as cdate2 from t_board where bid= ?';
    var values=[bid];
    connection.query(sql,values,function(err,rows){
        console.log("데이터베이스접근")
        if(err){
            console.log(err);
            console.log("글 로드에러");
            res.json({'status':'Fail', 'err_msg':'에러, 다시해봐.'});
        }else{
            console.log("글 로드성공");
            console.log("sessionID:",req.session.login_id);
            console.log("IDofMEMO:",rows[0].user_id)
            res.render('boardUpdate', {'status':'OK','login_id':req.session.login_id,'bid':req.query.bid, 'author_id':rows[0].user_id, 'author_name':rows[0].user_name, 'title':rows[0].title, 'content':rows[0].content, 'cdate2':rows[0].cdate2});
         }
    });
});

// /* board update page */
router.post('/modify',function(req,res,next){
    //이쪽으로 넘어오는 애들은 이미 작성자가 본인인 경우임 
    //form action 으로 넘어옴 
    var title = "";
    var original_title = req.body.original_board_title;
    var new_board_title= req.body.new_board_title;
    var new_board_content=req.body.new_board_content;
    if(new_board_title == ''){
        var title = req.body.original_board_title
    }else{
        var title = req.body.new_board_title
    }
    var values=[title, 
        req.body.board_content,req.body.bid];
    console.log(values);
    console.log("수정중", req.body.bid);
    var sql='UPDATE t_board set title=?, content=? where bid=?';
    connection.query(sql, values,function(err,result){
        if(err){
            console.log("수정중 에러발생!재시도바람");
            res.json({'status':'Fail', 'err_msg':'수정중 에러발생!재시도바람.'});
        }else{
            console.log("수정완료!")
            console.log(result.affectedRows + " record(s) updated");
            res.json( {'status':'OK','bid':req.body.bid, 'user_id':req.body.author, 'user_name':req.body.user_name, 'title':title, 'content':req.body.content});
        }
    });
});

router.post('/delete', function(req, res, next) {

    console.log("지우려는 글 번호:",req.body.bid);
    var sql = "delete from t_board where bid="+req.body.bid;
    connection.query(sql, function(err, rows) {
        if(err) {
            console.log(err);
            res.json({'status':'Fail', 'err':'삭제중 에러발생!재시도바람.'});
        } else {
            res.json( {'status':'OK'});
        }
    });   
});

module.exports = router;



//login.ejs에서 정의된 btn_login버튼을 클릭했을시의 작업을 아작스로 서버에 요청을 한다. 비동기 처리로서 like AsyncTask in Android.
$('#btn_login').on('click', function() {
    $.ajax({
        url:'/login/process', // 서버 routes에 있는 logins.js 
        method:'POST',
        dataType:'json',
        contentType:'application/json',
        data:JSON.stringify({'login_id':$('#login_id').val(),
                              'login_pwd':$('#login_pwd').val()  }),
                               
        success:function(result) {
            //route의 json이 보낸 값이 result로 들어온다. 
            //res.json({'status':'OK', 'login_id':req.body.login_id, 'login_pwd':req.body.login_pwd}); 형식으로 login/process에서 돌아옴
            console.log(result);
            if(result.status == 'OK') {
                //이렇게 로그인 체크를 했지만서도 app.js에서도 한번 더 session으로 체크한다. 
                //로그인이 성공하면 routes의 board.js /list로 
                /* app.use('/board', function(req,res,next){
                    if(req.session.logined){ 
                        next();
                    }else{
                        res.redirect('/');
                    }
                    },boardRouter); 
                    //로그인안되면 절대로 이 단계를 뛰어넘을 수가 없음. req.session.logined가 true가 되어야 하기 때문. 
                    */
                window.location.replace('/board/list');
                // $('.login-page').hide();
                // $('.user-page').css('visibility', 'visible');
                // $('#txt_welcome').text('Welcome ' + result.login_id);
                //서버사이드에서는 redirect 로 화면을 전환했는데,
                //여기 클라이언트 사이드에서는 window.location.replace 로 화면을 전환한다. 
            } else {
                $('#message').text(result.err_msg);
                alert("Woops, something got wrong in the login Process.\n Please check your ID or Password")
                
            }
        },
        error:function(err) {
            console.log(err);
            $('#message').text(err.responseText);
            alert("Woops, Error. Try again!")

        }
    });
});
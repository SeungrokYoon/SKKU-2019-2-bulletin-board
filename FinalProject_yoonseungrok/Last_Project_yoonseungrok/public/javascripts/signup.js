var isCheckedId=false;
var isChecekdPwd=false;
var isConfirmedPwd=false;
var isCheckedEmail=false;

$('#login_id').keyup(function(){//키 눌린게 떼지면
    console.log("keyup RESET");
    if(isCheckedId){
        isCheckedId =false;
    }
    if ($('#login_id').val().length <5){
        console.log('5자 이상쓰기');//브라우저에 찍히는 로그 
        $('#messageID').text('5자 이상 쓰세요');
    }else{
        $.ajax({
            url:'/login/checkid?login_id='+$('#login_id').val(),
            method:'GET',
            //여기서는 get방식으로 보내서 따론 json 파싱 안했음
            success:function(data){
                console.log("ajax success");
                if(data=='OK'){
                    isCheckedId=true;
                    $('#messageID').text('id사용가능');
                }else if(data =='Duplicated'){
                    isCheckedId=false;
                    $('#messageID').text('id 중복, 사용불가');
                }else {
                    isCheckedId=false;
                    $('#messageID').text('error발생, 재시도...');
                }
            },
            error:function(err){
                isCheckedId=false;
                $('#message').text('Error...');
            }
        });
    }
});


// //백그라운드에서 페이지 변환없이 서버와 통신 
// $('#btn_check_id').on('click', function() { 
//     if ($('#login_id').val().length <5){
//         console.log('5자 이상쓰기');//브라우저에 찍히는 로그 
//         alert('5자 이상 쓰세요')
//     }else{
//         $.ajax({
//             url:'/login/checkid?login_id='+$('#login_id').val(),
//             method:'GET',
//             //여기서는 get방식으로 보내서 따론 json 파싱 안했음
//             success:function(data){
//                 console.log("ajax success");
//                 if(data=='OK'){
//                     isCheckedId=true;
//                     $('#messageID').text('id사용가능');
//                 }else if(data =='Duplicated'){
//                     isCheckedId=false;
//                     $('#messageID').text('id 중복, 사용불가');
//                 }else {
//                     isCheckedId=false;
//                     $('#messageID').text('error발생, 재시도...');
//                 }
//             },
//             error:function(err){
//                 isCheckedId=false;
//                 $('#message').text('Error...');
//             }
//         });
//     }
// });

$('#btn_signup').on('click', function() {
    //2부 수업 시작 부분
    if (!isCheckedId){
        alert('ID체크해!~');
        return;
    }
    if($('#user_name').val().length < 3){
        alert('이름이 짧아~');
        return 
    }
    if(!isCheckedPwd){
        alert('비밀번호 달라~');
        return;
    }
    if(!isCheckedEmail){
        alert('이메일 주소 체크해~');
        return;
    }

    $.ajax({
        url:'/login/create',
        method:'POST',
        dataType:'json',
        contentType:'application/json',
        data: JSON.stringify({
            'user_name':$('#user_name').val(),
            'login_id':$('#login_id').val(),
            'login_pwd':$('#login_pwd').val(),
            'email':$('#email').val()
            //이런식으로 JSON형태로 호스트에게 전송한다. 이게 전송이 되면 route 의 login.js의 /create가 실행이 되면서 db에 쿼리를 전송하게 됨
        }),
        success: function(data){
            if(data.status =='OK'){
                console.log("가입성공");
                window.location.replace('/board/list');//javascript에서 화면 바꿔줄때는 windsow.location.replace를 쓴다. 
            }else{//data.status =="ERROR" 인 경우 
                $('#message').text('error발생1, 재시도..'); // 이 에러는 HTTP 프로토콜 실패~네트워크 상황(서버든 클라이언트든) 이기때문에, 재시도를 해보는 것으로 메시지를 전달한다. 이제 서버쪽에 login.js 로 넘어가자. 
            }
            //성공을 하면 다른 페이지로 넘어가야 하니까 우리 입장에서는 게시판의 메인 목록 페이지로 넘겨주는 게 좋겠다. 지금 우리는 클라이언트사이드에서 진행중임. 
        },
        error: function(err){
            $('#message').text('error발생2, 재시도..'); // 이 에러는 HTTP 프로토콜 실패~네트워크 상황(서버든 클라이언트든) 이기때문에, 재시도를 해보는 것으로 메시지를 전달한다. 이제 서버쪽에 login.js 로 넘어가자. 
        }
    });
});//input[type=password]
//안전한 비밀번호 설정 체크 
$('#login_pwd').keyup(function() {
    var pswd = $(this).val();
        //validate the length
        var varificationCounter=0;
        if ( pswd.length < 8 ) {
            $('#length').removeClass('valid').addClass('invalid');
        } else {
            $('#length').removeClass('invalid').addClass('valid');
            varificationCounter=varificationCounter+1;

        }
        if ( pswd.match(/[A-z]/) ) {
            $('#letter').removeClass('invalid').addClass('valid');
            varificationCounter=varificationCounter+1;

        } else {
            $('#letter').removeClass('valid').addClass('invalid');
        }
        
        //validate capital letter
        if ( pswd.match(/[A-Z]/) ) {
            $('#capital').removeClass('invalid').addClass('valid');
            varificationCounter=varificationCounter+1;

        } else {
            $('#capital').removeClass('valid').addClass('invalid');
        }
        
        //validate number
        if ( pswd.match(/\d/) ) {
            $('#number').removeClass('invalid').addClass('valid');
            varificationCounter=varificationCounter+1;

        } else {
            $('#number').removeClass('valid').addClass('invalid');
        }
        if (varificationCounter ==4){
            isCheckedPwd=true;
            $('#messageSafe').text("안전한비밀번호!");
        }else{
            $('#messageSafe').text("좀 더 안전한 비밀번호를 설정하세요");
            isCheckedPwd=false;
        }
    }).focus(function() {
        $('#pswd_info').show();
    }).blur(function() {
        $('#pswd_info').hide();     
});


$('input[type=password]').keyup(function() {
    if($('#login_pwd').val() != $('#confirm_pwd').val()){
        $('#messagePWD').text("비밀번호 불일치");
        isConfirmedPwd==false;

        $('#btn_signup').hide();

    }else{
        isConfirmedPwd=true;
        $('#messagePWD').text("비밀번호 일치");
        console.log("ischeckedPwd:",isCheckedPwd,"isConfirmededPwd:",isConfirmedPwd);
        if ((isConfirmedPwd==true)&(isCheckedPwd==true)){
            $('#btn_signup').show();
        }else{
            $('#messagePWD').text("안전한 비밀번호 조건4가지 충족여부와, 비밀번호간 일치 여부를 재확인 해주세요");
        }
    }
});

//email validation 
$('#email').keyup(function() {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if(emailReg.test( $('#email').val() )){
        isCheckedEmail=true;
        $('#messageEmail').text("이메일 형식 충족하였습니다.");
    }else{
        isCheckedEmail=false;
        $('#messageEmail').text("이메일 형식이 맞지 않습니다.");
    }
});
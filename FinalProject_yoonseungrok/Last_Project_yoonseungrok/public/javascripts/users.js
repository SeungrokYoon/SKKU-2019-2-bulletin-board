var isCheckedLogin_id=false;
var isCheckedUser_name=false;
var isCheckedUser_pwd=false;

//수정시에 빈아이디 빈 이름 빈 비밀번호없게 
$('#login_id').keyup(function(){
    
    if(isCheckedLogin_id){
        isCheckedLogin_id =false;
    }
   if($('#login_id').val() ==""){
       isCheckedLogin_id=false;
   }else{
       isCheckedLogin_id=true;
       
   }
   console.log("login_id",$('#login_id').val(),isCheckedLogin_id);
});
$('#user_name').keyup(function(){
    if(isCheckedUser_name){
        isCheckedUser_name =false;
    }
    
    if($('#user_name').val() !=""){
        isCheckedUser_name=true;
    }else{
        isCheckedUser_name=false;
    }
    console.log("user_name",$('#user_name').val(),isCheckedUser_name);

});
$('#user_pwd').keyup(function(){
    if(isCheckedUser_pwd){
        isCheckedUser_pwd =false;
    }
    if($('#user_pwd').val() !=""){
        isCheckedUser_pwd=true;
        }else{
        isCheckedUser_pwd=false;
    }
    console.log("user_pwd",$('#user_pwd').val(),isCheckedUser_pwd);

});


//로그아웃
$('#btn_logout').on('click',function(){

    window.location.replace("/login/logout");
});

//게시판 리스트로 돌아가기 
$('#btn_board_list').on('click', function() {
    console.log("보드리스트render")
    window.location.replace('/board/list');
});

//사용자리스트로 돌아가기 
$('#btn_user_list').on('click', function() {
    console.log("보드리스트render")
    window.location.replace('/users/list');
});


//수정확인버튼
$('#btn_user_update').on('click', function() { 
    console.log("id",isCheckedLogin_id,"name",isCheckedUser_name,"pwd",isCheckedUser_pwd);
    if($('#login_id').val() ==""){
        isCheckedLogin_id=false;
    }else{
        isCheckedLogin_id=true;
        
    }
    if($('#user_name').val() !=""){
        isCheckedUser_name=true;
    }else{
        isCheckedUser_name=false;
    }
    if($('#user_pwd').val() !=""){
        isCheckedUser_pwd=true;
        }else{
        isCheckedUser_pwd=false;
    }
    if((isCheckedUser_pwd) && (isCheckedLogin_id) && (isCheckedUser_name)){
        $.ajax({
            url:'/users/modify',
            method: 'POST',
            dataType:'json',
            contentType:'application/json',
            data:JSON.stringify({
                            'login_id':$('#login_id').val(),
                            'user_name':$('#user_name').val(),
                            'user_pwd':$('#user_pwd').val(),
                            'email':$('#email').val(),
                            'uid':$('#uid').val()}),
            success:function(data){
                if(data.status=='OK'){
                    alert('수정 완료!');
                    window.location.replace('/users/list');
                }else{
                    alert('수정에 실패, 다시시도1');
                }
            },
            error:function(err){
                alert('수정에 실패, 다시 시도2');
                
            }
        });
    
    }else{
        alert("아이디, 이름, 비밀번호는 제발 비워두지 말아주라");
    }
});   

$('#btn_user_delete').on('click', function() {
    //해당글의 uid


    $.ajax({
        url:'/users/delete',
        method: 'POST',
        dataType:'json',
        contentType:'application/json',
        data:JSON.stringify({'uid':$('#uid').val()
                            }), //uid 만 넘기면....안될듯 
            success:function(data){
                if(data.status=='OK'){
                    alert('게시물이 성공적으로 삭제되었습니다!');
                    window.location.replace('/users/list');
                }else{
                    alert('삭제 실패, 다시시도1(client)');
                    window.location.replace('/users/list');
                }
            },
            error:function(err){
                alert('삭제 실패, 다시 시도2(client)');
                window.location.replace('/users/list');
            }
    });
});
//btn userssearch
$('#btn_user_search').on('click', function() {
    $('#searchKey').submit();
});

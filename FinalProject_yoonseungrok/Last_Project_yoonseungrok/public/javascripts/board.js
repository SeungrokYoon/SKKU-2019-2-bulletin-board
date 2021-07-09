var isCheckedTitle=false;
//로그아웃
$('#btn_logout').on('click',function(){
    window.location.replace("/login/logout");
});
//새글작성시작버튼
$('#btn_board_new').on('click', function() {
    window.location.replace("/board/register");
});
//새글작성하고 등록(DB에 저장하는)하는 작업

//새글등록할때 빈제목이 되지 않게 
$('#board_title').keyup(function(){
    if(isCheckedTitle){
        isCheckedTitle =false;
    }
   if($('#board_title').val() !=""){
       isCheckedTitle=true;
   }else{
       isCheckedTitle=false;
   }

});

$('#btn_board_register').on('click', function() {
    // window.location.replace("/board/register");
    //board.ejs에서 src로 등록했으니 boardList.ejs의 태그들을 불러와서 사용할 수 있음.  
    //ajax는 웹 브라우저 내 백그라운드로 돌아감 
    if($('#board_title').val() !=""){
        isCheckedTitle=true;
    }else{
        isCheckedTitle=false;
    }
    if(isCheckedTitle){
        $.ajax({
            //routes/board.js 의 /register/process로 들어간다. 
            //글이 등록이 되는 일련의 작업들은 다 routes/board.js의 /register/process에서 시행이되니까
            //쿼리도 다 거기서 처리하는거임. 
            
            url:'/board/register/process',
            method: 'POST',
            dataType:'json',
            contentType:'application/json',
            data:JSON.stringify({
                            'board_title':$('#board_title').val(),
                            'board_content':$('#board_content').val()}),
                success:function(data){
                    if(data.status=='OK'){
                        alert('새로운 글 등록 완료!');
                        //history.back(); 사용은 어떨까...?
                        window.location.replace('/board/list');
                    }else{
                        alert('저장에 실패, 다시시도1');
                    }
                },
                error:function(err){
                    alert('저장에 실패, 다시 시도2');
                }
        });
    }else{
        alert("제목은 꼭 써주라");
    }
    
});

$('#btn_board_list').on('click', function() {
    console.log("보드리스트render")
    window.location.replace('/board/list');
});

//수정확인버튼
$('#btn_board_update').on('click', function() { 
    $.ajax({
        url:'/board/modify',
        method: 'POST',
        dataType:'json',
        contentType:'application/json',
        data:JSON.stringify({
                        'original_board_title':$('#original_board_title').val(),
                        'new_board_title':$('#new_board_title').val(),
                        'board_content':$('#new_board_content').val(),
                        'bid':$('#bid').val()}),
            success:function(data){
                if(data.status=='OK'){
                    alert('수정 완료!');
                    window.location.replace('/board/list');
                    //수정한글이 검색된 채로 있으면 수정한걸 바로 확인할 수 있어서 좋을듯.....추가생각중
                    // history.back();

                }else{
                    alert('수정에 실패, 다시시도1');
                }
            },
            error:function(err){
                alert('수정에 실패, 다시 시도2');
            }
    });


    window.location.replace("/board/list");
});

$('#btn_board_delete').on('click', function() {
    $.ajax({
        url:'/board/delete',
        method: 'POST',
        dataType:'json',
        contentType:'application/json',
        data:JSON.stringify({'bid':$('#bid').val()}), //bid 만 넘기면됨
            success:function(data){
                if(data.status=='OK'){
                    alert('게시물이 성공적으로 삭제되었습니다!');
                    window.location.replace('/board/list');
                }else{
                    alert('삭제 실패, 다시시도1');
                    window.location.replace('/board/list');
                }
            },
            error:function(err){
                alert('삭제 실패, 다시 시도2');
                window.location.replace('/board/list');
            }
    });
});

$('#btn_board_search').on('click', function() {
    $('#searchKey').submit();
});


$('#btn_user_admin').on('click', function() {
    console.log("유저리스트render")
    window.location.replace('/users/list');
});
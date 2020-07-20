

var board = new Array();
let hasConflicted = new Array();
let score = 0;

let startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
    prepareForMobile();
    newgame();
});

function prepareForMobile() {

    if(documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    $('#grid-container').css('width', gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02*gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02*cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){

            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
        }

    for( var i = 0 ; i < 4 ; i ++ ){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++ ){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();
    
    score = 0;
}

function updateBoardView(){

    $(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2 );
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2 );
            }
            else{
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }

            hasConflicted[i][j] = false;
        }

    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.6*cellSideLength + 'px');
}

function generateOneNumber(){

    if( nospace( board ) )
        return false;

    //随机一个位置
    var randx = parseInt( Math.floor( Math.random()  * 4 ) );
    var randy = parseInt( Math.floor( Math.random()  * 4 ) );

    let cnt = 0;
    while( cnt < 50 ){
        if( board[randx][randy] == 0 )
            break;

        randx = parseInt( Math.floor( Math.random()  * 4 ) );
        randy = parseInt( Math.floor( Math.random()  * 4 ) );
        
        cnt++;
    }

    while( cnt == 50 ) {
        for( let i = 0; i < 4; i++ ) {
             for( let j = 0; j < 4; j++ ) {
                 if( board[i][j] == 0)
                    randx = i;
                    randy = j;
             }
        }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber );

    return true;
}

$(document).keydown( function( event ){
    
    switch( event.keyCode ){
        case 37: //left
            if( moveLeft() ){
                event.preventDefault();
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 38: //up
            if( moveUp() ){
                event.preventDefault();
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 39: //right
            if( moveRight() ){
                event.preventDefault();
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 40: //down
            if( moveDown() ){
                event.preventDefault();
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300);
            }
            break;
        default: //default
            break;
    }
});

document.addEventListener('touchstart', function(event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

// document.addEventListener('touchmove', function(event) {
//     event.preventDefault();
// });

document.addEventListener('touchend', function(event) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    let deltax = endx - startx;
    let deltay = endy - starty;

    if(Math.abs(deltax) < documentWidth*0.3 && Math.abs(deltay) < documentWidth*0.3) {
        return;
    }

    if(Math.abs(deltax) >= Math.abs(deltay)) {
        if(deltax > 0) {
            if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300);
            }  
        }
        else{
            if( moveLeft() ) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300); 
            }
        }
    }
    else{
        if( deltay > 0) {
            if( moveDown() ) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300);
            }
        }
        else{
            if( moveUp() ) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300); 
            }
        }
    }
        
});

function isgameover(){
    if( nospace(board) || nomove(board))
        gameover();
}

function gameover() {
    alert('Game Over !');
}

function moveLeft(){

    if( !canMoveLeft( board ) )
        return false;

    //moveLeft
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1 ; j < 4 ; j ++ ){
            if( board[i][j] != 0 ){
                // console.log('此时找到的位置为' + i + ' ' + j);
                for( var k = 0 ; k < j ; k ++ ){
                    if( board[i][k] == 0 && noBlockHorizontal( i , k , j , board ) ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        // console.log('将'+ i + ' ' + j +'移动到' + i + ' ' + k);
                        // console.log( '此时(i,k)的值为：' + i + ' ' + k );
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , k , j , board ) && !hasConflicted[i][k] ){
                        // console.log(i + ' ' + k + '位置与' + i + ' ' + j + '位置值相等,进行移动');
                        //move
                        showMoveAnimation( i , j , i , k );
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;

                        // console.log('移动完成');
                        // console.log( '此时(i,k)的值为：' + i + ' ' + k );

                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight() {
    if( !canMoveRight( board ) )   return false;

    for(let i = 0; i < 4; i++) {
        for( let j = 2; j >= 0; j--) {
            if( board[i][j] != 0) {
                for( let k = 3; k > j; k--) {

                    if( board[i][k] == 0 && noBlockHorizontal( i, j, k, board ) ) {
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i, j, k, board ) && !hasConflicted[i][k]) {
                        showMoveAnimation( i , j , i , k );
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                    
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200);
    return true;

}

function moveUp() {
    if( !canMoveUp( board ) )  return false;
    
    for( let j = 0; j < 4; j++ ) {
        for( let i = 1; i < 4; i++ ) {
            if( board[i][j] != 0) {
                for( let k = 0; k < i; k++) {
                    if( board[k][j] == 0 && noBlockVertical(j, i, k, board) ) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j] ) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        
                        // add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    if( !canMoveDown( board ) ) return false;

    for( let j = 0; j < 4; j++) {
        for( let i = 2; i >= 0; i--) {
            if( board[i][j] != 0 ) {
                for( let k = 3; k > i; k--) {
                    if( board[k][j] == 0 && noBlockVertical( j, i, k, board )) {
                        showMoveAnimation( i, j, k, j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j, i, k, board ) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        // add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200);
    return true;
}


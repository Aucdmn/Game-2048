function ShowNumberWithAnimation(i, j, random_num) {

    let numberCell = $('#number-cell-' + i + '-' + j);

    numberCell.css('background-color', getNumberBackgroundColor(random_num));
    numberCell.css('color', getNumberColor(random_num));
    numberCell.text(random_num);

    numberCell.animate({
        width: '100px',
        height: '100px',
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 50);
    
}

function ShowMoveAnimation(from_x, from_y, to_x, to_y) {
    let numberCell = $('number-cell-' + from_x + '-' + from_y);
    numberCell.animate({
        top: getPosTop(to_x, to_y),
        left: getPosLeft(to_x, to_y)
    }, 200);
}
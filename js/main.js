let height, width;
let myFp, liveCount,
    deadCount;

function buildCells() {
    // get values from inputs
    height = $('#height').val();
    width = $('#width').val();


    if (height && width) {
        $('table').empty();
        let tr;
        for (let i = 0; i < height; i++) {
            $('table').append(`<tr></tr>`);
            tr = $('tr').last();
            for (let j = 0; j < width; j++) {
                tr.append(`<td id="td${i}-${j}" class='dead' onclick="tdClicked(this.id)"></td>`);
            }
        }


        //init dead and live count
        deadCount = height * width;
        liveCount = 0;
        updateCount();


        $('.control').show();
    } else {
        alert('Please enter width and height!');
    }
}

function tdClicked(id) {
    if ($('#' + id).hasClass('dead')) {
        $('#' + id).removeClass('dead');
        $('#' + id).addClass('live');
        deadCount--;
        liveCount++;
    } else {
        $('#' + id).removeClass('live');
        $('#' + id).addClass('dead');
        deadCount++;
        liveCount--;
    }
    updateCount();
}

function frame() {
    let count;
    let td;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            count = 0;

            //top left
            if (isCellLive(i - 1, j - 1))
                count++;
            //top
            if (isCellLive(i - 1, j))
                count++;
            //top right
            if (isCellLive(i - 1, j + 1))
                count++;
            //right
            if (isCellLive(i, j + 1))
                count++;
            //bottom right
            if (isCellLive(i + 1, j + 1))
                count++;
            //bottom
            if (isCellLive(i + 1, j))
                count++;
            //bottom left
            if (isCellLive(i + 1, j - 1))
                count++;
            //left
            if (isCellLive(i, j - 1))
                count++;


            //check if cell is live or died
            if (isCellLive(i, j)) {
                if (count < 2) {
                    $(`#td${i}-${j}`).addClass('will-die');
                } else if (count > 3) {
                    $(`#td${i}-${j}`).addClass('will-die');
                }
            } else {
                if (count == 3) {
                    $(`#td${i}-${j}`).addClass('will-live');
                }
            }

            //end of inner for
        }
        //end of outer for
    }

    let isChange = changeCells();

    //checks if there is change, is so it will stop
    if (!isChange) {
        stop();
    }

    updateCount();
}

function start() {
    let fps = $('#fpsIn').val();
    if (fps === "") {
        fps = 5;
    }
    if (myFp != null) {
        clearInterval(myFp);
    }
    myFp = setInterval(frame, 1000 / fps);
}

function stop() {
    clearInterval(myFp);
    console.log('stoped');
}

function changeCells() {
    let isChange = false;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if ($(`#td${i}-${j}`).hasClass('will-die')) {
                $(`#td${i}-${j}`).removeClass('will-die live');
                $(`#td${i}-${j}`).addClass('dead');
                isChange = true;
                deadCount++;
                liveCount--;
            } else if ($(`#td${i}-${j}`).hasClass('will-live')) {
                $(`#td${i}-${j}`).removeClass('will-live dead');
                $(`#td${i}-${j}`).addClass('live');
                isChange = true;
                liveCount++;
                deadCount--;
            }
        }
    }

    return isChange;
}

function isCellLive(i, j) {
    let td = document.getElementById(`td${i}-${j}`);
    if (td != null) {
        if (td.classList.contains('live')) {
            return true;
        }
    }
    return false;
}

function updateCount() {
    $('#liveCount').text(liveCount);
    $('#deadCount').text(deadCount);
}
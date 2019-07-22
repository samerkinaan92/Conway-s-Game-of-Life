let height, width;
let myFp, liveCount,
    deadCount, genCount;
let stopped = true;
let stateArr;



// initalize the cells width and height
function buildCells() {
    // get values from inputs
    height = $('#height').val();
    width = $('#width').val();


    if (height && width) {
        $('table').empty();
        let tr;
        let stateArr = [];
        for (let i = 0; i < height; i++) {
            stateArr[i] = [];
            $('table').append(`<tr></tr>`);
            tr = $('tr').last();
            for (let j = 0; j < width; j++) {
                tr.append(`<td id="td${i}-${j}" class='dead' onclick="tdClicked(this.id)"></td>`);
                stateArr[i][j] = 0;
            }
        }


        //init dead and live count
        deadCount = height * width;
        liveCount = 0;
        genCount = 0;
        updateCount();


        $('.control').show();
    } else {
        alert('Please enter width and height!');
    }
}


//cell click handler
function tdClicked(id) {
    if (stopped) {
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
}


//frame calculation
function frame() {
    let count;
    let td;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            count = 0;

            //top left
            if (isCellLive(i - 1, j - 1)) { count++; }
            //top
            if (isCellLive(i - 1, j)) { count++; }
            //top right
            if (isCellLive(i - 1, j + 1)) { count++; }
            //right
            if (isCellLive(i, j + 1)) { count++; }
            //bottom right
            if (isCellLive(i + 1, j + 1)) { count++; }
            //bottom
            if (isCellLive(i + 1, j)) { count++; }
            //bottom left
            if (isCellLive(i + 1, j - 1)) { count++; }
            //left
            if (isCellLive(i, j - 1)) { count++; }


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

    const isChange = changeCells();

    //checks if there is change, is so it will stop
    if (!isChange) {
        stop();
    }
    genCount++;
    updateCount();
}

//start click handler
function start() {
    let fps = $('#fpsIn').val();
    if (fps === "") {
        fps = 5;
    }
    if (myFp != null) {
        clearInterval(myFp);
    }
    myFp = setInterval(frame, 1000 / fps);
    stopped = false;
}

//stop click handler
function stop() {
    clearInterval(myFp);
    console.log('stoped');
    stopped = true;
    $('#stopBtn').focus();
}


//changes the cells after the frame calculation have finished
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


//checks if the (i,j) cell is alive
function isCellLive(i, j) {
    let td = document.getElementById(`td${i}-${j}`);
    if (td != null) {
        if (td.classList.contains('live')) {
            return true;
        }
    }
    return false;
}


//updates the cells count text on screen
function updateCount() {
    $('#liveCount').text(liveCount);
    $('#deadCount').text(deadCount);
    $('#genCount').text(genCount);
}

function randomCells() {
    deadCount = width * height;
    liveCount = 0;
    genCount = 0;
    stop();
    let randPer = $('#randNum').val();
    if (randPer < 0) {
        randPer = 0;
    }
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            rand = Math.floor(Math.random() * 100);
            if (rand >= randPer) {
                $(`#td${i}-${j}`).removeClass('live');
                $(`#td${i}-${j}`).addClass('dead');
            } else {
                $(`#td${i}-${j}`).removeClass('dead');
                $(`#td${i}-${j}`).addClass('live');
                liveCount++;
                deadCount--;
            }
        }
    }

    updateCount();
}
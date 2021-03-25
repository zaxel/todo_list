let dotDraw;
function dotsDraw(){
    let signsNumber = 0;
    dotDraw = setInterval(()=>{
        signsNumber++;
        if(signsNumber === 20) {
            status.innerHTML = '';
            signsNumber = 0;
        }
        status.innerHTML += ' *'
    }, 100) 
}

function stopDotDraw(){
    clearInterval(dotDraw);
}
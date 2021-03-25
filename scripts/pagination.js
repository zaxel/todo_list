// this is the best way I could do pagination without server giving me total amount of tasks stored on server. I have always to get all of them and then just render those I need
let pageCurrent = 1; 

function paginationDraw(data){
    let itemsAmount = data.length;
    let itemsOnPage = document.querySelector('.pagination_select').value;
    let pageNumbers = document.querySelector('.pageNumbers_cont');
    let paginationContainer = document.querySelector('.pagination_outcont');
    let nextBtn = document.querySelector('.jumpToNext');
    let prevBtn = document.querySelector('.jumpToPrev');
    let paginButtons = document.querySelector('.pagination_cont').querySelectorAll('button');
    paginButtons.forEach(btn => {
        btn.classList.remove('stayDisabled');
        btn.disabled = false;
    });

    if(itemsAmount===0){
        paginationContainer.classList.add('inactive');
    }else if(itemsAmount>0){
        paginationContainer.classList.remove('inactive');
        pageRender();
    }else(
        console.log('something went wrong in paginationDraw function')
    )

    const form = document.querySelector('form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      console.log('Form submission cancelled.');
    });

    function pageRender(){
        pageNumbers.innerHTML = '';
        pageNumber = Math.ceil(itemsAmount/itemsOnPage);
        if(pageNumber<4){
            for(let i = 1; i <= pageNumber; i++){
                pageNumbers.innerHTML += `
                    <button class="pageNbBtn" id="pgn${i}">${i}</button>
                `;
            }
            nextBtn.classList.add('stayDisabled');
            prevBtn.classList.add('stayDisabled');
            nextBtn.disabled = true;
            prevBtn.disabled = true;
        }
        else if (pageNumber >= 4) {
            if (pageCurrent === 1) {
                for (let i = 1; i <= 3; i++) {
                    pageNumbers.innerHTML += `
                    <button class="pageNbBtn" id="pgn${i}">${i}</button>
                `;
                }
                pageNumbers.innerHTML += `
                    <div class="pageNbDots">...</div>
                    <button class="pageNbBtn" id="pgn${pageNumber}">${pageNumber}</button>
                    `;
                prevBtn.classList.add('stayDisabled');
                prevBtn.disabled = true;
            }
            else if (pageCurrent > 1 && pageCurrent < 4) {
                for (let i = 1; i <= +pageCurrent + +1; i++) {
                    pageNumbers.innerHTML += `
                    <button class="pageNbBtn" id="pgn${i}">${i}</button>
                `;
                }
                pageNumbers.innerHTML += `
                    <div class="pageNbDots">...</div>
                    <button class="pageNbBtn" id="pgn${pageNumber}">${pageNumber}</button>
                    `;
            }
            else if (pageCurrent >= 4 && pageCurrent <= pageNumber-3) {
                pageNumbers.innerHTML += `
                    <button class="pageNbBtn" id="pgn1">1</button>
                    <div class="pageNbDots">...</div>
                `;
                for (let i = pageCurrent - 1; i <= +pageCurrent + +1; i++) {
                    pageNumbers.innerHTML += `
                    <button class="pageNbBtn" id="pgn${i}">${i}</button>
                `;

                }
                pageNumbers.innerHTML += `
                    <div class="pageNbDots">...</div>
                    <button class="pageNbBtn" id="pgn${pageNumber}">${pageNumber}</button>
                    `;
            }
            else if (pageCurrent > pageNumber-3 && pageCurrent<=pageNumber-1) {
                pageNumbers.innerHTML += `
                    <button class="pageNbBtn" id="pgn1">1</button>
                    <div class="pageNbDots">...</div>
                `;
                for (let i = pageCurrent - 1; i <= pageNumber - 1; i++) {
                    pageNumbers.innerHTML += `
                    <button class="pageNbBtn" id="pgn${i}">${i}</button>
                `;
                }
                pageNumbers.innerHTML += `
                    <button class="pageNbBtn" id="pgn${pageNumber}">${pageNumber}</button>
                    `;
            }
            else if (pageCurrent===pageNumber) {
                pageNumbers.innerHTML += `
                    <button class="pageNbBtn" id="pgn1">1</button>
                    <div class="pageNbDots">...</div>
                `;
                for (let i = pageCurrent - 2; i <= pageNumber; i++) {
                    pageNumbers.innerHTML += `
                    <button class="pageNbBtn" id="pgn${i}">${i}</button>
                `;
                }
                nextBtn.classList.add('stayDisabled');
                nextBtn.disabled = true;
            }
            else{
                console.log('error on pagination')
            }
        }
        else{
            console.log('some error occurred while pagination drawing');
        }

        let pagButtons = document.querySelector('.pagination_cont').querySelectorAll('button');
        pagButtons.forEach(pageBtn => {
            if(+pageBtn.id.substr(3) === pageCurrent){
                pageBtn.classList.add('stayDisabled');
                pageBtn.disabled = true;
            }
        });

        tasksDraw(data, pageCurrent, itemsOnPage, itemsAmount)
        paginationListener();
    }
    
    function paginationListener(){
        let pagButtons = document.querySelector('.pagination_cont').querySelectorAll('button');
        pagButtons.forEach(pageBtn => {
            pageBtn.addEventListener('click', function(e) {
                onPaginClick(pageBtn);
            })
        });
    }

    function onPaginClick(pageBtn) {
        if(pageBtn.id === 'pgnPrev'){
            pageCurrent = 1;
        }
        else if(pageBtn.id === 'pgnNext'){
            pageCurrent = +pageNumber;
        }
        else {
            pageCurrent = +pageBtn.id.substr(3);
        }
        tasksDraw(data, pageCurrent, itemsOnPage, itemsAmount)
        paginationDraw(data);
    }
}
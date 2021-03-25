let setTaskBt = document.querySelector('.setTask');
let getWidgetBt = document.querySelector('.getWidget');
let getTitleInput = document.querySelector('.taskTitle');
let status = document.querySelector('.inp_status');
let currentTaskValue = '';
let taskRunning = false;
let widgetId = 101;

getWidgetBt.addEventListener('click', function(e){
    pageCurrent = 1;
    setBtnsState(true);
    getTasks();
    dotsDraw();
})

setTaskBt.addEventListener('click', function(e){
        setBtnsState(true);
        dotsDraw();
        let promise = setTask(widgetId, getTitleInput.value);
        promise.then(onTaskSet)
        .then(getTasks)
})

function getTasks(){
    let promise = getWidget(widgetId);
    promise.then(onWidgetReceived);
}

function onWidgetReceived(data){
    stopDotDraw();
    setBtnsState(false);
    if(data.length > 0){
        paginationDraw(data);
    }else{
        statusSet('No tasks to display');
        clearStatus();
    }
}

function tasksDraw(data, pageCurrent, itemsOnPage, itemsAmount){
    let tasksContainer = document.querySelector('.tasks_container');
    tasksContainer.innerHTML = '';
    let itemRenderStart = 0;
    let numberRenderStop = 0;
    itemRenderStart = pageCurrent*itemsOnPage-(itemsOnPage-1);
    numberRenderStop = +itemRenderStart + +itemsOnPage; // + making js calc it as numbers

    for (let i = itemRenderStart; i < numberRenderStop && i <= itemsAmount; i++){
        tasksContainer.innerHTML +=
        `<div id="${data[i-1].id}" class="task_title_cont">
            <div class="task_line">
                <span class="task_number">${i}</span>: <span class="task_title">${data[i-1].title}</span> 
                <input class="task_input inactive" type="text">
            </div>
            <button class="task_del_bn"></button>
        </div>`;
    }
    statusSet('Tasks list updated');
    clearStatus();
    taskDel();
    taskEditBts();
}

function onTaskDel(){
    stopDotDraw();

    statusSet('task deleted');
    clearStatus()
        .then(function() {
            if(taskRunning){
                dotsDraw();
            }
        });
}

function onTaskSet(){
    stopDotDraw();
    statusSet('task added');
    getTitleInput.value = ''
    clearStatus()
    .then(function() {
        if(taskRunning){
            dotsDraw();
        }
    });
}

function onTaskEdit(){
    stopDotDraw();
    statusSet('task edited');
    clearStatus();
    getTitleInput.value = '';
}

function clearStatus() {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            status.innerHTML = '';
            resolve();
        },1000);
    })
}

function statusSet(text){
    status.innerHTML = text;
}

function taskDel(){
   let taskDelBts = document.querySelectorAll('.task_del_bn');
    if(taskDelBts.length > 0){
        taskDelBts.forEach(button => {
            button.addEventListener('click', function(e){
                setBtnsState(true);
                dotsDraw();
                let taskDelBnId = button.closest('.task_title_cont').id;
                let promiseDel = delTask(widgetId, taskDelBnId);
                promiseDel.then(onTaskDel)
                .then(getTasks)
            })
        });
    }  
}

function taskEditBts(){
    let taskEditBts = document.querySelectorAll('.task_line');
    if(taskEditBts.length > 0){
        taskEditBts.forEach(button => {
            button.addEventListener('click', function(e){
                if(!taskRunning){
                    setTaskBtnEdit(button);
                }
            })
        });
    }  
}

function setTaskBtnEdit(button){
    setBtnsState(true);
    let removeActiveTaskInp = document.querySelectorAll('.task_line');
    let taskBtnId = button.closest('.task_title_cont').id;
    let taskValue = '';

    if(removeActiveTaskInp.length>0){
        removeActiveTaskInp.forEach(el => {
            el.querySelector('.task_title').classList.remove('inactive');
            el.querySelector('.task_input').classList.add('inactive');
        })
    }

    button.querySelector('.task_title').classList.add('inactive');
    let inputTask = button.querySelector('.task_input');
    inputTask.classList.remove('inactive');
    inputTask.focus();
    taskValue = inputTask.closest('.task_line').querySelector('.task_title').innerHTML;
    inputTask.value = taskValue;
    taskBtnEdit(inputTask, taskValue, taskBtnId);
}

function taskBtnEdit(inputTask, taskValue, taskBtnId){
    inputTask.addEventListener('focusout', (e) => {
        inputTask.classList.add('inactive');
        inputTask.closest('.task_line').querySelector('.task_title').classList.remove('inactive');
        currentTaskValue = inputTask.value;
        if(taskValue !== currentTaskValue){
            dotsDraw();
            let promiseEdit = editTask(widgetId, taskBtnId, currentTaskValue);
            promiseEdit.then(onTaskBtnEdited)
            .then(onTaskEdit)
            .then(()=>{setBtnsState(false)})
        }else{
            console.log('leave as it is')
            setBtnsState(false);
        }
    });
}

function onTaskBtnEdited(taskId){
    let titleBtn  = document.getElementById(taskId).querySelector('.task_title').innerHTML = currentTaskValue;
}

function setBtnsState(state){
    taskRunning = state;
    let btns = document.querySelectorAll('button');
    if(btns.length>0 && state){
        btns.forEach(btn => {
            btn.disabled = true;
        });
    }else{
        btns.forEach(btn => {
            if(!btn.classList.contains('stayDisabled'))
            btn.disabled = false;
        });
    }
}

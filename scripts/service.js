
function getWidget(id, count=200, page=1){
   return axios.get(`https://repetitora.net/api/JS/Tasks?widgetId=${id}&count=${count}&page=${page}`)
    .then((response)=>{
        return response.data;
    })
}

function setTask(id, title){
   return axios.post('https://repetitora.net/api/JS/Tasks',
      {
         widgetId: id,
         title: title
      }
   )
}

function delTask(id, taskId){
   return axios.delete(`https://repetitora.net/api/JS/Tasks?widgetId=${id}&taskId=${taskId}`)
}

function editTask(id, taskId, title){
   return axios.put('https://repetitora.net/api/JS/Tasks',
   {widgetId: id,
   taskId: taskId,
    title: title})
   .then(() => {
       return taskId;
   })
}
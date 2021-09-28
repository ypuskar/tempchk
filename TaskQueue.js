module.exports = TaskQueue;
var taskWorker;
var queue = [];

function TaskQueue(worker) {
    taskWorker = worker;
    }

var processTask = function () {
    var taskParams = queue[0];
     taskWorker(taskParams, dequeue);
}
//This is passed to the taskWorker as
//its callback function.
var dequeue = function () {
    queue.splice(0, 1);
    if (queue.length > 0) {
        processTask();
    }
}

TaskQueue.prototype.queueTask = function (taskParams) {
    //Add task to queue
    var length = queue.push(taskParams);
    //if queue was empty
    if (length == 1) {
        processTask();
    }
    //else, wait for the current task to call dequeue
    //when it completes
}




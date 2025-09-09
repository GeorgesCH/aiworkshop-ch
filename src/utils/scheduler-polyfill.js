// Scheduler polyfill for framer-motion + React 18 compatibility
// This provides a complete scheduler implementation that framer-motion expects

let currentTime = 0;
let isYielding = false;

function getCurrentTime() {
  return performance.now();
}

function shouldYieldToHost() {
  return isYielding;
}

function requestPaint() {
  // No-op in this polyfill
}

function forceFrameRate(fps) {
  // No-op in this polyfill  
}

// Priority levels
const ImmediatePriority = 1;
const UserBlockingPriority = 2;
const NormalPriority = 3;
const LowPriority = 4;
const IdlePriority = 5;

let taskIdCounter = 1;
let taskQueue = [];
let timerQueue = [];
let isHostCallbackScheduled = false;
let isPerformingWork = false;

function scheduleCallback(priorityLevel, callback, options) {
  const currentTime = getCurrentTime();
  
  let startTime;
  if (typeof options === 'object' && options !== null) {
    const delay = options.delay;
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  let timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = -1;
      break;
    case UserBlockingPriority:
      timeout = 250;
      break;
    case IdlePriority:
      timeout = 1073741823;
      break;
    case LowPriority:
      timeout = 10000;
      break;
    case NormalPriority:
    default:
      timeout = 5000;
      break;
  }

  const expirationTime = startTime + timeout;

  const newTask = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  };

  if (startTime > currentTime) {
    newTask.sortIndex = startTime;
    timerQueue.push(newTask);
    if (taskQueue.length === 0 && newTask === timerQueue[0]) {
      setTimeout(() => {
        advanceTimers(newTask.startTime);
        requestHostCallback(flushWork);
      }, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    taskQueue.push(newTask);
    taskQueue.sort((a, b) => a.sortIndex - b.sortIndex);
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}

function cancelCallback(task) {
  if (task) {
    task.callback = null;
  }
}

function advanceTimers(currentTime) {
  while (timerQueue.length > 0) {
    const timer = timerQueue[0];
    if (timer.callback === null) {
      timerQueue.shift();
    } else if (timer.startTime <= currentTime) {
      timerQueue.shift();
      timer.sortIndex = timer.expirationTime;
      taskQueue.push(timer);
      taskQueue.sort((a, b) => a.sortIndex - b.sortIndex);
    } else {
      return;
    }
  }
}

function flushWork(hasTimeRemaining, initialTime) {
  isHostCallbackScheduled = false;
  isPerformingWork = true;

  try {
    return workLoop(hasTimeRemaining, initialTime);
  } finally {
    isPerformingWork = false;
  }
}

function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  
  let currentTask = taskQueue[0];
  while (currentTask !== undefined) {
    if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost())) {
      break;
    }
    
    const callback = currentTask.callback;
    if (typeof callback === 'function') {
      currentTask.callback = null;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      
      try {
        const continuationCallback = callback(didUserCallbackTimeout);
        currentTime = getCurrentTime();
        if (typeof continuationCallback === 'function') {
          currentTask.callback = continuationCallback;
        } else {
          taskQueue.shift();
        }
      } catch (error) {
        taskQueue.shift();
        throw error;
      }
    } else {
      taskQueue.shift();
    }
    
    advanceTimers(currentTime);
    currentTask = taskQueue[0];
  }
  
  if (currentTask !== undefined) {
    return true;
  } else {
    const firstTimer = timerQueue[0];
    if (firstTimer !== undefined) {
      setTimeout(() => {
        advanceTimers(firstTimer.startTime);
        requestHostCallback(flushWork);
      }, firstTimer.startTime - currentTime);
    }
    return false;
  }
}

function requestHostCallback(callback) {
  setTimeout(() => callback(true, getCurrentTime()), 0);
}

function getCurrentPriorityLevel() {
  return NormalPriority;
}

// Export the scheduler interface
export const unstable_now = getCurrentTime;
export const unstable_scheduleCallback = scheduleCallback;
export const unstable_cancelCallback = cancelCallback;
export const unstable_shouldYield = shouldYieldToHost;
export const unstable_requestPaint = requestPaint;
export const unstable_getCurrentPriorityLevel = getCurrentPriorityLevel;
export const unstable_forceFrameRate = forceFrameRate;

export const unstable_ImmediatePriority = ImmediatePriority;
export const unstable_UserBlockingPriority = UserBlockingPriority;
export const unstable_NormalPriority = NormalPriority;
export const unstable_LowPriority = LowPriority;
export const unstable_IdlePriority = IdlePriority;

// Default export for compatibility
export default {
  unstable_now: getCurrentTime,
  unstable_scheduleCallback: scheduleCallback,
  unstable_cancelCallback: cancelCallback,
  unstable_shouldYield: shouldYieldToHost,
  unstable_requestPaint: requestPaint,
  unstable_getCurrentPriorityLevel: getCurrentPriorityLevel,
  unstable_forceFrameRate: forceFrameRate,
  unstable_ImmediatePriority: ImmediatePriority,
  unstable_UserBlockingPriority: UserBlockingPriority,
  unstable_NormalPriority: NormalPriority,
  unstable_LowPriority: LowPriority,
  unstable_IdlePriority: IdlePriority,
};

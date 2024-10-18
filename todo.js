
/*MIT License

Copyright (c) 2024 youngitunesog

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

class TodoListCtrl {
    constructor() {
        this._taskList = [];
        this._reminderSound = new Audio('https://commondatastorage.googleapis.com/codeskulptor-assets/Evillaugh.ogg');
        this._bindUI();
    }

    _bindUI() {
        this._parentEl = document.querySelector('.artp'); 
        this._inputEls = [...document.querySelectorAll('#all .mtodo')]; 
        this._formEl = document.querySelector('#all'); 
        this._submitBtn = this._formEl.querySelector('#add'); 
        
        this._hookEvents();
    }
 
    _hookEvents() {
        this._replaceBtn();
        this._formEl.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this._submitBtn.value === "Add") {
                this._createTask();
            }
        });
    }

    _replaceBtn() {
        const _clonedBtn = this._submitBtn.cloneNode(true);
        this._submitBtn.replaceWith(_clonedBtn);
        this._submitBtn = _clonedBtn;
    }
    _startReminderCheck(task) {
      
    const checkInterval = setInterval(() => {
        // If reminder has already been triggered, stop checking
        if (task.reminderTriggered) {
            clearInterval(checkInterval);
            return;
        }

        
let dck = new Date();
  dck.setSeconds(0);
  let dck1 = dck.toLocaleString('en-US', {
    
      second: undefined, // This removes the seconds
      hour12: true // Optional, for 12-hour clock format
    });
        
      
        
        if (dck1 === task.deadline  && task.setreminder) {
     let taskalert = "This is To Remind you about your todo list Task: " + task.task;
     
     alert(taskalert)
            this._playReminderSound();
          task.reminderTriggered = true;
        }
    }, 1000); // Check every second
}

    _playReminderSound() {
  /*  const sound = new Audio('https://commondatastorage.googleapis.com/codeskulptor-assets/Evillaugh.ogg'); // Example of an online sound file
  //  sound.play().catch(error => console.error('Failed to play sound:', error));
    sound.play().catch(error => {
      console.error('Failed to play sound:', error);
      alert('Reminder sound could not be played.');
    });*/
    
    
    this._reminderSound.play().catch(error => {
            console.error('Failed to play sound:', error);
            alert('Reminder sound could not be played.');
        });
    
}



_pauseReminderSound() {
    this._reminderSound.pause();
        this._reminderSound.currentTime = 0;  // Optionally reset to the start of the sound
}


    
    _setReminder(id, btn) {
    // Remove existing event listener if any, by replacing the button with a clone
    const clonedBtn = btn.cloneNode(true);
    btn.replaceWith(clonedBtn);
    
    const icon = clonedBtn.querySelector('i'); // Select the inner icon

    clonedBtn.addEventListener('click', () => {
      let reminderupdate = this._taskList.find(item => item.id === id);

        if (icon.textContent === 'alarm_on') {
            icon.textContent = 'alarm_off'; // Toggle to alarm_off
           this._pauseReminderSound();
                  Object.assign(reminderupdate, { setreminder:false });
icon.classList.toggle('active'); // Toggle active class for styling
        } else {
            icon.textContent = 'alarm_on'; // Toggle back to alarm_on
                  Object.assign(reminderupdate, { setreminder:true });
                  //this._playReminderSound();
                  this._startReminderCheck(reminderupdate);
icon.classList.toggle('active'); // Toggle active class for styling
       
        }
        
    
    },{once:false});
}
    _formattoreadable(taskTime){
      let dck = new Date(taskTime);
      dck.setSeconds(0);
      let dck1 = dck.toLocaleString('en-US', {
      
        second: undefined, // This removes the seconds
        hour12: true // Optional, for 12-hour clock format
      });
      return dck1
    }
    
    _createTask() {
        const [taskDesc, taskTime] = this._inputEls.map(el => el.value.trim());

        if (!taskDesc || !taskTime) return;
  let dck = this._formattoreadable(taskTime);
        const taskObj = {
            id: this._genID(10),
            task: taskDesc,
            deadline: dck,
            createdAt: this._getFormattedDate(),
            editable: false,
            setreminder: true,
            reminderTriggered:false
        };
this._startReminderCheck(taskObj);
        this._taskList.unshift(taskObj);
        this._formEl.reset();
        this._renderTasks();
    }

    _toggleEdit(taskID) {
        const taskObj = this._taskList.find(task => task.id === taskID);
        taskObj.editable = !taskObj.editable;

        this._submitBtn.value = 'commit';
        this._submitBtn.style.backgroundColor = 'yellow';

        const clonedBtn = this._submitBtn.cloneNode(true);
        this._submitBtn.replaceWith(clonedBtn);
        this._submitBtn = clonedBtn;

        this._submitBtn.addEventListener('click', () => {
            this._commitChanges(taskID, this._inputEls[0].value.trim(), this._inputEls[1].value.trim());
        });

        this._renderTasks();
    }

    _commitChanges(taskID, updatedTask, updatedTime) {
        const taskObj = this._taskList.find(task => task.id === taskID);
   let  tT   = this._formattoreadable(updatedTime);
        Object.assign(taskObj, { task: updatedTask, deadline: tT, editable: false, setreminder: true,reminderTriggered: false });
          
          console.log(taskObj)
          
    this._startReminderCheck(taskObj);
        this._submitBtn.value = 'Add';
        this._submitBtn.style.backgroundColor = 'lightblue';
        this._hookEvents();
        this._renderTasks();
        this._formEl.reset();
    } 

    _removeTask(taskID) {
        this._taskList = this._taskList.filter(task => task.id !== taskID);
        this._renderTasks();
    }

    _genID(length) {
        return [...Array(length)].map(() => Math.floor(Math.random() * length)).join('');
    }

    _getFormattedDate() {
       
        let date = new Date();
         date.setSeconds(0);
let formattedDate = date.toLocaleString('en-US', {
  
  second: undefined, // This removes the seconds
  hour12: true // Optional, for 12-hour clock format
});
return formattedDate;
    }

    _renderTasks() {
        this._parentEl.innerHTML = '';
        
        this._taskList.forEach(({ id, task, deadline, createdAt, editable }) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('chi');
            taskItem.innerHTML = `
                <small class="small">${createdAt}</small>
                <h3 class="h3" data-value="${task}">${task}</h3>
                <small class="dlist" time-data="${deadline}">
                    <strong class="dolist">Do-list-@ : </strong> ${deadline}
                </small>
            `;

            if (editable) {
               this._inputEls[0].value = task;
               const formattedDeadline = new Date(deadline).toISOString().slice(0, 16);

                this._inputEls[1].value = formattedDeadline;
                
             
            }

            const editBtn = this._createButton('edit', 'edit', () => this._toggleEdit(id));
            const deleteBtn = this._createButton('delete', 'delete', () => this._removeTask(id));
            const reminder = this._createButton('alarm', '<i class="material-icons alarm-icon" id="alarmIcon">alarm_on</i>',() =>this._setReminder(id,reminder));
      
            taskItem.appendChild(reminder);
            taskItem.appendChild(deleteBtn);
            taskItem.appendChild(editBtn);
            this._parentEl.appendChild(taskItem);
        });
    }

    _createButton(type, tdata, eventHandler) {
        const btn = document.createElement('button');
        btn.setAttribute('id', type);
        btn.classList.add('btn');
        btn.innerHTML = tdata;
 
        btn.addEventListener('click', eventHandler);
       
        return btn;
    }
}

document.addEventListener('DOMContentLoaded', () => new TodoListCtrl()); 
  
  

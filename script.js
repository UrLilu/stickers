'use strict'

document.addEventListener('DOMContentLoaded', ()=>{
const stickyArea =document.querySelector('#sticky-container')
const createBtn =document.querySelector('#createbtn')
const stickyTitleInput =document.querySelector('#stickytitle')
const stickyTextInput =document.querySelector('#stickytext')

function createSticky(){
    const newSticky =document.createElement('div')

    const html=`<h3>${stickyTitleInput.value} </h3>
<p>${stickyTextInput.value}</p>
<span class='deletesticky'>&times;</span>`;

newSticky.classList.add('sticky')
newSticky.innerHTML= html
stickyArea.append(newSticky)
}

createBtn.addEventListener('click', createSticky)

});
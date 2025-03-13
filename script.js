'use strict'

document.addEventListener('DOMContentLoaded', ()=>{
const stickyArea =document.querySelector('#sticky-container')
const createBtn =document.querySelector('#createbtn')
const stickyTitleInput =document.querySelector('#stickytitle')
const stickyTextInput =document.querySelector('#stickytext')
const trashArea = document.querySelector('#trash-container');
const clearTrashBtn = document.querySelector('#clearTrash');
if (clearTrashBtn) {
    clearTrashBtn.addEventListener('click', clearTrash);
};

//функция для создания заметки
function createSticky(title, text){
    const newSticky =document.createElement('div')
    const html=`<div class ='sticky-header'>
    <span class='deletesticky'>&times;</span>
    <h3 class="drag">${title} </h3>
    <p>${text}</p>
 </div>
 <button class='restorebtn' style='display:none;'>Восстановить</button>`;
newSticky.classList.add('sticky')
newSticky.innerHTML= html
stickyArea.append(newSticky);
positionSticky(newSticky);
applyDeleteListener();
applyRestoreListener(newSticky); // Применяем слушатель для кнопки восстановления
clearStickyForm()
}

//функция для очистки формы
function clearStickyForm (){
    stickyTitleInput.value= '';
    stickyTextInput.value='';
}

// Функция для удаления заметки
const deletesticky=e=>{
   const sticky= e.target.closest('.sticky');
   stickyArea.removeChild(sticky);
   document.querySelector('.trash-content').appendChild(sticky);  // Перемещаем заметку в корзину
sticky.querySelector('.restorebtn').style.display = 'block'; // Показываем кнопку восстановления
        saveStickers();
}
// Функция для очищения корзины
function clearTrash() {
    const trashContent = document.querySelector('.trash-content');
    while (trashContent.firstChild) {
        trashContent.removeChild(trashContent.firstChild); // Удаляем все заметки
    }
    saveStickers(); // Обновляем localStorage
}


// Функция для восстановления заметки из корзины
const restoreSticky = e => {
    const sticky = e.target.closest('.sticky');
    const trashContent = document.querySelector('.trash-content')
    trashContent.removeChild(sticky);
    stickyArea.appendChild(sticky);// Возвращаем заметку обратно
    sticky.querySelector('.restorebtn').style.display = 'none'; // Скрываем кнопку восстановления
    positionSticky(sticky); 
    applyDragListeners(sticky); //  функция для слушателей
    saveStickers();
}
function applyDragListeners(sticky) {
    const dragElement = sticky.querySelector('.drag');
    dragElement.addEventListener('mousedown', initDrag);
}
function initDrag(e) {
    if (!e.target.classList.contains('drag')) return;
    
    dragTarget = e.target.closest('.sticky');
    LastOffSetX = e.offsetX;
    LastOffSetY = e.offsetY;
    isDragging = true;
}
// Функция для применения слушателей на кнопки удаления
function applyDeleteListener(){
    document.querySelectorAll('.deletesticky').forEach(button=> {
        button.removeEventListener('click',deletesticky); //удалить предыдущий обработчик
        button.addEventListener('click', deletesticky); //добавить новый обработчик
    })
}
// Функция для применения слушателей на кнопки восстановления
function applyRestoreListener(sticky) {
    const restoreButton = sticky.querySelector('.restorebtn');
    restoreButton.removeEventListener('click', restoreSticky); // удалить предыдущий обработчик
    restoreButton.addEventListener('click', restoreSticky); // добавить новый обработчик
}


let isDragging=false; //отслеживание перетаскивания на странице
let dragTarget = null; //переменная для текущего перетаскивания элемента
let LastOffSetX =0;
let LastOffSetY =0; //переменные для хранения последних координат смещения элемента

// Функция для перетаскивания заметок
function drag(e){
    if (!isDragging) return;

    const x=e.clientX-LastOffSetX
    const y=e.clientY-LastOffSetY

    dragTarget.style.left=`${x}px`
    dragTarget.style.top=`${y}px`
}

window.addEventListener('mousedown', e=>{
    if(!e.target.classList.contains('drag'))
        return;


dragTarget=e.target.closest('.sticky');
const rect = dragTarget.getBoundingClientRect();
LastOffSetX = e.clientX - rect.left;
LastOffSetY = e.clientY - rect.top;

isDragging= true;
dragTarget.style.zIndex = '9999';

});

window.addEventListener('mousemove',drag)
window.addEventListener('mouseup', ()=>{
    if(isDragging) {
        isDragging=false;
        dragTarget= null;
    }
})

// Функция для позиционирования заметок
function positionSticky (sticky){
    sticky.style.left= window.innerWidth/2-sticky.clientWidth/2 +Math.round((-100+Math.random()*50)) + 'px'

    sticky.style.top = window.innerHeight/2-sticky.clientHeight/2 +Math.round((-100+Math.random()*50)) + 'px'

}

// Функция для сохранения заметок в localStorage
function saveStickers() {
    const stickers = [];
    document.querySelectorAll('.sticky').forEach(sticky => {
        const title = sticky.querySelector('h3').innerText;
        const text = sticky.querySelector('p').innerText;
        const position = {
            left: sticky.style.left,
            top: sticky.style.top
        };
        stickers.push({ title, text, position });
    });
    localStorage.setItem('stickers', JSON.stringify(stickers));
        }


// Функция для загрузки заметок из localStorage
function loadStickers() {
    const stickers = JSON.parse(localStorage.getItem('stickers')) || [];
    stickers.forEach(sticker => {
        createSticky(sticker.title, sticker.text);
        const lastSticky = stickyArea.lastElementChild; // получаем только что созданную заметку
            lastSticky.style.left = sticker.position.left;
            lastSticky.style.top = sticker.position.top; // устанавливаем позицию
        });
    }


applyDeleteListener()
createBtn.addEventListener('click', () => {
    createSticky(stickyTitleInput.value, stickyTextInput.value);
    saveStickers(); // Сохраняем новые заметки в localStorage
    clearStickyForm();
});

loadStickers(); // Загружаем заметки из localStorage при загрузке страницы
});

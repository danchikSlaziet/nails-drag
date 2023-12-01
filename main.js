const firstPage = document.querySelector('.first-page');
const firstPageButton = firstPage.querySelector('.first-page__button');
const secondPage = document.querySelector('.second-page');
const secondPageButton = secondPage.querySelector('.second-page__button');
const secondPageInput = secondPage.querySelector('.second-page__input');
const secondPageLabel = secondPage.querySelector('.second-page__label');
const secondPageText = secondPage.querySelector('.second-page__text');
const thirdPage = document.querySelector('.third-page');
const thirdPageButton = thirdPage.querySelector('.third-page__button');
const fourthPage = document.querySelector('.fourth-page');
const fourthPageVideo = fourthPage.querySelector('.fourth-page__video');
const fourthPageButton = fourthPage.querySelector('.fourth-page__button');
const fourthPageInfo = fourthPage.querySelector('.fourth-page__info');
const fourthPageTextChoose = fourthPage.querySelector('.fourth-page__text_choose');
const fourthPageScreen = fourthPage.querySelector('.fourth-page__screen');
const nailButtons = fourthPage.querySelectorAll('.fourth-page__circle');
const finalPage = document.querySelector('.final-page');
const finalPageIMG = finalPage.querySelector('.final-page__img');
// const finalPageSendButton = finalPage.querySelector('.final-page__send-button');
const endPage = document.querySelector('.end-page');
const endPageButton = endPage.querySelector('.end-page__button');

const infoPage = document.querySelector('.info-page');
const infoPageButton = document.querySelector('.info-page__button');

const nailsBlock = document.querySelector('.nails-block')
const nails = nailsBlock.querySelectorAll('.nail');


// additional constants for debug and help
const hiddenIMG = document.querySelector('.hidden-image');
const nailsSliced = document.querySelector('.nails-sliced');

const botToken = '6905480197:AAH7vIDyN7NwzdmlUlN3Fpaq5BeYwf6wuS0';
let userChatId = '';
const photoPath = './images/logo.png';
const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;


// ================ FETCH ==================

class Api {
  constructor({baseUrl, secondUrl, thirdUrl, fourthUrl}) {
    this._baseUrl = baseUrl;
    this._secondUrl = secondUrl;
    this._thirdUrl = thirdUrl;
    this._fourthUrl = fourthUrl;
  }

  _getFetch(url, options) {
    return fetch(url, options)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка ${res.status}`)
      });
  }

  sendStatistics(data, name) {
    let params;
    if (data["last_name"] === '' && data["username"] === '') {
      params = {
        "name": name,
        "id": parseInt(data["id"]),
        "first_name": data["first_name"],
      }
    }
    else if (data["last_name"] !== '' && data["username"] === '') {
      params = {
        "name": name,
        "id": parseInt(data["id"]),
        "first_name": data["first_name"],
        "last_name": data["last_name"]
      }
    }
    else if (data["last_name"] === '' && data["username"] !== '') {
      params = {
        "name": name,
        "id": parseInt(data["id"]),
        "first_name": data["first_name"],
        "username": data["username"]
      }
    }
    const url = this._baseUrl;
    const options = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(params)
    }
    return this._getFetch(url, options);
  }

  sendFileId(id, fileId) {
    const params = {
      "id": id,
      "file_id": fileId
    }
    const url = this._secondUrl;
    const options = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(params)
    }
    return this._getFetch(url, options);
  }

  postNumber(id, number) {
    const params = {
      "id": id,
      "number": number
    }
    const url = this._fourthUrl;
    const options = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(params)
    }
    return this._getFetch(url, options);
  }

  getNumber(id) {
    const url = this._thirdUrl + `?id=${id}`;
    const options = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }
    return this._getFetch(url, options);
  }
}

const api = new Api({
  baseUrl: 'https://nails.ilovebot.ru/api/statistics',
  secondUrl: 'https://nails.ilovebot.ru/api/save_file',
  thirdUrl: 'https://nails.ilovebot.ru/api/get_number',
  fourthUrl: 'https://nails.ilovebot.ru/api/set_number'
});

let detect = new MobileDetect(window.navigator.userAgent);

function parseQuery(queryString) {
  let query = {};
  let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

let userData;
let firstTime = true;

window.addEventListener('DOMContentLoaded', () => {
  let app = window.Telegram.WebApp;
  let query = app.initData;
  let user_data_str = parseQuery(query).user;
  let user_data = JSON.parse(user_data_str);
  userData = user_data;
  app.expand();
  app.ready();
  userChatId = user_data["id"];

  api.getNumber(parseInt(userChatId))
    .then((data) => {
      console.log(data);
      if (data === 'Номер есть') {
        firstTime = false;
      }
    })
    .catch(err => console.log(err));

  api.sendStatistics(user_data, 'открытие приложения')
    .then(data => console.log(data))
    .catch(err => console.log(err));
});

document.addEventListener('click', function(event) {
  // Проверяем, был ли клик вне элемента input
  var isClickInsideInput = event.target.tagName === 'INPUT';
  
  // Если клик был вне элемента input, скрываем клавиатуру
  if (!isClickInsideInput) {
    document.activeElement.blur(); // Снимаем фокус с активного элемента (в данном случае, инпута)
  }
});

if (detect.os() === 'iOS') {
  fourthPageButton.textContent = 'Продолжить';
}

console.log(detect.os());

// if (detect.os() === 'iOS') {
//   fourthPageButton.textContent = 'Продолжить'
// }

const phoneMask = new IMask(secondPageInput, {
  mask: "+{7} (000) 000-00-00",
});

function phoneInputHandler() {
  if (phoneMask.masked.isComplete) {
    secondPageButton.disabled = false;
  } else {
    secondPageButton.disabled = true;
  }
}

secondPageInput.addEventListener('input', () => {
  phoneInputHandler();
  api.sendStatistics(userData, 'нажатие на "инпут(ввод номера телефона)" на экране с номером телефона')
    .then(data => console.log(data))
    .catch(err => console.log(err));
})

secondPageInput.addEventListener('focus', () => {
  if (detect.os() === 'iOS') {
    secondPageInput.style.transform = 'translateY(-120px)';
    secondPageLabel.style.transform = 'translateY(-120px)';
    secondPageButton.style.transform = 'translateY(-120px)';
    secondPageText.style.transform = 'translateY(-120px)'; 
  }
});

secondPageInput.addEventListener('blur', () => {
  if (detect.os() === 'iOS') {
    secondPageInput.style.transform = 'translateY(0)';
    secondPageLabel.style.transform = 'translateY(0)';
    secondPageText.style.transform = 'translateY(0)';
    secondPageButton.style.transform = 'translateY(0)';
    window.scrollTo({top: 0, behavior: "smooth"});
  }
});


firstPageButton.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "далее" на 1 экране')
    .then(data => console.log(data))
    .catch(err => console.log(err));
  firstPage.classList.add('first-page_disabled');
  if (firstTime) {
    secondPage.classList.remove('second-page_disabled');
  }
  else {
    fourthPage.classList.remove('fourth-page_disabled');
  }
  if (detect.os() === 'iOS') {
    startCamera();
  }
});

secondPageButton.addEventListener('click', () => {
  secondPage.classList.add('second-page_disabled');
  thirdPage.classList.remove('third-page_disabled');
  api.postNumber(parseInt(userData["id"]), secondPageInput.value)
    .then(data => console.log(data))
    .catch(err => console.log(err));
  api.sendStatistics(userData, 'нажатие на кнопку "проверить подписку МТС premium" на экране с номером телефона')
    .then(data => console.log(data))
    .catch(err => console.log(err));
  // secondPageInput.addEventListener('blur', () => {
  //   if (detect.os() === 'iOS') {
  //     secondPageInput.style.transform = 'translateY(0)';
  //     secondPageLabel.style.transform = 'translateY(0)';
  //     secondPageText.style.transform = 'translateY(0)';
  //     secondPageButton.style.transform = 'translateY(0)';
  //     window.scrollTo({top: 0, behavior: "smooth"});
  //   }
  // });
});

thirdPageButton.addEventListener('click', () => {
  thirdPage.classList.add('third-page_disabled');
  fourthPage.classList.remove('fourth-page_disabled');
  api.sendStatistics(userData, 'нажатие на кнопку "Приступить" на экране 3 экране ("Твой номер записан. Ты можешь создать новое изображение")')
    .then(data => console.log(data))
    .catch(err => console.log(err));
});

async function sendPhoto(assetElement) {
  // Получение ссылки на изображение
  const imageURL = assetElement.src;

  // finalPageSendButton.textContent = 'Отправка ...';

  // Загрузка изображения в бинарном формате
  const response = await fetch(imageURL);
  const imageBlob = await response.blob();

  // Формируем объект FormData для отправки файла
  const formData = new FormData();
  formData.append('chat_id', userChatId);
  formData.append('photo', imageBlob, 'photo.jpg');

  // Формируем URL для отправки фотографии
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

  // Отправка фотографии на сервер Telegram
  try {
      const result = await fetch(apiUrl, {
          method: 'POST',
          body: formData,
      });
      const data = await result.json();
      console.log(data);
      if (data.ok) {
          console.log('Фотография успешно отправлена в Telegram.');
          api.sendFileId(parseInt(userData["id"]), data.result.photo[3].file_id)
            .then(data => console.log(data))
            .catch(err => console.log(err));
          // finalPageSendButton.textContent = 'Отправлено';
      } else {
          console.error('Произошла ошибка при отправке фотографии.');
          // finalPageSendButton.textContent = 'Ошибка';
      }
  } catch (error) {
      console.error('Ошибка:', error);
      // finalPageSendButton.textContent = 'Ошибка';
  }
}

// nails.forEach(nail => {
//   nail.addEventListener('mousedown', startDrag);
//   nail.addEventListener('touchstart', startDragTouch);
// });

// function startDrag(e) {
//   e.preventDefault();

//   const nail = e.target;
//   const offsetX = e.clientX - nail.getBoundingClientRect().left;
//   const offsetY = e.clientY - nail.getBoundingClientRect().top;

//   function dragMove(e) {
//     const x = e.clientX - offsetX;
//     const y = e.clientY - offsetY;

//     nail.style.left = x + 'px';
//     nail.style.top = y + 'px';
//   }

//   function dragEnd() {
//     document.removeEventListener('mousemove', dragMove);
//     document.removeEventListener('mouseup', dragEnd);
//   }

//   document.addEventListener('mousemove', dragMove);
//   document.addEventListener('mouseup', dragEnd);
// }

// function startDragTouch(e) {
//   e.preventDefault();

//   const nail = e.target;
//   const offsetX = e.touches[0].clientX - nail.getBoundingClientRect().left;
//   const offsetY = e.touches[0].clientY - nail.getBoundingClientRect().top;

//   function dragMoveTouch(e) {
//     const x = e.touches[0].clientX - offsetX;
//     const y = e.touches[0].clientY - offsetY;

//     nail.style.left = x + 'px';
//     nail.style.top = y + 'px';
//   }

//   function dragEndTouch() {
//     document.removeEventListener('touchmove', dragMoveTouch);
//     document.removeEventListener('touchend', dragEndTouch);
//   }

//   document.addEventListener('touchmove', dragMoveTouch);
//   document.addEventListener('touchend', dragEndTouch);
// }

nails.forEach(nail => {
  nail.addEventListener('mousedown', startDrag);
  nail.addEventListener('touchstart', startDragTouch);
});

function startDrag(e) {
  e.preventDefault();
  api.sendStatistics(userData, 'перемещение ногтей')
    .then(data => console.log(data))
    .catch(err => console.log(err));
  const nail = e.target;
  const offsetX = e.clientX - parseFloat(getComputedStyle(nail).left);
  const offsetY = e.clientY - parseFloat(getComputedStyle(nail).top);

  function dragMove(e) {
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    nail.style.left = x + 'px';
    nail.style.top = y + 'px';
  }

  function dragEnd() {
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
  }

  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);
}

function startDragTouch(e) {
  e.preventDefault();
  api.sendStatistics(userData, 'перемещение ногтей')
    .then(data => console.log(data))
    .catch(err => console.log(err));
  const nail = e.target;
  const offsetX = e.touches[0].clientX - parseFloat(getComputedStyle(nail).left);
  const offsetY = e.touches[0].clientY - parseFloat(getComputedStyle(nail).top);

  function dragMoveTouch(e) {
    const x = e.touches[0].clientX - offsetX;
    const y = e.touches[0].clientY - offsetY;

    nail.style.left = x + 'px';
    nail.style.top = y + 'px';
  }

  function dragEndTouch() {
    document.removeEventListener('touchmove', dragMoveTouch);
    document.removeEventListener('touchend', dragEndTouch);
  }

  document.addEventListener('touchmove', dragMoveTouch);
  document.addEventListener('touchend', dragEndTouch);
}

fourthPageButton.addEventListener('click', () => { 
  if (fourthPageButton.textContent.trim() === 'Сохранить') {
    api.sendStatistics(userData, 'нажатие на кнопку "Сохранить" на экране с выбором ногтей')
          .then(data => console.log(data))
          .catch(err => console.log(err));

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const scaleFactor = 2;
    tempCanvas.width = fourthPageVideo.clientWidth*scaleFactor;
    tempCanvas.height = fourthPageVideo.clientHeight*scaleFactor;

    const leftSmech = (fourthPageVideo.clientWidth - fourthPageScreen.clientWidth)/2;


    tempCtx.drawImage(fourthPageVideo, 0, 0, tempCanvas.width, tempCanvas.height);

    nails.forEach((nail) => {
      
    tempCtx.drawImage(
      nail,
      (nail.offsetLeft + leftSmech)*scaleFactor,
      nail.offsetTop*scaleFactor,
      nail.width*scaleFactor,
      nail.height*scaleFactor
    ); 
    });

    const dataURL = tempCanvas.toDataURL('image/png', 1.0);

    hiddenIMG.width = fourthPageVideo.clientWidth;
    hiddenIMG.height = fourthPageVideo.clientHeight;
    hiddenIMG.src = dataURL;
    finalPageIMG.src = dataURL;

    fourthPage.classList.add('fourth-page_disabled');
    endPage.classList.remove('end-page_disabled');
    sendPhoto(finalPageIMG);
  }
  if (detect.os() === 'iOS' && fourthPageButton.textContent.trim() === 'Продолжить') {
    api.sendStatistics(userData, 'нажатие на кнопку "Продолжить" на экране с выбором ногтей')
      .then(data => console.log(data))
      .catch(err => console.log(err));
    startCamera();
    fourthPageInfo.classList.add('fourth-page__info_disabled');
    fourthPageTextChoose.style.display = 'none';
    nailsBlock.classList.remove('nails-block_disabled');
    fourthPageButton.textContent = 'Сохранить';
    // if (fourthPageButton.disabled) {
    //   fourthPageButton.textContent = 'Сохранить';
    // }
  }
});

nailButtons.forEach((elem, index) => {
  elem.addEventListener('click', () => {
    fourthPageButton.style.opacity = '1';
    fourthPageButton.disabled = false;
    
    if (detect.os() === 'iOS' && !fourthPageInfo.className.includes('disabled')) {
      try {
        stopCamera();
      }
      catch(err) {
        console.log(err)
      }
    }
    else if (detect.os() !== 'iOS' && !fourthPageVideo.className.includes('active')) {
      startCamera();
      fourthPageTextChoose.style.display = 'none';
      fourthPageInfo.classList.add('fourth-page__info_disabled');
      nailsBlock.classList.remove('nails-block_disabled');
    }
    switch (index) {
      case 0:
        nailButtons[0].src = './images/nail-circle-1-active.svg';
        nailButtons[1].src = './images/nail-circle-2.svg';
        nailButtons[2].src = './images/nail-circle-3.svg';
        nails.forEach((nail, index) => {
          nail.src = `./images/red-${index + 1}.png`;
        });
        api.sendStatistics(userData, 'нажатие на кнопку "Красные ногти" на экране с выбором ногтей')
          .then(data => console.log(data))
          .catch(err => console.log(err));
        break;
      case 1:
        nailButtons[1].src = './images/nail-circle-2-active.svg';
        nailButtons[0].src = './images/nail-circle-1.svg';
        nailButtons[2].src = './images/nail-circle-3.svg';
        nails.forEach((nail, index) => {
          nail.src = `./images/blue-${index + 1}.png`;
        });
        api.sendStatistics(userData, 'нажатие на кнопку "Фиолетовые ногти" на экране с выбором ногтей')
          .then(data => console.log(data))
          .catch(err => console.log(err));
        break;
      case 2:
        nailButtons[2].src = './images/nail-circle-3-active.svg';
        nailButtons[1].src = './images/nail-circle-2.svg';
        nailButtons[0].src = './images/nail-circle-1.svg';
        nails.forEach((nail, index) => {
          nail.src = `./images/gray-${index + 1}.png`;
        });
        api.sendStatistics(userData, 'нажатие на кнопку "Серые ногти" на экране с выбором ногтей')
          .then(data => console.log(data))
          .catch(err => console.log(err));
        break;
    
      default:
        break;
    }
    fourthPageVideo.classList.add('fourth-page__video_active');
    if (!fourthPageVideo.className.includes('active')) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
          console.log('start video around switch case')
          nailsBlock.classList.remove('nails-block_disabled');
          fourthPageVideo.srcObject = stream;
          fourthPageInfo.classList.add('fourth-page__info_disabled');
          fourthPageTextChoose.style.display = 'none';
      })
      .catch((error) => {
          console.error('Ошибка доступа к камере:', error);
      });
    }
  });
});

infoPageButton.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "Понятно" на экране после отказа доступа к камере')
          .then(data => console.log(data))
          .catch(err => console.log(err));
  location.reload();
})

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
          console.log('startCamera()')
          api.sendStatistics(userData, 'предоставление доступа к камере')
            .then(data => console.log(data))
            .catch(err => console.log(err));
          fourthPageVideo.srcObject = stream;
          if (!fourthPage.className.includes('disabled') && fourthPageButton.disabled) {
            fourthPageInfo.classList.add('fourth-page__info_disabled');
          }
      })
      .catch((error) => {
        api.sendStatistics(userData, 'отказ доступа к камере')
            .then(data => console.log(data))
            .catch(err => console.log(err));
        if (detect.os() === 'iOS') {
          infoPage.classList.remove('info-page_disabled');
          firstPage.classList.add('first-page_disabled');
        }
        else {
          infoPage.classList.remove('info-page_disabled');
          fourthPage.classList.add('fourth-page_disabled');
        }
          console.error('Ошибка доступа к камере:', error);
      });
}

function stopCamera() {
  const stream = fourthPageVideo.srcObject;
  const tracks = stream.getTracks();
  console.log('stopCamera()')

  tracks.forEach(track => track.stop());

  fourthPageVideo.srcObject = null;
}

endPageButton.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "Выбрать другой дизайн" на последнем экране')
    .then(data => console.log(data))
    .catch(err => console.log(err));
  endPage.classList.add('end-page_disabled');
  fourthPage.classList.remove('fourth-page_disabled');
})
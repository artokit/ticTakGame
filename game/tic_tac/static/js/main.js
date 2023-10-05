let mainMenuWrapper = document.querySelector('.mainMenuWrapper');
const socket = new WebSocket('ws://127.0.0.1:8000/ws');
socket.onmessage = function(event) {
  try {
    console.log(event);
  } catch (e) {
    console.log('Error:', e.message);
  }
};
function SwitchFunction(func) {
	let elems = document.querySelectorAll('.mainMenu div');
	
	mainMenuWrapper.style.transition = '.5s';
	mainMenuWrapper.style.opacity = '0';
	
	setTimeout(() => {
		mainMenuWrapper.style.transition = 'none';
		
		func();

		setTimeout(() => {
			mainMenuWrapper.style.transition = '.5s';
			mainMenuWrapper.style.opacity = '1';
		}, 100)		
	}, 550);
}


function switchTo(percent) {
	return () => {mainMenuWrapper.style.transform = `translateY(${percent}%)`;}
}


for (let elem of document.querySelectorAll('.goBack')) {
	console.log(elem);
	elem.onclick = () => { SwitchFunction(switchTo(0)); };
}
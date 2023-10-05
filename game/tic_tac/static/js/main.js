let mainMenuWrapper = document.querySelector('.mainMenuWrapper');
const socket = new WebSocket('ws://127.0.0.1:8000/ws');
let code = null;
let choice = null;
let myChoice = false;

socket.onmessage = (event) => {
	if (event.data == 'create:success') {
		SwitchFunction(switchTo(-400));
	}
	if (event.data.startsWith('start_game')) {
		code = event.data.split(':')[1];
		choice = event.data.split(':')[2];
		
		if (choice === 'o') {
			myChoice = true;
		}

		SwitchFunction(switchTo(-500));
	}
};

let SwitchFunction = (func) => {
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
};

let getCode = (btn) => {
	return btn.parentElement.querySelector('input').value;
}

let createGame = (btn) => {
	let code = getCode(btn);
	socket.send(`create:${code}`);
};

let joinGame = (btn) => {
	let code = getCode(btn);
	socket.send(`join:${code}`);
}

let switchTo = (percent) => {
	return () => {mainMenuWrapper.style.transform = `translateY(${percent}%)`;};
};


let choiceGameBox = (elem) => {
	if (elem.innerHTML || !myChoice) {
		return;
	}
	let userBox = document.createElement('i');
	userBox.className = `fa-solid fa-${choice}`;
	elem.appendChild(userBox);
	userBox.style.animation = 'appearanceBoxUser .5s forwards';
	socket.send("");  // Todo: Make send data about choice for enemy.
	myChoice = false;
};

for (let elem of document.querySelectorAll('.goBack')) {
	elem.onclick = () => { SwitchFunction(switchTo(0)); };
}

for (let elem of document.querySelectorAll('.gamePanel__box')) {
	elem.onclick = () => {choiceGameBox(elem)};
}
let mainMenuWrapper = document.querySelector('.mainMenuWrapper');
const socket = new WebSocket('ws://127.0.0.1:8000/ws');
let code = null;
let choice = null;
let myChoice = false;
let boxes = document.querySelectorAll('.gamePanel__box');

socket.onmessage = (event) => {
	// console.log(event);
	if (event.data == 'create:success') {
		SwitchFunction(switchTo(-400));
	}

	if (event.data.startsWith('user_choice')) {
		myChoice = true;
		data = event.data.split(':');
		let choiceEnemy = data[2];
		let index = Number(data[3]);
		let b = document.querySelectorAll('.gamePanel__box')[index];
		createUserBox(choiceEnemy, b);
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

let getBoxIndex = (elem) => {
	let index = 0;
	for (let box of boxes) {
		if (box == elem) {
			return index;
		}
		index++;
	}
} 

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

let createUserBox = (c, panel_box) => {
	let userBox = document.createElement('i');
	userBox.className = `fa-solid fa-${c}`;
	panel_box.appendChild(userBox);
	userBox.style.animation = 'appearanceBoxUser .5s forwards';
}

let choiceGameBox = (elem, i) => {
	if (elem.innerHTML || !myChoice) {
		return;
	}

	createUserBox(choice, elem);
	let boxIndex = getBoxIndex(elem);
	socket.send(`user_choice:${code}:${choice}:${boxIndex}`);
	myChoice = false;
};

for (let elem of document.querySelectorAll('.goBack')) {
	elem.onclick = () => { SwitchFunction(switchTo(0)); };
}

let i = 0;
for (let elem of document.querySelectorAll('.gamePanel__box')) {
	elem.onclick = () => {choiceGameBox(elem, i)};
}
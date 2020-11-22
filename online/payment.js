const cardJsSrc = 'http://127.0.0.1:5500/online/card.js';
const styleSrc = 'http://127.0.0.1:5500/online/style.css';
const logoSrc = 'http://127.0.0.1:5500/online/icons/irecharge.png';

data = {
	amount: null,
	apiKey: null,
	reference: null,
	email: null,
	meta: {
		description: null,
		datetime: null
	}
};

let isExpiryCorrect,
        isCardValid,
        isCvvValid = false;

let payOverlayBlock,
	payBlock,
	paybtn,
	payButton,
	overlay,
	paymentModal,
	cancelPayment,
	expiryDateInput,
	cardNumberInput,
	cardCvvInput;

function formatCardNumber(cardInput) {
	if (cardInput) {
		for (let i = 1; i < cardInput.length; i++) {
		cardInput = cardInput.replace("-", "");
		}
		if (cardInput.length >= 5) {
		const cardtype = checkCardType(cardInput);
		isCardValid = validateCard(cardInput);
		if (cardtype) {
			cardNumberInput.style.background = `url(online/icons/${cardtype}.png) no-repeat scroll 0px -7px`;
		} else {
			cardNumberInput.style.background = `url(online/icons/card.png) no-repeat scroll 0px -7px`;
		}
		if (isCardValid) {
			cardNumberInput.classList.remove("validationError");
		} else {
			cardNumberInput.classList.add("validationError");
		}
		paybtn.disabled = !isExpiryCorrect || !isCardValid || !isCvvValid;
		}
		cardInput = `_${cardInput}`;
		let toks = "";
		for (let i = 1; i < cardInput.length; i++) {
		toks +=
			i % 4 === 0 && i !== cardInput.length - 1
			? `${cardInput[i]}-`
			: cardInput[i];
		}

		cardNumberInput.value = toks;
	} else {
		return null;
	}
}
function formatExpiryInput(expiryInput) {
	expiryInput = expiryInput.replace("/", "");
	expiryPattern = /^((0[1-9])|(1[0-2]))[\/\.\-]*((2[0-9])|(3[0]))$/;
	isExpiryCorrect = expiryPattern.test(expiryInput);
	paybtn.disabled = !isExpiryCorrect || !isCardValid || !isCvvValid;
	if (isExpiryCorrect) {
		expiryDateInput.classList.remove("validationError");
	} else {
		expiryDateInput.classList.add("validationError");
	}
	expiryDateInput.value = expiryInput.substr(0, 2) + "/" + expiryInput.substr(2);
}

function checkCvvInput(cvvInput) {
	isCvvValid = cvvInput.length == 3;
	if (isCvvValid) {
		cardCvvInput.classList.remove("validationError");
	} else {
		cardCvvInput.classList.add("validationError");
	}
	paybtn.disabled = !isExpiryCorrect || !isCardValid || !isCvvValid;
}

function payiRecharge(data) {
	createHtml(data);

	setTimeout( () => {
		init();
		// const overlay = document.querySelector(".overlay");
		// const paymentModal = document.querySelector(".payment");
	
		// payOverlayBlock.classList.add("show-payment");
		// paymentModal.classList.add("show-payment");

	}, 2000);
}

function init() {
	isExpiryCorrect = isCardValid = isCvvValid = false;
	paybtn = document.getElementById("paybtn");
	paybtn.disabled = !isExpiryCorrect;
	payButton = document.querySelector("#paymentButton");
	payOverlayBlock = document.querySelector(".overlay");
	payBlock = document.querySelector(".payment");
	cancelPayment = document.querySelector("#cancelPayment");
	expiryDateInput = document.querySelector("#expiryDateInput");
	cardNumberInput = document.querySelector("#cardNumberInput");
	cardCvvInput = document.querySelector("#cvvInput");
	
	payOverlayBlock.classList.add("show-payment");
	payBlock.classList.add("show-payment");

	cancelPayment.addEventListener("click", () => {
		payOverlayBlock.classList.remove("show-payment");
		payBlock.classList.remove("show-payment");
		document.body.removeChild(payOverlayBlock);
	});
}

function createHtml(data) {
	payOverlayBlock = document.createElement('div');
	payOverlayBlock.className = "overlay";

	payBlock = document.createElement('div');
	payBlock.className = "payment";

	// ? ANOTHER PART
	const headTitle = document.createElement('h1');
	payBlock.appendChild(headTitle);

	// ? ANOTHER PART
	const logoDiv = document.createElement('div');		
	const logo = document.createElement('img');
	logoDiv.className = "logo";
	logo.setAttribute('src', logoSrc);
	logoDiv.appendChild(logo);

	// ? ANOTHER PART
	const paymentDetailsDiv = document.createElement('div');
	paymentDetailsDiv.className = 'payment-details';

	const payerEmail = document.createElement('p');
	payerEmail.innerHTML = data.email;

	const paymentData = document.createElement('h5');
	const payText = document.createElement('small');

	payText.className = 'payText';
	payText.innerHTML = 'Pay ';

	const amountText = document.createElement('span');
	amountText.className = 'amountText';
	amountText.innerHTML = this.formatCurrency(data.amount);
	
	paymentData.appendChild(payText);
	paymentData.appendChild(amountText);

	paymentDetailsDiv.appendChild(payerEmail);
	paymentDetailsDiv.appendChild(paymentData);


	// ? ANOTHER PART
	const inputCollectionDiv = document.createElement('div');
	inputCollectionDiv.className = 'center';

	const cardNumberInput = document.createElement('input');
	cardNumberInput.setAttribute('type', 'tel');
	cardNumberInput.setAttribute('id', 'cardNumberInput');
	cardNumberInput.setAttribute('placeholder', '1234-5678-9012-3456');
	cardNumberInput.setAttribute('maxlength', '19');
	cardNumberInput.setAttribute('oninput', 'formatCardNumber(cardNumberInput.value)');

	const expiryDateInput = document.createElement('input');
	expiryDateInput.setAttribute('type', 'tel');
	expiryDateInput.setAttribute('id', 'expiryDateInput');
	expiryDateInput.setAttribute('placeholder', 'mm/yy');
	expiryDateInput.setAttribute('maxlength', '5');
	expiryDateInput.setAttribute('oninput', 'formatExpiryInput(expiryDateInput.value)');
	
	const cvvInput = document.createElement('input');
	cvvInput.setAttribute('type', 'tel');
	cvvInput.setAttribute('id', 'cvvInput');
	cvvInput.setAttribute('placeholder', 'CVV: 123');
	cvvInput.setAttribute('maxlength', '3');
	cvvInput.setAttribute('oninput', 'checkCvvInput(cvvInput.value)');
	
	const br = document.createElement('br');

	inputCollectionDiv.appendChild(cardNumberInput);
	inputCollectionDiv.appendChild(br);
	inputCollectionDiv.appendChild(expiryDateInput);
	inputCollectionDiv.appendChild(cvvInput);

	// ? ANOTHER PART
	const paybtn = document.createElement('button');
	paybtn.setAttribute('id', 'paybtn');
	paybtn.innerHTML = 'Pay';

	// ? ANOTHER PART
	const centerDiv = document.createElement('div');
	centerDiv.className = "center";

	const cancelbtn = document.createElement('button');
	cancelbtn.setAttribute('id', 'cancelPayment');
	cancelbtn.innerHTML = "cancel";
	centerDiv.appendChild(cancelbtn);

	const cardScript = document.createElement('script');
	
	cardScript.setAttribute('src', cardJsSrc);
	cardScript.type = "text/javascript"

	payBlock.appendChild(headTitle);
	payBlock.appendChild(logoDiv);
	payBlock.appendChild(paymentDetailsDiv);
	payBlock.appendChild(paymentDetailsDiv);
	payBlock.appendChild(inputCollectionDiv);
	payBlock.appendChild(paybtn);
	payBlock.appendChild(centerDiv);

	payOverlayBlock.appendChild(payBlock);
	// const body = document.getElementsByTagName('body');
	payOverlayBlock.appendChild(cardScript);


	var linK = document.createElement('link');
	linK.href = styleSrc
	linK.rel = "stylesheet";
	// var heaD = document.getElementsByTagName('head');
	document.head.appendChild(linK);
	// console.log(payOverlayBlock);
	document.body.appendChild(payOverlayBlock)
}


function formatCurrency(amount, logo = 'logo') {
	const symbol = logo ? '₦' : 'NGN';
	amount = typeof (amount) === 'string' ? amount : amount.toString();
	const isAmountFloat = this.checkForFloat(amount);
	let floatPart = null;
	let intPart;
	if (isAmountFloat.float) {
		floatPart = amount.substring((isAmountFloat.position + 1));						// Extract float part
		console.log({ floatPart });
		console.log({ numberedFloat: Number(floatPart) });
		floatPart = ((Number(floatPart).toPrecision(2)));
		floatPart = Number(floatPart);
		floatPart = floatPart.toString();
		floatPart = Number(floatPart.substring(2, 0));		// Convert it to 2 D.P

		intPart = amount.substring(isAmountFloat.position, 0);
		return Number(floatPart) === 0 ? `${symbol} ${Number(intPart).toLocaleString()}.00` : `${symbol} ${Number(intPart).toLocaleString()}.${floatPart}`;
	} else {
		return `${symbol} ${Number(amount).toLocaleString()}.00`;
	}
}

function checkForFloat(value) {
	return value.indexOf('.') < 0 ? { float: false, position: null } : { float: true, position: value.indexOf('.') };
}
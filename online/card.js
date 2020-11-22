function checkCardType(cardNumber, checksum) {
	const cardArray = cardNumber.toString().split("").map((e) => parseInt(e) )

	const typeValidatorArr = cardArray.slice(0,2)
	const typeValidatorInt = parseInt(typeValidatorArr.join(""))

	if (checksum % 10 == 0 || !checksum) {
		let cardType;
		if (typeValidatorArr[0] == 4) {
			cardType =  "visa"
			document.getElementById('cardNumberInput').setAttribute('maxlength', 22);
		} else if (typeValidatorInt == 34 || typeValidatorInt == 37){
			cardType =  "american-express";
			document.getElementById('cardNumberInput').setAttribute('maxlength', 18);
		} else if (typeValidatorInt == 22 || typeValidatorInt == 51 || typeValidatorInt == 52  || typeValidatorInt == 53 || typeValidatorInt == 54 || typeValidatorInt == 55){
			cardType =  "mastercard";
			document.getElementById('cardNumberInput').setAttribute('maxlength', 19);
		} else if (typeValidatorInt == 35 ){
			cardType =  "jcb";
			document.getElementById('cardNumberInput').setAttribute('maxlength', 22);
		} else if (typeValidatorInt == 60 ){
			cardType =  "discover";
			document.getElementById('cardNumberInput').setAttribute('maxlength', 22);
		} else if (typeValidatorInt == 30 ){
			cardType =  "diners-club";
			document.getElementById('cardNumberInput').setAttribute('maxlength', 19);
		}

		return !checksum ? cardType : cardType ? true : false; 
	}
}


function validateCard(cardNumber){
const cardArray = cardNumber.toString().split("").map((e) => parseInt(e) )
  validlen(cardArray);
  const splitArr =  arrSplit(cardArray)
  const checksum = sumArrDigits(splitArr.arr1).reduce((a, c) => a + c) + splitArr.arr2.reduce((a, c) => a + c);

  return checkCardType(cardNumber, checksum);
}


function sumArrDigits(array){
  return array.join("").split("").map(e => parseInt(e))
}

function validlen(arr){
  // checks for card length of 13, 15, or 16
  return  arr.length == 13  || arr.length == 15 || arr.length == 16
}

function arrSplit(cardArray){
  const selectOddValues = cardArray.filter((a,i)=>i%2 === 1);
  const selectEvenValues = cardArray.filter((a,i)=>i%2 === 0);
  let arr1;
  let arr2;
  if (cardArray.length % 2 == 1){
    arr1 = selectOddValues.map(e => e * 2);
    arr2 = selectEvenValues;
  }else {
    arr1 = selectEvenValues.map(e => e * 2);
    arr2 = selectOddValues;
  }
  return {arr1, arr2}
}

// module.exports = {
// 	checkCardType,
// 	validateCard: validator
// };
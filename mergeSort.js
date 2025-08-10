function mergeSort(arr) {
	if (arr.length > 1) {
		const mid = Math.floor(arr.length / 2);

		let arr1 = arr.slice(0, mid);
		let arr2 = arr.slice(mid);

		arr1 = mergeSort(arr1);
		arr2 = mergeSort(arr2);

		const merged = merge(arr1, arr2);
		return merged;
	} else {
		return arr;
	}
}

function merge(arr1, arr2) {
	let returnedArr = [];
	let i = 0;
	let j = 0;

	while (i < arr1.length && j < arr2.length) {
		if (arr1[i] < arr2[j]) {
			returnedArr.push(arr1[i]);
			i++;
		} else {
			returnedArr.push(arr2[j]);
			j++;
		}
	}
	while (i < arr1.length) {
		returnedArr.push(arr1[i]);
		i++;
	}
	while (j < arr2.length) {
		returnedArr.push(arr2[j]);
		j++;
	}
	return returnedArr;
}

function removeDupes(arr) {
	let returnedArr = arr;

	for (let i = returnedArr.length - 1; i > 0; i--) {
		if (returnedArr[i] === returnedArr[i - 1]) {
			returnedArr.splice(i - 1, 1);
		}
	}

	return returnedArr;
}

export { mergeSort, removeDupes };

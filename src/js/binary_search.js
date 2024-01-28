const binarySearch = (array, searchValue) => {
    let l = 0;
    let r = array.length - 1;
    while (l <= r){
	let m = Math.floor((l+r)/2);
	if (array[m] < searchValue){
	    l = m + 1;
	}else if (array[m] > searchValue){
	    r = m - 1;
	}else{
	    return m;
	}
    }
    return -1;
};

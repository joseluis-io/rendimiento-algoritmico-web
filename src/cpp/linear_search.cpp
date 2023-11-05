int linearSearch(int array[], int length, int searchValue){
  for(int i = 0; i < length; i++){
    if(array[i] == searchValue){
      return i;
    }
  }
  return -1;
}

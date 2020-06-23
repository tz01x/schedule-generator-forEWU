function* gen( idx){
   if(idx>5){
       return;
   }
   yield gen(idx+1);
   return idx;
}
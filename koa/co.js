var co=function(gen){
  var kkk=gen();
  var tmp;
  var val;
  var done;  
  var returnValue;
  (function co_in(lt,c){
	  var kkk=lt
	  if(kkk.next){
		if(c) tmp = kkk.next(c);
		else  tmp=kkk.next();
		val = tmp.value;
		done = tmp.done;
		if(done==false){
          returnValue = val;       
		  co_in(kkk,val);
		}
		else{            
		  return returnValue;
		}
	  }
  })(kkk);

  return returnValue;
}
var utils = function(){

	return{
	
		toNumber : function(today){
		
			var day 	= 	today.getUTCDate().toString();
			var month 	=  (today.getUTCMonth()+1).toString();
			var year 	= 	today.getUTCFullYear().toString();
			
			return parseInt(day.toString()+month.toString()+year.toString());
		},
		last:function(day){
		
			var _date = new Date(
						day.getFullYear(),  
						day.getMonth(),  
			   		   (day.getDate()-1));
			return   _date;
		}
	
	}

}()

module.exports = utils;


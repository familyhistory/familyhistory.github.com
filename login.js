//console.log('local index.js loaded')

//nextHref = 'https://accounts.google.com/o/oauth2/auth?state=/profile&response_type=token&client_id=219713047770-qllqvhos1i3ll5nv0fgl523erj3479sr.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/fusiontables&redirect_uri=https://dl.dropbox.com/u/4582428/familyhistoryGoogleCode/loginDevJonas.html'

login=function(){
	loginInfo = document.getElementById('showLoginInfo');
	if(loginInfo.checked){nextHref+='?detail=yes'}
	document.location.href=nextHref;
}



// parameters being send in through the URL?
if(location.hash.substring(1).length>0){
	parms={} , search={}, queryString = location.hash.substring(1); searchString =  location.search.substring(1);
	queryString.split('&').map(function(x){return x.split('=')}).map(function(x,i){parms[x[0]]=x[1];return true});
	searchString.split('&').map(function(x){return x.split('=')}).map(function(x,i){search[x[0]]=x[1];return true});
	
	// Display and object's attributes as a list
	var displayLi=function(x){
		var p = document.createElement('p');
		for(xi in x){
			var li=document.createElement('li');
			li.innerHTML=xi+': <span style="color:navy">'+x[xi]+'</span>.';
			p.appendChild(li);
		}
		return p
	}
	
	// show token response parameters:
	document.body.appendChild(document.createElement('hr'));
	document.body.appendChild(displayLi(parms));
	document.body.appendChild(document.createElement('hr'));
	
	// get other information
	var getInfo = function(url){
		if(!getInfo.jobs){getInfo.jobs={}} // keep all jobs here
		var jobID='job'+Math.random().toString().slice(2);
		getInfo.jobs[jobID]={}; // and this particular job here
		getInfo.jobs[jobID].url=url;
		getInfo.jobs[jobID].callback=function(x){ // assemble callback function
			var div = document.createElement('div');div.id=url; // create a div to show Info
			var ph = document.createElement('p'); // header
			ph.innerHTML='<h3>'+url+'</h3>';
			div.appendChild(ph);
			div.appendChild(displayLi(x));
			getInfo.jobs[jobID].div=div; // contents
		}
		
		// time to call
		s = document.createElement('script');
		s.src = url+'?access_token='+parms.access_token+'&callback=getInfo.jobs.'+jobID+'.callback';
		s.onload = function(){
			console.log(s.src+' read ok');
			document.body.appendChild(getInfo.jobs[jobID].div);
		}
		document.body.appendChild(s);
	}
	
	getInfo('https://www.googleapis.com/oauth2/v1/tokeninfo');
	getInfo('https://www.googleapis.com/oauth2/v1/userinfo');
	
	// example of use of fusion tables: get list of tables:
	s = document.createElement('script');
	s.src ='https://fusiontables.googleusercontent.com/fusiontables/api/query?sql=SHOW+TABLES&encid=true&access_token='+parms.access_token+'&jsonCallback=console.log'; // why jsonCallback instead of teh usual callback?!
	document.body.appendChild(s); // results will be shown in the console
	
	// Family History tool
	loadFamilyHistoryTool=function(){
		s = document.createElement('script');
		s.src = 'familyhistory.js';
		s.onload=function(){familyHistory.loadUI()};
		document.body.appendChild(s);
	}
	sessionStorage.setItem('access_token',parms.access_token); // store access token
	document.getElementById('familyHistoryButton').disabled=false; // activate family history tool
	if(!!search.detail){
		document.getElementById('familyHistoryButton').style.fontSize='large';
		document.getElementById('login').style.fontSize='small';
	}
	else{
		document.body.innerHTML='<span style="color:red;font-family:Verdana">Loading ...</span>';
		loadFamilyHistoryTool();
	}
}


console.log('familyHistoryTool :-)')

// get access_token
familyHistory={
	config:{
		access_token:sessionStorage.getItem('access_token')		
	},
	
	loadUI:function(){
		// load Twiter Bootstrap
		document.body.innerHTML='<span style:"color:red">loading family history</span'
		var lk=document.createElement('link');
		lk.href = 'lib/jquery-ui-1.8.17.custom/css/ui-lightness/jquery-ui-1.8.17.custom.css';
		lk.rel = 'stylesheet';
		lk.type= 'text/css';
		document.head.appendChild(lk);
		var BS = document.createElement('link'); //Twitter Bootstrap css
		BS.href='lib/twitter-bootstrap-d335adf/docs/assets/css/bootstrap.css';
		BS.rel='stylesheet';
		//BS.onload=function(){familyHistory.assembleUI()};
		document.head.appendChild(BS);
		
		var JQ = document.createElement('script');
		JQ.src='lib/jquery-ui-1.8.17.custom/js/jquery-1.7.1.min.js';
		JQ.onload=function(){ // jQueryUI
			var JQui = document.createElement('script');
			JQui.src='lib/jquery-ui-1.8.17.custom/js/jquery-ui-1.8.17.custom.min.js';
			JQui.onload=function(){familyHistory.UI.start()};
			document.head.appendChild(JQui);
		}
		document.head.appendChild(JQ);
	},
	
	fusion:{
		sql:function(sq,cb){ //SQL exchange with Fusion Tables
			if(!sq){sq='SHOW+TABLES'}else{sq=sq.replace(/( )+/,'+')}
			if(!cb){cb='console.log'} // note call back is the exact string being passed to JSONP call
			//'https://fusiontables.googleusercontent.com/fusiontables/api/query?sql=SHOW+TABLES&encid=true&access_token='+parms.access_token+'&jsonCallback=console.log'
			$.getScript('https://fusiontables.googleusercontent.com/fusiontables/api/query?sql='+sq+'&encid=true&access_token='+familyHistory.config.access_token+'&jsonCallback='+cb);
		},
		
		data:{
			// for stuff about the Fusion Tables
		},
		
		getTables:function(){
			familyHistory.fusion.sql('SHOW+TABLES','familyHistory.fusion.getTables.callback');
			this.getTables.callback=function(x){
				familyHistory.fusion.data.tables=x;
				}
			},
			
		getTokenInfo:function(access_token){
			if(!access_token){access_token=familyHistory.config.access_token};
			this.getTokenInfo.callback=function(x){familyHistory.config.tokenInfo=x;familyHistory.config.access_token=x.access_token};
			$.getScript('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+access_token+'&callback=familyHistory.fusion.getTokenInfo.callback');
		},
		
		getUserInfo:function(access_token){
			if(!access_token){access_token=familyHistory.config.access_token};
			this.getUserInfo.callback=function(x){familyHistory.config.userInfo=x};
			$.getScript('https://www.googleapis.com/oauth2/v1/userinfo?access_token='+familyHistory.config.access_token+'&callback=familyHistory.fusion.getUserInfo.callback');
		},
		
		table2html:function(x){ // converts a Fusion Tables table response into HTML
			//
			var tb = $('<table>');
			var thead=$('<thead>').appendTo(tb);
			var tbody=$('<tbody>').appendTo(tb);
			
			return tb
		}
	},
	
	UI:{
		start:function(){ // Assemble UI
			document.body.innerHTML='';
			//$(document.body).append($('<div class="navbar navbar-fixed-top">')).append($('<div class="navbar-inner">')).append($('<div class="container">'));
			$('<div class="container-fluid">').appendTo($('<div class="navbar-inner">').appendTo($('<div class="navbar navbar-fixed-top">').appendTo(document.body)));
			$('<a class="brand" href="#"> Family history</a>').appendTo($('.container-fluid'));
			$('<div class="nav-collapse">').appendTo($('.container-fluid'));
			$('<ul class="nav">').appendTo($('.nav-collapse'));
			$('<li><a class="brand" href="javascript:console.log(9)" id="fusion" > Fusion tables</a></li>').appendTo($('.nav'));
			$('<p class="navbar-text pull-right">Logged in as <a href="#" id="username"> ... </a> <img width="35" id="photo"></p>').appendTo($('.nav-collapse'));
			// get userInfo
			if(!familyHistory.config.userInfo){
				this.start.userInfoCallback=function(x){
					familyHistory.config.userInfo=x;
					console.log(x);
					$('#username').text(familyHistory.config.userInfo.given_name+' '+familyHistory.config.userInfo.family_name+' ('+familyHistory.config.userInfo.email+')');
					$('#username').attr('href',familyHistory.config.userInfo.link).attr('target','_blank');
					$('#photo').attr('src',familyHistory.config.userInfo.picture)
					//$('<a class="brand" href="javascript:console.log(9)" id="fusion" > Fusion tables</a>').appendTo($('.container'));
				}
				$.getScript('https://www.googleapis.com/oauth2/v1/userinfo?access_token='+familyHistory.config.access_token+'&callback=familyHistory.UI.start.userInfoCallback');
			}
			
		},
		
		fusionTables:function(){ // get tables in user's Fusion Tables and add it to menu
			if(!familyHistory.fusion.data.tables){// if table information not retrieved yet
				familyHistory.fusion.sql('SHOW+TABLES','familyHistory.UI.fusionTables.callback');
				this.fusionTables.callback=function(x){
					familyHistory.fusion.data.tables=x;
					
					}
			}
		},
	}
	
	
		
}


// Interface

// load bootstrap

// <link href="lib/jquery-ui-1.8.17.custom/css/ui-lightness/jquery-ui-1.8.17.custom.css" rel="stylesheet" type="text/css"/>


	


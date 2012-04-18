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
			var m = x.cols.length, n = x.rows.length;
			var tb = document.createElement('table');
			var thead=document.createElement('thead');tb.appendChild(thead);
			var trh=document.createElement('tr');thead.appendChild(trh);
			for(var j=0;j<m;j++){
				var th=document.createElement('th');
				th.textContent=x.cols[j];
				trh.appendChild(th);
			}
			var tbody=document.createElement('tbody');
			for(var i=0;i<n;i++){
				var tr=document.createElement('tr');
				for(var j=0;j<m;j++){
					var td=document.createElement('td');
					td.textContent=x.rows[i][j];
					tr.appendChild(td);
				}
				tbody.appendChild(tr);
			}
			tb.appendChild(tbody);
			return tb
		}
	},
	
	UI:{
		start:function(){ // Assemble UI
			document.body.innerHTML='';
			//$(document.body).append($('<div class="navbar navbar-fixed-top">')).append($('<div class="navbar-inner">')).append($('<div class="container">'));
			$('<div class="container-fluid" id="containerFluidTop">').appendTo($('<div class="navbar-inner">').appendTo($('<div class="navbar navbar-fixed-top">').appendTo(document.body)));
			$('<a class="brand" href="javascript:familyHistory.UI.familyHistory()"> Family history</a>').appendTo($('.container-fluid'));
			$('<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></a>').appendTo($('#containerFluidTop')); // why does BT ask for this? does it really need it?
			$('<div class="nav-collapse">').appendTo($('#containerFluidTop'));
			$('<ul class="nav">').appendTo($('.nav-collapse'));
			$('<li><a class="brand" href="javascript:familyHistory.UI.fusionTables()" id="fusion" > Fusion tables</a></li>').appendTo($('.nav'));
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
		
			this.fusionTables.callback=function(x){
				$('#fusionTables').remove();// clear side panel;
				//$('#displayArea').remove();
				familyHistory.fusion.data.tables=x;
				$('<div class="well sidebar-nav" id="sidePanel">').appendTo($('<div class="span3">').appendTo($('<div class="row-fluid" id="horizontalSpan">').appendTo($('<div class="container-fluid" id="fusionTables">').appendTo(document.body))));
				$('<ul class="nav nav-list" id="sidePanelList">').appendTo($('#sidePanel'));
				$('<li>.</li>').appendTo($('.nav-list'));
				$('<li class="nav-header">Tables found:</li>').appendTo($('.nav-list'));
				var n = familyHistory.fusion.data.tables.table.rows.length;
				for(var i=0;i<n;i++){
					$('<li><a href="https://www.google.com/fusiontables/DataSource?docid='+familyHistory.fusion.data.tables.table.rows[i][0]+'&pli=1" target="_blank"><img src="https://www.google.com/images/icons/product/docs-32.png"></a><a href="javascript:familyHistory.UI.getFusionTable(\''+familyHistory.fusion.data.tables.table.rows[i][0]+'\')" target="_blank">'+familyHistory.fusion.data.tables.table.rows[i][1]+'</a></li>').appendTo($('.nav-list'));
				}
				$('<li class="nav-header"><button class="btn" onclick="delete familyHistory.fusion.data.tables;familyHistory.UI.fusionTables()">Refresh List</button></li>').appendTo($('.nav-list'));
			}
		
			if(!familyHistory.fusion.data.tables){// if table information not retrieved yet
				familyHistory.fusion.sql('SHOW+TABLES','familyHistory.UI.fusionTables.callback');
			}
			else{ // use existing table information
				this.fusionTables.callback(familyHistory.fusion.data.tables)
			}
		},
		
		getFusionTable:function(docId){
			$('#displayArea').remove(); // clear display area
			
			this.getFusionTable.callback=function(x){
				familyHistory.fusion.data[docId]=x;
				// display table
				$('<div class="span9" id="displayArea"><div class="hero-unit" id="dataDisplay"></div></div>').appendTo($('#horizontalSpan'));
				var tb = familyHistory.fusion.table2html(x.table);
				tb.id='dataTable';
				//tb.style.fontSize=9;
				$(tb).addClass('table');
				$(tb).appendTo($('#dataDisplay'))
				
				
			}
			
			if(!familyHistory.fusion.data[docId]){
				familyHistory.fusion.sql('SELECT+*+FROM+'+docId,'familyHistory.UI.getFusionTable.callback');
			}
			else{familyHistory.UI.getFusionTable.callback(familyHistory.fusion.data[docId])}
			
			//https://fusiontables.googleusercontent.com/fusiontables/api/query?sql=SELECT+*+FROM+1kVzLVxloYiLEQ2TdlSy3HIL3eN6buCg0l3mwC4M&encid=true&access_token=ya29.AHES6ZSo6boRQTE_ldjJnZBLcD0NxbVekYSD4EQDKoZcUz00&jsonCallback=lala
		},
		
		familyHistory:function(){
			$('#sidePanel').remove();// clear side panel;
		}
	}
	
	
		
}


// Interface

// load bootstrap

// <link href="lib/jquery-ui-1.8.17.custom/css/ui-lightness/jquery-ui-1.8.17.custom.css" rel="stylesheet" type="text/css"/>


	


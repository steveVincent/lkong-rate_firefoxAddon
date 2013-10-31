/**
 * lkongrate namespace.
 */
if ("undefined" == typeof(lkongrate)) {
  var lkongrate = {};
};

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
 
let file = FileUtils.getFile("ProfD", ["lkong_rate.sqlite"]);


gBrowser.addEventListener("DOMContentLoaded", function(event){
	if (event.originalTarget instanceof HTMLDocument) {
		var doc = event.originalTarget;
		 var obj=doc.body.innerHTML;
		var href = doc.location.href;
		// handle specific domain
		if(href.contains("www.lkong.net")&&href.contains("do=booklist")){ 
		
			 let dbConn = Services.storage.openDatabase(file);
		  dbConn.executeSimpleSQL("CREATE TABLE IF NOT EXISTS lk_book  (chapter TEXT, book_name TEXT, link TEXT, booklist TEXT)");
		  var title=decodeURIComponent(getTitle());
		  var statement = dbConn.createStatement("SELECT * FROM lk_book"); // WHERE book_name = :parameter
		//  statement.params.parameter = title;
		 var textstring="";
		 var booktitle = new Array();
		 var links=new Array();
		 var chapters=new Array();
		  statement.executeAsync({
			  handleResult: function(aResultSet) {
				  var i=0;
				  for (let row = aResultSet.getNextRow();
			         row;
			         row = aResultSet.getNextRow()) {
			 
			      let value = row.getResultByName("book_name");
			      textstring=textstring+"<a href=\""+row.getResultByName("link")+"\" target=\"_blank\">"+value+"</a>&nbsp;";
			  //    textstring=textstring+value+" = "+row.getResultByName("link")+"\n";
			      booktitle[i]=value;
			      links[i]=row.getResultByName("link");
			      chapters[i]=row.getResultByName("chapter");
			      if(chapters[i]==""||chapters[i]==null) chapters[i]="书签";
			      i++;
			      
			    }
				 
//				  textstring=textstring+"</body></html>";
				//alert(textstring);
				 
				   
				    	//newTabBrowser.contentDocument.body.innerHTML;
				  var obj1=content.document.getElementsByTagName('div');
				  for(var i=0;i<obj1.length;i++){
					   if (obj1[i].className.match("biaoti")) {
						   var text=obj1[i].innerHTML;
						   for(var ii=0;ii<booktitle.length;ii++){
							   if(text.contains(booktitle[ii])&&!text.contains("otherlist"))
							   text=text.replace(">"+booktitle[ii]+"</a>",">"+booktitle[ii]+"</a></div><div class=\"otherlist\"><a href=\""+links[ii]+"\" target=\"_blank\">"+chapters[ii]+"</a>");
						    }
						   
						   obj1[i].innerHTML=text;
					   }
				  }
				 
			  },
			  
			  handleError: function(aError) {
			    alert("Error: " + aError.message);
			  },
			 
			  handleCompletion: function(aReason) {
			    if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
			      alert("Query canceled or aborted!");
			  }
			});
		
		  dbConn.asyncClose();
	//	content.document.getElementById("divBookInfo").appendChild(element);
		  var indexW=0;
		  var strW="字数:<b>";
		  var loopCount=0;
		  do{
			   indexW=obj.indexOf(strW,indexW);
			   if(indexW<obj.length&&indexW>=0){
				   var indexW2=obj.indexOf("</b>",indexW);
				   if(indexW2-indexW-strW.length<15){
					   var wCount=(parseFloat(obj.substring(indexW+strW.length,indexW2))/10000.0).toFixed(1);
					   obj=obj.substring(0,indexW+strW.length)+wCount+"万"+obj.substring(indexW2);
					   
				   }
				   indexW=indexW2;
			   }
			   loopCount=loopCount+1;
		  }while(indexW<obj.length&&indexW>=0&&loopCount<25);
		}
		 
		var hrefA=["www.lkong.net/book","qidian.com","book.zongheng.com/book","www.17k.com/book","www.yuanchuang.com/book","www.lkong.net/book/"];
		var strWA=["<span class=\"pl\">字数:</span> ","<b>总字数：</b>","<p>总字数：","已写<em>","<span id=\"spTotleWordCount\"><strong>总字数：</strong>","</span>&nbsp;&nbsp;字数:<span>"];
		var stopWA=["字","</td>","</p>","</em>字...<br>","</span>","</span>字</p>"];
		var addtionWA=[1,1,1,1,1,0];
		for(var x=0;x<hrefA.length-1;x++){  //last one does not work
			if(href.contains(hrefA[x])){
				 var indexW=0;
				  var strW=strWA[x];
				  var loopCount=0;
				  do{
					   indexW=obj.indexOf(strW,indexW);
					   if(indexW<obj.length&&indexW>=0){
						   var indexW2=obj.indexOf(stopWA[x],indexW+strW.length);
						   if(indexW2-indexW-strW.length<15){
							   var wCo1=parseFloat(obj.substring(indexW+strW.length,indexW2));
							   var wCount=(wCo1/10000.0).toFixed(1);
							   if(addtionWA[x]==1) wCount=wCount.toString()+"万  ("+wCo1+")";
							   else  wCount=wCount.toString()+"万 ";
							   obj=obj.substring(0,indexW+strW.length)+wCount+obj.substring(indexW2);
							   
						   }
						   indexW=indexW2;
					   }
					   loopCount=loopCount+1;
				  }while(indexW<obj.length&&indexW>=0&&loopCount<25);
				  doc.body.innerHTML=obj; 
				  
			}
		}

	}
}, true);
function getTitle(){
	var href=gBrowser.contentDocument.location.href;
	  if(href.contains("www.qidian.com/book/")||href.contains("www.qidian.com/Book/")){
//		  var obj=content.document.getElementById("divBookInfo");
//		  var title=obj.innerHTML;
//		  var str="<h1>";
//		  var index1=title.indexOf(str);
//		  var index2=title.indexOf("</",str+str.length);
//		  title=title.substring(index1+str.length,index2);
		  var title=content.document.title;
		  title=title.substring(0,title.indexOf(","));
	  }else if(href.contains("qidian.com/BookReader")){
		  
			 var title=content.document.title;
			 var str="小说:";
			 var str2="独家首发";
			 if(title.indexOf("txt")>0) title=title.substring(0,title.indexOf("txt")).trim();
			 else if(title.indexOf(str2)>0) title=title.substring(title.indexOf(str)+str.length,title.indexOf(str2));
			 else if(title.indexOf("首发")>0) title=title.substring(title.indexOf(str)+str.length,title.indexOf("首发"));		 
			 else title=title.substring(title.indexOf(str)+str.length,title.indexOf("/"));
			
		  }else if(href.contains("vipreader.qidian.com/BookReader/")){
			  var title=content.document.title;
			  title=title.substring(0,title.indexOf("/"));
		  
		  }
	  else if(href.contains("book.zongheng.com")){
		  var title=content.document.title;
		  if(title.indexOf(",")>0)
			  title=title.substring(0,title.indexOf(","));
		  else title=title.substring(0,title.indexOf("，"));
	  
	  }else if(href.contains("www.yuanchuang.com/bookreader")){
		  var title=content.document.title;
		  if(title.indexOf("_")>0)
			  title=title.substring(0,title.indexOf("_"));
		 
	  
	  }else if(href.contains("www.yuanchuang.com/bookcatalog")){
		  var title=content.document.title;
		  if(title.indexOf("txt")>0)
			  title=title.substring(0,title.indexOf("txt"));
		 
	  
	  }else if(href.contains("www.yuanchuang.com/book")){
		  var title=content.document.title;
		  if(title.indexOf("，")>0)
			  title=title.substring(0,title.indexOf("，"));
		 
	  
	  }else if(href.contains("www.17k.com/book")||href.contains("www.17k.com/list") ){
		  var title=content.document.title;
		  if(title.indexOf("最新章节")>0)
			  title=title.substring(0,title.indexOf("最新章节"));
		 
	  
	  }else if(href.contains("www.17k.com/chapter")){
		  var title=content.document.title;
		  if(title.indexOf("-")>0)
			  title=title.substring(0,title.indexOf("-"));
		 
	  
	  }else if(href.contains("http://chuangshi.qq.com")){
	        // title=gBrowser.contentDocument.getElementsByClassName("title")[1].getElementsByTagName("strong")[0].firstChild.innerHTML;
		  var title=content.document.title;
		  title=title.substring(0,title.indexOf("最新章节"));
		  if(title.length<=0) {
			  title=content.document.title;
			  title=title.substring(0,title.indexOf("目录"));
			   if(title.length<=0) {
				  title=content.document.title;
				  title=title.substring(0,title.indexOf("_"));
			  }
		  }
	  }
	 
	  else{
		  var title="";
	  }
	  return encodeURIComponent(title);
}
function getChapter(){
	var data=new Array();
	var href=gBrowser.contentDocument.location.href;
	var chapter=content.document.title;
	var link="";
	if(href.contains("qidian.com/BookReader")){
		link=href.replace("http://www.qidian.com/BookReader/","");
		chapter=encodeURIComponent(chapter.substring(chapter.indexOf("/")+1,chapter.lastIndexOf("/")));
	}else if(href.contains("book.zongheng.com/chapter")){
		link=href.replace("book.zongheng.com/chapter/","z");
		chapter=encodeURIComponent(chapter.substring(0,chapter.indexOf(",")));
	}
	data[0]=chapter;
	data[1]=link;
	return data;
}
function lkongrate1(aEvent){
	 var title=getTitle();
	 var href=gBrowser.contentDocument.location.href;
	 if(href.contains("http://chuangshi.qq.com")){
		 gBrowser.loadOneTab("http://lkong.cn/search/"+title);
	 }else  if(title.length>0){
		  let url = "http://www.lkong.net/search.php?formhash=61bd917b&srchtype=title&srhfid=0&searchsubmit=true&mod=book&srchtxt="+title;
		 
			let request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
			              .createInstance(Components.interfaces.nsIXMLHttpRequest);
			request.overrideMimeType('text/html;charset=utf-8');
			
			request.onload = function(aEvent) {
			 // window.alert("Response Text: " + aEvent.target.responseText);
			 // var doc=aEvent.target.responseXML;
				var text=aEvent.target.responseText;
				var str="<div class=\"biaoti\"><a href=\"";
				var str2="\" target=\"_blank\"><strong><font color=\"#ff0000\">"+decodeURIComponent(title)+"</font></strong></a>";
				var index1=text.indexOf(str);
				if(index1<0) gBrowser.loadOneTab("http://www.lkong.net/book.php?mod=add");
				else{
						var index2=text.indexOf("\"",index1+str.length);
						
						if(text.lastIndexOf(str)!=index1) {
							var lastindex=text.lastIndexOf(str);
							while(lastindex>index1){
								if(text.substring(index2).indexOf(str2)==0){
									
									//gBrowser.loadOneTab(text.substring(index1+str.length,index2));
									break;
								}
								
								else {
									 index1=text.indexOf(str,index2);
									 index2=text.indexOf("\"",index1+str.length);
								} 
							}
							
							if(text.substring(index2).indexOf(str2)==0)	
								gBrowser.loadOneTab(text.substring(index1+str.length,index2));
							else {gBrowser.loadOneTab(url);}
						}
						else if(text.substring(index2).indexOf(str2)==0){
							
							//alert(text.substring(index1+str.length,index2));
							gBrowser.loadOneTab(text.substring(index1+str.length,index2));
						}
						else{
							gBrowser.loadOneTab("http://www.lkong.net/book.php?mod=add");
						}
				}
				//window.open(text.substring(index1+str.length,index2),"_blank");
				
			  
			};
			request.open("GET", url, true);
			request.send(null);
	  }
}

/**
 * Controls the browser overlay for the Hello World extension.
 */
lkongrate.BrowserOverlay = {
  /**
   * Says 'Hello' to the user.
   */
		bookmark : function(aEvent) {
			  var href=gBrowser.contentDocument.location.href;
			  
			 
				  var data1=getChapter();
				  var chapter=data1[0];
				  var link=data1[1];
				  
				  var title=decodeURIComponent(getTitle());
				  if(title==""){
					  var name=prompt("Please enter title","");
					  if (name!=null && name!="")
					    {
					    title=name;
					    } 
				  }
				  let dbConn = Services.storage.openDatabase(file);
				  dbConn.executeSimpleSQL("CREATE TABLE IF NOT EXISTS lk_book  (chapter TEXT, book_name TEXT, link TEXT, booklist TEXT)");
				  var statement = dbConn.createStatement("SELECT * FROM lk_book WHERE book_name = :parameter");
				  statement.params.parameter = title;
				  let existflag=false;
				  statement.executeAsync({
					  handleResult: function(aResultSet) {
						  existflag=true;
						  if(aResultSet.getNextRow()!=null) 
							  {
								  dbConn.executeSimpleSQL("UPDATE lk_book SET link='"+href+"',chapter='"+decodeURIComponent(chapter)+"' WHERE book_name='"+title+"'");
								  alert("update");
							  }
								 
							  
					  
					  },
					 
					  handleError: function(aError) {
					    alert("Error: " + aError.message);
					  },
					 
					  handleCompletion: function(aReason) {
					    if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
					      alert("Query canceled or aborted!");
					    else if(!existflag){
					    	 dbConn.executeSimpleSQL("INSERT INTO lk_book VALUES('"+decodeURIComponent(chapter)+"','"+title+"','"+href+"','')" );
							  alert("insert");
					    }
					    //else alert(existflag);
					  }
					});
				  
				  dbConn.asyncClose();
				 
			  
		  
			  },
  about:function(aEvent){
	  gBrowser.loadOneTab("https://addons.mozilla.org/en-US/firefox/addon/lkong-rate/");
  },
  sayHello : function(aEvent) {
	  lkongrate1(aEvent);
	  
	 
  },
  showbookmark : function(aEvent) {
	  gBrowser.addTab("http://www.lkong.net/home.php?mod=space&do=booklist&view=me");
  }
	
};

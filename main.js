
		$(document).ready(function(){		//moving carousel with on screen buttons

			$('#left').click( function() {
				$('#carousel').animate({		
				'marginLeft' : "+=50px"
				});
			});
			
			$('#right').click( function() {
				$('#carousel').animate({
				'marginLeft' : "-=50px"
				});
			});
		
		});

		$(document).keydown(function(e) { //moving carousel with key press
			switch (e.which) {
				case 37:
				$('#carousel').animate({
					'marginLeft' : "+=50px" //moves left
				});
			break;
				case 39:
				$('#carousel').animate({
					'marginLeft' : "-=50px" //moves right
				}); 
			break;
			}
		})
		
		function init() 
		{
			document.getElementById("findImages").addEventListener("click",getPhotos);		//findImage button 
			document.getElementById("addTag").addEventListener("click",newTagTextField);	//addTag button
		}
		var loader = new Image();
		loader.src = "loader.gif";
		var imageArray=[];
		//var innerLeftOffset=0;

		function newTagTextField() {
		
			var newTag = document.createElement("input");		//create a new tag text field
			newTag.setAttribute("id", "tag");
			newTag.setAttribute("type", "text");
			newTag.setAttribute("name", "tag");
			document.getElementById("tagsDisplayed").appendChild(newTag);		//put it inside new Div 
			
			var button = document.createElement("button");			//create a new delete button 
			var minus = document.createTextNode("-");
			button.setAttribute ("id", "deleteBtn");
			button.appendChild(minus);
			document.getElementById("tagsDisplayed").appendChild(button);	//put it inside new Div  
			
			button.addEventListener('click', function() { 					//when deleteBtn is clicked 
				newTag.parentNode.removeChild(newTag)					//deletes the text field
				button.parentNode.removeChild(button)					//deletes the deleteBtn				
			}, false);
		
		}
		

		function getPhotos()
		{
		
			var tagArray = new Array();
			tagArray = document.getElementsByTagName( 'input' ) // store collection of all input elements
			stringTagRequest="";
			stringOfTags="";
			for ( i = 0; i < tagArray.length; i++ )
			{ 
				stringOfTags += tagArray[i].value+ ","	// create a string of all the tags
				stringTagRequest=escape(stringOfTags); //creates a string for request (Escaping Special Characters)
			}
			
			if (stringTagRequest=="%2C"){				//if first text field has no tag (,)
				stringTagRequest="";
				
				document.getElementById('findImages').innerHTML = "Find Images";
				document.getElementById('carousel').innerHTML = "";
				document.getElementById('output').innerHTML = "No Tag Selected";
			}
			else{
				 newScript = document.createElement('script');
				 request = "https://www.flickr.com/services/rest/?";
				 request += "method=flickr.photos.search";
				 request += "&per_page=10";	 
				 request += "&api_key=0d5a7e70600be4275c1d2c0bd5989e90";
				 request += "&tags="+stringTagRequest; //input the string of tags for request
				 request += "&format=json";
				 request += "&tag_mode=all";
				 newScript.setAttribute('src',request);
				 document.getElementsByTagName('head')[0].appendChild(newScript);
				 document.getElementById('findImages').innerHTML = "Loading ...";
				 $('#carousel').html(loader);	//gif in carousel 
			 }
		}
			
		function jsonFlickrApi(images)
		{
			newStr ="<ul id='thumbs'>";
			mainImage="<ul id='thumbs'>";
			var nrOfImages=images.photos.photo.length;	

			 for (i = 0; i < images.photos.photo.length; i++ )		//loop and create url
			 {
				url = "http://farm" + images.photos.photo[i].farm ;

				url += ".static.flickr.com/" ;

				url += images.photos.photo[i].server + "/";

				url += images.photos.photo[i].id + "_";

				url += images.photos.photo[i].secret;
				 
				var urlSmall = "_s.jpg";		//	for thumbnails
				var urlMain = "_b.jpg";			//for main image
				
				imageArray[i]=url+urlMain;		//mainImage url of large size
				
				newStr += " <li><img id=\"thumbs_"+i+"\" onclick='get_Image()' src = " + url + urlSmall+"></li>";	//onclick thumbnail
				mainImage += " <li><img id=\"thumbs_"+i+"\" src = " + url + urlMain+"></li>";
			 }
			if (newStr=="<ul id='thumbs'>"){	//if empty
				newStr+="</ul>";
				mainImage+="</ul>";
				document.getElementById('output').innerHTML = "No results found";
				document.getElementById('findImages').innerHTML = "Find Images";
				document.getElementById('carousel').innerHTML = "";
				
			}
			else{
				newStr+="</ul>";
				mainImage+="</ul>";
				document.getElementById('carousel').innerHTML = newStr;		//display carousel

				document.getElementById('output').innerHTML = "";
				pos_Image();
				document.getElementById('findImages').innerHTML = "Find Images";
			}
			
		} 
	 
		function get_Image(){		//to display main image from thumbnail selected
			var tags_li = document.getElementsByTagName('li');		
			var numList_li = tags_li.length;		
			for ( var i = 0; i < numList_li; i++ ) (function(i){ 	 
				tags_li[i].onclick = function() {

					var imageSrc = imageArray[i];		//url of selected 
					document.getElementById('output').innerHTML = "<img src="+imageSrc+">";	//display out to main image
					return false;
				}
			})(i)			
		}
		
		
		function pos_Image(){
			halfOuterW = document.getElementById("outerContainer").offsetWidth / 2;
			halfImageW = document.getElementById("thumbs_0").offsetWidth / 2; 
			outerLeftOffset = halfOuterW - halfImageW;
			innerLeftOffset = document.getElementById("thumbs_0").offsetLeft;
			var leftPos = outerLeftOffset - innerLeftOffset;
			
			document.getElementById("carousel").style.left = leftPos + "px";
		}
	
		
	 
window.onload = init;

		
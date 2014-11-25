var Locker=function(){
	this.lastEncounteredDiv=null;
	this.isRecordingInProcess=false;
	this.init = function(){
		this.addEventsToButton();
		this.patternString=localStorage.getItem("patternString")||"";
		console.log(this.patternString);
		if(this.patternString!=""){
			document.querySelector(".heading").innerText="Draw the pattern to unlock"
		}
	}

	this.addEventsToButton=function(){
		var thisObj=this;
		this.allLockButtons=document.getElementsByClassName("lockButton");

		for (var i = this.allLockButtons.length - 1; i >= 0; i--) {
			this.allLockButtons[i].setAttribute("index",i);
			console.log(this.allLockButtons[i]);
					//MousedownEvent
					thisObj.allLockButtons[i].addEventListener("mousedown",function(event){
						thisObj.isRecordingInProcess=true;
						thisObj.lastEncounteredDiv=this;
						thisObj.patternString=this.getAttribute("index");
						this.style.background="red";
					});

					//MouseUp - Ideally it should be on conatiner class but since its a browser and user can click anywhere i am keeping it windows
					window.onmouseup=function(event){
						var thisObj=window.lockerObject;
						thisObj.isRecordingInProcess=false;
						if(thisObj.patternString.length<4){
							alert("Please choose 4 buttons atleast");
							thisObj.reset();
							return;
						}
						if(localStorage.getItem("patternString")){ // Checks if patter is already saved or not
							if(localStorage.getItem("patternString")==thisObj.patternString){ //if pattern matches
								for (var i = 0; i < thisObj.patternString.length; i++) {
									document.querySelector(".lockButton[index='"+thisObj.patternString[i]+"']").style.background="green";
								};
								var lines=document.querySelectorAll(".line")
								for (var i = 0; i < lines.length; i++) {
									lines[i].style.background="green";
								};
								alert("Awesome! . Pattern Matched");
								window.location=window.location	
							}else{ //if doesn't match 
							document.querySelector(".heading").innerText="Incorrect Pattern!"
							thisObj.reset();
						}

					}else{
						localStorage.setItem("patternString",thisObj.patternString);
						alert("Patter Saved!");
						window.location=window.location;
					}
				};

					//MouseOver
					thisObj.allLockButtons[i].addEventListener("mouseover",function(event){
						console.log(thisObj.isRecordingInProcess);
						if(thisObj.isRecordingInProcess && (this.getAttribute("visited")!="true")){
							this.style.background="red";
							thisObj.drawLine(thisObj.lastEncounteredDiv,this);
							thisObj.lastEncounteredDiv=this;
							thisObj.patternString+=this.getAttribute("index");
							console.log(thisObj.patternString);
							this.setAttribute("visited","true")

						}
					});
				};
			}

			//Draws a line by calculating distance between two centeres and calculating the angle
			this.drawLine=function(div1,div2){
				console.log(div1,div2);
				var div1CenterPoint=this.getCenterOfDiv(div1);
				var div2CenterPoint=this.getCenterOfDiv(div2);
				var lengthOfLine=Math.sqrt(((div1CenterPoint.x - div2CenterPoint.x) * (div1CenterPoint.x - div2CenterPoint.x)) + ((div1CenterPoint.y - div2CenterPoint.y) * (div1CenterPoint.y - div2CenterPoint.y)));
				var angle = Math.atan2((div1CenterPoint.y - div2CenterPoint.y),(div1CenterPoint.x - div2CenterPoint.x))*(180/Math.PI);
				var centerPoint={"x":((div1CenterPoint.x+div2CenterPoint.x)/2)-(lengthOfLine/2),"y":((div1CenterPoint.y+div2CenterPoint.y)/2)-(5/2)};
				var line = "<div class='line' style='height:5px; background-color:darkRed; line-height:1px; position:absolute; left:" + centerPoint.x + "px; top:" + centerPoint.y + "px; width:" + lengthOfLine + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
				var node = document.createElement("div");
				node.innerHTML=line;
				(document.getElementsByClassName("mainContainer")[0]).appendChild(node.firstChild);
			}

			this.getCenterOfDiv=function(elem){
				var rect = elem.getBoundingClientRect();
				console.log(rect);
				return {"x":rect.left+(rect.width/2),"y":rect.top+(rect.height/2)};				
			}

			this.reset=function(){
				this.allLockButtons=document.getElementsByClassName("lockButton");
				for (var i = this.allLockButtons.length - 1; i >= 0; i--) {
					this.allLockButtons[i].style.background="#999";
					this.allLockButtons[i].setAttribute("visited","false");
				}

				var lines=document.querySelectorAll(".line")
				for (var i = 0; i < lines.length; i++) {
					var child=lines[i];
					child.parentNode.removeChild(child);
				}

				this.patternString="";

			}
			this.init();
		};
		
		if(!window.lockerObject){
			var lockerObject=new Locker();	
		}
		

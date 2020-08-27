var mainController = (function(UIController){
    var DOM = UIController.DOM;
    DOM.btnUpload.addEventListener("change", function(element){
        document.querySelector(".captionobtained").innerHTML = "";
        if(document.querySelector(".noimg")){
            UIController.DeleteObj(document.querySelector(".noimg"));
        }

        if(document.querySelector(".imgwrapper")){
            imgs = document.querySelectorAll(".imgwrapper");
            imgs.forEach(function(){
                UIController.DeleteObj(document.querySelector(".imgwrapper"));
            });
        }

        if(document.querySelector(".mainimg")){
            UIController.DeleteObj(document.querySelector(".mainimg"));
        }
        if(document.querySelector(".nomainimg")){
            UIController.DeleteObj(document.querySelector(".nomainimg"));
        }

        UIController.insertObj(document.querySelector(".mainimgwrapper"), '<div class="nomainimg"></div>');
        
        var numFiles = element.target.files.length;

        if(numFiles > 3){
            DOM.sidebar.style.alignItems = "flex-start";
        }
        else{
            DOM.sidebar.style.alignItems = "center";
        }

        for(var i=0; i<numFiles; i++){
            var reader = new FileReader();
            /* reader.onload = function(e){
                console.log(e.target.fileName);
                var el='<div class="imgwrapper"><img src="' +  e.target.result + '" alt=""><div class="imgblind"><div class="btn-process" onclick="displayImage(this)" data-img="' +  e.target.result + '" data-imgname=""><span class="gradienttext">PROCESS</span></div></div></div>';
                UIController.insertObj(document.querySelector(".imgcontentwrapper"), el);
            };
            reader.readAsDataURL(element.target.files[i]); */

            reader.onload = (function(file) {
                return function(e) {
                    createListItem(e, file)
                };
            })(element.target.files[i]);
            reader.readAsDataURL(element.target.files[i]);
        }

        function createListItem(e, file){
            var el='<div class="imgwrapper"><img src="' +  e.target.result + '" alt=""><div class="imgblind"><div class="btn-process" onclick="displayImage(this)" data-img="' +  e.target.result + '" data-imgname="' + file.name + '"><span class="gradienttext">PROCESS</span></div></div></div>';
            UIController.insertObj(document.querySelector(".imgcontentwrapper"), el);
        }
    });
})(UIController);
        
var displayImage = function(el){
    document.querySelector(".captionobtained").innerHTML = "";
    filename = el.dataset.imgname;
	$.ajax({
		url: "/predict",
		data: {
			"csrfmiddlewaretoken": $(".filename").siblings("input[name='csrfmiddlewaretoken']" ).val(),
			"filename": filename
		},
		method: "POST",
		dataType: "json",
		success : function(data){
            console.log("Succeeded");
            var caption = data.desc.split(" ");
            var finalCaption = "";
            for(var i=0; i< caption.length; i++){
                if(caption[i] != "startseq" && caption[i] != "endseq"){
                    finalCaption += caption[i] + " ";
                }
            }
            document.querySelector(".captionobtained").innerHTML = titleCase(finalCaption);
        },
        error: function(){
            console.log("Error occured");
        }
    });
    
    if(document.querySelector(".mainimg")){
        UIController.DeleteObj(document.querySelector(".mainimg"));
    }
    if(document.querySelector(".nomainimg")){
        UIController.DeleteObj(document.querySelector(".nomainimg"));
    }
    var obj = '<div class="mainimg"><img src="' + el.dataset.img + '" alt=""></div>';
    UIController.insertObj(document.querySelector(".mainimgwrapper"), obj);
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
 }
 
var UIController = (function(){
    var DOM = {
        btnUpload: document.querySelector(".btn-upload"),
        sidebar: document.querySelector(".sidebar")
    };

    return{
        DOM: DOM,
        DeleteObj: function(obj){
            obj.parentNode.removeChild(obj);
        },
        insertObj: function(parent, obj, state = 'afterbegin'){
            parent.insertAdjacentHTML(state, obj);
        }
    }
})();
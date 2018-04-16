$(function () {
    var resultArray = [];


    class InputString {
        constructor(showItems, inputItems) {
            this.showItems = showItems;
            this.inputItems = inputItems;
        }
        get getShowItems() {
            return this.showItems;
        }
        get getInputItems() {
            return this.inputItems;
        }
    }

   


    function inputAutofocus() {
        $('#inputString').focus();
        //this moves to the begining of the input;

        moveCursorToEnd();
        setTimeout(inputAutofocus, 5);
    }

    function moveCursorToEnd() {
        var tmpStr = $('#inputString').val();
        $('#inputString').val('');
        $('#inputString').val(tmpStr);
    }

    function checkFirtCharNull(inputS){      
        if (inputS.length === 1 && inputS === "0"){           
            $("#inputString").text("");
            $("#inputString").val("");
        }
    }
     
    function addNumber(e) {
        var inputVal = $("#inputString").val();
        //  alert(inputText+" : "+inputVal);

        var currentInput = $(e).text();
        $("#inputString").text(inputVal + currentInput);
        $("#inputString").val(inputVal + currentInput);
    }

 
   // allowing only a couple of keys to operate
   $("#inputString").keydown(function (e) {
        // Allow: backspace, delete,  enter, .   
        if ($.inArray(e.keyCode, [46, 8, 13, 110, 190]) !== -1) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });



   // managing events from the calculator screen: number buttons 0-9
    $(document).on("click", ".btn-type-1", function () {
        var testStart = $("#inputString").val();
        checkFirtCharNull(testStart);
        addNumber(this);
    });
    
    
    // managing events from the calculator screen: button +-
    $(document).on("click", ".btn-type-7", function () {
       var testStart = $("#inputString").val();
       if(testStart!=0){
        (testStart.substring(0,1)==="-")?$("#inputString").val( testStart.substring(1)):$("#inputString").val( "-"+testStart);   
       }  
    });
    
    $(document).on("click", ".btn-type-2", function () {
       var testStart = $("#inputString").val();
       var inputString=new InputString(testStart, testStart);
       resultArray.push(inputString);
       var operatorString= new InputString($(this).text(),$(this).val());
       resultArray.push(operatorString);
    });
    
    
    // managing events from the calculator screen: button .
    $(document).on("click", ".btn-type-8", function () {
        var testStart = $("#inputString").val();
        var decimalPosition=testStart.indexOf(".");        
           if(decimalPosition<0){
              $("#inputString").val(testStart+".");
           }
    });


   //managing event from the keys
    $(document).on("keydown", function (e) {
        var testStart = $("#inputString").val();       
        if ((!e.shiftKey && (e.keyCode > 48 && e.keyCode < 57)) || (e.keyCode > 96 && e.keyCode < 105)) {
           checkFirtCharNull(testStart); 
           return;
        }
        if(e.keyCode===110){
           var decimalPosition=testStart.indexOf(".");        
           if(decimalPosition>0){
              e.preventDefault();
           }
        }
    });


    



    $(document).ready(function () {
        //inputAutofocus();

    });
    ;
});



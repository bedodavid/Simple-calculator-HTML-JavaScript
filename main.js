$(function () {
    var resultArray = [];
    var mathResultInput = 0;
    var afterOperator = false;
    var aftercomplex = "";
    var inputBeforeComplex = "";
    var storedMemory = 0;

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


    function formatNumberToFloating(resultString) {
        var rsStrLgt = resultString.length;
        var decinamlPos=resultString.indexOf(".");
        var resultNumber;
        // FORMATING the result, how it will be showed in the input space 
        if (decinamlPos !== -1) {
            if (rsStrLgt > 16) {                
                resultNumber = Number.parseFloat(resultString);
                if (resultNumber>9999999999999999.9){
                    resultNumber = Number.parseFloat(resultString).toExponential(16); 
                }
                
            } else {
                resultNumber = Number.parseFloat(resultString);
            }
        } else {
            if (rsStrLgt > 16) {
                resultNumber = Number.parseInt(resultString).toExponential(16);
            } else {
                resultNumber = Number.parseInt(resultString);
            }
        }
        return resultNumber;
    }
   /* function roundNumber(inputString){
        var needRounded=true;
        var decimalPosition=inputString.indexOf(".");
        var inputLength=inputString.length;
        var i=decimalPosition;
        if (decimalPosition!=-1){
            while(needRounded&&i<inputLength-3){
                if (inputString.charAt(i)!=0||inputString.charAt(i)!=9){
                  needRounded=false;  
                }
                i++;
            }
        }
        return needRounded;        
    }  */
   
   
   function clearAll(){
       resultArray.length = 0;
       mathResultInput = 0;
       $('#inputString').val("0");
       $('#inputString').text("0");
       $("#showInput").text(" ");
       aftercomplex = "";
       inputBeforeComplex = "";
   }
   
   
    function manageShowComplex(result, value, firstPart, secondPart) {
        var resultString = result.toString();
        var resultNumber = formatNumberToFloating(resultString);

        if (aftercomplex === "") {
            aftercomplex = firstPart + value + secondPart;
        } else {
            aftercomplex = firstPart + aftercomplex + secondPart;
        }

        /* CHECKING: if any secondary operation is clicked the first time
         yes: then save all the calculations made before the secondary operation into: "inputBeforeComplex"
         
         if is not the first secondary operation than just adds the current operation to the saved trunk. 
         !!! IMPORTANT $("#showInput").html=" " as otherwise the inputBeforeComplex will be an empty string and this will allow a second
         time to save the "inputBeforeComplex" if the trunk is an EMPTY string 
         (this happens in case of just secondary operations are performed, so the first save is an empty string) */

        var inputBeforeComplexLength = inputBeforeComplex.length;
        if (inputBeforeComplexLength === 0) {
            inputBeforeComplex = $("#showInput").html();
        }
        $("#showInput").html(inputBeforeComplex + aftercomplex);

        return resultNumber;
    }


    function secondaryOperations(inputvalue, operator) {
        var value = BigNumber(inputvalue);
        var result;
        var resultNumber;
        switch (operator) {
            case "sqrt":
            {
                result = value.squareRoot();
                resultNumber = manageShowComplex(result, value, "&#8730(", ")");
                break;
            }
            case "inv":
            {
                var one = BigNumber(1);
                result = one.dividedBy(value);
                resultNumber = manageShowComplex(result, value, "1/(", ")");
                break;
            }
            case "pow2":
            {
                result = value.times(value);
                resultNumber = manageShowComplex(result, value, "(", ")<sup>2</sup>");
                break;
            }
            case "pow3":
            {
                result = value.times(value).times(value);
                resultNumber = manageShowComplex(result, value, "(", ")<sup>3</sup>");
                break;
            }
            case "percent":
            {
                var base = BigNumber(mathResultInput);
                result = base.times(value).div(100);               
                resultNumber = result;
            }
        }

        $('#inputString').val(resultNumber);
        $('#inputString').html(resultNumber);
    }


    function simpleAritmetic(basicNumber, addendum, operator) {
        var addNumber = BigNumber(addendum);
        var base = BigNumber(basicNumber);
        switch (operator) {
            case "+":
            {
                base = base.plus(addNumber);
                mathResultInput = base;
                break;
            }
            case "-":
            {
                base = base.minus(addNumber);
                mathResultInput = base;
                break;
            }
            case "*":
            {
                base = base.times(addNumber);
                mathResultInput = base;
                break;
            }
            case "/":
            {
                base = base.dividedBy(addNumber);
                mathResultInput = base;
                break;
            }
        }
    }
   
    function showScrollButtons(){
        $(".scrollLabel").css("visibility","visible");
        
    };
   
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

    function checkFirtCharNull(inputS) {
        if (inputS.length === 1 && inputS === "0") {
            $("#inputString").text("");
            $("#inputString").val("");
        }
    }

    function addToArray(inputValue, showValue) {
        var inputModel = new InputString(inputValue, showValue);
        resultArray.push(inputModel);
    }

    function updateArray(inputValue, showValue, position) {
        var inputModel = new InputString(inputValue, showValue);
        resultArray[position] = inputModel;
    }

    function showHistory(inputName) {
        var arrayLenght = resultArray.length;
        var showString = "";
        for (i = 0; i < arrayLenght - 1; i += 2) {
            var storedNumber = resultArray[i].getShowItems;
            if (storedNumber.substring(0, 1) === "-") {
                storedNumber = "(" + storedNumber + ")";
            }
            var storedOperator = resultArray[i + 1].getShowItems;
            showString = showString + storedNumber + " " + storedOperator + " ";
        }
        if(inputName=="#txtAreaHistory"){
          $(inputName).html( $(inputName).html()+"\n"+showString+"\n"+$("#inputString").val());     
        }else{
          $(inputName).html(showString);
          if (showString.length>47){
            showScrollButtons();    
          }          
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

  $("#scrollRight").on("click", function () {
     $("#showInput").scrollLeft($("#showInput").scrollLeft()+10);     
  });
  
  $("#scrollLeft").on("click", function () {
     $("#showInput").scrollLeft($("#showInput").scrollLeft()-10);     
  });


    // managing events from the calculator screen: number buttons 0-9
    $(document).on("click", ".btn-type-1", function () {
        inputBeforeComplex = "";
        var testStart = $("#inputString").val();
        checkFirtCharNull(testStart);
        if (!afterOperator) {
            addNumber(this);
        } else {
            $("#inputString").val("");
            addNumber(this);
            afterOperator = false;
        }

    });

    $(document).on("click", ".btn-type-2", function () {
        inputBeforeComplex = "";
        var inputString = $("#inputString").val();

        if (!afterOperator) {
            if (aftercomplex === "") {
                addToArray(inputString, inputString);
            } else {
                addToArray(aftercomplex, inputString);
                aftercomplex = "";
            }
            addToArray($(this).text(), $(this).val());

            if (resultArray.length > 2) {
                var arrayLength = resultArray.length;
                var addendum = resultArray[arrayLength - 2].getInputItems;
                var operator = resultArray[arrayLength - 3].getInputItems;
                simpleAritmetic(mathResultInput, addendum, operator);
                afterOperator = true;
            } else {
                mathResultInput = resultArray[0].getInputItems;
                afterOperator = true;
            }
        } else {
            updateArray($(this).text(), $(this).val(), resultArray.length - 1);
            afterOperator = true;
        }
        showHistory("#showInput");
        var resultNumber=formatNumberToFloating(mathResultInput.toString());
        $("#inputString").text(resultNumber);
        $("#inputString").val(resultNumber);
    });


    //managing the "bit" more complex operations %, 1/x, sqrt, x^2, x^3
    $(document).on("click", ".btn-type-3", function () {
        var inputString = $("#inputString").val();
        secondaryOperations(inputString, $(this).val());
        afterOperator = false;
    });



    // managing events from the calculator screen: button AC
    $(document).on("click", ".btn-type-4", function () {
        var operation = $(this).val();
        if (operation === "clear") {
            clearAll();
        } else {
            var inputStr = $('#inputString').val();
            if (inputStr.length > 0) {
                inputStr = inputStr.substr(0, inputStr.length - 1);
                $('#inputString').val(inputStr);
                $('#inputString').text(inputStr);
                afterOperator = false;
            } else {
                $('#inputString').val("0");
                $('#inputString').text("0");
            }



        }

    });

    $(document).on("click", ".btn-type-5", function () {
        var memoryOperation = $(this).val();
        switch (memoryOperation) {
            case "ms":
            {
                storedMemory = $('#inputString').text();
                $("#mr").prop("disabled", false);
                $("#mc").prop("disabled", false);
                break;
            }
            case "m+":
            {
                memValue = BigNumber(storedMemory);
                simpleAritmetic($('#inputString').val(), memValue, "+");
                $("#inputString").text(mathResultInput);
                $("#inputString").val(mathResultInput);
                aftercomplex = "";
                inputBeforeComplex = "";
                break;
            }
            case "m-":
            {
                memValue = BigNumber(storedMemory);
                simpleAritmetic($('#inputString').val(), memValue, "-");
                $("#inputString").text(mathResultInput);
                $("#inputString").val(mathResultInput);
                aftercomplex = "";
                inputBeforeComplex = "";
                break;
            }
            case "mc":
            {
                storedMemory = 0;
                $("#mr").prop("disabled", true);
                $("#mc").prop("disabled", true);
                break;

            }
            case "mr":
            {
                $("#inputString").text(storedMemory);
                $("#inputString").val(storedMemory);
                break;

            }

        }

    });

// MANAGE the "Equal" UI button  ("enter" from the keyboard)
 $(document).on("click", ".btn-type-6", function () {
     inputBeforeComplex = "";
        var inputString = $("#inputString").val();       
            if (aftercomplex === "") {
                addToArray(inputString, inputString);
            } else {
                addToArray(aftercomplex, inputString);
                aftercomplex = "";
            }
            addToArray($(this).text(), $(this).val());

            if (resultArray.length > 2) {
                var arrayLength = resultArray.length;
                var addendum = resultArray[arrayLength - 2].getInputItems;
                var operator = resultArray[arrayLength - 3].getInputItems;
                simpleAritmetic(mathResultInput, addendum, operator);               
            } else {
                mathResultInput = resultArray[0].getInputItems;               
            }        
       
        var resultNumber=formatNumberToFloating(mathResultInput.toString());        
        $("#inputString").val(resultNumber);
        showHistory("#txtAreaHistory");
        clearAll();        
    });



    // managing events from the calculator screen: button +-
    $(document).on("click", ".btn-type-7", function () {
        var testStart = $("#inputString").val();
        if (testStart != 0) {
            (testStart.substring(0, 1) === "-") ? $("#inputString").val(testStart.substring(1)) : $("#inputString").val("-" + testStart);
        }
        afterOperator = false;

    });

    // managing events from the calculator screen: button .
    $(document).on("click", ".btn-type-8", function () {
        if (!afterOperator) {
            var testStart = $("#inputString").val();
            var decimalPosition = testStart.indexOf(".");
            if (decimalPosition < 0) {
                $("#inputString").val(testStart + ".");
            }
        } else {
            $("#inputString").val("0.");
            $("#inputString").text("0.");
        }

        afterOperator = false;
    });


    //managing event from the keys
    $(document).on("keydown", function (e) {
        var testStart = $("#inputString").val();
        if ((!e.shiftKey && (e.keyCode > 48 && e.keyCode < 57)) || (e.keyCode > 96 && e.keyCode < 105)) {
            checkFirtCharNull(testStart);
            return;
        }
        if (e.keyCode === 110) {
            var decimalPosition = testStart.indexOf(".");
            if (decimalPosition > 0) {
                e.preventDefault();
            }
        }
    });
    $(document).ready(function () {
//inputAutofocus();

    });
    ;
});



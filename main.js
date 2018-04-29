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
    

    function secondaryOperations(inputvalue, operator) {
        var value = BigNumber(inputvalue);       
        var result;
        var inputBeforeComplexLength = inputBeforeComplex.length;
        

        switch (operator) {
            case "sqrt":
            {
                result = value.squareRoot();
                if (aftercomplex === "") {
                    aftercomplex = "&#8730(" + value + ")";
                } else {
                    aftercomplex = "&#8730(" + aftercomplex + ")";
                }

                break;
            }
            case "inv":
            {
                var one = BigNumber(1);
                result = one.dividedBy(value);
                if (aftercomplex === "") {
                    aftercomplex = "1/(" + value + ")";
                } else {
                    aftercomplex = "1/(" + aftercomplex + ")";
                }
                break;
            }
            case "pow2":
            {
                result = value.times(value);
                var resultString=result.toString();
                var rsStrLgt=resultString.length;                
                if (rsStrLgt>17){
                   var resultNumber=Number.parseFloat(resultString).toExponential(16); 
                } else{
                   var resultNumber=Number.parseFloat(resultString); 
                }               
                if (aftercomplex === "") {
                    aftercomplex = "(" + value + ")<sup>2</sup>";
                } else {
                    aftercomplex = "(" + aftercomplex + ")<sup>2</sup>";
                }
                break;
            }
            case "pow3":
            {
                result = value.times(value).times(value);
                
                if (aftercomplex === "") {
                    aftercomplex = "(" + value + ")<sup>3</sup>";
                } else {
                    aftercomplex = "(" + aftercomplex + ")<sup>3</sup>";
                }
                break;
            }
        }
        $('#inputString').val(resultNumber);
        $('#inputString').html(resultNumber);
        if (inputBeforeComplexLength === 0) {
            inputBeforeComplex = $("#showInput").html();           
        }
        $("#showInput").html(inputBeforeComplex + aftercomplex);

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

    function showHistoryLabel() {
        var arrayLenght = resultArray.length;
        var showString = "";
        for (i = 0; i < arrayLenght - 1; i += 2) {
            var storedNumber = resultArray[i].getShowItems;
            if (storedNumber.substring(0, 1) === "-") {
                storedNumber = "(" + storedNumber + ")";
            }
            var storedOperator = resultArray[i + 1].getShowItems;
            showString = showString + storedNumber + storedOperator;
        }
        $("#showInput").html(showString);
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
        showHistoryLabel();
        $("#inputString").text(mathResultInput);
        $("#inputString").val(mathResultInput);
    });


    //managing the "bit" more complex operations %, 1/x, sqrt, x^2, x^3
    $(document).on("click", ".btn-type-3", function () {
        var inputString = $("#inputString").val();
        secondaryOperations(inputString, $(this).val());
        afterOperator = false;
    });



    // managing events from the calculator screen: button AC
    $(document).on("click", ".btn-type-4", function () {
        var operation=$(this).val();
        if (operation==="clear"){
         resultArray.length = 0;
         mathResultInput = 0;
        $('#inputString').val("");
        $('#inputString').text("0");
        $("#showInput").text("");
        aftercomplex = "";
        inputBeforeComplex = "";   
        }else{
            var inputStr=$('#inputString').val();
            inputStr=inputStr.substr(0,inputStr.length-1);
            if(inputStr.length>0){             
            $('#inputString').val(inputStr);
            $('#inputString').text(inputStr);   
            }else{
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



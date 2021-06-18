var question_nav = document.querySelectorAll(".question-number");
var question_num = document.querySelectorAll(".num");
var question_container = document.querySelectorAll(".question-container");
var single_question = document.querySelectorAll(".single-question");
var down_caret = document.querySelectorAll(".down-caret");
var all_answers_container = document.querySelectorAll(".all-answers-container");
var answer_container = document.querySelectorAll(".single-answer-container");

var shipment_options = new Array(2);

var field_input = document.querySelectorAll(".field-input");

/* TAKES CARE OF ROTATING CARET AND DISPLAYING OPTIONS WHEN QUESTION IS CLICKED */

document.querySelectorAll(".down-caret").forEach( caret => {
    caret.addEventListener("click", function() {
        if(caret.style.transform === "rotate(180deg)" && caret.parentElement.nextElementSibling.style.display === "flex") {
            caret.parentElement.nextElementSibling.style.display = "none";
            caret.style.transform = "rotate(0deg)";
        }
        else {
            caret.parentElement.nextElementSibling.style.display = "flex";
            caret.style.transform = "rotate(180deg)";
        }
    })
})

/* TAKES CARE OF HIGHLIGHTING LEFTSIDE QUESTION NAV WHEN CORRESPONDING QUESTION IS HOVERED */

for(let i = 0; i < question_container.length; i++){
    question_container[i].addEventListener("mouseenter", function() {
        question_nav[i].classList.add("question-number-active");
        question_num[i].classList.add("num-active");
    })

    question_container[i].addEventListener("mouseleave", function() {
        question_nav[i].classList.remove("question-number-active");
        question_num[i].classList.remove("num-active");
    })
}

/* TAKES CARE OF HIGHLIGHTING ANSWERS ACCORDINGLY */

var place_holder = new Array(5);

for(let i = 0; i < all_answers_container.length; i++){
    let answer_picked = false;

    for(let j = i*3; j < 3*i + 3; j++){ 
        answer_container[j].addEventListener("click", function(){
            if( answer_picked === true ){
                if( place_holder[i] == 0 ) {
                    capsuleDeselected();
                }
                answer_container[place_holder[i]].classList.remove("single-answer-container-click");
                answer_container[j].classList.add("single-answer-container-click");
                place_holder[i] = j;

                if( place_holder[i] == 0 ) {
                    capsuleSelected();
                }

                if( place_holder[i] == 6 || place_holder[i] == 7 || place_holder[i] == 8) {
                    order_size = place_holder[i];
                    shipmentPrices(place_holder[i]);
                }

                if( place_holder[i] == 12 || place_holder[i] == 13 || place_holder[i] == 14) {
                    delivery_window = place_holder[i];
                }

                answer_picked = true;
            }
            else {
                place_holder[i] = j;

                if( place_holder[i] == 0 ) {
                    capsuleSelected();
                }

                if( place_holder[i] == 6 || place_holder[i] == 7 || place_holder[i] == 8) {
                    order_size = place_holder[i];
                    shipmentPrices(place_holder[i]);
                }

                if( place_holder[i] == 12 || place_holder[i] == 13 || place_holder[i] == 14) {
                    delivery_window = place_holder[i];
                }

                answer_container[j].classList.add("single-answer-container-click");
                answer_picked = true;
            }
            orderSummary(i, place_holder[i], place_holder);
            checkFive(place_holder);
        })
    }
}

/* ORDER SUMMARY MODAL */

var order_summary_content = document.querySelector(".order-summary");
var order_summary_modal_content = document.querySelector(".order-summary-checkout");
var order_summary_modal_container = document.querySelector(".order-summary-modal-container");
var checkout_total = document.querySelector(".checkout-total-num");

document.querySelector(".order-summary-button").addEventListener("click", function(){
    monthly_cost = calculateMonthlyCost(order_size, delivery_window);
    order_summary_modal_container.style.display = "flex";
    order_summary_modal_container.style.pointerEvents = "auto";
    order_summary_modal_content.innerHTML = order_summary_content.innerHTML;
    checkout_total.textContent = monthly_cost.toFixed(2);
    document.querySelector(".modal-backdrop").style.display = "block";
    window.scrollTo(0, 0);
})

/* HELPER METHODS */

/* TAKES CARE OF CASE IN WICH CAPSULE IS SELECTED AS AN ANSWER FOR QUESTION 1 */
function capsuleSelected() {
    single_question[3].classList.add("disable");
    all_answers_container[3].classList.add("disable");
    down_caret[3].style.pointerEvents = 'none';
}

function capsuleDeselected() {
    single_question[3].classList.remove("disable");
    all_answers_container[3].classList.remove("disable");
    down_caret[3].style.pointerEvents = 'auto';
}

/* TAKES CARE OF ORDER SUMMARY */
function orderSummary(input_index, answer_index, place_holder ) {
    var capsule_option;
    for(let i = 0; i < place_holder.length; i++) {
        if(place_holder[i] === 0) {
            capsule_option = true;
        }
    }
    
    if (capsule_option === true) {
        document.querySelector(".if-capsule").textContent = "using ";
        document.querySelector(".ground-text").style.display = "none";
    }
    else {
        document.querySelector(".if-capsule").textContent = "as ";
        document.querySelector(".ground-text").style.display = "inline";
    }
    
    field_input[input_index].textContent = answer_container[answer_index].firstElementChild.textContent;
    field_input[input_index].classList.add("field-input-new");
    field_input[input_index].style.display = "inline";
}

/* CHANGES SHIPMENT PRICES */ 
var shipment_prices = document.querySelectorAll(".shipment-price");
var shipment_250g = ["7.20", "9.60", "12.00"];
var shipment_500g = ["13.00", "17.50", "22.00"];
var shipment_1000g = ["22.00", "32.00", "42.00"];

function shipmentPrices(answer_index) {
    if( answer_index == 6 ) {
        for( var i = 0; i < shipment_prices.length; i++){
            shipment_prices[i].textContent = shipment_250g[i];
        }
    }

    if( answer_index == 7 ) {
        for( var i = 0; i < shipment_prices.length; i++){
            shipment_prices[i].textContent = shipment_500g[i];
        }
    }

    if( answer_index == 8 ) {
        for( var i = 0; i < shipment_prices.length; i++){
            shipment_prices[i].textContent = shipment_1000g[i];
        }
    }
}

var monthly_cost;
var order_size;
var delivery_window;

/* CALCULATES MONTHLY COST */
function calculateMonthlyCost(order_size, delivery_window) {
    var cost_per_month;
    if(order_size == 6){
        if(delivery_window == 12){
            cost_per_month = 4*7.2;
        }
        if(delivery_window == 13){
            cost_per_month = 2*9.6;
        }
        if(delivery_window == 14){
            cost_per_month = 1*12.00;
        }
    }
    if(order_size == 7){
        if(delivery_window == 12){
            cost_per_month = 4*13;
        }
        if(delivery_window == 13){
            cost_per_month = 2*17.5;
        }
        if(delivery_window == 14){
            cost_per_month = 1*22.00;
        }
    }
    if(order_size == 8){
        if(delivery_window == 12){
            cost_per_month = 4*22;
        }
        if(delivery_window == 13){
            cost_per_month = 2*32;
        }
        if(delivery_window == 14){
            cost_per_month = 1*42;
        }
    }
    return cost_per_month;
}

function checkFive( place_holder ) { 
    var count = 0;
    for(var i = 0; i < place_holder.length; i++) {
        if (place_holder[i] != null) {
            count++;
        }
    }
    if (count == 5) {
        document.querySelector(".order-summary-button").style.pointerEvents = "auto";
        document.querySelector(".order-summary-button").classList.add("order-summary-button-enabled");
    }
}   

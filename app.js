console.log('this is personal project "budget App"'); 
console.log('made from basic css , html, jQuery, bootstrap and majorly JS')

class Person{
    constructor(fName , lName , mobile, email){
        this.fName  =   fName;
        this.lName  =   lName;
        this.mobile =   mobile;
        this.email  =   email;
        this.budgetAmount   =   0;
    }
}
// setting the initial expense and expense array    
const chartsData = [];
const expense = ( localStorage.getItem('expenseAmount') === null )? makeInitialExpense() : parseInt( localStorage.getItem('expenseAmount') ) ;
const expenseDetails = JSON.parse( localStorage.getItem('expenseDetails') );

eventListener();

function eventListener(){
    document.addEventListener('DOMContentLoaded',()=>{
        if(checkforUser())
        $('#userInfoForm').modal('show');
        else
            setInitailValues();

        setTable();
        setChart();
    });
}

function setChart(){
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}

function drawChart(){

    var data = google.visualization.arrayToDataTable(chartsData);
    var option = {
        'title': 'My Expense Budget Report'
    };

    var chart = new google.visualization.PieChart(document.getElementById('pieChart'));

    chart.draw(data,option);
}

function setTable(){
    document.getElementById('totalExpenditure').innerHTML = expense;
    table = document.getElementById('expenseTable');
    if( expenseDetails.length == 0 ){
        tr = document.createElement('tr');
        td = document.createElement('td')
        td.setAttribute('colspan',4);
        td.classList.add('lead','text-primary','p-3','text-center');
        txt = document.createTextNode('There are no expenses added some expenses.');

        td.appendChild(txt);
        tr.appendChild(td);
        table.appendChild(tr);
    }
    else{
        for(let i = 0 ; i < expenseDetails.length ; i++ ){
            tr = document.createElement('tr');
            
            td_1 = document.createElement('td');
            td_2 = document.createElement('td');
            td_3 = document.createElement('td');
            td_4 = document.createElement('td');
            td_4.setAttribute('style','text-align:end');
            txt_1 = document.createTextNode( i+1 );
            txt_2 = document.createTextNode(expenseDetails[i].title);
            txt_3 = document.createTextNode(expenseDetails[i].description);
            txt_4 = document.createTextNode(expenseDetails[i].amount);
            
            td_1.appendChild(txt_1);
            td_2.appendChild(txt_2);
            td_3.appendChild(txt_3);
            td_4.appendChild(txt_4);

            tr.appendChild(td_1);
            tr.appendChild(td_2);
            tr.appendChild(td_3);
            tr.appendChild(td_4);

            table.appendChild(tr);

        }
    }

}

function makeInitialExpense(){
     
    let details = [];
    localStorage.setItem('expenseAmount' , 0 );
    localStorage.setItem('expenseDetails' , JSON.stringify(details));
    return 0;
}

function addExpense(){
    let title       = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let amount      = parseInt( document.getElementById('ExpenseAmount').value );

    let detail = {
        'title'         : title,
        'description'   : description,
        'amount'        : amount
    };

    existing_arr = JSON.parse( localStorage.getItem('expenseDetails') );
    existing_arr.push(detail);
    localStorage.setItem( 'expenseDetails' , JSON.stringify( existing_arr ) );

    existing_amount = parseInt( localStorage.getItem('expenseAmount') );
    existing_amount+=amount;
    localStorage.setItem('expenseAmount' , existing_amount);
    window.location.reload();
}

function setInitailValues(){
    let data = JSON.parse( localStorage.getItem('user') );

    // setting the value in cards

    document.getElementById('nameOP').innerHTML = data.fName+" "+data.lName;
    document.getElementById('emailOP').innerHTML = data.email;
    document.getElementById('mobileOP').innerHTML = data.mobile;

    // for expense block

    document.getElementById('budgetOP').innerHTML = data.budgetAmount;
    
    let exp = parseInt( localStorage.getItem('expenseAmount') );
    let bal = data.budgetAmount - exp;

    document.getElementById('expenseOP').innerHTML = exp;
    document.getElementById('balenceOP').innerHTML = data.budgetAmount - exp;

    // badge for info tags
    icon = document.createElement('i')
    let infoClass , title ;
    if(bal <= 0.5*data.budgetAmount && bal >= 0.25*data.budgetAmount ){
        infoClass = 'bg-warning';
        title = 'Less than 50% of Budget remains';
        icon.classList.add('fa','fa-warning');
    }
        
    else if(bal < 0.25*data.budgetAmount){
        infoClass = 'bg-danger';
        title = 'Less than 25% of Budget remains';
        icon.classList.add('fas','fa-times');
    }
        
    else if(bal > 0.5*data.budgetAmount){
        infoClass = 'bg-success';
        title = 'More than 50% of Budget remains';
        icon.classList.add('far','fa-check-square');
    }
        
    span = document.createElement('span');
    span.classList.add('badge',infoClass,'mx-2');
    span.setAttribute('title', title);

    span.appendChild(icon);
    document.getElementById('balenceOP').appendChild(span);

    //for charts
    obj =['Title' , 'Amount'];
    chartsData.push(obj)

    if(exp == 0){
        obj = ['Remaining Budget' , (JSON.parse( localStorage.getItem('user') )).budgetAmount]
        chartsData.push(obj)
    }
    else{
        // existing expenses
        for(let i = 0 ; i < expenseDetails.length ; i++ ){
            obj = [];
            obj.push(expenseDetails[i].title)
            obj.push( parseInt(expenseDetails[i].amount) )
            chartsData.push(obj)
        }
        
        // remaing budget
        obj = ['Remaining Budget' , (JSON.parse( localStorage.getItem('user') )).budgetAmount - expense];
        chartsData.push(obj)
    }
}

function submitUserForm(){
    // getting form values
    let fName = document.getElementById('firstName').value;
    let lName = document.getElementById('lastName').value;
    let email = document.getElementById('email').value;
    let mobile = document.getElementById('mobile').value;

    const user = new Person(fName , lName , mobile , email);
    storeInLs(user , 'user');
    $('#userInfoForm').modal('hide'); 
    $('#userBudgetForm').modal('show');
}

function storeInLs(obj,inp){
    let store = JSON.stringify(obj);
    localStorage.setItem(inp, store);
}

function saveBudget(){
    amount = document.getElementById('budgetAmount').value;
    let user = JSON.parse(localStorage.getItem('user'));
    user.budgetAmount = parseInt(amount) ;
    localStorage.setItem('user',JSON.stringify(user));
    window.location.reload();
}

function checkforUser(){
    return null === localStorage.getItem('user')
}     // return false if user exist

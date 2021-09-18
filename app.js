const AddExpensePanel = (props) => {
    const {name, value, date, changeName, changeValue, changeDate} = props;
    return(
    <div className="addPanel">
        <h1>Śledzenie wydatków</h1>
        <h3>Dodaj nowy wydatek</h3>
        <div className="form">
            <label className="name" htmlFor="name">Nazwa: </label>
            <input onChange={changeName} value={name} className="expenseName" type="text" name="name" placeholder="Na co, gdzie wydałeś pieniądze?"/>
            <label className="date" htmlFor="date">Data: </label>
            <input onChange={changeDate} value={date} className="date" type="date" name="date"/>
            <label className="number" htmlFor="value">Pieniądze: </label>
            <input onChange={changeValue} value={value} className="value" type="number" name="value"/>
            <button className="add" onClick={props.add}>Dodaj</button>
        </div>
    </div>
    )
}

const ExpenseSummary = (props) => {
    return(
        <div className="summary">
            <div className="upper">
                <div className="name">Nazwa</div>
                <div className="date">Data</div>
                <div className="value">Wartość</div>
            </div>
            {props.expenses.map(expense => {return(
                <div key={expense.id} className="expense">
                    <div className="name">{expense.name}</div>
                    <div className="date">{expense.date}</div>
                    <div className="value">{expense.value}zł <i onClick={() => props.del(expense.id)} className="fas fa-times"></i></div>
                </div>
            )})}  
            <div className="amount">Suma: {props.total}zł</div>
        </div>
    )
}

class Expense {
    constructor(name, date, value){
        this.id = Math.random();
        this.name = name;
        this.date = date;
        this.value = value;
    }

}

class App extends React.Component {
  
    state = {
        expenseName: '',
        expenseDate: '',
        expenseValue: '',
        total: localStorage.getItem('total') ? JSON.parse(localStorage.getItem('total')) : 0,
        expenses: localStorage.getItem("expenses") ? JSON.parse(localStorage.getItem('expenses')) : [],
    }

    
    addExpense = () => {
        if(this.state.expenseName === '') {
            return alert("Wpisz nazwę wydatku.");
        } else if(this.state.expenseDate === '') {
            return alert("Podaj datę.");
        } else if(this.state.expenseValue === '') {
            return alert("Podaj wysokość wydatku.");
        }
        const expense = new Expense(this.state.expenseName, this.state.expenseDate, this.state.expenseValue);
        const expenses = this.state.expenses;
        let total = Number(this.state.total);
        total += Number(this.state.expenseValue);
        total = total.toFixed(2);
        expenses.push(expense);
        this.setState({
            expenses: expenses,
            expenseDate: '',
            expenseValue: '',
            expenseName: '',
            total: Number(total),
        })
        localStorage.setItem('total', JSON.stringify(total));
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
    
    removeExpense = (id) => {
        const expenses = this.state.expenses;
        let total = this.state.total;
        const element = expenses.filter(expense => expense.id === id);
        const index = expenses.findIndex(expense => expense.id === id);
        total -= element[0].value;
        expenses.splice(index, 1);
        this.setState({
            expenses: expenses,
            total: total,
        })
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('total', JSON.stringify(total));
        console.log(element);
    }

    changeName = (e) => {
        this.setState({
            expenseName: e.target.value
        })
    }
    
    changeValue = (e) => {
        this.setState({
            expenseValue: e.target.value
        })
    }

    changeDate = (e) => {
        this.setState({
            expenseDate: e.target.value
        })
    }

    render() { 
        return(
            <>
                <AddExpensePanel
                add={this.addExpense}
                value={this.state.expenseValue} 
                name={this.state.expenseName} 
                date={this.state.expenseDate} 
                changeValue={this.changeValue} 
                changeName={this.changeName} 
                changeDate={this.changeDate}
                />
                <ExpenseSummary 
                del={this.removeExpense} 
                expenses={this.state.expenses}
                total={this.state.total}
                />
            </>
        )
    }
}
 
ReactDOM.render(<App/>, document.getElementById('root'));
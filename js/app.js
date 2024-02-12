class CalorieTraker {

    constructor() {
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories(0);
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();
        this._caloriesConsumed = Storage.getConsumedCalories();
        this._caloriesBurned = Storage.getBurnedCalories();

        this._render();
    }

    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._caloriesConsumed += meal.calories;
        Storage.updateCalories(this._totalCalories);
        Storage.updateConsumedCalories(this._caloriesConsumed);
        Storage.saveMeals(meal);
        this._displaynewMeal(meal);
        this._render();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._caloriesBurned += workout.calories;
        Storage.updateCalories(this._totalCalories);
        Storage.updateBurnedCalories(this._caloriesBurned);
        Storage.saveWorkouts(workout);
        this._displaynewWorkout(workout);
        this._render();
    }

    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        // this._displayCalorieLimit();
        this._render();
    }

    loadItems() {
        this._meals.forEach(item => {
            this._displaynewMeal(item);
        })
        this._workouts.forEach(item => {
            this._displaynewWorkout(item);
        })
    }

    _displayCaloriesLimit() {
        const totalDisplayCalories = document.querySelector('#calories-limit');
        totalDisplayCalories.innerText = this._calorieLimit;
    }

    _displayCaloriesTotal() {
        const totalDisplayTotal = document.querySelector('#calories-total');
        totalDisplayTotal.innerText = this._totalCalories;
    }

    _displayCaloriesConsumed() {
        const totalDisplayConsumed = document.querySelector('#calories-consumed');

        // const consumed=this._meals.reduce((total,meal)=>{
        //     total+=meal.calories;
        // },0)
        totalDisplayConsumed.innerText = this._caloriesConsumed;
        // totalDisplayConsumed.innerText=this.consumed;
    }

    _displayCaloriesBurned() {
        const totalDisplayBurned = document.querySelector('#calories-burned');
        totalDisplayBurned.innerText = this._caloriesBurned;
    }

    _displayCaloriesRemaining() {
        const totalDisplayRemaining = document.querySelector('#calories-remaining');
        const progressBar = document.getElementById('calorie-progress');
        totalDisplayRemaining.innerText = this._calorieLimit - this._totalCalories;
        if (this._calorieLimit - this._totalCalories < 0 || this._calorieLimit - this._totalCalories > this._calorieLimit) {
            totalDisplayRemaining.parentElement.parentElement.classList.remove('bg-light');
            totalDisplayRemaining.parentElement.parentElement.classList.add('bg-danger');
            progressBar.classList.add('bg-danger');
            progressBar.classList.remove('bg-success');
        }
        else {

            totalDisplayRemaining.parentElement.parentElement.classList.remove('bg-danger');
            totalDisplayRemaining.parentElement.parentElement.classList.add('bg-light');

            progressBar.classList.add('bg-success');
            progressBar.classList.remove('bg-danger');
        }
    }

    _displayCalorieProgress() {
        const progressBar = document.getElementById('calorie-progress');
        let width = (this._totalCalories / this._calorieLimit) * 100;
        width = Math.min(width, 100);
        // console.log(width);
        progressBar.style.width = `${width}%`;
    }

    _displaynewMeal(meal) {
        const items = document.getElementById('meal-items');
        const div = document.createElement('div');
        div.classList.add('card', 'my-2');
        div.setAttribute('data-id', meal.id);
        div.innerHTML = `
        <div class="card my-2">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${meal.name}</h4>
            <div
              class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
            >
              ${meal.calories}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      </div>
        `
        items.appendChild(div);
    }

    _displaynewWorkout(workout) {
        const items = document.getElementById('workout-items');
        const div = document.createElement('div');
        div.classList.add('card', 'my-2');
        div.setAttribute('data-id', workout.id);
        div.innerHTML = `
            <div class="card my-2">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${workout.name}</h4>
                <div
                  class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                >
                  ${workout.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>
            `
        items.appendChild(div);
    }

    _removeMeal(rmid) {
        this._meals.forEach((meal, index) => {
            if (meal.id == rmid) {
                this._totalCalories -= meal.calories;
                this._caloriesConsumed -= meal.calories;
                Storage.updateCalories(this._totalCalories);
                Storage.updateConsumedCalories(this._caloriesConsumed);
                Storage.removeMeal(rmid);
                this._meals.splice(index, 1);
            }
            this._render();
        })
    }


    _removeWorkout(rmid) {
        this._workouts.forEach((workout, index) => {
            if (workout.id == rmid) {
                this._totalCalories += workout.calories;
                this._caloriesBurned -= workout.calories;
                Storage.updateCalories(this._totalCalories);
                Storage.updateBurnedCalories(this._caloriesBurned);
                Storage.removeWorkout(rmid);
                this._workouts.splice(index, 1);
            }
            this._render();
        })
    }
    _reset() {
        Storage.clearAll();
        location.reload();
        this._render();
    }
    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCalorieProgress();
    }

}


class Storage {
    static getCalorieLimit(defaultLimit = 2000) {
        let calorieLimit;
        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit;
        } else {
            calorieLimit = +localStorage.getItem('calorieLimit');
        }
        return calorieLimit;
    }

    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getTotalCalories(defaultCalories = 0) {
        let totalCalories;
        if (localStorage.getItem('totalCalories') === null) {
            totalCalories = defaultCalories;
        } else {
            totalCalories = +localStorage.getItem('totalCalories');
        }
        return totalCalories;
    }

    static updateCalories(calories) {
        localStorage.setItem('totalCalories', calories);
    }

    static getConsumedCalories(defaultCalories = 0) {
        let consumedCalories;
        if (localStorage.getItem('consumedCalories') === null) {
            consumedCalories = defaultCalories;
        } else {
            consumedCalories = +localStorage.getItem('consumedCalories');
        }
        return consumedCalories;
    }

    static updateConsumedCalories(calories) {
        localStorage.setItem('consumedCalories', calories);
    }

    static getBurnedCalories(defaultCalories = 0) {
        let burnedCalories;
        if (localStorage.getItem('burnedCalories') === null) {
            burnedCalories = defaultCalories;
        } else {
            burnedCalories = +localStorage.getItem('burnedCalories');
        }
        return burnedCalories;
    }

    static updateBurnedCalories(calories) {
        localStorage.setItem('burnedCalories', calories);
    }

    static getMeals() {
        let meals;

        if (localStorage.getItem('meals') == null) {
            meals = []
        }
        else {
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    static saveMeals(meal) {
        let meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static getWorkouts() {
        let workouts;

        if (localStorage.getItem('workouts') == null) {
            workouts = []
        }
        else {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    static saveWorkouts(workout) {
        let workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeMeal(id) {
        const meals = Storage.getMeals();
        meals.forEach((meal, index) => {
            if (meal.id === id) {
                meals.splice(index, 1);
            }
        });
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static removeWorkout(id) {
        const workouts = Storage.getWorkouts();
        workouts.forEach((workout, index) => {
            if (workout.id === id) {
                workouts.splice(index, 1);
            }
        });
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static clearAll(){
        localStorage.clear();
    }

}


class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class App {

    constructor() {
        this._traker = new CalorieTraker();
        document.getElementById('meal-form').addEventListener('submit', this._addItem.bind(this, 'meal'));
        document.getElementById('workout-form').addEventListener('submit', this._addItem.bind(this, 'workout'));
        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));
        document.getElementById('filter-meals').addEventListener('keyup', this._filterItem.bind(this, 'meals'));
        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItem.bind(this, 'workouts'));
        document.getElementById('reset').addEventListener('click', this._reset.bind(this));
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
        this._traker.loadItems();
        // console.log(this);
        // this._try();
        // // _try();
    }

    _addItem(type, e) {

        e.preventDefault();
        const name = document.getElementById(`${type}-name`);
        const calorie = document.getElementById(`${type}-calories`);

        if (name.value == '' || calorie.value === 0) {
            alert("Please Add Valid Details!!");
            return;
        }

        if (type == 'meal') {

            const meal = new Meal(name.value, +calorie.value);
            this._traker.addMeal(meal);

        } else {
            const workout = new Workout(name.value, +calorie.value);
            this._traker.addWorkout(workout);
        }

        name.value = '';
        calorie.value = '';

        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseItem, {
            toggle: false,
        });
    }


    _removeItem(type, e) {

        if (e.target.classList.contains('fa-xmark') || e.target.classList.contains('delete')) {
            if (confirm("Are You Sure?")) {
                const id = e.target.closest('.card').parentElement.getAttribute('data-id');
                type == 'meal' ?
                    this._traker._removeMeal(id) :
                    this._traker._removeWorkout(id);

                e.target.closest('.card').parentElement.remove();
            }
        }
    }

    _filterItem(type, e) {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
            const name = item.firstElementChild.firstElementChild.textContent;
            if (name.toLowerCase().indexOf(text) != -1) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    _reset() {
        this._traker._reset();
        document.getElementById('meal-items').innerHTML = ''
        document.getElementById('workout-items').innerHTML = ''
    }

    _setLimit(e) {
        e.preventDefault();
        const limit = document.getElementById('limit');

        if (limit.value === '') {
            alert('Please add a limit');
            return;
        }

        this._traker.setLimit(+limit.value);
        limit.value = '';

        const modalEl = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }
}

const app = new App();

// const traker=new CalorieTraker();

// const breakfast=new Meal('Breakfast',200);
// traker.addMeal(breakfast);

// const run=new Workout('Run',100);
// traker.addWorkout(run);

// const lunch=new Meal('Lunch',500);
// traker.addMeal(lunch);

// const gym=new Workout('Gym',200);
// traker.addWorkout(gym);

/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

    app.ALL_TODOS = 'all';
    app.ACTIVE_TODOS = 'active';
    app.COMPLETED_TODOS = 'completed';
    var TodoFooter = app.TodoFooter;
    var TodoItem = app.TodoItem;
    var TodoCategory = app.TodoCategory;

    app.CAT_WORK = 'work';
    app.CAT_PERSONAL = 'personal';
    app.CAT_SUPERPERSONAL = 'superpersonal';

    
    var ENTER_KEY = 13;

    var TodoApp = React.createClass({
        getInitialState: function () {
            return {
                nowShowing: app.ALL_TODOS,
                editing: null,
                newTodo: '',
                newCategory: ''
            };
        },

        componentDidMount: function () {
            var setState = this.setState;
            var router = Router({
                '/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
                '/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
                '/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS}),
                // Add routes for categories
        		'/category_work': setState.bind(this, {nowShowing: app.CAT_WORK}),
        		'/category_personal': setState.bind(this, {nowShowing: app.CAT_PERSONAL}),
        		'/category_superpersonal': setState.bind(this, {nowShowing: app.CAT_SUPERPERSONAL}),
        		'/all_categories': setState.bind(this, {nowShowing: app.ALL_TODOS})
            });
            router.init('/');
        },

		handleChange: function (event) {
			this.setState({newTodo: event.target.value});
		},

        handleCategoryChange: function (event) {
            this.setState({newCategory: event.target.value});
        },
		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

            var val = this.state.newTodo.trim();
            var cat = this.state.newCategory.trim();

            if (val, cat) {
                this.props.model.addTodo(val, cat);
                this.setState({newTodo: '', newCategory: ''});
            }
        },

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.props.model.toggleAll(checked);
		},

		toggle: function (todoToToggle) {
			this.props.model.toggle(todoToToggle);
		},

		destroy: function (todo) {
			this.props.model.destroy(todo);
		},

		edit: function (todo) {
			this.setState({editing: todo.id});
		},

        save: function (todoToSave, text, cat) {
            this.props.model.save(todoToSave, text, cat);
            this.setState({editing: null});
        },

		cancel: function () {
			this.setState({editing: null});
		},

		clearCompleted: function () {
			this.props.model.clearCompleted();
		},

        render: function () {
            var footer;
            var category;
            var main;
            var todos = this.props.model.todos;
            var shownTodos = todos.filter(function (todo) {
                switch (this.state.nowShowing) {
                case app.ACTIVE_TODOS:
                    return !todo.completed;
                case app.COMPLETED_TODOS:
                    return todo.completed;
                case app.CAT_WORK:
                    if(todo.category=='work') return true;
                    else return false;
                case app.CAT_PERSONAL:
                    if(todo.category=='personal') return true;
                    else return false;
                case app.CAT_SUPERPERSONAL:
                    if(todo.category=='superpersonal') return true;
                    else return false;
                default:
                    return true;
                }
            }, this);

			var todoItems = shownTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.id}
						todo={todo}
						onToggle={this.toggle.bind(this, todo)}
						onDestroy={this.destroy.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={this.state.editing === todo.id}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			var completedCount = todos.length - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
					/>;
			}

			if (todos.length) {
        category =
        <TodoCategory
                        nowShowing={this.state.nowShowing}
                    />;
      }

            if (todos.length) {
				main = (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
						/>
						<ul className="todo-list">
							{todoItems}
						</ul>
					</section>
				);
			}

            return (
                <div>
                    <header className="header">
                        <h1>todos</h1>
                        <form onKeyDown={this.handleNewTodoKeyDown}>
                            <input
                                className="new-todo"
                                placeholder="What needs to be done?"
                                value={this.state.newTodo}


                                onChange={this.handleChange}
                                autoFocus={true}
                            />
                        <select value={this.state.newCategory} className="new-todo"
                        onChange={this.handleCategoryChange}>
                            <option value="">Select a Category</option>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="superpersonal">Super Personal</option>
                        </select>

                        </form>
                    </header>
                    {main}
                    {category}
                    {footer}
                </div>
            );
        }
    });

	var model = new app.TodoModel('react-todos');

	function render() {
		React.render(
			<TodoApp model={model}/>,
			document.getElementsByClassName('todoapp')[0]
		);
	}

	model.subscribe(render);
	render();
})();

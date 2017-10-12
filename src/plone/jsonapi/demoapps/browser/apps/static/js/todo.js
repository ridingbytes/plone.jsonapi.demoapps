
/* Please use this command to compile this file into the parent `js` directory:
    coffee --no-header -w -o ../js -c todo.coffee
 */

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  require(['++resource++static/js/jquery-1.12.4.min.js', '++resource++static/js/backbone-min.js', '++resource++static/js/underscore-min.js'], function() {
    var App, Todo, TodoView, Todos;
    console.log("jQuery Version=", jQuery.fn.jquery);
    console.log("Backbone=", Backbone.VERSION);
    console.log("Underscore=", _.VERSION);

    /* MODELS */
    Backbone.emulateHTTP = true;
    Todo = (function(superClass) {
      extend(Todo, superClass);

      function Todo() {
        return Todo.__super__.constructor.apply(this, arguments);
      }

      Todo.prototype.urlRoot = '@@API/plone/api/1.0/document';

      Todo.prototype.idAttribute = 'uid';

      Todo.prototype.defaults = {
        uid: "",
        url: "",
        title: "",
        description: "",
        parent_path: "/Plone/todos",
        review_state: "private"
      };

      Todo.prototype.isNew = function() {
        return _.isEmpty(this.get("uid"));
      };

      Todo.prototype.parse = function(response, options) {
        var ref;
        if (((ref = response.items) != null ? ref.length : void 0) === 1) {
          return response.items[0];
        }
        return response;
      };

      Todo.prototype.isDone = function() {
        if (this.get("review_state") === "private") {
          return true;
        } else {
          return false;
        }
      };

      Todo.prototype.toggleState = function() {
        var transition;
        transition = this.get("review_state") === "published" ? "retract" : "publish";
        return this.save({
          transition: transition
        }, {
          success: function(model, response, options) {
            if (response.count !== 1) {
              return;
            }
            return model.set(response.items[0]);
          }
        });
      };

      return Todo;

    })(Backbone.Model);

    /* COLLECTIONS */
    Todos = (function(superClass) {
      extend(Todos, superClass);

      function Todos() {
        return Todos.__super__.constructor.apply(this, arguments);
      }

      Todos.prototype.model = Todo;

      Todos.prototype.url = '@@API/plone/api/1.0/document?path=/Plone/todos&depth=1&sort_on=getObjPositionInParent';

      Todos.prototype.parse = function(response, options) {
        return response.items;
      };

      return Todos;

    })(Backbone.Collection);

    /* VIEWS */
    TodoView = (function(superClass) {
      extend(TodoView, superClass);

      function TodoView() {
        return TodoView.__super__.constructor.apply(this, arguments);
      }

      TodoView.prototype.tagName = "li";

      TodoView.prototype.template = _.template($("#todo-item").html());

      TodoView.prototype.initialize = function() {
        this.listenTo(this.model, "change", this.render);
        return this.listenTo(this.model, "destroy", this.remove);
      };

      TodoView.prototype.events = {
        "click .destroy": "clear",
        "click .toggleState": "toggleState",
        "dblclick .view": "edit",
        "keypress .edit": "updateOnEnter",
        "keypress .description": "updateDescriptionOnEnter",
        "blur .edit": "close"
      };

      TodoView.prototype.clear = function(event) {
        return this.model.destroy();
      };

      TodoView.prototype.edit = function() {
        this.$el.addClass("editing");
        return this.title.select();
      };

      TodoView.prototype.close = function() {
        var value;
        value = this.title.val();
        if (!value) {
          return this.clear();
        } else {
          this.model.save({
            title: value
          });
          return this.$el.removeClass("editing");
        }
      };

      TodoView.prototype.updateOnEnter = function(event) {
        if (event.keyCode === 13) {
          return this.close();
        }
      };

      TodoView.prototype.updateDescriptionOnEnter = function(event) {
        if (!(event.keyCode === 13)) {
          return;
        }
        return this.model.save({
          description: this.description.val()
        });
      };

      TodoView.prototype.toggleState = function(event) {
        return this.model.toggleState();
      };

      TodoView.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.toggleClass("done", this.model.isDone());
        this.title = this.$('.edit');
        this.description = this.$('.description');
        return this;
      };

      return TodoView;

    })(Backbone.View);
    App = (function(superClass) {
      extend(App, superClass);

      function App() {
        return App.__super__.constructor.apply(this, arguments);
      }

      App.prototype.el = "#todoapp";

      App.prototype.todo_folder = "/Plone/todos";

      App.prototype.events = {
        "keypress #new-todo": "createOnEnter"
      };

      App.prototype.initialize = function() {
        console.debug("App.initialize");
        this.todos = new Todos();
        this.todos.fetch({
          path: this.todo_folder
        });
        this.todo_list = $("#todo-list");
        this.todos.on('add', this.addOne, this);
        this.todos.on('reset', this.addAll, this);
        return this.new_todo = $("#new-todo");
      };

      App.prototype.addOne = function(todo) {
        var view;
        view = new TodoView({
          model: todo
        });
        return this.todo_list.append(view.render().el);
      };

      App.prototype.addAll = function() {
        console.log("App.addAll");
        return this.todos.each(this.addOne, this);
      };

      App.prototype.createOnEnter = function(event) {
        var todo;
        if (event.keyCode !== 13) {
          return;
        }
        if (!this.new_todo.val()) {
          return;
        }
        todo = new Todo();
        todo.save({
          title: this.new_todo.val(),
          transition: "publish"
        }, {
          success: function(model, response, options) {
            if (response.items.length !== 1) {
              return;
            }
            return model.set(response.items[0]);
          }
        });
        this.todos.add(todo);
        return this.new_todo.val("");
      };

      return App;

    })(Backbone.View);
    return window.app = new App();
  });

}).call(this);

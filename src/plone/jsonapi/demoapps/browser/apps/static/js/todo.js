
/* Please use this command to compile this file into the parent `js` directory:
    coffee --no-header -w -o ../js -c todo.coffee
 */

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  require(['++resource++static/js/jquery-1.12.4.min.js', '++resource++static/js/backbone-min.js', '++resource++static/js/underscore-min.js'], function() {
    var Todo, Todos;
    console.log("jQuery Version=", jQuery.fn.jquery);
    console.log("Backbone=", Backbone.VERSION);
    console.log("Underscore=", _.VERSION);

    /* MODELS */
    Todo = (function(superClass) {
      extend(Todo, superClass);

      function Todo() {
        return Todo.__super__.constructor.apply(this, arguments);
      }

      Todo.prototype.defaults = {
        id: "",
        title: "",
        url: "",
        state: ""
      };

      return Todo;

    })(Backbone.Model);

    /* COLLECTIONS */
    return Todos = (function(superClass) {
      extend(Todos, superClass);

      function Todos() {
        return Todos.__super__.constructor.apply(this, arguments);
      }

      Todos.prototype.model = Todo;

      return Todos;

    })(Backbone.Collection);
  });

}).call(this);

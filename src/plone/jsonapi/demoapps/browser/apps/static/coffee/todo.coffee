### Please use this command to compile this file into the parent `js` directory:
    coffee --no-header -w -o ../js -c todo.coffee
###

require [
  '++resource++static/js/jquery-1.12.4.min.js'
  '++resource++static/js/backbone-min.js'
  '++resource++static/js/underscore-min.js'
], () ->

  console.log "jQuery Version=", jQuery.fn.jquery
  console.log "Backbone=", Backbone.VERSION
  console.log "Underscore=", _.VERSION

  ### MODELS ###

  class Todo extends Backbone.Model
    defaults:
      id: ""
      title: ""
      url: ""
      state: ""

  ### COLLECTIONS ###
  class Todos extends Backbone.Collection
    model: Todo

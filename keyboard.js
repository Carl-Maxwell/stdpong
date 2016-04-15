Keyboard = {
  initialize: function() {
    addEventListener('keydown', this.keyDown.bind(this));
    addEventListener('keyup'  , this.keyUp  .bind(this));

    keyStates = {};
    callbacks = {};
  },

  state: function(key) {
    return keyStates[key];
  },

  keyDown: function(evt) {
    key = fromWhichToString(evt.which);

    change = !keyStates[key];
    keyStates[key] = true;

    if (change) this.emit(key, evt);
  },

  emit: function(name, evt) {
    if (callbacks[name] && callbacks[name].length) {
      callbacks[name].forEach(function(callback) {
        callback(evt);
      });

      callbacks[name] = callbacks[name].filter(function(callback) {
        return !callback.once;
      });
    }
  },

  keyUp:function(evt) {
    key = fromWhichToString(evt.which);

    this.emit(key + ':released', evt);

    keyStates[key] = false;
  },

  on: function(key, callback) {
    if (key in callbacks) {
      callbacks[key].push(callback);
    } else {
      callbacks[key] = [callback];
    }
  },

  off: function(key) {
    callbacks[key] = [];
  },

  once: function(key, callback) {
    callback.once = true;
    this.on(key, callback);
  }
};

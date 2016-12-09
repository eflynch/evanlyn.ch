(function () {
  // Model
  function ConwayState(width, height, size) {
    var that = Object.create(ConwayState.prototype);

    var alive, neighbors, colors
    var color = '#000000';


    _applyToNeighbors = function(x, y, f){
      var neighborRelations = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      neighborRelations.map(function (rel){
        var neighborX = (x + rel[0] + width) % width;
        var neighborY = (y + rel[1] + height) % height;
        f(neighborX, neighborY);
      });
    };

    _applyChangeToNeighbors = function(x, y, d) {
      _applyToNeighbors(x, y, function (neighborX, neighborY) {
        neighbors[neighborY][neighborX] += d;
      });
    };

    _getColorFromNeighbors = function(x, y) {
      var r = 0;
      var g = 0;
      var b = 0;
      var addColors = function (colorString) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorString);
        r += parseInt(result[1], 16);
        g += parseInt(result[2], 16);
        b += parseInt(result[3], 16);
      }
      var formatColors = function (r, g, b) {
        var colorToHex = function (c) {
          var hex = Math.round(c).toString(16);
          return hex.length === 1 ? '0' + hex: hex;
        };
        return '#' + colorToHex(r) + colorToHex(g) + colorToHex(b);
      }
      _applyToNeighbors(x, y, function (neighborX, neighborY) {
        if (alive[neighborY][neighborX]){
          addColors(colors[neighborY][neighborX]);
        }
      });
      return formatColors(r / 3, g / 3, b / 3);
    }

    ConwayState.prototype.clearState = function() {
      var create2DArray = function (x) {
        return Array.apply(null, new Array(height)).map(function() {
          return Array.apply(null, new Array(width)).map(function() { return x;});
        });
      };
      alive = create2DArray(false);
      neighbors = create2DArray(0);
      colors = create2DArray('#000000');
    };

    ConwayState.prototype.setStateFromURL = function() {
      var url = window.location.search.substring(1);
      if (!url) {
        return;
      }
      var pairs = url.split('&');
      var points = pairs.map(function(point) {
        return {
          x: parseInt(point.split(',')[0]),
          y: parseInt(point.split(',')[1]),
          color: color
        };
      });
      return that.setState(points);
    };

    ConwayState.prototype.setState = function(points) {
      for (var i = 0; i < points.length; i++) {
        var point = points[i];
        that.set(point.x, point.y, point.color);
      }
    };

    ConwayState.prototype.setColor = function(newColor) {
      color = newColor;
    };

    ConwayState.prototype.set = function(x, y, color) {
      if (!alive[y][x]) {
        _applyChangeToNeighbors(x, y, 1);
      }
      if (!(typeof(color) === 'string') || (color.length !== 7)){
        throw new Error('Bad Color');
      }
      alive[y][x] = true;
      colors[y][x] = color;
    };

    ConwayState.prototype.kill = function(x, y) {
      if (alive[y][x]) {
        _applyChangeToNeighbors(x, y, -1);
      }
      alive[y][x] = false;
      colors[y][x] = '#000000';
    };

    ConwayState.prototype.get = function(x, y){
      return alive[y][x];
    };

    ConwayState.prototype.getColor = function(x, y){
      return colors[y][x];
    };

    ConwayState.prototype.update = function() {
      var toKill = new Array();
      var toSet = new Array();
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          if (alive[y][x]) {
            if (neighbors[y][x] < 2 || neighbors[y][x] > 3) {
              toKill.push({
                x: x,
                y: y
              });
            }
          } else {
            if (neighbors[y][x] === 3) {
              toSet.push({
                x: x,
                y: y,
                color: _getColorFromNeighbors(x, y)
              });
            }
          }
        }
      }
      for (var i = 0; i < toKill.length; i++) {
        that.kill(toKill[i].x, toKill[i].y);
      }
      for (var i = 0; i < toSet.length; i++) {
        that.set(toSet[i].x, toSet[i].y, toSet[i].color);
      }
    };

  ConwayState.prototype.getSize = function(){
    return size;
  }

  ConwayState.prototype.getWidth = function(){
    return width;
  }

  ConwayState.prototype.getHeight = function(){
    return height;
  }

  ConwayState.prototype.getCurrentColor = function(){
    return color;
  }

  that.clearState();
  return that;
  };



  // View
  function ConwayDOMView(state, id){
    var that = Object.create(ConwayDOMView.prototype);

    _initialize = function() {
      var game = document.getElementById(id);
      game.style.width = state.getWidth() * state.getSize();
      game.style.height = state.getHeight()* state.getSize();

      var squareStyle = function (size) {
        size = size - 2;
        return 'width: ' + size + 'px; height: ' + size + 'px; margin: 1px; float: left;';
      };

      var squareHTML = function (x, y) {
        return '<div class="square" id="'+x+','+y+'" '+'style="'+squareStyle(state.getSize())+'"></div>';
      };

      var html = "";
      for (var y=0; y<state.getHeight(); y++){
        for (var x=0; x<state.getWidth(); x++){
          html = html + squareHTML(x, y);
        }
      }
      game.innerHTML = html;
    };

    _setSquareColor = function(x, y, color) {
      document.getElementById(x+','+y).style.backgroundColor = color;
    };

    _setDrawingHandlers = function() {
      var $squares = $('.square');
      var $game = $('#'+id);
      var mouseIsDown = false;
      $game.on('mousedown', function() {mouseIsDown = true;});
      $game.on('mouseup', function() {mouseIsDown = false;});
      $('.square').on('mouseover', function(e){
        if (mouseIsDown) {
          var x = parseInt(e.currentTarget.id.split(',')[0]);
          var y = parseInt(e.currentTarget.id.split(',')[1]);
          state.set(x, y, state.getCurrentColor());
          that.render();
        }
      });
      $('.square').on('mousedown', function(e){
        var x = parseInt(e.currentTarget.id.split(',')[0]);
        var y = parseInt(e.currentTarget.id.split(',')[1]);
        if (state.get(x, y)){
          state.kill(x, y);
        } else {
          state.set(x, y, state.getCurrentColor());
        }
        that.render();
      });
    };

    ConwayDOMView.prototype.render = function() {
      for (var y = 0; y < state.getHeight(); y++) {
        for (var x = 0; x < state.getWidth(); x++) {
          if (state.get(x, y)){
            _setSquareColor(x, y, state.getColor(x, y));
          } else {
            _setSquareColor(x, y, '#fff');
          }
        }
      }
    };

    _initialize();
    _setDrawingHandlers();
    return that;
  };



  // Control
  function ConwayController(state, view){
    var that = Object.create(ConwayController.prototype);
    var intervalID = null;

    ConwayController.prototype.init = function() {
      state.setStateFromURL();
      view.render();
    };

    ConwayController.prototype.start = function(speed) {
      if (intervalID === null){
        intervalID = setInterval(function (){
          state.update();
          view.render();
        }, speed);
      } else {
        that.stop();
        that.start(speed);
      }
    };

    ConwayController.prototype.stop = function() {
      if (intervalID !== null){
        clearInterval(intervalID);
        intervalID = null;
      }
    };

    ConwayController.prototype.step = function() {
      that.stop();
      state.update();
      view.render();
    };

    ConwayController.prototype.reset = function() {
      state.clearState();
      state.setStateFromURL();
      view.render();
    };

    return that;
  };


  // Export Model, View, and Control to global namespace
  window.ConwayState = ConwayState;
  window.ConwayView = ConwayDOMView;
  window.ConwayController = ConwayController;

})()
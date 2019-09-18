(function(global) {

  var glUtils = {

    VERSION: '0.0.3',
    
    checkWebGL: function(canvas) {
      
      var gl;
      var contexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
      
      for (var i = 0; i < contexts.length; i++) {
        
        try {
          
          var context = contexts[i];
          gl = canvas.getContext(context);
        } catch (error) {
          // Sementara kosong
        }
        
        if (gl) {
          break;
        }
      }
      
      if (!gl) {
        alert("WebGL tidak ditemukan. Tolong gunakan Chrome/Firefox terbaru.");
      }
      
      return gl;
    },

    getShader: function(gl, type, source) {
      
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        
        console.log("Shader gagal dikompilasi: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    },

    createProgram: function(gl, vertexShader, fragmentShader) {
      
      var program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        
        console.log("Program gagal di-link: " + gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }
      
      return program;
    },
    
    SL: {
      /*
       * Ajax stuff
       */
      XMLHttpFactories: [
        function () { return new XMLHttpRequest() },
        function () { return new ActiveXObject("Msxml2.XMLHTTP") },
        function () { return new ActiveXObject("Msxml3.XMLHTTP") },
        function () { return new ActiveXObject("Microsoft.XMLHTTP") }
      ],

      createXMLHTTPObject: function() {
        
        var xmlhttp = false;
        
        for (var i = 0; i < this.XMLHttpFactories.length; i++) {
          
          try {
            xmlhttp = this.XMLHttpFactories[i]();
          } catch (error) {
            continue;
          }
          break;
        }

        return xmlhttp;
      },
      
      sendRequest: function(url, callback, element) {
        
        var req = this.createXMLHTTPObject();
        
        if (!req) return;
        var method = "GET";
        req.open(method, url, true);
        
        req.onreadystatechange = function() {
          
          if (req.readyState != 4) return;
          if (req.status != 0 && req.status != 200 && req.status != 304) {
            return;
          }
          callback(req, element);
        }
        
        if (req.readyState == 4) return;
        req.send();
      },
      /*
       * Signals
       */
      init: function(options) {
        
        var options = options || {};
        this.callback = options.callback || function() {};
        this.elemName = options.elemName || "shader";
        this.dataSrc = options.dataSrc || "data-src";
        this.dataType = options.dataType || "data-type";
        this.dataVersion = options.dataVersion || "data-version";
        this.shaderElems = document.getElementsByName(this.elemName);
        this.loadedSignal = new global.signals.Signal();
        this.Shaders = this.Shaders || {};
        this.loadedSignal.add(this.callback);
        this.slShaderCount = this.shaderElems.length;
        
        for(var i = 0; i < this.slShaderCount; i++) {
          var shader = this.shaderElems[i];
          this.sendRequest(shader.getAttribute(this.dataSrc), this.processShader, shader);
        }
        
        this.checkForComplete();
      },
      
      checkForComplete: function() {
        if(!this.slShaderCount) {
          this.loadedSignal.dispatch();
        }
      },
      
      processShader: function(req, element) {
        
        glUtils.SL.slShaderCount--;
        var version = element.getAttribute(glUtils.SL.dataVersion);
        
        if(!glUtils.SL.Shaders[version]) {
          glUtils.SL.Shaders[version] = {
            vertex: '',
            fragment: ''
          };
        }
        console.log("\nShader source:\n"+ req.responseText);
        glUtils.SL.Shaders[version][element.getAttribute(glUtils.SL.dataType)] = req.responseText;
        glUtils.SL.checkForComplete();
      }
    }
  };
  global.glUtils = glUtils;
})(window || this);

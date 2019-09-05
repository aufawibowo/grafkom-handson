(function(global) {
    var glUtils = {
        VERSION: '0.0.1',
        checkWebGL: function(canvas) {
            var gl;
            var contexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            for (var i = 0; i < contexts.length; i++) {
                try {
                    var context = contexts[i];
                    gl = canvas.getContext(context)
                } catch (error) {
                    //none
                }
                if (gl) {
                    break;
                }
            }
            if (!gl) {
                alert("WebGL Not Found. Please use most recent browsers");
            }
            return gl;
        }
    };
    global.glUtils = glUtils;
})(window || this);
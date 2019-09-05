(function() {
    var canvas = document.getElementById("glcanvas");
    var gl;
    var contexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (var i = 0; i < contexts.length; i++) {
        try {
            var context = contexts[i];
            gl = canvas.getContext(context)
        } catch (error) {

        }
        if (gl) {
            break;
        }

    }
    if (!gl) {
        alert("WebGL Not Found. Please use most updated browsers");
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

})();
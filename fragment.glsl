// http://learnwebgl.brown37.net/09_lights/lights_combined.html?highlight=diffuse

precision mediump float;

varying vec3 fColor;
varying vec3 fNormal;
varying vec3 fPosition;

uniform vec3 lightColor;
uniform vec3 lightPosition;
uniform vec3 ambientColor;
uniform float shininess;

// http://learnwebgl.brown37.net/09_lights/lights_combined.html?highlight=diffuse

void main() {
  vec3 ambient = ambientColor * fColor;

  vec3 lightDirection = lightPosition - fPosition;
  lightDirection = normalize(lightDirection);

  vec3 normal = normalize(fNormal);
  
  float lightIntensity = dot(normal, lightDirection);
  lightIntensity = clamp(lightIntensity, 0.0, 1.0);

  vec3 diffuse = fColor * lightIntensity;

  vec3 reflection = 2. * dot(normal, lightDirection) * normal - lightDirection;

  vec3 to_camera = -1. * fPosition;

  reflection = normalize(reflection);
  to_camera = normalize(to_camera);
  lightIntensity = dot(reflection, to_camera);
  lightIntensity = clamp(lightIntensity, 0.0, 1.0);
  lightIntensity = pow(lightIntensity, shininess);

  vec3 specular;
  if (lightIntensity > 0.0){
    specular = lightColor * lightIntensity;
    diffuse = diffuse * (1. - lightIntensity);
  }else{
    specular = vec3(0., 1., 0.);
  }
  
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}


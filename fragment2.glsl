precision mediump float;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 fTexCoord;

uniform vec3 lightColor;
uniform vec3 lightPosition;
uniform vec3 ambientColor;
// uniform vec3 

uniform sampler2D sampler0;

// http://learnwebgl.brown37.net/09_lights/lights_combined.html?highlight=diffuse

void main() {

  vec4 tex0 = texture2D(sampler0, fTexCoord); // Hasil akhirnya adalah warna (RGBA)

  vec3 lightDirection = lightPosition - fPosition;
  lightDirection = normalize(lightDirection);

  vec3 normal = normalize(fNormal);



  float lightIntensity = max(dot(lightDirection, -normal), 0.0);

  float specularPower = 120.0;
  float specular = 0.0;
  if (lightIntensity > 0.0){
    // viewing vector
    vec3 viewVec = vec3(0,0,1.0);

    // reflective vector
    vec3 reflectVec = reflect(-lightDirection, normal);

    // determine the specularFactor based on the dot product of viewing and reflective,
    // taking at least a minimum of 0.0
    float specularFactor = max(dot(reflectVec, viewVec), 0.0);
    specular = pow(specularFactor, specularPower);
  }

  vec3 diffuse = lightColor * tex0.rgb * lightIntensity + specular;

  vec3 ambient = ambientColor * tex0.rgb;

  gl_FragColor = vec4(diffuse + ambient, 1.0);
}

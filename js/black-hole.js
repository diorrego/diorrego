// Fully procedural pixel art. The reference image is never loaded by this renderer.
const WIDTH = 624;
const HEIGHT = 432;
const VIEW_HEIGHT = 1.125;
const vertexSource = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentSource = `
precision highp float;
uniform float time;
uniform float motion;
varying vec2 uv;

vec2 turn(vec2 p, float a) {
  float c = cos(a), s = sin(a);
  return vec2(c*p.x-s*p.y, s*p.x+c*p.y);
}
float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),
             mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
}
float turbulence(vec2 p) {
  float total = 0.0;
  float weight = 0.55;
  for (int i=0; i<4; i++) {
    total += noise(p)*weight;
    p = turn(p,0.57)*2.07+vec2(13.1,7.4);
    weight *= 0.49;
  }
  return total;
}
vec3 thermal(float h) {
  vec3 c = vec3(0.025,0.018,0.055);
  c = mix(c,vec3(0.20,0.055,0.18),smoothstep(0.02,0.18,h));
  c = mix(c,vec3(0.48,0.12,0.16),smoothstep(0.16,0.35,h));
  c = mix(c,vec3(0.78,0.25,0.09),smoothstep(0.30,0.54,h));
  c = mix(c,vec3(1.00,0.49,0.13),smoothstep(0.48,0.70,h));
  c = mix(c,vec3(1.00,0.78,0.29),smoothstep(0.66,0.89,h));
  return mix(c,vec3(1.00,0.96,0.68),smoothstep(0.86,1.13,h));
}
void main() {
  // One small hard-edged pixel per cell; no bilinear blur or picture texture.
  vec2 cell = (floor(uv*vec2(624.,432.))+0.5)/vec2(624.,432.);
  // Fit the tilted disk's complete analytic bounds with breathing room on every edge.
  vec2 p = (cell-0.5)*vec2(1.625,1.125);
  float t = time*motion;
  vec2 disk = turn(p,-0.43);
  disk.y /= 0.51;
  float r = length(disk);
  float a = atan(disk.y,disk.x);
  float horizon = 0.082;

  // Kepler-like differential rotation keeps the shadow fixed while matter flows.
  float orbital = t*(0.16+0.064/max(r,0.085));
  vec2 flow = vec2(cos(a+orbital),sin(a+orbital))*r;
  float broad = turbulence(flow*7.0+vec2(2.1,4.7));
  float grain = turbulence(flow*42.0+vec2(broad*3.0));
  float winding = a*4.0+log(max(r,0.06))*10.5+t*1.15;
  float ribbons = 0.5+0.5*sin(winding+broad*5.0);
  float filaments = 0.5+0.5*sin(a*11.0+log(max(r,0.06))*39.0+t*2.1+grain*5.5);

  // Ragged cloud banks, winding filaments and a luminous inner disk.
  float envelope = exp(-r*3.55);
  float density = (0.43+grain*0.91)*(0.56+ribbons*0.52);
  density *= 0.80+filaments*0.31;
  float ragged = smoothstep(0.13,0.43,broad+envelope*0.25);
  float heat = envelope*density*ragged*1.98;
  heat *= smoothstep(horizon*0.98,horizon*1.32,r);

  // The approaching side is brighter; narrow highlights travel into the horizon.
  heat *= 1.0+0.16*cos(a-0.6);
  float photon = exp(-pow((r-0.108)/0.018,2.0));
  float photonRays = 0.83+0.17*sin(a*7.0-t*2.0+grain*3.0);
  heat += photon*photonRays*0.52;
  float spark = pow(max(0.0,sin(winding*1.5+grain*4.0)),22.0);
  heat += spark*envelope*0.11;

  heat *= 1.0-smoothstep(0.68,0.82,r);

  // Quantized temperature bands retain the small-pixel illustration character.
  heat = floor(heat*25.0)/25.0;
  vec3 color = thermal(heat);
  float alpha = smoothstep(0.014,0.075,heat);
  float shadow = 1.0-smoothstep(horizon*0.94,horizon,r);
  color = mix(color,vec3(0.002,0.003,0.006),shadow);
  alpha = max(alpha,shadow);
  gl_FragColor = vec4(color,alpha);
}`;

function createWebGLRenderer(canvas, onLost) {
  const gl = canvas.getContext('webgl', {
    alpha: true, premultipliedAlpha: false, antialias: false,
    depth: false, stencil: false, preserveDrawingBuffer: true,
  });
  if (!gl) return null;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error('Procedural black-hole shader compilation failed');
    }
    return shader;
  }
  const program = gl.createProgram();
  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    throw new Error('Procedural black-hole shader linking failed');
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const timeUniform = gl.getUniformLocation(program, 'time');
  const motionUniform = gl.getUniformLocation(program, 'motion');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  gl.viewport(0, 0, WIDTH, HEIGHT);
  let active = true;
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    active = false;
    onLost();
  });
  return {
    kind: 'webgl',
    render(time, moving) {
      if (!active) return;
      gl.uniform1f(timeUniform, time);
      gl.uniform1f(motionUniform, moving ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
  };
}

function createCanvasRenderer(original) {
  // Pure math fallback: cached orbital geometry, animated plasma and thermal colors.
  const canvas = document.createElement('canvas');
  canvas.id = original.id;
  canvas.setAttribute('aria-hidden', 'true');
  original.replaceWith(canvas);
  const context = canvas.getContext('2d');
  if (!context) return null;
  canvas.width = 416;
  canvas.height = 288;
  const frame = context.createImageData(416, 288);
  const geometry = [];
  const c = Math.cos(.43), s = Math.sin(.43);
  const palette = [[7,5,14],[48,14,44],[119,30,42],[201,64,23],[255,125,33],[255,198,74],[255,245,174]];
  for (let y=0; y<288; y++) {
    for (let x=0; x<416; x++) {
      const dx=(x/416-.5)*1.625, dy=(.5-y/288)*VIEW_HEIGHT;
      const qx=c*dx+s*dy, qy=(-s*dx+c*dy)/.51;
      const r=Math.hypot(qx,qy), a=Math.atan2(qy,qx);
      geometry.push({r,a,envelope:Math.exp(-r*3.55)});
    }
  }
  return {
    kind: 'canvas2d',
    render(time, moving) {
      const t = moving ? time : 0;
      for (let i=0; i<geometry.length; i++) {
        const {r,a,envelope}=geometry[i];
        const orbital=t*(.16+.064/Math.max(r,.085));
        const grain=.5+.22*Math.sin(Math.cos(a+orbital)*r*113+Math.sin(a+orbital)*r*77)+.13*Math.sin(r*147-a*17-orbital*13);
        const ribbons=.5+.5*Math.sin(a*4+Math.log(Math.max(r,.06))*10.5+t*1.15+grain*5);
        let heat=envelope*(.43+grain*.91)*(.56+ribbons*.52)*1.98;
        heat*=Math.max(0,Math.min(1,(r-.080)/.028));
        heat+=Math.exp(-(((r-.108)/.018)**2))*.50;
        const fade=Math.max(0,Math.min(1,(r-.68)/.14));
        heat*=1-fade*fade*(3-2*fade);
        const shadow=r<.078;
        const level=Math.max(0,Math.min(5.99,Math.floor(heat*25)/25*5.4));
        const low=Math.floor(level), fraction=level-low;
        const index=i*4;
        for(let channel=0;channel<3;channel++)frame.data[index+channel]=shadow?1:palette[low][channel]*(1-fraction)+palette[low+1][channel]*fraction;
        frame.data[index+3]=shadow?255:Math.max(0,Math.min(255,(heat-.014)/.061*255));
      }
      context.putImageData(frame,0,0);
    },
  };
}

export async function initializeBlackHole() {
  const scene = document.querySelector('#universe');
  const canvas = document.querySelector('#space-canvas');
  let renderer;
  try {
    renderer = createWebGLRenderer(canvas, () => {
      scene.classList.remove('has-canvas');
      scene.dataset.artReady = 'false';
      scene.dataset.renderer = 'svg';
    });
  } catch {
    renderer = null;
  }
  if (!renderer) renderer = createCanvasRenderer(canvas);
  scene.dataset.procedural = 'true';
  if (!renderer) return { render() {} };
  renderer.render(0, false);
  scene.dataset.renderer = renderer.kind;
  scene.dataset.artReady = 'true';
  scene.classList.add('has-canvas');
  return renderer;
}

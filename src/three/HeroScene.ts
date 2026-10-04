import * as THREE from 'three'

/**
 * Hero scene: two product pouches floating over a grainy sun.
 *
 * Everything is drawn with multiply blending against a cream clear colour,
 * so the white backgrounds of the packaging JPEGs sink into the paper exactly
 * like CSS `mix-blend-mode: multiply` would. No lighting; the "3D" comes from
 * perspective, a gentle bulge in each pouch and mouse/scroll driven motion.
 */

export type HeroSceneOptions = {
  canvas: HTMLCanvasElement
  packs: { url: string; x: number; y: number; z: number; rot: number; scale: number; parallax: number }[]
  cream: string
  sun: string
  reducedMotion: boolean
  onReady?: () => void
}

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

const SUN_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const SUN_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uReveal;
  uniform vec3 uTint;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.07; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float ang = atan(p.y, p.x);

    float n = fbm(p * 3.2 + uTime * 0.045);
    float edge = 0.58 + (n - 0.5) * 0.16;
    float disc = 1.0 - smoothstep(edge - 0.22, edge, r);

    // faint spokes outside the disc, turning slowly
    float spokes = pow(max(0.0, sin(ang * 32.0 + uTime * 0.12)), 10.0);
    float rays = spokes * smoothstep(edge - 0.04, edge + 0.04, r) * (1.0 - smoothstep(edge + 0.05, 1.0, r)) * 0.28;

    // film grain, animated
    float grain = (hash(vUv * 1600.0 + fract(uTime * 0.7)) - 0.5) * 0.14;

    float mask = clamp(disc * (0.82 + grain) + rays, 0.0, 1.0) * uReveal;
    vec3 col = mix(vec3(1.0), uTint, mask);
    gl_FragColor = vec4(col, 1.0);
  }
`

const PACK_VERT = /* glsl */ `
  varying vec2 vUv;
  uniform float uBulge;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float sx = sin(uv.x * 3.14159);
    float sy = pow(sin(uv.y * 3.14159), 0.55);
    pos.z += uBulge * sx * sy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const PACK_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uOpacity;
  void main() {
    vec3 t = texture2D(uMap, vUv).rgb;
    gl_FragColor = vec4(mix(vec3(1.0), t, uOpacity), 1.0);
  }
`

export class HeroScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private group = new THREE.Group()
  private sun: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  private packs: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = []
  private pointer = new THREE.Vector2()
  private pointerTarget = new THREE.Vector2()
  private timer = new THREE.Timer()
  private running = false
  private visible = true
  private disposed = false
  private scrollProgress = 0
  private opts: HeroSceneOptions

  /** Public knobs driven by GSAP from the outside. */
  readonly intro = { rise: 1, opacity: 0, sun: 0 }

  constructor(opts: HeroSceneOptions) {
    this.opts = opts
    this.renderer = new THREE.WebGLRenderer({ canvas: opts.canvas, antialias: true, alpha: false, powerPreference: 'low-power' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(new THREE.Color(opts.cream), 1)

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
    this.camera.position.set(0, 0, 7)
    this.scene.add(this.group)

    const cream = hexToRgb(opts.cream)
    const sun = hexToRgb(opts.sun)
    const tint = new THREE.Vector3(sun.x / cream.x, sun.y / cream.y, sun.z / cream.z)

    this.sun = new THREE.Mesh(
      new THREE.PlaneGeometry(5.6, 5.6),
      new THREE.ShaderMaterial({
        vertexShader: SUN_VERT,
        fragmentShader: SUN_FRAG,
        uniforms: { uTime: { value: 0 }, uReveal: { value: 0 }, uTint: { value: tint } },
        blending: THREE.MultiplyBlending,
        transparent: true,
        premultipliedAlpha: true,
        depthWrite: false,
        depthTest: false,
      }),
    )
    this.sun.position.set(0.35, 0.15, -1.2)
    this.sun.renderOrder = 0
    this.group.add(this.sun)

    const loader = new THREE.TextureLoader()
    let pending = opts.packs.length
    opts.packs.forEach((pack, i) => {
      loader.load(pack.url, (texture) => {
        if (this.disposed) {
          texture.dispose()
          return
        }
        texture.colorSpace = THREE.NoColorSpace
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy())
        const img = texture.image as HTMLImageElement
        const aspect = img.naturalWidth / img.naturalHeight
        const h = 2.15 * pack.scale
        const w = h * aspect
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h, 24, 32),
          new THREE.ShaderMaterial({
            vertexShader: PACK_VERT,
            fragmentShader: PACK_FRAG,
            uniforms: { uMap: { value: texture }, uOpacity: { value: 0 }, uBulge: { value: w * 0.09 } },
            blending: THREE.MultiplyBlending,
            transparent: true,
        premultipliedAlpha: true,
            depthWrite: false,
            depthTest: false,
          }),
        )
        mesh.position.set(pack.x, pack.y, pack.z)
        mesh.rotation.z = pack.rot
        mesh.renderOrder = 1 + i
        mesh.userData = { base: new THREE.Vector3(pack.x, pack.y, pack.z), rot: pack.rot, parallax: pack.parallax, phase: i * 1.7 }
        this.group.add(mesh)
        this.packs[i] = mesh
        if (--pending === 0) {
          this.resize()
          this.render()
          opts.onReady?.()
        }
      })
    })

    this.resize()
    window.addEventListener('resize', this.resize)
    document.addEventListener('visibilitychange', this.onVisibility)
  }

  setPointer(nx: number, ny: number) {
    this.pointerTarget.set(nx, ny)
  }

  setScroll(progress: number) {
    this.scrollProgress = progress
    if (this.opts.reducedMotion) this.render()
  }

  setVisible(visible: boolean) {
    this.visible = visible
    if (visible) this.start()
  }

  start() {
    if (this.running || this.disposed || this.opts.reducedMotion) return
    this.running = true
    this.renderer.setAnimationLoop(this.loop)
  }

  stop() {
    this.running = false
    this.renderer.setAnimationLoop(null)
  }

  dispose() {
    this.disposed = true
    this.stop()
    window.removeEventListener('resize', this.resize)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        const mat = obj.material as THREE.ShaderMaterial
        Object.values(mat.uniforms).forEach((u) => {
          if (u.value instanceof THREE.Texture) u.value.dispose()
        })
        mat.dispose()
      }
    })
    this.renderer.dispose()
  }

  private onVisibility = () => {
    if (document.hidden) this.stop()
    else if (this.visible) this.start()
  }

  private resize = () => {
    const { canvas } = this.opts
    const w = canvas.clientWidth || 1
    const h = canvas.clientHeight || 1
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    // On narrow viewports pull the camera back so both pouches stay in frame.
    const narrow = w / h < 0.9
    this.camera.position.z = narrow ? 10.4 : 7
    // Keep the composition in the right half on wide screens so it never sits under the headline.
    const visibleWidth = 2 * this.camera.position.z * Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.aspect
    this.group.position.x = narrow ? 0 : visibleWidth * 0.27
    if (this.opts.reducedMotion) this.render()
  }

  private loop = () => {
    if (!this.visible || document.hidden) {
      this.stop()
      return
    }
    this.render()
  }

  render = () => {
    this.timer.update()
    const t = this.timer.getElapsed()
    const reduced = this.opts.reducedMotion
    const sunMat = this.sun.material
    sunMat.uniforms.uTime.value = t
    sunMat.uniforms.uReveal.value = reduced ? 1 : this.intro.sun

    if (!reduced) {
      this.pointer.lerp(this.pointerTarget, 0.06)
      this.group.rotation.y = this.pointer.x * 0.16
      this.group.rotation.x = -this.pointer.y * 0.1
    }

    const scroll = this.scrollProgress
    this.sun.position.y = 0.15 + scroll * 0.9
    this.sun.rotation.z = scroll * 0.35

    this.packs.forEach((mesh, i) => {
      if (!mesh) return
      const { base, rot, parallax, phase } = mesh.userData as { base: THREE.Vector3; rot: number; parallax: number; phase: number }
      const floatY = reduced ? 0 : Math.sin(t * 0.7 + phase) * 0.045
      const floatR = reduced ? 0 : Math.sin(t * 0.5 + phase) * 0.012
      const rise = reduced ? 0 : this.intro.rise * (0.9 + i * 0.35)
      const drift = (i === 0 ? -1 : 1) * scroll * 0.9
      mesh.position.set(
        base.x + drift * 0.35 + this.pointer.x * parallax,
        base.y + floatY - rise + scroll * (1.1 + i * 0.5) + this.pointer.y * parallax * 0.6,
        base.z,
      )
      mesh.rotation.z = rot + floatR + drift * 0.18
      mesh.material.uniforms.uOpacity.value = reduced ? 1 : this.intro.opacity
    })

    this.renderer.render(this.scene, this.camera)
  }
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

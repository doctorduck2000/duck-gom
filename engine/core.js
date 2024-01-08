import { CHUNK_SIZE, SPEED } from "./static.js";
import { Degree, Int, Load, Radian, Random, Script } from "./utils.js";

class Block {
	constructor (datas={}) {
		this.full = datas.full;
		this.geometry = datas.geometry;
		this.material = datas.material;
		this.position = datas.position;

		const R = () => Int(Random() % 4);
		
		this.rotation = {
			x: datas.rotation ? (typeof datas.rotation.x === "number" ? datas.rotation.x : R()) : R(),
			y: datas.rotation ? (typeof datas.rotation.y === "number" ? datas.rotation.y : R()) : R(),
			z: datas.rotation ? (typeof datas.rotation.z === "number" ? datas.rotation.z : R()) : R()
		};
	}

	render () {
		this.mesh = new THREE.Mesh(this.geometry,this.material);
		this.mesh.position.set(...this.position);
		this.mesh.rotation.set(Radian(this.rotation.x * 90),Radian(this.rotation.y * 90),Radian(this.rotation.z * 90));
	}
};

class Camera {
	constructor () {
		this.position = [0,0,0];
		this.rotation = [0,0,0];
		this.updated = true;
	}

	moveTo (x=0,y=0,z=0) {
		this.position = [x,y,z];

		this.updated = true;
	}

	move (x=0,y=0,z=0) {
		this.position[0] += x;
		this.position[1] += y;
		this.position[2] += z;

		this.updated = true;
	}

	rotateTo (x=0,y=0,z=0) {
		this.rotation = [x,y,z];
	}

	rotate (x=0,y=0,z=0) {
		this.rotation[0] += x;
		this.rotation[1] += y;
		this.rotation[2] += z;

		if (this.rotation[0] < -90) {
			this.rotation[0] = -90;
		}

		if (this.rotation[0] > 90) {
			this.rotation[0] = 90;
		}

		if (this.rotation[2] < -90) {
			this.rotation[2] = -90;
		}

		if (this.rotation[2] > 90) {
			this.rotation[2] = 90;
		}
	}
	
	get radianRotation () {
		return [Radian(this.rotation[0]),Radian(this.rotation[1]),Radian(this.rotation[2])];
	}
};

const Controls = {
	pressed: {
		jump: false,
		sneak: false,
		forward: false,
		backward: false,
		towardsleft: false,
		towardsright: false
	},

	init: () => {
		Controls.touchDevice = (("ontouchstart" in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

		if (Controls.touchDevice) {
			const joystick = document.getElementsByTagName("joystick")[0];
			joystick.style.display = "";

			const cancel = () => {
				joystick.removeEventListener("touchstart",jStart);
				joystick.removeEventListener("touchmove",jMove);
				joystick.removeEventListener("touchend",jEnd);
				joystick.removeEventListener("touchcancel",jEnd);
				
				window.removeEventListener("touchstart",cStart);
				window.removeEventListener("touchmove",cMove);
				window.removeEventListener("touchend",cEnd);
				window.removeEventListener("touchcancel",cEnd);

				joystick.style.display = "none";

				document.getElementById("menu").style.display = "";
				world.canvas.style.filter = `blur(0.25rem)`;
			};


			const jStart = (e) => {
				
			};

			const jMove = (e) => {
				
			};

			const jEnd = (e) => {
				
			};


			const cStart = (e) => {
				
			};

			const cMove = (e) => {
				
			};

			const cEnd = (e) => {
				
			};

			const resume = () => {
				joystick.addEventListener("touchstart",jStart);
				joystick.addEventListener("touchmove",jMove);
				joystick.addEventListener("touchend",jEnd);
				joystick.addEventListener("touchcancel",jEnd);

				window.addEventListener("touchstart",cStart);
				window.addEventListener("touchmove",cMove);
				window.addEventListener("touchend",cEnd);
				window.addEventListener("touchcancel",cEnd);

				document.getElementById("menu").style.display = "none";
				world.canvas.style.filter = "none";
			};

			document.getElementById("resume").addEventListener("click",resume);
			resume();
			
			window.addEventListener("blur",cancel);
		} else {
			const cancel = () => {
				document.exitPointerLock();
				document.removeEventListener("mousemove",Controls.move);
				document.getElementById("menu").style.display = "flex";
				world.canvas.style.filter = `blur(0.25rem)`;
			};

			const f = () => {
				if (document.pointerLockElement === document.documentElement) {
					document.addEventListener("mousemove",Controls.move);
					document.getElementById("menu").style.display = "";
					document.getElementsByTagName("settings")[0].style.display = "";
					world.canvas.style.filter = "none";
				} else {
					cancel();
				}
			};

			window.addEventListener("pointerlockchange",f);
			window.addEventListener("mozpointerlockchange",f);
			window.addEventListener("blur",cancel);

			window.addEventListener("keydown",(e) => {
				const action = settings.actions[e.key.toLowerCase()];

				if (action) {
					Controls.pressed[action] = true;
					e.preventDefault();
				}
			});
			
			window.addEventListener("keyup",(e) => {
				const action = settings.actions[e.key.toLowerCase()];

				if (action) {
					Controls.pressed[action] = false;
					e.preventDefault();
				}
			});

			document.getElementById("resume").addEventListener("click",Controls.lock);
			document.getElementById("settings").addEventListener("click",() => document.getElementsByTagName("settings")[0].style.display = "flex");
			document.getElementById("exit-settings").addEventListener("click",Controls.lock);

			document.getElementById("low-quality").addEventListener("click",() => {
				if (!document.getElementById("low-quality").toggleAttribute("checked")) {
					world.antialias = false;
					world.quality = "low";
					world.powerPreference = "high-performance";
				} else {
					world.antialias = true;
					world.quality = "high";
					world.powerPreference = "low-power";
				}
			});
			
			document.getElementById("render-distance").value = settings.renderDistance;
			document.getElementById("render-distance-display").innerHTML = settings.renderDistance;

			document.getElementById("render-distance").addEventListener("input",(e) => {
				settings.renderDistance = Number(e.target.value);
				document.getElementById("render-distance-display").innerHTML = Math.pow(Math.round(settings.renderDistance) * 2,2);
			});

			Controls.lock();

			document.getElementsByTagName("ui")[0].append(document.createElement("cursor"));
		}

		Controls.update();
	},

	move: (e) => {
		if (Controls.touchDevice) {

		} else {
			camera.rotate(-(e.movementY / innerHeight * 360) * settings.sensibility.y,-(e.movementX / innerWidth * 360) * settings.sensibility.x);
		}
	},

	lock: () => {
		try {
			document.documentElement.requestPointerLock();
		} catch (e) {
			new ErrorScreen({
				title: "Mouse lock error",
				content: `Mouse lock isn't available on your device.<br />Check the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API#browser_compatibility" target="_blank">browser compatibility</a> on MDN.`,
				error: e
			});
		}
	},

	update: () => {
		if (world.FPS !== 0) {
			window.r = Radian(-camera.rotation[1] + (Controls.pressed.backward && !Controls.pressed.forward ? 180 : 0) + (Controls.pressed.towardsleft && !Controls.pressed.towardsright ? -90 : 0) + (Controls.pressed.towardsright && !Controls.pressed.towardsleft ? 90 : 0));
			const s = Controls.pressed.forward || Controls.pressed.backward || Controls.pressed.towardsleft || Controls.pressed.towardsright ? SPEED / world.FPS : 0;

			const x = s * Math.sin(r);
			const y = Controls.pressed.jump && !Controls.pressed.sneak ? SPEED / world.FPS : (Controls.pressed.sneak & !Controls.pressed.jump ? -SPEED / world.FPS : 0);
			const z = -s * Math.cos(r);

			camera.move(x,y,z);
			
			Controls.lastUpdate = performance.now();
		}
		requestAnimationFrame(() => Controls.update());
	}
};

class Chunk {
	constructor (generation,x,z) {
		let datas = Script(generation,x,z);

		this.blocks = datas.blocks;

		this.position = {
			x: x,
			z: z
		};

		this.blocks.forEach((xl,x) => {
			xl.forEach((zl,z) => {
				zl.forEach((block,y) => {
					const type = block;
					block = (resources.blocks[type] || resources.blocks.error);
					block.type = type;
					block.position = [x + (this.position.x * CHUNK_SIZE[0]),y,z + (this.position.z * CHUNK_SIZE[1])];
					this.blocks[x][z][y] = new Block(block);
					this.blocks[x][z][y].render();
				});
			});
		});

		world.chunks[`${this.position.x}_${this.position.z}`] = this;

		this.render();
	}

	render () {
		this.group ? this.group.clear() : this.group = new THREE.Group();

		this.blocks.forEach((xl,x) => {
			xl.forEach((zl,z) => {
				zl.forEach((block,y) => {
					if (block instanceof Block) {
						const size = new THREE.Vector3();
						new THREE.Box3().copy(block.geometry.boundingBox).getSize(size);

						const ranges = {
							x: [x - 1,x + size.x + 1],
							y: [y - 1,y + size.y + 1],
							z: [z - 1,z + size.z + 1]
						};

						let surroundedByFullBlocks = true;

						for (let sx = ranges.x[0]; sx < ranges.x[1]; ++sx) {
							for (let sz = ranges.z[0]; sz < ranges.z[1]; ++sz) {
								for (let sy = ranges.y[0]; sy < ranges.y[1]; ++sy) {
									let n = 0;

									if (sx === ranges.x[0] || sx === ranges.x[1] - 1) {
										n++;
									}

									if (sy === ranges.y[0] || sy === ranges.y[1] - 1) {
										n++;
									}

									if (sz === ranges.z[0] || sz === ranges.z[1] - 1) {
										n++;
									}

									if (n < 2) {
										let bx = sx;
										let bz = sz;

										let cx = this.position.x;
										let cz = this.position.z;

										if (sx >= CHUNK_SIZE[0]) {
											cx++;
											bx = 0;
										}

										if (sx < 0) {
											cx--;
											bx = CHUNK_SIZE[0] - 1;
										}

										if (sz >= CHUNK_SIZE[1]) {
											cz++;
											bz = 0;
										}

										if (sz < 0) {
											cz--;
											bz = CHUNK_SIZE[1] - 1;
										}

										const chunk = world.chunks[`${cx}_${cz}`];

										if (sy != -1 && chunk && chunk.blocks && !(chunk.blocks[bx] && chunk.blocks[bx][bz] && chunk.blocks[bx][bz][sy] && chunk.blocks[bx][bz][sy].full)) {
											surroundedByFullBlocks = false;
										}
									}
								}
							}
						}

						if (!surroundedByFullBlocks) {
							this.group.add(block.mesh);
						}
					}
				});
			});
		});
	}

	getHighestBlock (x=0,z=0) {
		return this.blocks[x][z].length;
	}
};

class ErrorScreen {
	constructor (datas={}) {
		this.title = datas.title || "Error";
		this.content = datas.content || "No description or content";
		this.error = datas.error || "Unknow error";

		window.freeze = true;

		const w = document.createElement("ErrorWindow");
		w.innerHTML = `<name>${this.title}</name><content>${this.content}</content><error>${this.error}</error>`;
		document.body.prepend(w);
	}
};

class Resources {
	static async load (url="/resources/default.resources.webcraft") {
		return new Resources(await Load(url,"json"));
	}

	constructor (resources) {
		this.blocks = resources.blocks;
		this.description = resources.description;
		this.generations = resources.generations;
		this.name = resources.name;
		this.version = resources.version;

		this.blocks.error = {
			full: true,
			geometry: "return new THREE.BoxGeometry(1,1,1)",
			material: "const face1 = new THREE.MeshLambertMaterial({map:loadTexture(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQImQXBAQEAAACAEP9PF1IISg1Dzgf5+WD3KgAAAABJRU5ErkJggg==`)}); const face2 = new THREE.MeshLambertMaterial({map:loadTexture(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQImQXBAQEAAACAEP9PF1BKCg1Dzgf5Z4meawAAAABJRU5ErkJggg==`)}); return [face1,face1,face1,face1,face2,face2]",
			name: "Errorblock",
			rotation: {x:0,y:0,z:0},
			scripts: {}
		};

		for (let name in this.blocks) {
			this.blocks[name].full = this.blocks[name].full !== undefined ? this.blocks[name].full : this.blocks.error.full;
			this.blocks[name].geometry = Script(this.blocks[name].geometry !== undefined ? this.blocks[name].geometry : this.blocks.error.geometry);
			this.blocks[name].geometry.computeBoundingBox();
			this.blocks[name].material = Script(`window.loadTexture = (uri="") => {
				const textureLoader = new THREE.TextureLoader();
				const texture = textureLoader.load(uri,() => {
					world.updated = true;
					world.forcedUpdate = true;
				});
				texture.magFilter = THREE.NearestFilter;
				return texture;
			};
			
			${this.blocks[name].material !== undefined ? this.blocks[name].material : this.blocks.error.material}`);
			this.blocks[name].name = this.blocks[name].name !== undefined ? this.blocks[name].name : this.blocks.error.name;
			this.blocks[name].scripts = this.blocks[name].scripts !== undefined ? this.blocks[name].scripts : {};
		}
	}
};

class Settings {
	constructor () {
		this.actions = {
			"w": "forward",
			"arrowup": "forward",
			"s": "backward",
			"arrowdown": "backward",
			"a": "towardsleft",
			"arrowleft": "towardsleft",
			"d": "towardsright",
			"arrowright": "towardsright",
			" ": "jump",
			"shift": "sneak"
		};

		this.fov = 50;
		this.info = true;
		this.quality = "high";
		
		this.sensibility = {
			x: 1,
			y: 0.5
		};

		this.renderType = "auto";
		this.renderDistance = 1;
	}
};

class World {
	constructor (mode="flat") {
		this._internal = {
			previousTimestamp: 0,
			renderer: {
				datas: {
					antialias: true,
					powerPreference: "high-performance",
					precision: "mediump"
				}
			}
		};

		this.mode = mode;

		this.chunks = {};

		this.scene = new THREE.Scene();
		this.lights = {
			ambient: new THREE.AmbientLight("#FFF",0.25),
			hemisphere: new THREE.HemisphereLight("#FFF",1)
		};
		this.group = new THREE.Group();
		this.scene.add(this.lights.ambient,this.lights.hemisphere,this.group);

		this.raycaster = new THREE.Raycaster();
		this.raycaster.near = 0.01;
		this.raycaster.far = 5;

		this.canvas = document.createElement("canvas");
		this._internal.renderer.datas.canvas = this.canvas;

		this.setRenderer(this._internal.renderer.datas);

		this.size = [innerWidth,innerHeight];
		this.quality = settings.quality;
	}

	get antialias () {
		return this._internal.renderer.datas.antialias;
	}

	set antialias (v) {
		const d = this._internal.renderer.datas;
		d.antialias = v;
		this.setRenderer(d);
	}

	get powerPreference () {
		return this._internal.renderer.datas.powerPreference;
	}

	set powerPreference (v) {
		const d = this._internal.renderer.datas;
		d.powerPreference = v;
		this.setRenderer(d);
	}

	get quality () {
		return this.renderer.getPixelRatio();
	}

	set quality (v) {
		const qualities = {
			"high": devicePixelRatio,
			"low": 1
		};

		this.renderer.setPixelRatio(qualities[v]);
		this.updated = true;
	}

	get size () {
		return this.renderer.getSize(new THREE.Vector2());
	}

	set size (v) {
		this.renderer.setSize(v[0],v[1]);
		camera.updated = true;
	}


	async init () {
		await this.update();
		this.updated = true;
	}


	generateChunk (x=0,z=0) {
		this.chunks[`${x}_${z}`] = "generating";
		new Chunk(resources.generations[world.mode],x,z);
	}

	
	setRenderer (d) {
		if (this.renderer) {
			this.renderer.dispose();
		}

		this._internal.renderer.datas = d;

		this.renderer = new THREE.WebGLRenderer(d);
		this.updated = true;
	}

	async update() {
		const start = performance.now();

		if (this.updated || camera.updated) {
			const coreStart = performance.now();

			if (!this.camera || camera.updated) {
				camera.updated = false;

				this.camera = new THREE.PerspectiveCamera(settings.fov,innerWidth / innerHeight,0.01,2000);
				this.camera.position.set(...camera.position);
				this.camera.rotation.set(...camera.radianRotation);
				this.camera.rotation.order = "YXZ";
				this.camera.updateMatrixWorld();

				const pointer = new THREE.Vector2();
				pointer.x = (innerWidth / 2 / innerWidth ) * 2 - 1;
				pointer.y = -(innerHeight / 2 / innerHeight) * 2 + 1;
				this.raycaster.setFromCamera(pointer,this.camera);
			}

			const px = Math.round(camera.position[0] / CHUNK_SIZE[0]);
			const pz = Math.round(camera.position[2] / CHUNK_SIZE[1]);
			const r = Math.round(settings.renderDistance);

			this.group.clear();

			for (let x = px - r; x < px + r; ++x) {
				for (let z = pz - r; z < pz + r; ++z) {
					const chunk = this.chunks[`${x}_${z}`];
					
					if (!chunk) {
						this.generateChunk(x,z);
					} else if (chunk instanceof Chunk) {
						this.group.add(chunk.group);
					}
				}
			}

			const intersects = this.raycaster.intersectObject(this.group,true) || null;
			
			if (intersects.length > 0) {
				const intersect = intersects[0];

				if (!window.target || target.object.uuid !== intersect.object.uuid) {
					window.target = intersect;

					if (this.raycaster.visibleEffect) {
						this.raycaster.visibleEffect.removeFromParent();
					}

					this.raycaster.visibleEffect = new THREE.LineSegments(new THREE.EdgesGeometry(target.object.geometry));
					this.raycaster.visibleEffect.material.opacity = 0.5;
					this.raycaster.visibleEffect.material.transparent = true;

					target.object.updateMatrix();
					this.raycaster.visibleEffect.geometry.applyMatrix4(target.object.matrix);

					this.scene.add(this.raycaster.visibleEffect);
				}
			} else {
				window.target = null;

				if (this.raycaster.visibleEffect) {
					this.raycaster.visibleEffect.removeFromParent();
				}
			}

			this.coreTime = performance.now() - coreStart;

			const renderingStart = performance.now();
			this.renderer.render(this.scene,this.camera);
			this.renderingTime = performance.now() - renderingStart;
		}

		if (start - this._internal.previousTimestamp !== 0) {
			this.FPS = (1 / (start - this._internal.previousTimestamp)) * 1000;
			this._internal.previousTimestamp = start;
		} else {
			this.FPS = 0;
		}

		const infos = document.getElementsByClassName("infos")[0];

		if (settings.info) {
			infos.style.display = "";
			infos.innerHTML = `Core: ${Int(this.coreTime)} ms<br />Rendering: ${Int(this.renderingTime)} ms<br />${Int(this.FPS)} FPS<br />Quality: ${document.getElementById("low-quality").hasAttribute("checked") ? "low" : "high"}<br /><br />Position: ${camera.position[0].toFixed(2)} ${camera.position[1].toFixed(2)} ${camera.position[2].toFixed(2)}<br />Rotation: ${(-camera.rotation[1] % 360).toFixed(2)} ${(camera.rotation[0] % 360).toFixed(2)} ${(camera.rotation[2] % 360).toFixed(2)}<br />Direction: ${(Degree(window.r || 0) % 360).toFixed(2)}<br /><br />Calls: ${this.renderer.info.render.calls}<br />Triangles: ${this.renderer.info.render.triangles}<br />Render distance: ${Math.pow(Math.round(settings.renderDistance) * 2,2)} chunks<br /><br />Generated chunks: ${Object.keys(this.chunks).length}`;
		} else {
			infos.style.display = "none";
		}

		this.updated = false;
		
		if (!window.freeze) {
			requestAnimationFrame(() => this.update());
		}
	}
};


export {
	Block as block,
	Camera as camera,
	Chunk as chunk,
	Controls as controls,
	ErrorScreen as errorScreen,
	Resources as resources,
	Settings as settings,
	World as world
}
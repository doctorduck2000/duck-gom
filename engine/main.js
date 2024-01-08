import * as Core from "./core.js";
import * as Static from "./static.js";
import * as Utils from "./utils.js";

const Start = async (mode) => {
	if (!mode && user) {
		mode = "local";
	} else {
		mode = "demo";
	}

	switch (mode) {
		case "local":
			
			break;
	}

	try {
		window.camera = new Core.camera();
		window.settings = new Core.settings();
		window.world = new Core.world();
		window.resources = await Core.resources.load();

		document.getElementsByTagName("title")[0].innerHTML = `${mode} | WebCraft`;
		await world.generateChunk();
		document.body.append(world.canvas);

		world.scene.background = new THREE.Color("#222");
		camera.moveTo(0,world.chunks["0_0"].getHighestBlock(CHUNK_SIZE[0] / 2,CHUNK_SIZE[1] / 2) + 1,0);
		window.addEventListener("resize",() => world.size = [innerWidth,innerHeight]);

		window.actx = new (window.webkitAudioContext || window.AudioContext)({
			sampleRate: 44100
		});

		if (actx.state === "running") {
			world.init();
			Core.controls.init();

			document.getElementById("startWindow").remove();
		} else {
			document.body.addEventListener("click",() => {
				actx.resume();

				world.init();
				Core.controls.init();

				document.getElementById("startWindow").remove();
			},{
				once: true
			});
		}		
	} catch (e) {
		new Core.errorScreen({
			title: "Oops",
			content: "An error occured when launching the game",
			error: e
		});
	}
};

export { Start };
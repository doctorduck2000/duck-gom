const Degree = (d=0) => (d / Math.PI * 180) % 360;
const Int = Math.round;
window.Int = Int;

const Load = (url="",type="text",timeout=10000) => {
	return new Promise((resolve,reject) => {
		const xhr = new XMLHttpRequest();

		xhr.open("GET",url,true);
		xhr.responseType = type;

		xhr.onload = () => {
			if (xhr.status === 200) {
				resolve(xhr.response);
			} else {
				reject(`${xhr.statusText} (${xhr.status})`);
			}
		};

		xhr.onerror = () => {
			reject(`Network error (${xhr.status})`);
		};
		
		xhr.ontimeout = () => {
			reject("Network error (timeout");
		};

		xhr.timeout = timeout;

		xhr.send();
	});
};

const Radian = (d=0) => (d % 360) * Math.PI / 180;
const Random = () => {
	if (!Random.digits || !Random.index || !Random.digits[Random.index]) {
		const Uint32 = new Uint32Array(1);
		window.crypto.getRandomValues(Uint32);
		Random.index = -1;
		Random.digits = String(Uint32[0]);
	}

	Random.index++;
	return Random.digits[Random.index];
};
window.Random = Random;
const Script = (txt="",...args) => new Function("args",txt)(args);

const wait = (time=0) => {
	return new Promise((resolve) => {
		if (time < 1000 / 60) {
			requestAnimationFrame(resolve);
		} else {
			setTimeout(() => requestAnimationFrame(resolve),time);
		}
	});
};


export { Degree, Int as Int, Load, Radian, Random as Random, Script, wait };

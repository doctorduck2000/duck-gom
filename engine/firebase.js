import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

const Firebase = {
    app: initializeApp({
		apiKey: "AIzaSyAfK59van1dSr_hY_bqpRpVU_Uyk-ilhB0",
		authDomain: "wixonic-productions-webcraft.firebaseapp.com",
		databaseURL: "https://wixonic-productions-webcraft-default-rtdb.europe-west1.firebasedatabase.app",
		projectId: "wixonic-productions-webcraft",
		storageBucket: "wixonic-productions-webcraft.appspot.com",
		messagingSenderId: "1040133112527",
		appId: "1:1040133112527:web:2d2775938eadced041edba",
		measurementId: "G-T2X8V33Y4W"
	}),

	auth: getAuth()
};

Firebase.analytics = getAnalytics(Firebase.app);

export { Firebase };
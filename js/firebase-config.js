// Importa las funciones necesarias de los SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Configuración de tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD3iEvN1K9XkflqcM6VEblsjiqGXqQJOLY",
  authDomain: "futbol-academy-d95a3.firebaseapp.com",
  projectId: "futbol-academy-d95a3",
  storageBucket: "futbol-academy-d95a3.firebasestorage.app",
  messagingSenderId: "512196652396",
  appId: "1:512196652396:web:5eb3379e2501f26bab1749",
  measurementId: "G-21KYV37L25"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportamos la autenticación y la base de datos para usarlas en el login y registro
export const auth = getAuth(app);
export const db = getFirestore(app);
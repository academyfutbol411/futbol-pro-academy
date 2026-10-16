import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const cursosIniciales = [
  {
    title: "Dominio de Balón & Primer Toque",
    description: "Domina el esférico bajo presión, mejora tu control orientado y aumenta tu velocidad de ejecución técnica.",
    category: "Técnica individual",
    level: "Novato / Promesa",
    price: 29900,
    imageUrl: "",
    instructorId: "inst_01",
    published: true
  },
  {
    title: "Inteligencia Táctica & Lectura de Juego",
    description: "Comprende los espacios, anticipa las jugadas y toma mejores decisiones tácticas en fase ofensiva y defensiva.",
    category: "Táctica y posicionamiento",
    level: "Competidor",
    price: 29900,
    imageUrl: "",
    instructorId: "inst_02",
    published: true
  },
  {
    title: "Velocidad, Agilidad y Prevención",
    description: "Desarrolla potencia explosiva en espacios cortos, coordinación de pies y rutinas de prevención de lesiones comunes.",
    category: "Preparación física",
    level: "Todos los niveles",
    price: 29900,
    imageUrl: "",
    instructorId: "inst_03",
    published: true
  }
];

async function cargarCursos() {
  try {
    for (const curso of cursosIniciales) {
      await addDoc(collection(db, "courses"), curso);
    }
    console.log("¡Cursos precargados con éxito en Firestore!");
  } catch (error) {
    console.error("Error al cargar los cursos: ", error);
  }
}

// Puedes ejecutar esta función una vez desde tu entorno de desarrollo
// cargarCursos();
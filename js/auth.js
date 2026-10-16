import { auth, db } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const nameGroup = document.getElementById("name-group");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const toggleMode = document.getElementById("toggle-mode");
const googleBtn = document.getElementById("google-btn");
const errorMsg = document.getElementById("error-msg");

let isRegistering = false;

// Alternar entre Iniciar Sesión y Registrarse
toggleMode.addEventListener("click", () => {
  isRegistering = !isRegistering;
  if (isRegistering) {
    formTitle.textContent = "Crear Cuenta Pro";
    submitBtn.textContent = "Registrarse";
    nameGroup.style.display = "block";
    toggleMode.textContent = "Inicia sesión aquí";
  } else {
    formTitle.textContent = "Iniciar Sesión";
    submitBtn.textContent = "Ingresar";
    nameGroup.style.display = "none";
    toggleMode.textContent = "Regístrate aquí";
  }
  errorMsg.textContent = "";
});

// Función inteligente de redirección (Verifica Admin o Enrollments)
async function verificarAccesoYRedirigir(user) {
  try {
    // 1. Revisar si es Administrador
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists() && userDocSnap.data().role === "admin") {
      window.location.href = "admin.html";
      return;
    }

    // 2. Revisar si tiene inscripciones activas (Paywall / Enrollments)
    const enrollmentsRef = collection(db, "enrollments");
    const q = query(enrollmentsRef, where("userId", "==", user.uid), where("status", "==", "active"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Tiene curso activo -> Directo al aula virtual
      window.location.href = "mis-cursos.html";
    } else {
      // No tiene cursos pagados -> Mandar a metodología/planes para elegir
      window.location.href = "metodologia.html";
    }
  } catch (error) {
    console.error("Error al verificar accesos:", error);
    window.location.href = "mis-cursos.html";
  }
}

// Función auxiliar para guardar usuario nuevo en Firestore
async function guardarUsuarioEnFirestore(user, nombrePersonalizado = "") {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      name: nombrePersonalizado || user.displayName || "Usuario Pro",
      email: user.email,
      role: "student",
      createdAt: new Date()
    });
  }
}

// Envío del formulario (Correo y Contraseña)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";
  const email = emailInput.value;
  const password = passwordInput.value;
  const name = nameInput.value;

  try {
    if (isRegistering) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await guardarUsuarioEnFirestore(userCredential.user, name);
      await verificarAccesoYRedirigir(userCredential.user);
    } else {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await verificarAccesoYRedirigir(userCredential.user);
    }
  } catch (error) {
    errorMsg.textContent = "Error: " + error.message;
  }
});

// Acceso con Google
googleBtn.addEventListener("click", async () => {
  errorMsg.textContent = "";
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    await guardarUsuarioEnFirestore(result.user);
    await verificarAccesoYRedirigir(result.user);
  } catch (error) {
    errorMsg.textContent = "Error con Google: " + error.message;
  }
});
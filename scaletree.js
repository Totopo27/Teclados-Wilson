/**
 * scaletree.js
 * Módulo independiente para cálculos matemáticos del Scale Tree de Erv Wilson 
 * y generación de Tripletas Diofantinas (Stern-Brocot).
 */

const ScaleTree = {
  // 1. Utilidad GCD (Máximo Común Divisor)
  gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b > 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  },

  // 2. Validación del sistema MOS
  isValidSystem(edo, generator) {
    if (edo <= 0 || generator <= 0) return false;
    // Un sistema genera todos los grados del EDO solo si son coprimos (MCD = 1)
    return this.gcd(edo, generator) === 1;
  },

  // 3. Generación del árbol de Stern-Brocot (Tripletas Diofantinas)
  generateDiophantineTriplets(edo, generator) {
    if (!this.isValidSystem(edo, generator)) {
      console.error(`[ScaleTree] El sistema EDO ${edo} con generador ${generator} no es válido (MCD no es 1).`);
      return [];
    }

    // Asegurarse de usar el complemento grande para que el teclado no quede invertido
    const halfEdo = edo / 2;
    const largeGen = generator < halfEdo ? edo - generator : generator;

    const targetRatio = largeGen / edo;
    const triplets = [];

    // Raíz del árbol de Peirce / Stern-Brocot
    let left = { num: 0, den: 1 };
    let right = { num: 1, den: 0 };
    
    // Mediante inicial (1/1)
    let mediant = { num: left.num + right.num, den: left.den + right.den };

    while (true) {
      // Guardar la tripleta actual en el historial
      triplets.push({
        left: [left.num, left.den],
        right: [right.num, right.den],
        mediant: [mediant.num, mediant.den],
        // El nombre corresponde a la fracción de la mediante (ej. "7/12")
        name: `${mediant.num}/${mediant.den}`
      });

      // Si llegamos al objetivo exacto (Generador / EDO), terminamos la secuencia
      if (mediant.num === largeGen && mediant.den === edo) {
        break;
      }

      // Cortafuegos de seguridad extrema (no debería activarse nunca en un MOS válido)
      if (mediant.den > edo + 1000) {
        console.warn("[ScaleTree] Límite de iteraciones excedido.");
        break;
      }

      const mediantRatio = mediant.num / mediant.den;

      if (targetRatio < mediantRatio) {
        // El objetivo es menor que la mediante, nos movemos a la izquierda en el árbol.
        // La mediante actual se convierte en el nuevo padre derecho.
        right = mediant;
      } else {
        // El objetivo es mayor que la mediante, nos movemos a la derecha en el árbol.
        // La mediante actual se convierte en el nuevo padre izquierdo.
        left = mediant;
      }

      // Calcular nueva mediante sumando numeradores y denominadores (Suma de Principiante)
      mediant = { num: left.num + right.num, den: left.den + right.den };
    }

    return triplets;
  }
};

export default ScaleTree;

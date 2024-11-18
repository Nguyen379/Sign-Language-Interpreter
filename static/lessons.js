const lessons = {
  alphabet: {
    title: "ASL Alphabet",
    description: "Learn to finger spell in American Sign Language",
    levels: [
      {
        id: 1,
        letters: ["A", "B", "C", "D", "E"],
        instructions:
          "Start with these basic letters. Make sure your hand is facing the camera.",
        references: {
          A: "Make a fist with your thumb resting on the side",
          B: "Hold your hand up with your palm facing forward, fingers straight and together, thumb tucked",
          C: "Curve your fingers and thumb to form a 'C' shape",
          D: "Make a 'D' shape with your index finger pointing up and thumb touching your middle finger",
          E: "Curl your fingers into your palm, with thumb resting across them",
        },
      },
      {
        id: 2,
        letters: ["F", "G", "H", "I", "J"],
        instructions:
          "These letters involve more complex hand shapes. Take your time with each one.",
      },
    ],
  },
  numbers: {
    title: "Numbers 1-10",
    description: "Learn basic number signs",
    levels: [
      {
        id: 1,
        numbers: ["1", "2", "3", "4", "5"],
        instructions: "Start with numbers 1-5. Keep your palm facing forward.",
        references: {
          1: "Point index finger up, other fingers closed",
          2: "Index and middle finger extended, other fingers closed",
          3: "Index, middle, and ring fingers extended",
          4: "All fingers extended except thumb",
          5: "All fingers and thumb extended, spread apart",
        },
      },
    ],
  },
};

export default lessons;

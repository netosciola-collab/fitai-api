import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de exercícios...");

  const exercises = [
    // PEITO - 4 exercícios
    {
      name: "Supino Reto com Barra",
      description:
        "Deite no banco, segure a barra na largura dos ombros, desça até o peito e empurre de volta. Mantenha os pés no chão e o core contraído.",
      muscleGroup: "peito",
      equipment: "barra, banco",
    },
    {
      name: "Supino Inclinado com Barra",
      description:
        "Ajuste o banco para 45 graus, segure a barra acima do peito, desça controlado até o peito superior e empurre.",
      muscleGroup: "peito",
      equipment: "barra, banco inclinado",
    },
    {
      name: "Crucifixo com Halteres",
      description:
        "Deite no banco com halteres acima do peito, braços ligeiramente flexionados, abra os braços em arco até sentir alongamento no peito.",
      muscleGroup: "peito",
      equipment: "halteres, banco",
    },
    {
      name: "Crossover na Polia",
      description:
        "Fique em pé entre as polias, pegue os cabos, abra os braços para os lados e puxe os cabos em um movimento de abraço até a linha média do corpo.",
      muscleGroup: "peito",
      equipment: "polia, cabo",
    },

    // COSTAS - 4 exercícios
    {
      name: "Barra Fixa",
      description:
        "Segure a barra com as mãos um pouco mais largas que a largura dos ombros, puxe o corpo para cima até o queixo passar da barra, desça controlado.",
      muscleGroup: "costas",
      equipment: "barra fixa",
    },
    {
      name: "Remada Curvada com Barra",
      description:
        "Incline-se para frente com a barra, mantenha a coluna neutra, puxe a barra até o abdômen, aperte as costas e desça controlado.",
      muscleGroup: "costas",
      equipment: "barra, disco",
    },
    {
      name: "Puxada Frontal na Polia",
      description:
        "Sente na máquina, puxe a barra até o peito, aperte as costas, desça controlado até a posição inicial com os braços estendidos.",
      muscleGroup: "costas",
      equipment: "polia, cabo, barra",
    },
    {
      name: "Remada Unilateral com Haltere",
      description:
        "Coloque um joelho no banco, puxe o haltere até a costela, aperte a costas, desça controlado. Repita do outro lado.",
      muscleGroup: "costas",
      equipment: "haltere, banco",
    },

    // PERNAS - 5 exercícios
    {
      name: "Agachamento Livre",
      description:
        "Coloque a barra nos ombros, desça dobrando os joelhos até 90 graus, mantenha o peito ereto, suba empurrando pelo calcanhar.",
      muscleGroup: "pernas",
      equipment: "barra, rack",
    },
    {
      name: "Leg Press",
      description:
        "Sente na máquina com os pés na plataforma na largura dos ombros, desça dobrando os joelhos, suba empurrando a plataforma.",
      muscleGroup: "pernas",
      equipment: "máquina leg press",
    },
    {
      name: "Cadeira Extensora",
      description:
        "Sente na máquina, estenda as pernas até ficar reta, aperte o quadríceps no topo, desça controlado.",
      muscleGroup: "pernas",
      equipment: "máquina extensora",
    },
    {
      name: "Mesa Flexora",
      description:
        "Deite na máquina, dobre os joelhos puxando o peso até os glúteos, aperte os isquiotibiais, desça controlado.",
      muscleGroup: "pernas",
      equipment: "máquina flexora",
    },
    {
      name: "Stiff (Rosca Seca)",
      description:
        "De pé com a barra, mantenha as pernas retas, incline-se para frente dobrando na cintura até sentir alongamento nos isquiotibiais, volte à posição inicial.",
      muscleGroup: "pernas",
      equipment: "barra, disco",
    },

    // OMBROS - 3 exercícios
    {
      name: "Desenvolvimento com Barra",
      description:
        "Sente ou fique em pé, segure a barra na altura dos ombros, empurre a barra acima da cabeça, desça controlado.",
      muscleGroup: "ombros",
      equipment: "barra, banco",
    },
    {
      name: "Elevação Lateral com Halteres",
      description:
        "De pé com halteres nos lados, levante os braços lateralmente até a altura dos ombros, desça controlado.",
      muscleGroup: "ombros",
      equipment: "halteres",
    },
    {
      name: "Elevação Frontal com Halteres",
      description:
        "De pé com halteres na frente das coxas, levante os braços para frente até a altura dos ombros, desça controlado.",
      muscleGroup: "ombros",
      equipment: "halteres",
    },

    // BÍCEPS - 3 exercícios
    {
      name: "Rosca Direta com Barra",
      description:
        "De pé com a barra, cotovelos ao lado do corpo, flexione os cotovelos levantando a barra até o peito, desça controlado.",
      muscleGroup: "bíceps",
      equipment: "barra",
    },
    {
      name: "Rosca Alternada com Halteres",
      description:
        "De pé com halteres nos lados, flexione um cotovelo levantando o haltere, alterne os braços.",
      muscleGroup: "bíceps",
      equipment: "halteres",
    },
    {
      name: "Rosca Concentrada com Haltere",
      description:
        "Sente no banco, descanse o cotovelo na coxa interna, flexione o cotovelo levantando o haltere, desça controlado.",
      muscleGroup: "bíceps",
      equipment: "haltere, banco",
    },

    // TRÍCEPS - 3 exercícios
    {
      name: "Tríceps Pulley",
      description:
        "De pé na frente da polia, segure a barra, empurre para baixo estendendo os cotovelos, desça controlado.",
      muscleGroup: "tríceps",
      equipment: "polia, barra",
    },
    {
      name: "Tríceps Testa (Rosca Francesa)",
      description:
        "Deite no banco com a barra acima do peito, dobre os cotovelos levando a barra em direção à testa, estenda os cotovelos.",
      muscleGroup: "tríceps",
      equipment: "barra, banco",
    },
    {
      name: "Mergulho",
      description:
        "Segure as barras, levante o corpo, desça dobrando os cotovelos até 90 graus, suba estendendo os cotovelos.",
      muscleGroup: "tríceps",
      equipment: "barras paralelas",
    },

    // CORE - 3 exercícios
    {
      name: "Prancha",
      description:
        "Apoie os antebraços e os dedos dos pés no chão, mantenha o corpo reto, contraia o core e mantenha a posição.",
      muscleGroup: "core",
      equipment: "nenhum",
    },
    {
      name: "Abdominal Crunch",
      description:
        "Deite no banco com os joelhos dobrados, coloque as mãos atrás da cabeça, levante o tronco contraindo o abdômen, desça controlado.",
      muscleGroup: "core",
      equipment: "banco",
    },
    {
      name: "Abdominal Bicicleta",
      description:
        "Deite no chão com as mãos atrás da cabeça, levante o tronco e traga um joelho em direção ao cotovelo oposto, alterne.",
      muscleGroup: "core",
      equipment: "nenhum",
    },

    // CARDIO - 3 exercícios
    {
      name: "Esteira",
      description:
        "Suba na esteira, comece com uma velocidade confortável, mantenha a postura ereta, aumente a velocidade ou inclinação conforme desejado.",
      muscleGroup: "cardio",
      equipment: "esteira",
    },
    {
      name: "Bike Ergométrica",
      description:
        "Suba na bike, ajuste a altura do assento, comece a pedalar em um ritmo confortável, aumente a resistência conforme desejado.",
      muscleGroup: "cardio",
      equipment: "bike",
    },
    {
      name: "Elíptico",
      description:
        "Suba no elíptico, coloque os pés nos pedais, comece a pedalar em um ritmo confortável, aumente a resistência conforme desejado.",
      muscleGroup: "cardio",
      equipment: "elíptico",
    },
  ];

  try {
    const result = await prisma.exercise.createMany({
      data: exercises,
      skipDuplicates: true,
    });

    console.log(`✅ ${result.count} exercícios inseridos com sucesso!`);

    // Verificar total de exercícios no banco
    const totalExercises = await prisma.exercise.count();
    console.log(`📊 Total de exercícios no banco: ${totalExercises}`);

    // Contar por muscleGroup
    const groups = await prisma.exercise.groupBy({
      by: ["muscleGroup"],
      _count: true,
    });

    console.log("\n📈 Exercícios por grupo muscular:");
    groups.forEach((group) => {
      console.log(`  ${group.muscleGroup}: ${group._count} exercícios`);
    });
  } catch (error) {
    console.error("❌ Erro ao inserir exercícios:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

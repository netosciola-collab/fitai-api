import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Tentar inserir um exercício simples para ver qual campo está faltando
    const result = await prisma.exercise.create({
      data: {
        name: "Test Exercise",
        category: "peito",
        equipment: [],
        instructions: "Test instructions",
        musclesPrimary: [],
        musclesSecondary: [],
        alternatives: [],
      },
    });

    console.log("✅ Exercício criado com sucesso!");
    console.log(result);

    // Listar todas as colunas do exercício
    const exercise = await prisma.exercise.findUnique({
      where: { id: result.id },
    });

    console.log("\n📋 Campos do Exercise:");
    console.log(Object.keys(exercise));
  } catch (error: any) {
    console.error("❌ Erro:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

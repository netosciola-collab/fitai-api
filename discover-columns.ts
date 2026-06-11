import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Tentar criar um exercício vazio para ver quais campos são obrigatórios
    const result = await prisma.exercise.create({
      data: {
        name: "Test",
        category: "test",
        difficulty: "beginner",
      },
    });

    console.log("✅ Exercício criado com sucesso!");
    console.log("\n📋 Campos do Exercise:");
    const keys = Object.keys(result);
    keys.forEach((key) => {
      console.log(`  - ${key}: ${typeof result[key as keyof typeof result]}`);
    });

    // Deletar o exercício de teste
    await prisma.exercise.delete({
      where: { id: result.id },
    });
  } catch (error: any) {
    console.error("❌ Erro:", error.message);
    console.log("\n📋 Campos obrigatórios encontrados:");
    if (error.message.includes("Argument")) {
      const matches = error.message.match(/Argument `(\w+)` is missing/g);
      if (matches) {
        matches.forEach((match) => {
          const field = match.replace(/Argument `|` is missing/g, "");
          console.log(`  - ${field} (obrigatório)`);
        });
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();

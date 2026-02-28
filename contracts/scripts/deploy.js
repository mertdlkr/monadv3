const hre = require("hardhat");

async function main() {
    console.log("🦀 NEXUS Kontratları Deploy Ediliyor...\n");
    console.log("Ağ: Monad Testnet");
    console.log("Chain ID: 10143\n");

    // BazaarRegistry deploy
    console.log("1/2 — BazaarRegistry deploy ediliyor...");
    const BazaarRegistry = await hre.ethers.getContractFactory("BazaarRegistry");
    const bazaar = await BazaarRegistry.deploy();
    await bazaar.waitForDeployment();
    const bazaarAddr = await bazaar.getAddress();
    console.log(`✅ BazaarRegistry: ${bazaarAddr}\n`);

    // GuildDAO deploy
    console.log("2/2 — GuildDAO deploy ediliyor...");
    const GuildDAO = await hre.ethers.getContractFactory("GuildDAO");
    const guild = await GuildDAO.deploy();
    await guild.waitForDeployment();
    const guildAddr = await guild.getAddress();
    console.log(`✅ GuildDAO: ${guildAddr}\n`);

    // Birkaç agent register et (demo data)
    console.log("📝 Demo agent'lar kaydediliyor...");

    const demoAgents = [
        ["Mehmet", "merchant", "Halı & Kilim", 1000],
        ["Kemal", "jeweler", "Altın", 1000],
        ["Hasan", "broker", "Komisyoncu", 1000],
        ["Yusuf", "trickster", "Antika (Sahte)", 1000],
        ["Tourist Bob", "tourist", "Gezgin", 1000],
        ["Ayşe", "officer", "Zabıta", 1000],
    ];

    for (const [name, role, shop, wealth] of demoAgents) {
        const tx = await bazaar.registerAgent(name, role, shop, wealth);
        await tx.wait();
        console.log(`  🦀 ${name} (${role}) kayıt edildi`);
    }

    // Birkaç demo trade yap
    console.log("\n💰 Demo trade'ler yapılıyor...");

    await (await bazaar.executeTrade(0, 4, "İpek Halı", 450)).wait();
    console.log("  📦 Mehmet → Tourist Bob: İpek Halı, 450 MON");

    await (await bazaar.executeTrade(1, 4, "Altın Bilezik", 300)).wait();
    console.log("  📦 Kemal → Tourist Bob: Altın Bilezik, 300 MON");

    // Kartel kur
    console.log("\n🤝 Demo kartel oluşturuluyor...");
    await (await bazaar.formCartel([0, 1, 2])).wait();
    console.log("  🤝 Kartel: Mehmet, Kemal, Hasan");

    // Fraud report
    console.log("\n🚨 Dolandırıcılık raporu...");
    await (await bazaar.reportFraud(3, "Sahte Osmanlı antikası satışı")).wait();
    console.log("  🚨 Yusuf: Sahte Osmanlı antikası satışı");

    // Guild proposal
    console.log("\n⚖️ Lonca kararı...");
    await (await guild.propose(
        "Sahte ürün cezası artırılsın",
        "Kalpazan cezaları 3x artırılmalı",
        2, // PUNISHMENT category
        7  // 7 gün oylama
    )).wait();
    console.log("  ⚖️ Teklif: Sahte ürün cezası artırılsın");

    // Guild decree
    await (await guild.issueDecree("Çarşı resmi olarak açılmıştır. Pazarlık başlasın!")).wait();
    console.log("  📜 Ferman: Çarşı açılmıştır!");

    // Özet
    console.log("\n" + "=".repeat(50));
    console.log("🦀 NEXUS — DEPLOY TAMAM!");
    console.log("=".repeat(50));
    console.log(`BazaarRegistry : ${bazaarAddr}`);
    console.log(`GuildDAO       : ${guildAddr}`);
    console.log(`Ağ             : Monad Testnet (10143)`);
    console.log(`Agent Sayısı   : ${demoAgents.length}`);
    console.log(`Trade Sayısı   : 2`);
    console.log(`Kartel Sayısı  : 1`);
    console.log("=".repeat(50));
    console.log("\n🔗 Explorer: https://testnet.monadexplorer.com/address/" + bazaarAddr);
    console.log("🔗 Explorer: https://testnet.monadexplorer.com/address/" + guildAddr);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

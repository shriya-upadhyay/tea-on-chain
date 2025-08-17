// womenFullNames.ts

// funnyUsernames.ts

export const womenFullNames: string[] = [
    "404NotFoundMe",
    "BananaInPajamas",
    "CheeseWizard9000",
    "PickleRickRoll",
    "KeyboardWarrior42",
    "LordOfTheMemes",
    "SofaKingCool",
    "NachoAverageJoe",
    "PotatoOverlord",
    "CaptainObviousLOL",
    "GuacOnTheRock",
    "CtrlAltDelight",
    "UnicornsExist123",
    "DonutDisturb",
    "ChickenNuggetBoss",
    "OopsIDidItAgain",
    "YeetMachine",
    "ShrekOnFleek",
    "CerealKillerxD",
    "BroccoliBandit",
    "PineapplePizzaH8r",
    "QuantumWaffle",
    "MrMeowgi",
    "ChewbaccaSnacc",
    "ObiWanCatnobi",
    "SirLaughALot",
    "ToiletPaperVIP",
    "IceCreamDreamTeam",
    "Fartnado",
    "KetchupQueen",
    "PenguinWaddlePro",
    "EmojiOverlord",
    "HotDogSamurai",
    "SlothSpeedRun",
    "DuckDuckBruh",
    "Baconator69",
    "LlamaDramaMama",
    "SockGremlin",
    "MemeLord420",
    "SpaghettiCode",
    "BoomerZoomer",
    "YodaBest",
    "WiFighter",
    "DonkeyKongVibes",
    "EggcellentAdventurer",
    "CroissantCrusader",
    "TacoCatRacecar",
    "MooLicious",
    "PopcornProphet",
    "JudgeJudyHopps",
    "OopsAllBerries",
    "FluffyDestroyer",
    "ZombieUnicorn",
    "SauceBossSupreme",
    "Broseidon",
    "QuackAttack",
    "CheeseburgerNinja",
    "BananaPhoneRing",
    "AvocadoToastie",
    "MilkshakeMafia",
    "SherlockBones",
    "WaffleStomper",
    "EpicFailWhale",
    "TofuBandito",
    "YeetYeetStreet",
    "TwerkingTurtle",
    "NachoCheesus",
    "GameOfCones",
    "CtrlAltWin",
    "DiscoPotato",
    "CaptainUnderpantsIRL",
    "BubbleWrapAddict",
    "PizzaPapi",
    "TrashPandaKing",
    "OopsOopsGoose",
    "MonkeyBusiness247",
    "GiggleSnort",
    "SushiSlapper",
    "HamSandwich42",
    "ClownFiesta",
    "OopsIDroppedIt",
    "ExtraSaucy",
    "HipHopHippo",
    "BreadPitt",
    "CatastrophicLOL",
    "BeanBurritoBoss",
    "TacoBelle",
    "DumpsterDiverDeluxe",
    "SirSnaccALot",
    "WumboCombo",
    "DonkeyHoté",
    "ChonkyUnicorn",
    "KoolAidCultLeader",
    "MrWorldwideWeb",
    "HolyGuacamole69",
    "BeefSupreme",
    "SassySasquatch",
    "MoistMuffinTop",
    "BroccoliYeehaw"
  ];
  

// Function to get a random woman's name
export const getRandomWomanName = (): string => {
  const randomIndex = Math.floor(Math.random() * womenFullNames.length);
  return womenFullNames[randomIndex];
};

// Function to get a random woman's name by UUID (for consistent mapping)
export const getWomanNameByUUID = (uuid: string): string => {
  // Use the UUID to generate a consistent index
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % womenFullNames.length;
  return womenFullNames[index];
};
  
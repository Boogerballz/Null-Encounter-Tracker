/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

import './App.css';
import encounterData from './pokemon_null.json';

const routes = encounterData.routes;

const SPRITE_GEN5 = 'https://play.pokemonshowdown.com/sprites/gen5/';
const SPRITE_ANI  = 'https://play.pokemonshowdown.com/sprites/ani/';
const TYPE_NULL_SPRITE = 'https://play.pokemonshowdown.com/sprites/gen5/typenull.png';

const NAME_REMAPS = {
  'donzozo': 'dondozo',
  'dudunsprace-three': 'dudunsparce-three',
};

const toShowdownName = (name) => {
  let n = name.toLowerCase().trim();
  n = n.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  n = n.replace(/[éèê]/g, 'e');
  n = n.replace(/['\u2019]/g, '');
  n = n.replace(/♀/g, '-f').replace(/♂/g, '-m');
  n = n.replace(/[:.]/g, '');
  n = n.replace(/\s+/g, '-');
  n = n.replace(/-+/g, '-').replace(/^-|-$/g, '');
  return NAME_REMAPS[n] ?? n;
};

const SPRITE_OVERRIDES = {
  'tauros-paldea-aqua':    'tauros-paldeaaqua',
  'tauros-paldea-blaze':   'tauros-paldeablaze',
  'tauros-paldea':         'tauros-paldeacombat',
  'mr-mime-galar':         'mrmime-galar',
  'jangmo-o':              'jangmoo',
  'hakamo-o':              'hakamoo',
  'dudunsparce-three':     'dudunsparce-threesegment',
  'tapu-fini':             'tapufini',
  'tapu-bulu':             'tapubulu',
  'tapu-koko':             'tapukoko',
  'tapu-lele':             'tapulele',
  'toxtricity-low-key':    'toxtricity-lowkey',
  'flutter-mane':          'fluttermane',
  'great-tusk':            'greattusk',
  'iron-treads':           'irontreads',
  'iron-thorns':           'ironthorns',
  'iron-valiant':          'ironvaliant',
  'scream-tail':           'screamtail',
  'iron-bundle':           'ironbundle',
  'roaring-moon':          'roaringmoon',
  'walking-wake':          'walkingwake',
  'iron-jugulis':          'ironjugulis',
  'nidoran-f':             'nidoranf',
  'nidoran-m':             'nidoranm',
  'flabebe':               'flabebe',
  'mime-jr':               'mimejr',
  'mr-mime':               'mrmime',
  'type-null':             'typenull',
  'brute-bonnet':          'brutebonnet',
  'slither-wing':          'slitherwing',
  'sandy-shocks':          'sandyshocks',
  'gouging-fire':          'gougingfire',
  'raging-bolt':           'ragingbolt',
  'iron-hands':            'ironhands',
  'iron-moth':             'ironmoth',
  'iron-leaves':           'ironleaves',
  'iron-crown':            'ironcrown',
  'iron-boulder':          'ironboulder',
  'zygarde-10':             'zygarde-10',
  'zygarde-10%':            'zygarde-10',
  'chi-yu':                 'chiyu',
  'wo-chien':               'wochien',
  'chien-pao':              'chienpao',
  'ting-lu':                'tinglu',
  'mr-rime':                'mrrime',
  'porygon-z':              'porygonz',
  'kommo-o':                'kommoo',
};

const getGen5Url = (name) => {
  const key = toShowdownName(name);
  return `${SPRITE_GEN5}${SPRITE_OVERRIDES[key] ?? key}.png`;
};
const getAniUrl  = (name) => `${SPRITE_ANI}${toShowdownName(name)}.gif`;
const getNulldexUrl = (name) => `https://nulldex.pokemon0null.workers.dev/pokemon/${encodeURIComponent(toShowdownName(name))}`;

const SmartSprite = memo(function SmartSprite({ name, className, style }) {
  const [stage, setStage] = useState(0); // 0 = gen5, 1 = animated, 2 = failed
  useEffect(() => { setStage(0); }, [name]);
  if (stage > 1) return <div className="sprite-placeholder" style={style}>?</div>;
  const src = stage === 0 ? getGen5Url(name) : getAniUrl(name);
  return <img src={src} alt={name} className={className} style={style}
              loading="lazy" decoding="async"
              onError={() => setStage(s => Math.min(s + 1, 2))} />;
});

const EVO_CHAINS = [
  ["bulbasaur","ivysaur","venusaur"],["charmander","charmeleon","charizard"],
  ["squirtle","wartortle","blastoise"],["caterpie","metapod","butterfree"],
  ["weedle","kakuna","beedrill"],["pidgey","pidgeotto","pidgeot"],
  ["rattata","rattata-alola","raticate","raticate-alola"],["spearow","fearow"],
  ["ekans","arbok"],["pichu","pikachu","raichu","raichu-alola"],
  ["sandshrew","sandshrew-alola","sandslash","sandslash-alola"],
  ["nidoran-f","nidorina","nidoqueen"],["nidoran-m","nidorino","nidoking"],
  ["cleffa","clefairy","clefable"],["vulpix","vulpix-alola","ninetales","ninetales-alola"],
  ["igglybuff","jigglypuff","wigglytuff"],["zubat","golbat","crobat"],
  ["oddish","gloom","vileplume","bellossom"],["paras","parasect"],["venonat","venomoth"],
  ["diglett","diglett-alola","dugtrio","dugtrio-alola"],
  ["meowth","meowth-alola","meowth-galar","persian","persian-alola","perrserker"],
  ["psyduck","golduck"],["mankey","primeape","annihilape"],
  ["growlithe","growlithe-hisui","arcanine","arcanine-hisui"],
  ["poliwag","poliwhirl","poliwrath","politoed"],["abra","kadabra","alakazam"],
  ["machop","machoke","machamp"],["bellsprout","weepinbell","victreebel"],
  ["tentacool","tentacruel"],
  ["geodude","geodude-alola","graveler","graveler-alola","golem","golem-alola"],
  ["ponyta","ponyta-galar","rapidash","rapidash-galar"],
  ["slowpoke","slowbro","slowbro-galar","slowking","slowking-galar"],
  ["magnemite","magneton","magnezone"],
  ["farfetchd","farfetchd-galar","sirfetchd"],
  ["doduo","dodrio"],["seel","dewgong"],
  ["grimer","grimer-alola","muk","muk-alola"],["shellder","cloyster"],
  ["gastly","haunter","gengar"],["onix","steelix"],["drowzee","hypno"],
  ["krabby","kingler"],
  ["voltorb","voltorb-hisui","electrode","electrode-hisui"],
  ["exeggcute","exeggutor","exeggutor-alola"],
  ["cubone","marowak","marowak-alola"],
  ["tyrogue","hitmonlee","hitmonchan","hitmontop"],["lickitung","lickilicky"],
  ["koffing","weezing","weezing-galar"],["rhyhorn","rhydon","rhyperior"],
  ["chansey","blissey"],["tangela","tangrowth"],["horsea","seadra","kingdra"],
  ["goldeen","seaking"],["staryu","starmie"],
  ["mime-jr","mr-mime","mr-mime-galar","mr-rime"],
  ["scyther","scizor","kleavor"],
  ["elekid","electabuzz","electivire"],["magby","magmar","magmortar"],
  ["mantyke","mantine"],["basculin","basculegion","basculegion-f"],
  ["poipole","naganadel"],
  ["pumpkaboo","pumpkaboo-small","pumpkaboo-large","pumpkaboo-super","gourgeist"],
  ["tauros","tauros-paldea","tauros-paldea-blaze","tauros-paldea-aqua"],
  ["magikarp","gyarados"],
  ["eevee","vaporeon","jolteon","flareon","espeon","umbreon","leafeon","glaceon","sylveon"],
  ["porygon","porygon2","porygon-z"],["omanyte","omastar"],["kabuto","kabutops"],
  ["dratini","dragonair","dragonite"],
  ["chikorita","bayleef","meganium"],
  ["cyndaquil","quilava","typhlosion","typhlosion-hisui"],
  ["totodile","croconaw","feraligatr"],["sentret","furret"],["hoothoot","noctowl"],
  ["ledyba","ledian"],["spinarak","ariados"],["chinchou","lanturn"],
  ["togepi","togetic","togekiss"],["natu","xatu"],["mareep","flaaffy","ampharos"],
  ["azurill","marill","azumarill"],["bonsly","sudowoodo"],
  ["hoppip","skiploom","jumpluff"],["aipom","ambipom"],["sunkern","sunflora"],
  ["yanma","yanmega"],["wooper","wooper-paldea","quagsire","clodsire"],
  ["murkrow","honchkrow"],["misdreavus","mismagius"],
  ["girafarig","farigiraf"],["pineco","forretress"],["dunsparce","dudunsparce","dudunsparce-three"],
  ["gligar","gliscor"],["snubbull","granbull"],
  ["qwilfish","qwilfish-hisui","overqwil"],
  ["sneasel","sneasel-hisui","weavile","sneasler"],
  ["teddiursa","ursaring","ursaluna","ursaluna-bloodmoon"],["slugma","magcargo"],
  ["swinub","piloswine","mamoswine"],["corsola","corsola-galar","cursola"],
  ["remoraid","octillery"],["houndour","houndoom"],["phanpy","donphan"],
  ["stantler","wyrdeer"],["larvitar","pupitar","tyranitar"],
  ["treecko","grovyle","sceptile"],["torchic","combusken","blaziken"],
  ["mudkip","marshtomp","swampert"],["poochyena","mightyena"],
  ["zigzagoon","zigzagoon-galar","linoone","linoone-galar","obstagoon"],
  ["wurmple","silcoon","beautifly","cascoon","dustox"],
  ["lotad","lombre","ludicolo"],["seedot","nuzleaf","shiftry"],
  ["taillow","swellow"],["wingull","pelipper"],
  ["ralts","kirlia","gardevoir","gallade"],["surskit","masquerain"],
  ["shroomish","breloom"],["slakoth","vigoroth","slaking"],
  ["nincada","ninjask","shedinja"],["whismur","loudred","exploud"],
  ["makuhita","hariyama"],["nosepass","probopass"],["skitty","delcatty"],
  ["aron","lairon","aggron"],["meditite","medicham"],["electrike","manectric"],
  ["roselia","roserade"],["gulpin","swalot"],["carvanha","sharpedo"],
  ["wailmer","wailord"],["numel","camerupt"],["spoink","grumpig"],
  ["trapinch","vibrava","flygon"],["cacnea","cacturne"],["swablu","altaria"],
  ["barboach","whiscash"],["corphish","crawdaunt"],["baltoy","claydol"],
  ["lileep","cradily"],["anorith","armaldo"],["feebas","milotic"],
  ["shuppet","banette"],["duskull","dusclops","dusknoir"],
  ["snorunt","glalie","froslass"],["spheal","sealeo","walrein"],
  ["clamperl","huntail","gorebyss"],["bagon","shelgon","salamence"],
  ["beldum","metang","metagross"],["bidoof","bibarel"],
  ["starly","staravia","staraptor"],["shinx","luxio","luxray"],
  ["budew","roselia","roserade"],["cranidos","rampardos"],["shieldon","bastiodon"],
  ["combee","vespiquen"],["buizel","floatzel"],["cherubi","cherrim"],
  ["shellos","gastrodon"],["drifloon","drifblim"],["buneary","lopunny"],
  ["glameow","purugly"],["chingling","chimecho"],["stunky","skuntank"],
  ["bronzor","bronzong"],["happiny","chansey","blissey"],
  ["gible","gabite","garchomp"],["munchlax","snorlax"],["riolu","lucario"],
  ["hippopotas","hippowdon"],["skorupi","drapion"],["croagunk","toxicroak"],
  ["finneon","lumineon"],["snover","abomasnow"],
  ["tepig","pignite","emboar"],["snivy","servine","serperior"],
  ["oshawott","dewott","samurott","samurott-hisui"],
  ["patrat","watchog"],["lillipup","herdier","stoutland"],["purrloin","liepard"],
  ["munna","musharna"],["pidove","tranquill","unfezant"],
  ["blitzle","zebstrika"],["roggenrola","boldore","gigalith"],
  ["woobat","swoobat"],["drilbur","excadrill"],
  ["timburr","gurdurr","conkeldurr"],["tympole","palpitoad","seismitoad"],
  ["sewaddle","swadloon","leavanny"],["venipede","whirlipede","scolipede"],
  ["cottonee","whimsicott"],["petilil","lilligant","lilligant-hisui"],
  ["sandile","krokorok","krookodile"],
  ["darumaka","darumaka-galar","darmanitan","darmanitan-galar"],
  ["dwebble","crustle"],["scraggy","scrafty"],
  ["yamask","yamask-galar","cofagrigus","runerigus"],
  ["tirtouga","carracosta"],["archen","archeops"],["trubbish","garbodor"],
  ["zorua","zorua-hisui","zoroark","zoroark-hisui"],["minccino","cinccino"],
  ["gothita","gothorita","gothitelle"],["solosis","duosion","reuniclus"],
  ["ducklett","swanna"],["vanillite","vanillish","vanilluxe"],
  ["deerling","sawsbuck"],["karrablast","escavalier"],["foongus","amoonguss"],
  ["frillish","jellicent"],["joltik","galvantula"],["ferroseed","ferrothorn"],
  ["klink","klang","klinklang"],["tynamo","eelektrik","eelektross"],
  ["elgyem","beheeyem"],["litwick","lampent","chandelure"],
  ["axew","fraxure","haxorus"],["cubchoo","beartic"],
  ["shelmet","accelgor"],["stunfisk","stunfisk-galar"],["mienfoo","mienshao"],
  ["golett","golurk"],["pawniard","bisharp","kingambit"],
  ["rufflet","braviary","braviary-hisui"],["vullaby","mandibuzz"],
  ["deino","zweilous","hydreigon"],["larvesta","volcarona"],
  ["chespin","quilladin","chesnaught"],["fennekin","braixen","delphox"],
  ["froakie","frogadier","greninja"],["bunnelby","diggersby"],
  ["fletchling","fletchinder","talonflame"],["litleo","pyroar"],
  ["flabebe","floette","florges"],["skiddo","gogoat"],["pancham","pangoro"],
  ["espurr","meowstic","meowstic-f"],["honedge","doublade","aegislash"],
  ["spritzee","aromatisse"],["swirlix","slurpuff"],["inkay","malamar"],
  ["binacle","barbaracle"],["skrelp","dragalge"],["clauncher","clawitzer"],
  ["helioptile","heliolisk"],["tyrunt","tyrantrum"],["amaura","aurorus"],
  ["goomy","sliggoo","sliggoo-hisui","goodra","goodra-hisui"],
  ["phantump","trevenant"],
  ["bergmite","avalugg","avalugg-hisui"],["noibat","noivern"],
  ["rowlet","dartrix","decidueye","decidueye-hisui"],
  ["litten","torracat","incineroar"],["popplio","brionne","primarina"],
  ["pikipek","trumbeak","toucannon"],["yungoos","gumshoos"],
  ["grubbin","charjabug","vikavolt"],["crabrawler","crabominable"],
  ["cutiefly","ribombee"],["rockruff","lycanroc", "lycanroc-dusk", "lycanroc-midnight"],["mareanie","toxapex"],
  ["mudbray","mudsdale"],["dewpider","araquanid"],["fomantis","lurantis"],
  ["morelull","shiinotic"],["salandit","salazzle"],["stufful","bewear"],
  ["bounsweet","steenee","tsareena"],["wimpod","golisopod"],
  ["sandygast","palossand"],["type-null","silvally"],
  ["jangmo-o","hakamo-o","kommo-o"],
  ["grookey","thwackey","rillaboom"],["scorbunny","raboot","cinderace"],
  ["sobble","drizzile","inteleon"],["skwovet","greedent"],
  ["rookidee","corvisquire","corviknight"],["blipbug","dottler","orbeetle"],
  ["nickit","thievul"],["gossifleur","eldegoss"],["wooloo","dubwool"],
  ["chewtle","drednaw"],["yamper","boltund"],["rolycoly","carkol","coalossal"],
  ["applin","flapple","appletun","dipplin","hydrapple"],
  ["silicobra","sandaconda"],["arrokuda","barraskewda"],
  ["toxel","toxtricity","toxtricity-low-key"],["sizzlipede","centiskorch"],
  ["clobbopus","grapploct"],["sinistea","polteageist"],
  ["hatenna","hattrem","hatterene"],["impidimp","morgrem","grimmsnarl"],
  ["milcery","alcremie"],["snom","frosmoth"],["cufant","copperajah"],
  ["dreepy","drakloak","dragapult"],
  ["sprigatito","floragato","meowscarada"],["fuecoco","crocalor","skeledirge"],
  ["quaxly","quaxwell","quaquaval"],["lechonk","oinkologne"],
  ["tarountula","spidops"],["nymble","lokix"],["pawmi","pawmo","pawmot"],
  ["tandemaus","maushold"],["fidough","dachsbun"],["smoliv","dolliv","arboliva"],
  ["nacli","naclstack","garganacl"],["charcadet","armarouge","ceruledge"],
  ["tadbulb","bellibolt"],["wattrel","kilowattrel"],["maschiff","mabosstiff"],
  ["shroodle","grafaiai"],["bramblin","brambleghast"],
  ["toedscool","toedscruel"],["capsakid","scovillain"],
  ["rellor","rabsca"],["flittle","espathra"],
  ["tinkatink","tinkatuff","tinkaton"],["wiglett","wugtrio"],
  ["finizen","palafin"],["varoom","revavroom"],["glimmet","glimmora"],
  ["greavard","houndstone"],["cetoddle","cetitan"],
  ["gimmighoul","gholdengo"],["frigibax","arctibax","baxcalibur"],
  ["falinks"],["morpeko"],["klawf"],["tatsugiri"],["wo-chien"],
  ["chi-yu"],["ting-lu"],["chien-pao"],
];

const FAMILY_MAP = {};
for (const chain of EVO_CHAINS) {
  for (const mon of chain) { FAMILY_MAP[mon] = new Set(chain); }
}

// Cache name normalization (it's regex-heavy and was being redone thousands of times per click)
const normCache = new Map();
const normName = (name) => {
  let v = normCache.get(name);
  if (v === undefined) { v = toShowdownName(name); normCache.set(name, v); }
  return v;
};

// Index the box once per change instead of scanning it for every encounter on the page
const boxIndexCache = new WeakMap();
const indexBox = (box) => {
  let idx = boxIndexCache.get(box);
  if (!idx) {
    const alive = new Set(), blocked = new Set();
    for (const p of box) {
      if (p.status === 'dead') continue;
      const n = normName(p.species);
      alive.add(n); blocked.add(n);
      const f = FAMILY_MAP[n];
      if (f) for (const m of f) blocked.add(m);
    }
    idx = { alive, blocked };
    boxIndexCache.set(box, idx);
  }
  return idx;
};

const isDupedOut = (encPokemon, boxPokemon) => {
  const { alive, blocked } = indexBox(boxPokemon);
  const encN = normName(encPokemon);
  if (blocked.has(encN)) return true;
  const ef = FAMILY_MAP[encN];
  if (ef) for (const m of ef) if (alive.has(m)) return true;
  return false;
};

const getAdjustedEncounters = (encounters, box) => {
  const dupedRate = encounters
    .filter(e => isDupedOut(e.pokemon, box))
    .reduce((s, e) => s + (Number(e.rate) || 0), 0);
  if (dupedRate === 0 || box.length === 0) return encounters.map(e => ({ ...e, adjRate: e.rate }));
  const remaining = 100 - dupedRate;
  return encounters.map(e => {
    if (isDupedOut(e.pokemon, box)) return { ...e, adjRate: 0 };
    const adj = remaining > 0 ? ((Number(e.rate) / remaining) * 100) : 0;
    return { ...e, adjRate: Math.round(adj * 10) / 10 };
  });
};

const EXTRA_ENCOUNTERS = {
  "Mauville City": {
  gift: [
    { group:"Game Corner · Pool 1 (after New Mauville quest)", pokemon:[
      {pokemon:"Minior",level:34,rate:25},{pokemon:"Pumpkaboo",level:34,rate:25},
      {pokemon:"Flabébé",level:34,rate:25},{pokemon:"Shellos",level:34,rate:25},
    ]},
    { group:"Game Corner · Pool 2 (after Feather Badge)", pokemon:[
      {pokemon:"Togedemaru",level:34,rate:25},{pokemon:"Morpeko",level:34,rate:25},
      {pokemon:"Toxel",level:34,rate:25},{pokemon:"Rotom",level:34,rate:25},
    ]},
    { group:"Game Corner · Pool 3 (after Mind Badge)", pokemon:[
      {pokemon:"Honedge",level:34,rate:20},{pokemon:"Mimikyu",level:34,rate:20},
      {pokemon:"Finizen",level:34,rate:20},{pokemon:"Darumaka",level:34,rate:20},
      {pokemon:"Darumaka-Galar",level:34,rate:20},
    ]},
  ],
},


  "Trainer Hill": {
  gift: [
    {pokemon:"Vaporeon",level:35,rate:12.5},
    {pokemon:"Jolteon", level:35,rate:12.5},
    {pokemon:"Flareon", level:35,rate:12.5},
    {pokemon:"Espeon",  level:35,rate:12.5},
    {pokemon:"Umbreon", level:35,rate:12.5},
    {pokemon:"Leafeon", level:35,rate:12.5},
    {pokemon:"Glaceon", level:35,rate:12.5},
    {pokemon:"Sylveon", level:35,rate:12.5},
  ],
},
  "Battle Frontier": {
    gift: [{pokemon:"Type: Null",level:40,rate:100}],
  },
  "Mossdeep City": {
    gift: [
      { group:"Past Paradox", pokemon:[
        {pokemon:"Great Tusk",level:60,rate:10},{pokemon:"Scream Tail",level:60,rate:10},
        {pokemon:"Brute Bonnet",level:60,rate:10},{pokemon:"Flutter Mane",level:60,rate:10},
        {pokemon:"Slither Wing",level:60,rate:10},{pokemon:"Sandy Shocks",level:60,rate:10},
        {pokemon:"Roaring Moon",level:60,rate:10},{pokemon:"Walking Wake",level:60,rate:10},
        {pokemon:"Gouging Fire",level:60,rate:10},{pokemon:"Raging Bolt",level:60,rate:10},
      ]},
      { group:"Future Paradox", pokemon:[
        {pokemon:"Iron Treads",level:60,rate:10},{pokemon:"Iron Bundle",level:60,rate:10},
        {pokemon:"Iron Hands",level:60,rate:10},{pokemon:"Iron Jugulis",level:60,rate:10},
        {pokemon:"Iron Moth",level:60,rate:10},{pokemon:"Iron Thorns",level:60,rate:10},
        {pokemon:"Iron Valiant",level:60,rate:10},{pokemon:"Iron Leaves",level:60,rate:10},
        {pokemon:"Iron Boulder",level:60,rate:10},{pokemon:"Iron Crown",level:60,rate:10},
      ]},
      { group:"Ultra Beast", pokemon:[
        {pokemon:"Nihilego",level:60,rate:10},{pokemon:"Buzzwole",level:60,rate:10},
        {pokemon:"Pheromosa",level:60,rate:10},{pokemon:"Xurkitree",level:60,rate:10},
        {pokemon:"Celesteela",level:60,rate:10},{pokemon:"Kartana",level:60,rate:10},
        {pokemon:"Guzzlord",level:60,rate:10},{pokemon:"Poipole",level:60,rate:10},
        {pokemon:"Stakataka",level:60,rate:10},{pokemon:"Blacephalon",level:60,rate:10},
      ]},
    ],
  },
  "Route 111": {
    static: [
      {pokemon:"Golett",level:25,rate:25},{pokemon:"Sandygast",level:25,rate:25},
      {pokemon:"Sandshrew",level:25,rate:25},{pokemon:"Phanpy",level:25,rate:25},
    ],
  },
  "New Mauville (Inside)": {
    static: [
      {pokemon:"Voltorb",level:20,rate:20},{pokemon:"Voltorb-Hisui",level:20,rate:20},
      {pokemon:"Foongus",level:20,rate:20},{pokemon:"Ditto",level:20,rate:20},
      {pokemon:"Stunfisk-Galar",level:20,rate:20},
    ],
  },
  "Aqua Hideout": {
    static: [
      {pokemon:"Gimmighoul",level:35,rate:20},{pokemon:"Electrode-Hisui",level:35,rate:20},
      {pokemon:"Amoonguss",level:35,rate:20},{pokemon:"Ditto",level:35,rate:20},
      {pokemon:"Stunfisk-Galar",level:35,rate:20},
    ],
  },
};

const GYM_SECTIONS = [
  { gym:"Roxanne", badge:"Stone Badge", emoji:"🪨", routes:["Littleroot Town","Littleroot Grove","Route 101","Oldale Town","Oldale Grove","Route 103","Verdanturf Tunnel","Verdanturf Tunnel B1F","Route 102","Route 102 Grove","Petalburg City","Petalburg Grove","Route 104","Petalburg Woods","Rustboro City","Rustboro Grove","Route 115"] },
  { gym:"Brawly", badge:"Knuckle Badge", emoji:"🥊", routes:["Route 116","Rusturf Tunnel","Dewford Town","Route 107","Route 106","Granite Cave 1F","Granite Cave B1F","Granite Cave B2F","Granite Cave Steven's Room"] },
  { gym:"Wattson", badge:"Dynamo Badge", emoji:"⚡", routes:["Route 109","Slateport City","Route 110","Icicle Cave","Verdanturf Town","Route 117","Mauville City","Route 118","Route 111"] },
  { gym:"Norman", badge:"Balance Badge", emoji:"⚖️", routes:["Trainer Hill","Land Cave Entrance","Land Cave End","Altering Cave","Altering Grove","Verdanturf Grotto"] },
  { gym:"Flannery", badge:"Heat Badge", emoji:"🔥", routes:["Mirage Tower 1F","Mirage Tower 2F","Mirage Tower 3F","Mirage Tower 4F","Route 113","Fallarbor Town","Route 114","Route 114 Underpass","Meteor Falls","Meteor Falls Room 2","Meteor Falls B1F Room 1","Meteor Falls B1F Room 2","Route 112","Fiery Path","Mt. Chimney","Jagged Pass"] },
  { gym:"Winona", badge:"Feather Badge", emoji:"🪶", routes:["Route 134","New Mauville (Outside)","New Mauville (Inside)","Route 105","Route 108","Abandoned Ship B1F Rooms","Abandoned Ship Dive Room","Route 119","Fortree City","Route 120"] },
  { gym:"Tate & Liza", badge:"Mind Badge", emoji:"🔮", routes:["Route 121","Lilycove City","Aqua Hideout","Battle Frontier","Artisan Cave B1F","Artisan Cave 1F","Southern Island Exterior","Southern Island Interior","Route 122","Route 123","Mt. Pyre 1F","Mt. Pyre 2F","Mt. Pyre 3F","Mt. Pyre 4F","Mt. Pyre 5F","Mt. Pyre 6F","Mt. Pyre Exterior","Mt. Pyre Summit","Magma Hideout Floor 1","Magma Hideout Floor 2","Magma Hideout Floor 3","Magma Hideout Floor 4","Mossdeep City","Route 125","Shoal Cave (Entrance Room)","Shoal Cave (Inner Room)","Shoal Cave (Stairs Room)","Shoal Cave (Lower Room)","Shoal Cave (Ice Room)"] },
  { gym:"Steven", badge:"Adamantine Badge", emoji:"⚙️", routes:["Route 127","Route 126","Route 126 Underwater","Sootopolis City","Route 128","Seafloor Cavern (No Water)","Seafloor Cavern (Water)","Cave Of Origin Entrance","Cave Of Origin 1F","Route 131","Pacifidlog Town","Sky Pillar 1F","Sky Pillar 2F","Sky Pillar 3F","Sky Pillar 4F","Sky Pillar 5F"] },
  { gym:"E4", badge:"Elite Four", emoji:"👑", routes:["Ever Grande City","Victory Road 1F","Victory Road B1F","Victory Road Final Room"] },
];

const METHOD_COLORS = { grass:'#2d6a30', fishing:'#1a5276', surfing:'#117a8b', rock_smash:'#7d6608', gift:'#6a0d83', static:'#0d5c7a' };

const LAND_ROUTES = new Set([
  "Verdanturf Tunnel","Verdanturf Tunnel B1F","Rusturf Tunnel",
  "Granite Cave 1F","Granite Cave B1F","Granite Cave B2F","Granite Cave Steven's Room",
  "Icicle Cave","Land Cave Entrance","Land Cave End","Altering Cave","Verdanturf Grotto",
  "Route 111", "Mirage Tower 1F","Mirage Tower 2F","Mirage Tower 3F","Mirage Tower 4F",
  "Route 114 Underpass","Meteor Falls","Meteor Falls Room 2",
  "Meteor Falls B1F Room 1","Meteor Falls B1F Room 2",
  "Fiery Path","New Mauville (Outside)","New Mauville (Inside)",
  "Artisan Cave B1F","Artisan Cave 1F","Mt. Pyre 1F","Mt. Pyre 2F","Mt. Pyre 3F","Mt. Pyre 4F","Mt. Pyre 5F","Mt. Pyre 6F",
  "Magma Hideout Floor 1","Magma Hideout Floor 2","Magma Hideout Floor 3","Magma Hideout Floor 4",
  "Shoal Cave (Entrance Room)","Shoal Cave (Inner Room)","Shoal Cave (Stairs Room)","Shoal Cave (Lower Room)","Shoal Cave (Ice Room)",
  "Seafloor Cavern (No Water)","Seafloor Cavern (Water)","Cave Of Origin Entrance","Cave Of Origin 1F","Sky Pillar 1F","Sky Pillar 2F","Sky Pillar 3F","Sky Pillar 4F","Sky Pillar 5F",
  "Victory Road 1F","Victory Road B1F","Victory Road Final Room","Navel Rock Entrance",
  "Navel Rock B1F","Navel Rock Fork","Navel Rock Up 1","Navel Rock Up 2","Navel Rock Up 3","Navel Rock Up 4",
  "Navel Rock Down 1","Navel Rock Down 2","Navel Rock Down 3","Navel Rock Down 4","Navel Rock Down 5",
  "Navel Rock Entrance","Navel Rock B1F","Navel Rock Fork","Navel Rock Up 1","Navel Rock Up 2","Navel Rock Up 3","Navel Rock Up 4","Navel Rock Down 1","Navel Rock Down 2","Navel Rock Down 3","Navel Rock Down 4","Navel Rock Down 5",
]);

const GrassIcon = ({ size = 16 }) => (
  <img
    src={`${process.env.PUBLIC_URL}/icons/grass.png`}
    alt=""
    width={size}
    height={size}
    style={{ imageRendering: 'pixelated', verticalAlign: 'middle' }}
  />
);

const BallIcon = ({ size = 20 }) => (
  <img
    src={`${process.env.PUBLIC_URL}/icons/safari_ball.png`}
    alt=""
    width={size}
    height={size}
    style={{ imageRendering: 'pixelated', verticalAlign: 'middle' }}
  />
);

const LandIcon = ({ size = 18 }) => (
  <img
    src={`${process.env.PUBLIC_URL}/icons/land.png`}
    alt=""
    width={size}
    height={size}
    style={{ imageRendering: 'pixelated', verticalAlign: 'middle' }}
  />
);

const FishingIcon = ({ size = 20 }) => (
  <img
    src={`${process.env.PUBLIC_URL}/icons/fishing.png`}
    alt=""
    width={size}
    height={size}
    style={{ imageRendering: 'pixelated', verticalAlign: 'middle' }}
  />
);
const SurfIcon = ({ size = 18 }) => (
  <img
    src={`${process.env.PUBLIC_URL}/icons/surfing.png`}
    alt=""
    width={size}
    height={size}
    style={{ imageRendering: 'pixelated', verticalAlign: 'middle' }}
  />
);

const RockIcon = ({ size = 20 }) => (
  <img
    src={`${process.env.PUBLIC_URL}/icons/rock_smash.png`}
    alt=""
    width={size}
    height={size}
    style={{ imageRendering: 'pixelated', verticalAlign: 'middle' }}
  />
);

const StaticIcon = ({ size = 22 }) => (
  <img
    src={`${process.env.PUBLIC_URL}/icons/static.png`}
    alt=""
    style={{ height: size, width: 'auto', imageRendering: 'pixelated', verticalAlign: 'middle' }}
  />
);

const GiftIcon = ({ size = 16 }) => (
  <img
    src={`${process.env.PUBLIC_URL}/icons/gift.png`}
    alt=""
    width={size}
    height={size}
    style={{ imageRendering: 'pixelated', verticalAlign: 'middle', objectFit: 'contain' }}
  />
);

const getMethodDisplay = (method, routeName) => {
  if (method === 'grass' && LAND_ROUTES.has(routeName)) {
    return { color: '#8b7d5a', icon: <LandIcon />, label: 'LAND' };
  }
  const icons = {
    grass: <GrassIcon />,
    fishing: <FishingIcon />,
    surfing: <SurfIcon />,
    rock_smash: <RockIcon />,
    gift: <GiftIcon />,
    static: <StaticIcon />,
  };
  const labels = { grass:'GRASS', fishing:'FISHING', surfing:'SURFING', rock_smash:'ROCK SMASH', gift:'GIFT', static:'STATIC' };
  return {
    color: METHOD_COLORS[method] || '#444',
    icon: icons[method] || '•',
    label: labels[method] || method.replace('_',' ').toUpperCase(),
  };
};

function MethodIcon({ method, small, routeName }) {
  const sz = small ? '0.9rem' : '1rem';
  if (method === 'grass' && routeName && LAND_ROUTES.has(routeName)) return <LandIcon size={small ? 14 : 18} />;
  if (method === 'fishing')    return <FishingIcon size={small ? 16 : 20} />;
  if (method === 'rock_smash') return <RockIcon size={small ? 16 : 20} />;
  if (method === 'grass')      return <GrassIcon size={small ? 14 : 16} />;
  if (method === 'surfing')    return <SurfIcon size={small ? 14 : 18} />;
  if (method === 'gift')       return <GiftIcon size={small ? 14 : 16} />;
  if (method === 'static')     return <StaticIcon size={small ? 18 : 22} />;
  return <span>•</span>;
}

function parseShowdown(text) {
  return text.trim().split(/\n\s*\n/).filter(b=>b.trim()).map(block=>{
    const lines = block.trim().split('\n');
    const head = lines[0].split('@')[0].trim().replace(/\s*\((M|F)\)\s*$/, '');
    const m = head.match(/^(.*?)\s*\((.+)\)$/);
    let nickname = '', species = '';
    if (m) { nickname = m[1]; species = m[2]; } else { species = head; }
    let level=1;
    for (const line of lines.slice(1)) {
      if (line.startsWith('Level:')) level=parseInt(line.split(':')[1])||level;
    }
    return {species,nickname,level,status:'alive',id:Date.now()+Math.random()};
  }).filter(p=>p.species);
}

function SpritePopup({ enc, adjRate, onCatch, onClose }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={e=>e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>✕</button>
        <SmartSprite name={enc.pokemon} className="popup-sprite" />
        <div className="popup-name">{enc.pokemon}</div>
        <div className="popup-meta">
          {enc.level != null && (
  <div className="popup-meta">
    Lv. {enc.level} · Base: {enc.rate}%
    {adjRate !== undefined && adjRate !== enc.rate &&
      <span className="popup-adj"> → Adj: {adjRate}%</span>}
  </div>
)}
        </div>
        <div className="popup-actions">
          <button className="popup-btn catch-btn" onClick={()=>{onCatch(enc.pokemon);onClose();}}>
            Catch & Add to Box
          </button>
          <a className="popup-btn dex-btn" href={getNulldexUrl(enc.pokemon)} target="_blank" rel="noreferrer">
            View in Nulldex
          </a>
        </div>
      </div>
    </div>
  );
}

const SpriteCard = memo(function SpriteCard({ enc, adjRate, duped, onCatch }) {
  const [popup, setPopup] = useState(false);
  return (
    <>
      <div
  className={`sprite-card ${duped?'duped':''}`}
  onClick={()=>setPopup(true)}
  onContextMenu={(e)=>{
    e.preventDefault();                    // stops the browser's right-click menu
    if (!duped) onCatch(enc.pokemon);      // add to box unless it's already duped out
  }}
  title={duped ? undefined : 'Right-click to add to box'}
>
        <SmartSprite name={enc.pokemon} className="sprite-img" />
        {duped && <div className="duped-badge">DUPED</div>}
        <div className="sprite-name">{enc.pokemon}</div>
        <div className="sprite-meta">
          Lv.{enc.level}
          {duped
            ? <span className="sprite-rate rate-duped"> ✕</span>
            : <span className="sprite-rate"> {adjRate !== undefined ? adjRate : enc.rate}%</span>
          }
        </div>
      </div>
      {popup && <SpritePopup enc={enc} adjRate={adjRate} onCatch={onCatch} onClose={()=>setPopup(false)}/>}
    </>
  );
}, (a, b) =>
  a.enc.pokemon === b.enc.pokemon && a.enc.level === b.enc.level && a.enc.rate === b.enc.rate &&
  a.adjRate === b.adjRate && a.duped === b.duped && a.onCatch === b.onCatch
);

const RouteCard = memo(function RouteCard({ route, box, onCatch }) {
  const [expanded, setExpanded] = useState(false);

  const extra = EXTRA_ENCOUNTERS[route.name] || {};
  const backendMethods = Object.entries(route.encounters || {});
  const extraMethods = Object.entries(extra);
  const backendKeys = new Set(backendMethods.map(([m]) => m));
  const allMethods = [
    ...backendMethods,
    ...extraMethods.filter(([m]) => !backendKeys.has(m)),
  ];
  const mergedMethods = allMethods.map(([m, encs]) => {
    if (backendKeys.has(m) && extra[m]) {
      return [m, [...encs, ...extra[m]]];
    }
    return [m, encs];
  });

  const isSpecial = (m) => m === 'gift' || m === 'static';
  const visible = expanded ? mergedMethods : mergedMethods.slice(0,1);

  return (
    <div className="route-card" id={`route-${route.name.replace(/\s+/g,'-')}`}>
      <div className="route-card-header" onClick={()=>setExpanded(!expanded)}>
        <h3>{route.name}</h3>
        <div className="route-header-right">
          {mergedMethods.length>1 && !expanded && (
            <span className="method-pills">
              {mergedMethods.slice(1).map(([m])=>(
                <span key={m} className="pill"><MethodIcon method={m} small routeName={route.name}/></span>
              ))}
            </span>
          )}
          <span className="expand-icon">{expanded?'▲':'▼'}</span>
        </div>
      </div>

      {visible.map(([method,encounters])=>{
        if (isSpecial(method)) {
          const hasGroups = encounters.length > 0 && encounters[0].group;
          const adjustGroup = (pokemons) => {
            const dupedRate = pokemons.filter(e => isDupedOut(e.pokemon, box)).reduce((s,e) => s + (Number(e.rate)||0), 0);
            const remaining = 100 - dupedRate;
            return pokemons.map(e => {
              if (isDupedOut(e.pokemon, box)) return {...e, adjRate: 0};
              const adj = (dupedRate === 0 || box.length === 0) ? e.rate : (remaining > 0 ? Math.round((Number(e.rate)/remaining)*1000)/10 : 0);
              return {...e, adjRate: adj};
            });
          };
          return (
            <div key={method} className="encounter-method">
              <div className="method-header-row">
                <div className="method-header" style={{background:METHOD_COLORS[method]||'#444'}}>
                  <MethodIcon method={method}/> <span>{method.toUpperCase()}</span>
                </div>
              </div>
              {hasGroups ? encounters.map((grp,gi)=>{
                const adjusted = adjustGroup(grp.pokemon);
                return (
                  <div key={gi}>
                    <div style={{fontSize:'0.7rem',fontWeight:700,color:'var(--text2)',letterSpacing:'0.5px',padding:'8px 0 6px 2px',textTransform:'uppercase'}}>{grp.group}</div>
                    <div className="sprite-grid">
                      {adjusted.map((enc,i)=>(
                        <SpriteCard key={i} enc={enc} adjRate={enc.adjRate} duped={isDupedOut(enc.pokemon,box)} onCatch={onCatch}/>
                      ))}
                    </div>
                  </div>
                );
              }) : (
                <div className="sprite-grid">
                  {getAdjustedEncounters(encounters, box).map((enc,i)=>(
                    <SpriteCard key={i} enc={enc} adjRate={enc.adjRate} duped={isDupedOut(enc.pokemon,box)} onCatch={onCatch}/>
                  ))}
                </div>
              )}
            </div>
          );
        }
        const adjusted = getAdjustedEncounters(encounters, box);
        const { color: mColor, icon: mIcon, label: mLabel } = getMethodDisplay(method, route.name);
        return (
          <div key={method} className="encounter-method">
            <div className="method-header-row">
              <div className="method-header" style={{background:mColor}}>
                <span>{mIcon}</span> <span>{mLabel}</span>
              </div>
              {NOTE_LABELS[route.name]?.[method] && (
                <div className="note-chip" style={{background:'rgba(233,69,96,0.15)',border:'1px solid var(--red)',borderRadius:4,padding:'3px 10px',fontSize:'0.7rem',fontWeight:700,color:'var(--red)'}}>
                  {NOTE_LABELS[route.name][method]}
                </div>
              )}
            </div>
            <div className="sprite-grid">
              {adjusted.map((enc,i)=>(
                <SpriteCard key={i} enc={enc} adjRate={enc.adjRate} duped={isDupedOut(enc.pokemon,box)} onCatch={onCatch}/>
              ))}
            </div>
          </div>
        );
      })}

      {mergedMethods.length>1 && (
        <button className="view-more-btn" onClick={()=>setExpanded(!expanded)}>
          <strong>{expanded?'▲ Show Less':`▼ View All Methods (${mergedMethods.length})`}</strong>
        </button>
      )}
    </div>
  );
});

function TrackerEntry({ p, onToggle, onRemove }) {
  const isDead = p.status==='dead';
  return (
    <div className={`tracker-entry ${isDead?'dead':''}`}>
      <div className="tracker-sprite">
        <SmartSprite name={p.species} className="tracker-sprite-img"/>
      </div>
      <div className="tracker-info">
        <div className="tracker-species">{p.species}</div>
        {p.level>1 && <div className="tracker-level">Lv. {p.level}</div>}
      </div>
      <div className="tracker-actions">
        <button className={`status-btn ${isDead?'revive-btn':'kill-btn'}`} onClick={()=>onToggle(p.id)}>
          {isDead?'♻️':' '}
        </button>
        <button className="remove-btn" onClick={()=>onRemove(p.id)}>✕</button>
      </div>
    </div>
  );
}

function NuzlockeTracker({ box, setBox }) {
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [newName, setNewName] = useState('');
  const fileRef = useRef();

  const save = useCallback((updated) => { localStorage.setItem('nuzlocke_box',JSON.stringify(updated)); return updated; }, []);
  const addPokemon = useCallback((name) => {
    const n=(name||newName).trim(); if(!n) return;
    setBox(prev=>save([...prev,{species:n,status:'alive',id:Date.now()+Math.random()}]));
    if(!name) setNewName('');
  }, [newName, save, setBox]);
  const toggleStatus = useCallback((id) => setBox(prev=>save(prev.map(p=>p.id===id?{...p,status:p.status==='alive'?'dead':'alive'}:p))), [save, setBox]);
  const removePokemon = useCallback((id) => setBox(prev=>save(prev.filter(p=>p.id!==id))), [save, setBox]);
  const clearBox = useCallback(() => { setBox([]); localStorage.removeItem('nuzlocke_box'); }, [setBox]);
  const handleImport = useCallback(() => { setBox(prev=>save([...prev,...parseShowdown(importText)])); setImportText(''); setShowImport(false); }, [importText, save, setBox]);
  const handleFile = useCallback((e) => {
    const file=e.target.files[0]; if(!file) return;
    const r=new FileReader();
    r.onload=(ev)=>setBox(prev=>save([...prev,...parseShowdown(ev.target.result)]));
    r.readAsText(file); e.target.value='';
  }, [save, setBox]);

  const alive=box.filter(p=>p.status==='alive');
  const dead=box.filter(p=>p.status==='dead');

  return (
    <div className="tracker">
      <div className="tracker-header"><h2>Nuzlocke Box</h2></div>
      <div className="tracker-add">
        <input className="tracker-input" placeholder="Pokémon name..." value={newName}
          onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPokemon()}/>
        <button className="tracker-btn add-btn" onClick={()=>addPokemon()}>+ Add</button>
      </div>
      <div className="import-row">
        <button className="tracker-btn import-btn" onClick={()=>setShowImport(!showImport)}>Paste</button>
        <button className="tracker-btn import-btn" onClick={()=>fileRef.current.click()}>File</button>
        <input ref={fileRef} type="file" accept=".txt" style={{display:'none'}} onChange={handleFile}/>
        {box.length>0 && <button className="tracker-btn clear-btn" onClick={clearBox}>🚛 Clear</button>}
      </div>
      {showImport && (
        <div className="import-box">
          <textarea className="import-textarea" placeholder="Paste your Lua/Showdown export here..."
            value={importText} onChange={e=>setImportText(e.target.value)} rows={8}/>
          <button className="tracker-btn add-btn" onClick={handleImport}>Import</button>
        </div>
      )}
      {alive.length>0 && (
        <div className="tracker-section">
          <div className="tracker-section-label">ACTIVE ({alive.length})</div>
          {alive.map(p=><TrackerEntry key={p.id} p={p} onToggle={toggleStatus} onRemove={removePokemon}/>)}
        </div>
      )}
      {dead.length>0 && (
        <div className="tracker-section">
          <div className="tracker-section-label dead-label">FALLEN ({dead.length})</div>
          {dead.map(p=><TrackerEntry key={p.id} p={p} onToggle={toggleStatus} onRemove={removePokemon}/>)}
        </div>
      )}
      {box.length===0 && (
        <div className="tracker-empty">Add Pokémon or import your save.<br/><br/>Dupes clause active — owned species & evolutions are greyed out on encounter tables.</div>
      )}
    </div>
  );
}

const OTHER_LOCATIONS = {
  "Safari Zone South":     { grass: [{pokemon:"Uxie",level:76,rate:10},{pokemon:"Uxie",level:76,rate:10},{pokemon:"Azelf",level:76,rate:10},{pokemon:"Azelf",level:76,rate:10},{pokemon:"Mesprit",level:76,rate:10},{pokemon:"Mesprit",level:76,rate:10},{pokemon:"Cresselia",level:76,rate:10},{pokemon:"Cresselia",level:76,rate:10},{pokemon:"Shaymin",level:76,rate:10},{pokemon:"Shaymin",level:76,rate:5},{pokemon:"Shaymin",level:76,rate:4},{pokemon:"Shaymin",level:76,rate:1}] },
  "Safari Zone North":     { grass: [{pokemon:"Regieleki",level:76,rate:10},{pokemon:"Regieleki",level:76,rate:10},{pokemon:"Regidrago",level:76,rate:10},{pokemon:"Regidrago",level:76,rate:10},{pokemon:"Glastrier",level:76,rate:10},{pokemon:"Glastrier",level:76,rate:10},{pokemon:"Spectrier",level:76,rate:10},{pokemon:"Spectrier",level:76,rate:10},{pokemon:"Jirachi",level:76,rate:10},{pokemon:"Jirachi",level:76,rate:5},{pokemon:"Jirachi",level:76,rate:4},{pokemon:"Jirachi",level:76,rate:1}], rock_smash: [{pokemon:"Regirock",level:76,rate:25},{pokemon:"Regice",level:76,rate:25},{pokemon:"Registeel",level:76,rate:25},{pokemon:"Regigigas",level:76,rate:15},{pokemon:"Regigigas",level:76,rate:10}] },
  "Safari Zone Southwest": { grass: [{pokemon:"Raikou",level:78,rate:10},{pokemon:"Raikou",level:78,rate:10},{pokemon:"Entei",level:78,rate:10},{pokemon:"Entei",level:78,rate:10},{pokemon:"Suicune",level:78,rate:10},{pokemon:"Suicune",level:78,rate:10},{pokemon:"Mew",level:78,rate:10},{pokemon:"Mew",level:78,rate:10},{pokemon:"Celebi",level:78,rate:10},{pokemon:"Celebi",level:78,rate:5},{pokemon:"Celebi",level:78,rate:4},{pokemon:"Celebi",level:78,rate:1}], fishing: [{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Manaphy",level:78,rate:10},{pokemon:"Manaphy",level:78,rate:10}], surfing: [{pokemon:"Articuno",level:78,rate:20},{pokemon:"Zapdos",level:78,rate:20},{pokemon:"Moltres",level:78,rate:20},{pokemon:"Tapu Koko",level:78,rate:20},{pokemon:"Tapu Lele",level:78,rate:10},{pokemon:"Tapu Lele",level:78,rate:10}] },
  "Safari Zone Northwest": { grass: [{pokemon:"Cobalion",level:78,rate:10},{pokemon:"Cobalion",level:78,rate:10},{pokemon:"Terrakion",level:78,rate:10},{pokemon:"Terrakion",level:78,rate:10},{pokemon:"Virizion",level:78,rate:10},{pokemon:"Virizion",level:78,rate:10},{pokemon:"Keldeo",level:78,rate:10},{pokemon:"Keldeo",level:78,rate:10},{pokemon:"Meloetta",level:78,rate:10},{pokemon:"Meloetta",level:78,rate:5},{pokemon:"Meloetta",level:78,rate:4},{pokemon:"Meloetta",level:78,rate:1}], fishing: [{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Phione",level:78,rate:20},{pokemon:"Manaphy",level:78,rate:20},{pokemon:"Manaphy",level:78,rate:10},{pokemon:"Manaphy",level:78,rate:10}], surfing: [{pokemon:"Articuno-Galar",level:78,rate:20},{pokemon:"Zapdos-Galar",level:78,rate:20},{pokemon:"Moltres-Galar",level:78,rate:20},{pokemon:"Tapu Fini",level:78,rate:20},{pokemon:"Tapu Bulu",level:78,rate:10},{pokemon:"Tapu Bulu",level:78,rate:10}] },
  "Safari Zone Southeast": { grass: [{pokemon:"Chien-Pao",level:80,rate:10},{pokemon:"Wo-Chien",level:80,rate:10},{pokemon:"Ting-Lu",level:80,rate:10},{pokemon:"Chi-Yu",level:80,rate:10},{pokemon:"Okidogi",level:80,rate:10},{pokemon:"Fezandipiti",level:80,rate:10},{pokemon:"Munkidori",level:80,rate:10},{pokemon:"Pecharunt",level:80,rate:10},{pokemon:"Zarude",level:80,rate:10},{pokemon:"Magearna",level:80,rate:5},{pokemon:"Marshadow",level:80,rate:4},{pokemon:"Marshadow",level:80,rate:1}], fishing: [{pokemon:"Volcanion",level:80,rate:20},{pokemon:"Volcanion",level:80,rate:20},{pokemon:"Latios",level:80,rate:20},{pokemon:"Latias",level:80,rate:20},{pokemon:"Manaphy",level:80,rate:10},{pokemon:"Phione",level:80,rate:10}], surfing: [{pokemon:"Darkrai",level:80,rate:20},{pokemon:"Manaphy",level:80,rate:20},{pokemon:"Hoopa",level:80,rate:20},{pokemon:"Cresselia",level:80,rate:20},{pokemon:"Volcanion",level:80,rate:10},{pokemon:"Volcanion",level:80,rate:10}], rock_smash: [{pokemon:"Diancie",level:80,rate:25},{pokemon:"Heatran",level:80,rate:25},{pokemon:"Regigigas",level:80,rate:25},{pokemon:"Zygarde-10%",level:80,rate:15},{pokemon:"Zygarde-10%",level:80,rate:10}] },
  "Safari Zone Northeast": { grass: [{pokemon:"Genesect",level:80,rate:10},{pokemon:"Genesect",level:80,rate:10},{pokemon:"Zeraora",level:80,rate:10},{pokemon:"Zeraora",level:80,rate:10},{pokemon:"Meltan",level:80,rate:10},{pokemon:"Meltan",level:80,rate:10},{pokemon:"Ogerpon",level:80,rate:10},{pokemon:"Ogerpon",level:80,rate:10},{pokemon:"Victini",level:80,rate:10},{pokemon:"Victini",level:80,rate:5},{pokemon:"Victini",level:80,rate:4},{pokemon:"Kubfu",level:80,rate:1}] },
  "Navel Rock Entrance":   { grass: [{pokemon:"Minior",level:40,rate:10},{pokemon:"Forretress",level:40,rate:10},{pokemon:"Scizor",level:40,rate:10},{pokemon:"Kleavor",level:40,rate:10},{pokemon:"Flygon",level:40,rate:10},{pokemon:"Mienshao",level:40,rate:10},{pokemon:"Crobat",level:40,rate:10},{pokemon:"Gliscor",level:40,rate:10},{pokemon:"Cyclizar",level:40,rate:10},{pokemon:"Persian-Alola",level:40,rate:5},{pokemon:"Persian-Alola",level:40,rate:4},{pokemon:"Persian-Alola",level:40,rate:1}] },
  "Navel Rock B1F":        { grass: [{pokemon:"Salazzle",level:40,rate:10},{pokemon:"Togekiss",level:40,rate:10},{pokemon:"Ambipom",level:40,rate:10},{pokemon:"Banette",level:40,rate:10},{pokemon:"Primarina",level:40,rate:10},{pokemon:"Hawlucha",level:40,rate:10},{pokemon:"Swalot",level:40,rate:10},{pokemon:"Samurott",level:40,rate:10},{pokemon:"Samurott-Hisui",level:40,rate:10},{pokemon:"Grafaiai",level:40,rate:5},{pokemon:"Whimsicott",level:40,rate:4},{pokemon:"Liepard",level:40,rate:1}] },
  "Navel Rock Fork":       { grass: [{pokemon:"Wyrdeer",level:40,rate:10},{pokemon:"Exeggutor-Alola",level:40,rate:10},{pokemon:"Carbink",level:40,rate:10},{pokemon:"Cofagrigus",level:40,rate:10},{pokemon:"Klefki",level:40,rate:10},{pokemon:"Reuniclus",level:40,rate:10},{pokemon:"Audino",level:40,rate:10},{pokemon:"Orbeetle",level:40,rate:10},{pokemon:"Hatterene",level:40,rate:10},{pokemon:"Spiritomb",level:40,rate:5},{pokemon:"Spiritomb",level:40,rate:4},{pokemon:"Spiritomb",level:40,rate:1}] },
  "Navel Rock Up 1":       { grass: [{pokemon:"Excadrill",level:40,rate:10},{pokemon:"Toedscruel",level:40,rate:10},{pokemon:"Avalugg",level:40,rate:10},{pokemon:"Avalugg-Hisui",level:40,rate:10},{pokemon:"Torkoal",level:40,rate:10},{pokemon:"Coalossal",level:40,rate:10},{pokemon:"Togekiss",level:40,rate:10},{pokemon:"Gliscor",level:40,rate:10},{pokemon:"Corviknight",level:40,rate:10},{pokemon:"Altaria",level:40,rate:5},{pokemon:"Altaria",level:40,rate:4},{pokemon:"Altaria",level:40,rate:1}] },
  "Navel Rock Up 2":       { grass: [{pokemon:"Golem",level:40,rate:10},{pokemon:"Golem-Alola",level:40,rate:10},{pokemon:"Magnezone",level:40,rate:10},{pokemon:"Steelix",level:40,rate:10},{pokemon:"Forretress",level:40,rate:10},{pokemon:"Donphan",level:40,rate:10},{pokemon:"Bastiodon",level:40,rate:10},{pokemon:"Duraludon",level:40,rate:10},{pokemon:"Crustle",level:40,rate:10},{pokemon:"Avalugg",level:40,rate:5},{pokemon:"Avalugg-Hisui",level:40,rate:4},{pokemon:"Avalugg-Hisui",level:40,rate:1}] },
  "Navel Rock Up 3":       { grass: [{pokemon:"Lycanroc-Midnight",level:40,rate:10},{pokemon:"Bibarel",level:40,rate:10},{pokemon:"Bombirdier",level:40,rate:10},{pokemon:"Carbink",level:40,rate:10},{pokemon:"Shuckle",level:40,rate:10},{pokemon:"Minior",level:40,rate:10},{pokemon:"Druddigon",level:40,rate:10},{pokemon:"Armaldo",level:40,rate:10},{pokemon:"Copperajah",level:40,rate:10},{pokemon:"Meowstic",level:40,rate:5},{pokemon:"Meowstic-F",level:40,rate:4},{pokemon:"Meowstic-F",level:40,rate:1}] },
  "Navel Rock Up 4":       { grass: [{pokemon:"Cradily",level:40,rate:10},{pokemon:"Porygon2",level:40,rate:10},{pokemon:"Alcremie",level:40,rate:10},{pokemon:"Gliscor",level:40,rate:10},{pokemon:"Hydrapple",level:40,rate:10},{pokemon:"Garganacl",level:40,rate:10},{pokemon:"Togekiss",level:40,rate:10},{pokemon:"Altaria",level:40,rate:10},{pokemon:"Sableye",level:40,rate:10},{pokemon:"Avalugg",level:40,rate:5},{pokemon:"Avalugg-Hisui",level:40,rate:4},{pokemon:"Avalugg-Hisui",level:40,rate:1}] },
  "Navel Rock Down 1":     { grass: [{pokemon:"Audino",level:40,rate:10},{pokemon:"Yanmega",level:40,rate:10},{pokemon:"Klawf",level:40,rate:10},{pokemon:"Espathra",level:40,rate:10},{pokemon:"Klefki",level:40,rate:10},{pokemon:"Dachsbun",level:40,rate:10},{pokemon:"Stonjourner",level:40,rate:10},{pokemon:"Obstagoon",level:40,rate:10},{pokemon:"Sableye",level:40,rate:10},{pokemon:"Hitmontop",level:40,rate:5},{pokemon:"Hitmontop",level:40,rate:4},{pokemon:"Hitmontop",level:40,rate:1}] },
  "Navel Rock Down 2":     { grass: [{pokemon:"Clefable",level:40,rate:10},{pokemon:"Mr. Mime",level:40,rate:10},{pokemon:"Shiinotic",level:40,rate:10},{pokemon:"Amoonguss",level:40,rate:10},{pokemon:"Lucario",level:40,rate:10},{pokemon:"Blastoise",level:40,rate:10},{pokemon:"Sinistcha",level:40,rate:10},{pokemon:"Volcarona",level:40,rate:10},{pokemon:"Toedscruel",level:40,rate:10},{pokemon:"Raichu",level:40,rate:5},{pokemon:"Raichu-Alola",level:40,rate:4},{pokemon:"Raichu-Alola",level:40,rate:1}] },
  "Navel Rock Down 3":     { grass: [{pokemon:"Shiftry",level:40,rate:10},{pokemon:"Lokix",level:40,rate:10},{pokemon:"Grimmsnarl",level:40,rate:10},{pokemon:"Toxicroak",level:40,rate:10},{pokemon:"Honchkrow",level:40,rate:10},{pokemon:"Obstagoon",level:40,rate:10},{pokemon:"Cinderace",level:40,rate:10},{pokemon:"Lycanroc-Dusk",level:40,rate:10},{pokemon:"Mawile",level:40,rate:10},{pokemon:"Spiritomb",level:40,rate:5},{pokemon:"Spiritomb",level:40,rate:4},{pokemon:"Spiritomb",level:40,rate:1}] },
  "Navel Rock Down 4":     { grass: [{pokemon:"Shiftry",level:40,rate:10},{pokemon:"Infernape",level:40,rate:10},{pokemon:"Palossand",level:40,rate:10},{pokemon:"Diggersby",level:40,rate:10},{pokemon:"Cyclizar",level:40,rate:10},{pokemon:"Scrafty",level:40,rate:10},{pokemon:"Blastoise",level:40,rate:10},{pokemon:"Mr. Mime-Galar",level:40,rate:10},{pokemon:"Hariyama",level:40,rate:10},{pokemon:"Hitmonchan",level:40,rate:5},{pokemon:"Hitmonlee",level:40,rate:4},{pokemon:"Hitmonlee",level:40,rate:1}] },
  "Navel Rock Down 5":     { grass: [{pokemon:"Meganium",level:40,rate:10},{pokemon:"Torterra",level:40,rate:10},{pokemon:"Drapion",level:40,rate:10},{pokemon:"Perrserker",level:40,rate:10},{pokemon:"Falinks",level:40,rate:10},{pokemon:"Escavalier",level:40,rate:10},{pokemon:"Turtonator",level:40,rate:10},{pokemon:"Cradily",level:40,rate:10},{pokemon:"Armaldo",level:40,rate:10},{pokemon:"Klawf",level:40,rate:5},{pokemon:"Sliggoo-Hisui",level:40,rate:4},{pokemon:"Pupitar",level:40,rate:1}] },
};

const SAFARI_LOCATIONS = ["Safari Zone South","Safari Zone North","Safari Zone Southwest","Safari Zone Northwest","Safari Zone Southeast","Safari Zone Northeast"];
const NAVEL_LOCATIONS  = ["Navel Rock Entrance","Navel Rock B1F","Navel Rock Fork","Navel Rock Up 1","Navel Rock Up 2","Navel Rock Up 3","Navel Rock Up 4","Navel Rock Down 1","Navel Rock Down 2","Navel Rock Down 3","Navel Rock Down 4","Navel Rock Down 5"];

const NOTE_LABELS = {
  "Safari Zone South":     { grass: "Opens up after getting the Pokeblock Case in Lilycove Contest Hall" },
  "Safari Zone North":     { grass: "Opens up after defeating Maxie in Magma Hideout", rock_smash: "Opens up after defeating Maxie in Magma Hideout" },
  "Safari Zone Southwest": { grass: "Opens up after getting the Mind Badge", fishing: "Opens up after getting the Mind Badge", surfing: "Opens up after getting the Mind Badge" },
  "Safari Zone Northwest": { grass: "Opens up after defeating Archie in Seafloor Cavern", fishing: "Opens up after defeating Archie in Seafloor Cavern", surfing: "Opens up after defeating Archie in Seafloor Cavern" },
  "Safari Zone Southeast": { grass: "Opens up after getting the Adamantite Badge", fishing: "Opens up after getting the Adamantite Badge", surfing: "Opens up after getting the Adamantite Badge", rock_smash: "Opens up after getting the Adamantite Badge" },
  "Safari Zone Northeast": { grass: "Opens up after getting the Adamantite Badge" },
  "Navel Rock Entrance":   { grass: "Pivot Move table" },
  "Navel Rock B1F":        { grass: "Encore table" },
  "Navel Rock Fork":       { grass: "Trick Room table" },
  "Navel Rock Up 1":       { grass: "Hazard Removal table" },
  "Navel Rock Up 2":       { grass: "Sturdy table" },
  "Navel Rock Up 3":       { grass: "Stealth Rock table" },
  "Navel Rock Up 4":       { grass: "Recovery table" },
  "Navel Rock Down 1":     { grass: "Protection table" },
  "Navel Rock Down 2":     { grass: "Redirection table" },
  "Navel Rock Down 3":     { grass: "Sucker Punch table" },
  "Navel Rock Down 4":     { grass: "Fake Out table" },
  "Navel Rock Down 5":     { grass: "Crit Immunity table" },
  "Altering Grove":          { fishing: "Azumarill can use Perish Song" },
  "Lilycove City":           { fishing: "Both Primarina and Azumarill can use Perish Song", surfing: "Altaria can use Perish Song" },
  "Route 134":               { fishing: "Azumarill can use Perish Song" },
  "Shoal Cave (Inner Room)": { surfing: "Politoed can use Perish Song" },
  "Route 126":               { fishing: "Politoed can use Perish Song" },
  "Route 122":               { surfing: "Mismagius can use Perish Song" },
  "Fortree City":            { grass: "Altaria can use Perish Song", trade: "2 guaranteed 31 IVs" },
  "Route 131":               { surfing: "Primarina can use Perish Song" },
  "Dewford Town":            { grass: "Both Natu and Abra can use Teleport" },
  "Meteor Falls":            { rock_smash: "Solrock can use Explosion" },
  "Meteor Falls Room 2":     { surfing: "Bronzong can use Explosion", fishing: "Gastrodon can use Memento" },
  "Meteor Falls B1F Room 1": { fishing: "Dewgong can use Perish Song", grass: "Diancie can use Misty Explosion" },
  "Meteor Falls B1F Room 2": { fishing: "Tatsugiri can use Memento" },
  "Sky Pillar 5F":           { grass: "Solrock can use Explosion" },
  "Route 123":               { grass: "Forretress can use Explosion" },
  "Route 127":               { fishing: "Pyukumuku can use Memento" },
  "Abandoned Ship B1F Rooms":             { fishing: "Basculin can use Final Gambit" },
  "Rustboro City":             { trade: "2 guaranteed 31 IVs" },
  "Mirage Tower 3F":           { trade: "2 guaranteed 31 IVs" },
  "Weather Institute":         { trade: "2 guaranteed 31 IVs & Genie is selected at random" },
};

function OtherLocationCard({ name, encounters, box, onCatch }) {
  const [expanded, setExpanded] = useState(false);
  const methods = Object.entries(encounters);
  const visible = expanded ? methods : methods.slice(0, 1);
  return (
    <div className="route-card">
      <div className="route-card-header" onClick={() => setExpanded(!expanded)}>
        <h3>{name}</h3>
        <div className="route-header-right">
          {methods.length > 1 && !expanded && (
            <span className="method-pills">
              {methods.slice(1).map(([m]) => <span key={m} className="pill"><MethodIcon method={m} small routeName={name} /></span>)}
            </span>
          )}
          <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {visible.map(([method, encs]) => {
        const adjusted = getAdjustedEncounters(encs, box);
        const { color: mColor, icon: mIcon, label: mLabel } = getMethodDisplay(method, name);
        return (
          <div key={method} className="encounter-method">
            <div className="method-header-row">
              <div className="method-header" style={{ background: mColor }}>
                <span>{mIcon}</span> <span>{mLabel}</span>
              </div>
              {NOTE_LABELS[name]?.[method] && (
                <div style={{
                  background: 'rgba(233,69,96,0.15)',
                  border: '1px solid var(--red)',
                  borderRadius: 4,
                  padding: '3px 10px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--red)',
                  whiteSpace: 'nowrap',
                }}>
                  {NOTE_LABELS[name][method]}
                </div>
              )}
            </div>
            <div className="sprite-grid">
              {adjusted.map((enc, i) => (
                <SpriteCard key={i} enc={enc} adjRate={enc.adjRate} duped={isDupedOut(enc.pokemon, box)} onCatch={onCatch} />
              ))}
            </div>
          </div>
        );
      })}
      {methods.length > 1 && (
        <button className="view-more-btn" onClick={() => setExpanded(!expanded)}>
          <strong>{expanded ? '▲ Show Less' : `▼ View All Methods (${methods.length})`}</strong>
        </button>
      )}
    </div>

  );
}
 
function OtherSection({ box, onCatch }) {
  const [tab, setTab] = useState('safari');
  const locations = tab === 'safari' ? SAFARI_LOCATIONS : NAVEL_LOCATIONS;
  const tabStyle = (t) => ({
    padding: '6px 14px', border: 'none', borderRadius: 6, cursor: 'pointer',
    fontWeight: 700, fontSize: '0.78rem', transition: 'all 0.15s',
    background: tab === t ? 'var(--accent)' : 'var(--bg4)',
    color: tab === t ? '#fff' : 'var(--text2)',
  });
  return (
    <div className="special-section">
      <div className="gym-header"><h2><BallIcon size={24}/> Other Encounters</h2></div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button style={tabStyle('safari')} onClick={() => setTab('safari')}><BallIcon size={16}/> Safari Zone</button>
        <button style={tabStyle('navel')} onClick={() => setTab('navel')}>🪨 Navel Rock</button>
      </div>
      {locations.map(name => (
        <OtherLocationCard key={name} name={name} encounters={OTHER_LOCATIONS[name] || {}} box={box} onCatch={onCatch} />
      ))}
    </div>
  );
}
 

const TRADES = [
  { location: "Rustboro City",     wanted: "Qwilfish",  offered: ["Qwilfish-Hisui"] },
  { location: "Mirage Tower 3F",   wanted: "Stoutland", offered: ["Houndstone"] },
  { location: "Weather Institute", wanted: "Castform",  offered: ["Tornadus", "Thundurus", "Landorus", "Enamorus"] },
  { location: "Fortree City",      wanted: "Florges",   wantedNote: "non-red color", offered: ["Floette-Eternal"] },
];

// You "have" the wanted mon only if that exact species is alive in your box.
const ownsExact = (species, box) =>
  box.some(p => p.status !== 'dead' && normName(p.species) === normName(species));

const TradeIcon = memo(function TradeIcon({ name, role, owned, duped, note, rate, multi, onCatch }) {
  const [popup, setPopup] = useState(false);
  const blocked = role === 'wanted' ? owned : duped;
  const cls = `sprite-card trade-icon${role === 'wanted' && owned ? ' trade-owned' : ''}${role === 'offered' && duped ? ' duped' : ''}`;
  return (
    <>
      <div
        className={cls}
        onClick={() => setPopup(true)}
        onContextMenu={(e) => { e.preventDefault(); if (!blocked) onCatch(name); }}
        title={blocked ? undefined : 'Right-click to add to box'}
      >
        <SmartSprite name={name} className="sprite-img" />
        {role === 'wanted' && owned && <div className="check-badge">✓</div>}
        {role === 'offered' && duped && <div className="duped-badge">DUPED</div>}
        <div className="sprite-name">{name}</div>
        {multi && role === 'offered' && (
          <div className="sprite-meta">
            {duped
              ? <span className="sprite-rate rate-duped">✕</span>
              : <span className="sprite-rate">{rate}%</span>}
          </div>
        )}
        {note && <div className="trade-note">{note}</div>}
      </div>
      {popup && <SpritePopup enc={{ pokemon: name }} onCatch={onCatch} onClose={() => setPopup(false)} />}
    </>
  );
});

function TradeCard({ trade, box, onCatch }) {
  const alive = box.filter(p => p.status !== 'dead');
  // Any alive mon from the wanted Pokémon's evolution family satisfies the trade.
  const tradedAway = alive.find(p => isDupedOut(trade.wanted, [p])) || null;
  const owned = !!tradedAway;
  // That mon leaves your box in the trade, so ignore it when checking dupes on what you'd receive.
  const boxAfterTrade = tradedAway ? box.filter(p => p !== tradedAway) : box;
  const openCount = trade.offered.filter(n => !isDupedOut(n, boxAfterTrade)).length;
const offerRate = trade.offered.length > 1 && openCount > 0 ? Math.round(1000 / openCount) / 10 : undefined;
  return (
    <div className="route-card trade-card">
      <div className="route-card-header" style={{ cursor: 'default' }}>
        <h3>{trade.location}</h3>
      </div>

      <div className="encounter-method" style={{ padding: '3px 12px 12px' }}>
        <div className="method-header-row">
          <div className="method-header" style={{ background: '#1a5276' }}>
            <span>🔄</span> <span>TRADE</span>
          </div>
          {NOTE_LABELS[trade.location]?.trade && (
            <div className="note-chip" style={{
              background: 'rgba(233,69,96,0.15)',
              border: '1px solid var(--red)',
              borderRadius: 4,
              padding: '3px 10px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--red)',
            }}>
              {NOTE_LABELS[trade.location].trade}
            </div>
          )}
        </div>

        <div className="trade-row">
          <TradeIcon name={trade.wanted} role="wanted" owned={owned} note={trade.wantedNote} onCatch={onCatch} />
          <div className="trade-arrows" aria-hidden="true">
            <span>→</span>
            <span>←</span>
          </div>
          <div className="trade-offers">
            {trade.offered.map(n => (
              <TradeIcon key={n} name={n} role="offered" duped={isDupedOut(n, boxAfterTrade)} rate={offerRate} multi={trade.offered.length > 1} onCatch={onCatch} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecialSection({ box, onCatch }) {
  return (
    <div className="special-section">
      <div className="gym-header"><h2>✨ Special Encounters</h2></div>
      {TRADES.map(t => <TradeCard key={t.location} trade={t} box={box} onCatch={onCatch} />)}
    </div>
  );
}

function App() {
  const [activeSection,setActiveSection] = useState('Roxanne');
  const [search,setSearch]   = useState('');
  const [box,setBox]         = useState(()=>{ try{return JSON.parse(localStorage.getItem('nuzlocke_box'))||[];}catch{return [];} });
  const [darkMode,setDarkMode] = useState(()=>{ const s=localStorage.getItem('dark_mode'); return s===null?true:s==='true'; });
  const sectionRefs = useRef({});
  const contentRef  = useRef();

  useEffect(()=>{ document.body.className=darkMode?'dark':'light'; localStorage.setItem('dark_mode',darkMode); },[darkMode]);
  useEffect(() => {
  try { localStorage.setItem('nuzlocke_box', JSON.stringify(box)); } catch {}
}, [box]);
  useEffect(()=>{
    const el=contentRef.current; if(!el) return;
    const onScroll=()=>{
      const top=el.scrollTop+80;
      let cur=GYM_SECTIONS[0].gym;
      for (const key of [...GYM_SECTIONS.map(g=>g.gym),'Other','Special']) {
        const ref=sectionRefs.current[key];
        if(ref&&ref.offsetTop<=top) cur=key;
      }
      setActiveSection(cur);
    };
    el.addEventListener('scroll',onScroll,{passive:true});
    return ()=>el.removeEventListener('scroll',onScroll);
  },[]);

  const scrollTo=useCallback((key)=>{
    setSearch('');
    const el=sectionRefs.current[key];
    if(el&&contentRef.current) contentRef.current.scrollTop=el.offsetTop-16;
  },[]);

const handleCatch = useCallback((species) => {
  setBox(prev => [...prev, { species, status: 'alive', id: Date.now() + Math.random() }]);
}, []);

  const getRoutes=useCallback((gymRoutes)=>gymRoutes.map(n=>{
    const found = routes.find(r=>r.name===n);
    if (found) return found;
    if (EXTRA_ENCOUNTERS[n]) return { name: n, encounters: {} };
    return null;
  }).filter(Boolean),[]);

  const searchResults=search.length>1 ? routes.filter(r=>r.name.toLowerCase().includes(search.toLowerCase())) : null;

  const allNavItems=[
    ...GYM_SECTIONS.map(g=>({key:g.gym,label:g.gym,badge:g.badge,emoji:g.emoji})),
    {key:'Other',label:'Other',badge:'Safari Zone + Navel Rock',emoji:<BallIcon/>,tooltip:'Contains Safari Zone & Navel Rock encounters'},
    {key:'Special',label:'Trades',emoji:'🔄'},
  ];

  return (
    <div className={`app ${darkMode?'dark':'light'}`}>
      <header className="header">
        <div className="header-left">
          <h1>
            Pokémon Null
            <img src={TYPE_NULL_SPRITE} alt="Type: Null" className="header-type-null"/>
          </h1>
          <span className="header-sub">Encounter Router</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <a href="https://www.twitch.tv/xyzal_0" target="_blank" rel="noreferrer"
            style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none',whiteSpace:'nowrap'}}>
            <span style={{fontSize:'0.8rem',fontWeight:700,color:'#9147ff'}}>Created by: xyzal </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#9147ff" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
            </svg>
          </a>
          <input className="search-bar" placeholder="Search routes..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </header>

      <div className="layout">
        <nav className="sidebar">
          <div className="sidebar-label">GYM SPLITS</div>
          {allNavItems.map(({key,label,badge,emoji,tooltip},i)=>(
            <React.Fragment key={key}>
              {i===GYM_SECTIONS.length && <div className="sidebar-divider"/>}
              <button className={`nav-btn ${activeSection===key?'active':''}`} onClick={()=>scrollTo(key)} title={tooltip||undefined}>
                <span className="nav-left"><span className="nav-emoji">{emoji}</span><span className="nav-gym">{label}</span></span>
                <span className="nav-badge">{badge}</span>
              </button>
            </React.Fragment>
          ))}
          <div className="sidebar-divider"/>
          <div className="theme-toggle">
            <button className={`theme-btn ${darkMode?'active':''}`} onClick={()=>setDarkMode(true)}>Dark</button>
            <button className={`theme-btn ${!darkMode?'active':''}`} onClick={()=>setDarkMode(false)}>Light</button>
          </div>
        </nav>

        <main className="content" ref={contentRef}>
          {searchResults && (
            <div className="search-results-wrap">
              <h2 className="search-title">Results for "{search}" ({searchResults.length})</h2>
              {searchResults.length===0
                ? <p className="no-results">No routes found.</p>
                : searchResults.map(r=><RouteCard key={r.name} route={r} box={box} onCatch={handleCatch}/>)
              }
            </div>
          )}
          {!searchResults && (
            <>
              {GYM_SECTIONS.map(({gym,badge,emoji,routes:gr})=>(
                <div key={gym} className="gym-section" ref={el=>sectionRefs.current[gym]=el}>
                  <div className="gym-header">
                    <h2>{emoji} {gym} Split</h2>
                    <span className="badge-chip">{badge}</span>
                  </div>
                  {getRoutes(gr).map(r=><RouteCard key={r.name} route={r} box={box} onCatch={handleCatch}/>)}
                </div>
              ))}
              <div ref={el=>sectionRefs.current['Other']=el}><OtherSection box={box} onCatch={handleCatch}/></div>
              <div ref={el=>sectionRefs.current['Special']=el}><SpecialSection box={box} onCatch={handleCatch}/></div>
            </>
          )}
        </main>

        <aside className="tracker-panel">
          <NuzlockeTracker box={box} setBox={setBox}/>
        </aside>
      </div>
    </div>
  );
}

export default App;

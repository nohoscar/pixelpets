import type { PetKind } from "./petSprites";

/**
 * Random "thoughts" each pet can think while idle.
 * Used for ambient flavor — picks one randomly every ~12-25s while walking.
 *
 * Per-pet themed lines + universal fallbacks. Personality-driven.
 */

// Universal lines — every pet can say these occasionally
const UNIVERSAL: string[] = [
  "¿hay wifi aquí?", "tengo sueñito", "¿qué hora es?", "hola humano 👋",
  "click click", "me gusta tu setup", "no toques mi área", "🎵 lalala 🎵",
  "¡hello world!", "¿comemos algo?", "¿jugamos?", "soy famoso en internet",
  "estoy pensando...", "✨ vibes ✨", "no rompas nada", "pixel power",
];

// Mood-specific lines — used based on stats
export const MOOD_LINES = {
  hungry:  ["mucha hambre 🍖", "comida pls", "tengo el estómago vacío", "¿hay pizza?", "snack snack"],
  sad:     ["estoy triston 💔", "necesito mimos", "abrázame 🥺", "me siento solito", "buaa"],
  tired:   ["zzz... cansad@", "necesito siesta", "mis ojitos pesan 💤", "café por favor"],
  happy:   ["¡soy feliz! ✨", "la vida es buena", "🎶 tarara 🎶", "todo está bien", "bailando bailando"],
  bored:   ["aburrido aburrido", "¿algo divertido?", "necesito acción", "haz algo plis"],
} as const;

// Per-pet themed thought lines
const THOUGHTS: Partial<Record<PetKind, string[]>> = {
  // ----- Cute classics -----
  cat: ["miau 🐾", "¿caja?", "tirar cosas...", "sleep + judge", "necesito una ventana", "cazaré ese cursor"],
  dog: ["WOOF WOOF", "¿pasear? ¿¡pasear!?", "tengo una pelota", "buen humano", "¡cola wag wag!", "amo a todos"],
  bunny: ["hop hop", "¿zanahoria?", "binky time 🐰", "soy esponjoso", "narices contigo"],
  fox: ["what does the fox say?", "soy astuto 🦊", "ding ding ding", "fast & fluffy", "siiiiilencio"],
  panda: ["bambú... bambú...", "rolling rolling", "sleep mode 24/7", "soy bola peluda", "snack de hojas"],
  axolotl: ["blub blub 💧", "vivo bajo el agua", "soy adorable y lo sé", "regenero todo uwu", "dame gusano"],
  capybara: ["chill mode 100%", "vamos al onsen ♨", "soy amig@ de todos", "naranja en la cabeza 🍊", "max relax"],
  penguin: ["awawk", "¿pescado?", "soy un esmoquin", "hielo hielo", "no vuelo pero brillo"],
  monkey: ["uh ah ah", "¿plátano?", "trepo paredes", "soy travieso 🙊", "robo cosas brillantes"],
  unicorn: ["✨ magia ✨", "soy único", "rainbow power 🌈", "polvo de hada", "creo en mí"],
  // ----- Cartoon -----
  slime: ["squish squish", "soy gelatina", "no me derritas", "blub", "elastic life"],
  slimemage: ["por mi báculo!", "abracadabra ✨", "INT 99 STR 1", "+10 fireball", "estudio mucho"],
  mushroom: ["soy un hongo feliz 🍄", "no me comas", "esporas ftw", "respira hondo", "soy mágico"],
  // ----- Fantasy -----
  dragon: ["RAWR 🔥", "necesito tesoro", "soy pequeño pero feroz", "fuego suave", "cuidado, muerdo"],
  ghost: ["boo 👻", "¿me ves?", "atravieso paredes", "soy translúcido", "uuuuuu"],
  robot: ["BEEP BOOP", "01001000 01001001", "calibrando...", "RAM al 100%", "ERROR 404: alma"],
  // ----- Lovecraft -----
  cthulhu: ["Ph'nglui mglw'nafh...", "duermo en R'lyeh", "los astros se alinean", "cosmic vibes", "no me mires fijo"],
  shoggoth: ["Tekeli-li! Tekeli-li!", "tantos ojos 👀", "¿cuántos soy?", "blop blop", "NO ESCAPARÁS"],
  blackgoat: ["Iä! Shub-Niggurath!", "1000 jóvenes 🐐", "cabra cósmica", "el bosque negro llama", "baaa"],
  necronomicon: ["léeme... LÉEME", "página 666 🔮", "no hagas el ritual", "conocimiento prohibido", "soy un libro vivo"],
  yurei: ["uuuuuu...", "no hice nada", "venganza...", "el agua está fría 💧", "no abras esa puerta"],
  alien: ["sssrrrr...", "fase 1: incubar", "tu cuerpo es perfecto", "drool drool 💧", "hay más arriba 👾"],
  // ----- Videogames -----
  pikachu: ["pika pika ⚡", "PIKACHUUUU", "elige a tu starter", "+10 voltios", "¿pokébola? no gracias"],
  kirby: ["poyo poyo!", "tengo hambre 😋", "absorbo poderes", "warp star ⭐", "hi friend!"],
  yoshi: ["yoshi yoshi!", "egg time 🥚", "soy verde y fuerte", "¿mario? lo cuido yo", "lengua larga 👅"],
  creeper: ["sssssssss...", "aw man 💥", "qué bonito tu setup", "boom incoming", "no corras"],
  metroid: ["zzzzapp ⚡", "drenando energía", "cuidado Samus", "soy goo flotante", "freeze me bro"],
  companionCube: ["....", "(corazón silencioso)", "no soy sintiente*", "no me incinerres", "*pero te quiero ❤"],
  chocobo: ["kweh!", "ride me to victory 🏇", "verde es chill", "necesito greens 🌿", "wark wark"],
  booMario: ["soy tímido 👻", "no me mires", "te asusto si miras hacia otro lado", "boo!", "lengua afuera"],
  bulborb: ["zzz... 🍖", "comeré pikmin", "snorrr", "no me despiertes", "boca grande"],
  headcrab: ["jump on face", "🦀 click click", "ph34r me", "Gordon Freeman?", "tengo dientes raros"],
  isaac: ["mom said no... 😢", "lágrimas como balas", "the basement awaits", "+1 vida", "buaaaa"],
  // ----- Sci-fi / Horror -----
  facehugger: ["abrázame fuerte 🤗", "respira normal", "cara bonita...", "no te muevas", "te traigo regalo"],
  xenomorph: ["sssrrrr", "drool dripping...", "perfect organism", "in space no one hears me", "boca dentro de boca"],
  dalek: ["EXTERMINATE!", "soy perfecto", "el doctor me teme", "no escaleras 😩", "elevate elevate"],
  tribble: ["coo coo coo", "soy adorable", "me reproduzco fast", "love me feed me", "many many many"],
  bb8: ["beep boop bweep", "rolling rolling", "naranja > azul", "orgánico amigo?", "BB-8 reportándose"],
  weepingAngel: ["...", "no parpadees", "te muevo en el tiempo", "(estoy detrás de ti)", "DON'T BLINK"],
  gremlin: ["jeje jeje 😈", "no me mojes", "no luz brillante", "no comer después de medianoche", "🎵 caos 🎵"],
  chestburster: ["¡SORPRESA! 💥", "saliendo del huevo", "ñam ñam costillas", "screech!", "hello world"],
  yautja: ["soy cazador", "hot trofeo", "blade ready ⚔", "mira mi cráneo collection", "honor o muerte"],
};

/** Pick a random idle thought for a pet kind. */
export function randomThought(kind: PetKind): string {
  const themed = THOUGHTS[kind];
  // 70% themed, 30% universal — keeps variety
  const useThemed = themed && themed.length > 0 && Math.random() < 0.7;
  const pool = useThemed ? themed! : UNIVERSAL;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Pick a mood-specific line. */
export function moodThought(mood: keyof typeof MOOD_LINES): string {
  const pool = MOOD_LINES[mood];
  return pool[Math.floor(Math.random() * pool.length)];
}

export interface Question {
  id: number;
  esPrompt: string;
  hyPrompt: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  fullSentenceEs: string;
}

export interface FruitItem {
  id: number;
  esQuestion: string;
  hyQuestion: string;
  esAnswer: string;
  hyAnswer: string;
  fruitTag?: string;
  colorTag?: string;
}

export interface DayVocab {
  es: string;
  hy: string;
  dayNumber: number;
}

export interface DayItem {
  id: number;
  esQuestion: string;
  hyQuestion: string;
  esAnswer: string;
  hyAnswer: string;
}

export interface SecretWord {
  word: string;
  hyTranslation: string;
  hintHy: string;
  hintEs: string;
}

export const MAIN_SECRET_WORDS: SecretWord[] = [
  {
    word: 'JUGADOR',
    hyTranslation: 'Խաղացող',
    hintHy: 'Այն անձն է, ով մասնակցում է խաղին կամ սպորտին։',
    hintEs: 'Persona que juega o participa en un juego o deporte.'
  },
  {
    word: 'ESPAÑOL',
    hyTranslation: 'Իսպաներեն',
    hintHy: 'Լեզուն, որը մենք միասին սովորում ենք այս խաղում։',
    hintEs: 'El idioma que estamos aprendiendo juntos.'
  },
  {
    word: 'MANZANA',
    hyTranslation: 'Խնձոր',
    hintHy: 'Համեղ միրգ, որը կարող է լինել կարմիր, կանաչ կամ դեղին։',
    hintEs: 'Fruta dulce que puede ser roja, verde o amarilla.'
  },
  {
    word: 'VIERNES',
    hyTranslation: 'Ուրբաթ',
    hintHy: 'Շաբաթվա հինգերորդ աշխատանքային օրը՝ հանգստյան օրերից առաջ։',
    hintEs: 'El quinto día de la semana laboral, antes del fin de semana.'
  },
  {
    word: 'GUITARRA',
    hyTranslation: 'Կիթառ',
    hintHy: 'Երաժշտական լարային գործիք, որով հիանալի նվագում են Իսպանիայում։',
    hintEs: 'Instrumento musical de cuerda muy popular en España.'
  }
];

export const PRESENTE_QUESTIONS: Question[] = [
  {
    id: 1,
    esPrompt: "Yo ___ español todos los días.",
    hyPrompt: "Ես ամեն օր իսպաներեն եմ սովորում։",
    options: [
      { key: 'A', text: "estudio" },
      { key: 'B', text: "estudias" },
      { key: 'C', text: "estudia" },
      { key: 'D', text: "estudiamos" }
    ],
    correctAnswer: 'A',
    fullSentenceEs: "Yo estudio español todos los días."
  },
  {
    id: 2,
    esPrompt: "María ___ en una cafetería.",
    hyPrompt: "Մարիան աշխատում է սրճարանում։",
    options: [
      { key: 'A', text: "trabajo" },
      { key: 'B', text: "trabajas" },
      { key: 'C', text: "trabaja" },
      { key: 'D', text: "trabajan" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "María trabaja en una cafetería."
  },
  {
    id: 3,
    esPrompt: "Nosotros ___ en Barcelona.",
    hyPrompt: "Մենք ապրում ենք Բարսելոնայում։",
    options: [
      { key: 'A', text: "vivo" },
      { key: 'B', text: "vivimos" },
      { key: 'C', text: "viven" },
      { key: 'D', text: "vives" }
    ],
    correctAnswer: 'B',
    fullSentenceEs: "Nosotros vivimos en Barcelona."
  },
  {
    id: 4,
    esPrompt: "Tú ___ mucha agua.",
    hyPrompt: "Դու շատ ջուր ես խմում։",
    options: [
      { key: 'A', text: "bebo" },
      { key: 'B', text: "bebe" },
      { key: 'C', text: "bebes" },
      { key: 'D', text: "bebemos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Tú bebes mucha agua."
  },
  {
    id: 5,
    esPrompt: "Ellos ___ fútbol los sábados.",
    hyPrompt: "Նրանք շաբաթ օրերին ֆուտբոլ են խաղում։",
    options: [
      { key: 'A', text: "juega" },
      { key: 'B', text: "jugamos" },
      { key: 'C', text: "juegan" },
      { key: 'D', text: "juegas" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Ellos juegan fútbol los sábados."
  },
  {
    id: 6,
    esPrompt: "Ana ___ un libro por la noche.",
    hyPrompt: "Անան երեկոյան գիրք է կարդում։",
    options: [
      { key: 'A', text: "leo" },
      { key: 'B', text: "lees" },
      { key: 'C', text: "lee" },
      { key: 'D', text: "leen" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Ana lee un libro por la noche."
  },
  {
    id: 7,
    esPrompt: "Yo ___ temprano por la mañana.",
    hyPrompt: "Ես առավոտյան շուտ նախաճաշում եմ։",
    options: [
      { key: 'A', text: "desayunas" },
      { key: 'B', text: "desayuno" },
      { key: 'C', text: "desayuna" },
      { key: 'D', text: "desayunamos" }
    ],
    correctAnswer: 'B',
    fullSentenceEs: "Yo desayuno temprano por la mañana."
  },
  {
    id: 8,
    esPrompt: "Mi hermano ___ música en su habitación.",
    hyPrompt: "Իմ եղբայրը իր սենյակում երաժշտություն է լսում։",
    options: [
      { key: 'A', text: "escucho" },
      { key: 'B', text: "escuchas" },
      { key: 'C', text: "escucha" },
      { key: 'D', text: "escuchamos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Mi hermano escucha música en su habitación."
  },
  {
    id: 9,
    esPrompt: "Nosotros ___ la cena juntos.",
    hyPrompt: "Մենք միասին ընթրիք ենք պատրաստում։",
    options: [
      { key: 'A', text: "preparo" },
      { key: 'B', text: "preparas" },
      { key: 'C', text: "prepara" },
      { key: 'D', text: "preparamos" }
    ],
    correctAnswer: 'D',
    fullSentenceEs: "Nosotros preparamos la cena juntos."
  },
  {
    id: 10,
    esPrompt: "Tú ___ muy rápido.",
    hyPrompt: "Դու շատ արագ ես վազում։",
    options: [
      { key: 'A', text: "corres" },
      { key: 'B', text: "corro" },
      { key: 'C', text: "corre" },
      { key: 'D', text: "corren" }
    ],
    correctAnswer: 'A',
    fullSentenceEs: "Tú corres muy rápido."
  },
  {
    id: 11,
    esPrompt: "Carlos ___ una camiseta azul.",
    hyPrompt: "Կառլոսը կապույտ շապիկ է կրում։",
    options: [
      { key: 'A', text: "llevo" },
      { key: 'B', text: "llevas" },
      { key: 'C', text: "lleva" },
      { key: 'D', text: "llevamos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Carlos lleva una camiseta azul."
  },
  {
    id: 12,
    esPrompt: "Yo ___ a mis amigos después de clase.",
    hyPrompt: "Ես դասից հետո տեսնում եմ իմ ընկերներին։",
    options: [
      { key: 'A', text: "ves" },
      { key: 'B', text: "ve" },
      { key: 'C', text: "veo" },
      { key: 'D', text: "vemos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Yo veo a mis amigos después de clase."
  },
  {
    id: 13,
    esPrompt: "Ellas ___ en el parque.",
    hyPrompt: "Նրանք զբոսնում են այգում։",
    options: [
      { key: 'A', text: "caminan" },
      { key: 'B', text: "camina" },
      { key: 'C', text: "caminamos" },
      { key: 'D', text: "caminas" }
    ],
    correctAnswer: 'A',
    fullSentenceEs: "Ellas caminan en el parque."
  },
  {
    id: 14,
    esPrompt: "Nosotros ___ la televisión por la noche.",
    hyPrompt: "Մենք երեկոյան հեռուստացույց ենք դիտում։",
    options: [
      { key: 'A', text: "miras" },
      { key: 'B', text: "miramos" },
      { key: 'C', text: "miran" },
      { key: 'D', text: "miro" }
    ],
    correctAnswer: 'B',
    fullSentenceEs: "Nosotros miramos la televisión por la noche."
  },
  {
    id: 15,
    esPrompt: "Tú ___ una carta a tu amiga.",
    hyPrompt: "Դու նամակ ես գրում ընկերուհուդ։",
    options: [
      { key: 'A', text: "escribo" },
      { key: 'B', text: "escribes" },
      { key: 'C', text: "escribe" },
      { key: 'D', text: "escribimos" }
    ],
    correctAnswer: 'B',
    fullSentenceEs: "Tú escribes una carta a tu amiga."
  },
  {
    id: 16,
    esPrompt: "Mi madre ___ muy bien.",
    hyPrompt: "Իմ մայրիկը շատ լավ է պատրաստում։",
    options: [
      { key: 'A', text: "cocinas" },
      { key: 'B', text: "cocino" },
      { key: 'C', text: "cocina" },
      { key: 'D', text: "cocinamos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Mi madre cocina muy bien."
  },
  {
    id: 17,
    esPrompt: "Yo ___ café sin azúcar.",
    hyPrompt: "Ես սուրճ եմ խմում առանց շաքարի։",
    options: [
      { key: 'A', text: "tomo" },
      { key: 'B', text: "tomas" },
      { key: 'C', text: "toma" },
      { key: 'D', text: "toman" }
    ],
    correctAnswer: 'A',
    fullSentenceEs: "Yo tomo café sin azúcar."
  },
  {
    id: 18,
    esPrompt: "Los niños ___ en el patio.",
    hyPrompt: "Երեխաները խաղում են բակում։",
    options: [
      { key: 'A', text: "jugamos" },
      { key: 'B', text: "juega" },
      { key: 'C', text: "juegan" },
      { key: 'D', text: "juegas" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Los niños juegan en el patio."
  },
  {
    id: 19,
    esPrompt: "Nosotros ___ español en clase.",
    hyPrompt: "Մենք դասարանում իսպաներեն ենք խոսում։",
    options: [
      { key: 'A', text: "hablo" },
      { key: 'B', text: "hablas" },
      { key: 'C', text: "hablamos" },
      { key: 'D', text: "hablan" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Nosotros hablamos español en clase."
  },
  {
    id: 20,
    esPrompt: "Tú ___ la puerta antes de salir.",
    hyPrompt: "Դու դուրս գալուց առաջ փակում ես դուռը։",
    options: [
      { key: 'A', text: "cierro" },
      { key: 'B', text: "cierras" },
      { key: 'C', text: "cierra" },
      { key: 'D', text: "cerramos" }
    ],
    correctAnswer: 'B',
    fullSentenceEs: "Tú cierras la puerta antes de salir."
  },
  {
    id: 21,
    esPrompt: "Yo ___ música cuando trabajo.",
    hyPrompt: "Ես աշխատելիս երաժշտություն եմ լսում։",
    options: [
      { key: 'A', text: "escuchas" },
      { key: 'B', text: "escucha" },
      { key: 'C', text: "escucho" },
      { key: 'D', text: "escuchamos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Yo escucho música cuando trabajo."
  },
  {
    id: 22,
    esPrompt: "Elena ___ frutas en el supermercado.",
    hyPrompt: "Ելենան սուպերմարկետում մրգեր է գնում։",
    options: [
      { key: 'A', text: "compras" },
      { key: 'B', text: "compro" },
      { key: 'C', text: "compra" },
      { key: 'D', text: "compran" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Elena compra frutas en el supermercado."
  },
  {
    id: 23,
    esPrompt: "Nosotros ___ a casa a las seis.",
    hyPrompt: "Մենք ժամը վեցին տուն ենք վերադառնում։",
    options: [
      { key: 'A', text: "vuelvo" },
      { key: 'B', text: "vuelve" },
      { key: 'C', text: "volvemos" },
      { key: 'D', text: "vuelven" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Nosotros volvemos a casa a las seis."
  },
  {
    id: 24,
    esPrompt: "Tú ___ el autobús cada mañana.",
    hyPrompt: "Դու ամեն առավոտ ավտոբուս ես նստում։",
    options: [
      { key: 'A', text: "tomas" },
      { key: 'B', text: "tomo" },
      { key: 'C', text: "toma" },
      { key: 'D', text: "toman" }
    ],
    correctAnswer: 'A',
    fullSentenceEs: "Tú tomas el autobús cada mañana."
  },
  {
    id: 25,
    esPrompt: "Mis amigos ___ mucho los fines de semana.",
    hyPrompt: "Իմ ընկերները հանգստյան օրերին շատ են ճանապարհորդում։",
    options: [
      { key: 'A', text: "viajamos" },
      { key: 'B', text: "viajan" },
      { key: 'C', text: "viajas" },
      { key: 'D', text: "viaja" }
    ],
    correctAnswer: 'B',
    fullSentenceEs: "Mis amigos viajan mucho los fines de semana."
  },
  {
    id: 26,
    esPrompt: "Yo ___ mi habitación cada sábado.",
    hyPrompt: "Ես ամեն շաբաթ օրը մաքրում եմ իմ սենյակը։",
    options: [
      { key: 'A', text: "limpio" },
      { key: 'B', text: "limpias" },
      { key: 'C', text: "limpia" },
      { key: 'D', text: "limpiamos" }
    ],
    correctAnswer: 'A',
    fullSentenceEs: "Yo limpio mi habitación cada sábado."
  },
  {
    id: 27,
    esPrompt: "Pablo ___ en una tienda de ropa.",
    hyPrompt: "Պաբլոն աշխատում է հագուստի խանութում։",
    options: [
      { key: 'A', text: "trabajo" },
      { key: 'B', text: "trabajas" },
      { key: 'C', text: "trabaja" },
      { key: 'D', text: "trabajan" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Pablo trabaja en una tienda de ropa."
  },
  {
    id: 28,
    esPrompt: "Nosotros ___ juntos después de clase.",
    hyPrompt: "Մենք դասից հետո միասին ուտում ենք։",
    options: [
      { key: 'A', text: "como" },
      { key: 'B', text: "comes" },
      { key: 'C', text: "comemos" },
      { key: 'D', text: "comen" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Nosotros comemos juntos después de clase."
  },
  {
    id: 29,
    esPrompt: "Tú ___ muchas preguntas.",
    hyPrompt: "Դու շատ հարցեր ես տալիս։",
    options: [
      { key: 'A', text: "hago" },
      { key: 'B', text: "haces" },
      { key: 'C', text: "hace" },
      { key: 'D', text: "hacemos" }
    ],
    correctAnswer: 'B',
    fullSentenceEs: "Tú haces muchas preguntas."
  },
  {
    id: 30,
    esPrompt: "Mi padre ___ el periódico por la mañana.",
    hyPrompt: "Իմ հայրիկը առավոտյան թերթ է կարդում։",
    options: [
      { key: 'A', text: "lees" },
      { key: 'B', text: "leo" },
      { key: 'C', text: "lee" },
      { key: 'D', text: "leemos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Mi padre lee el periódico por la mañana."
  },
  {
    id: 31,
    esPrompt: "Yo ___ al colegio a pie.",
    hyPrompt: "Ես դպրոց եմ գնում ոտքով։",
    options: [
      { key: 'A', text: "vas" },
      { key: 'B', text: "va" },
      { key: 'C', text: "voy" },
      { key: 'D', text: "vamos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Yo voy al colegio a pie."
  },
  {
    id: 32,
    esPrompt: "Laura ___ una película los viernes.",
    hyPrompt: "Լաուրան ուրբաթ օրերին ֆիլմ է դիտում։",
    options: [
      { key: 'A', text: "veo" },
      { key: 'B', text: "ves" },
      { key: 'C', text: "ve" },
      { key: 'D', text: "vemos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Laura ve una película los viernes."
  },
  {
    id: 33,
    esPrompt: "Nosotros ___ mucho en clase.",
    hyPrompt: "Մենք դասարանում շատ բան ենք սովորում։",
    options: [
      { key: 'A', text: "aprendo" },
      { key: 'B', text: "aprendes" },
      { key: 'C', text: "aprendemos" },
      { key: 'D', text: "aprenden" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Nosotros aprendemos mucho en clase."
  },
  {
    id: 34,
    esPrompt: "Tú ___ la mesa antes de comer.",
    hyPrompt: "Դու ուտելուց առաջ սեղանն ես պատրաստում։",
    options: [
      { key: 'A', text: "preparas" },
      { key: 'B', text: "preparo" },
      { key: 'C', text: "prepara" },
      { key: 'D', text: "preparamos" }
    ],
    correctAnswer: 'A',
    fullSentenceEs: "Tú preparas la mesa antes de comer."
  },
  {
    id: 35,
    esPrompt: "Ellos ___ en un piso pequeño.",
    hyPrompt: "Նրանք ապրում են փոքր բնակարանում։",
    options: [
      { key: 'A', text: "vive" },
      { key: 'B', text: "vivimos" },
      { key: 'C', text: "viven" },
      { key: 'D', text: "vives" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Ellos viven en un piso pequeño."
  },
  {
    id: 36,
    esPrompt: "Yo ___ una chaqueta cuando hace frío.",
    hyPrompt: "Ես բաճկոն եմ հագնում, երբ ցուրտ է։",
    options: [
      { key: 'A', text: "llevas" },
      { key: 'B', text: "llevo" },
      { key: 'C', text: "lleva" },
      { key: 'D', text: "llevan" }
    ],
    correctAnswer: 'B',
    fullSentenceEs: "Yo llevo una chaqueta cuando hace frío."
  },
  {
    id: 37,
    esPrompt: "Marta ___ francés y español.",
    hyPrompt: "Մարտան ֆրանսերեն և իսպաներեն է սովորում։",
    options: [
      { key: 'A', text: "estudias" },
      { key: 'B', text: "estudio" },
      { key: 'C', text: "estudia" },
      { key: 'D', text: "estudiamos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Marta estudia francés y español."
  },
  {
    id: 38,
    esPrompt: "Nosotros ___ el desayuno a las ocho.",
    hyPrompt: "Մենք նախաճաշում ենք ժամը ութին։",
    options: [
      { key: 'A', text: "tomo" },
      { key: 'B', text: "tomas" },
      { key: 'C', text: "toma" },
      { key: 'D', text: "tomamos" }
    ],
    correctAnswer: 'D',
    fullSentenceEs: "Nosotros tomamos el desayuno a las ocho."
  },
  {
    id: 39,
    esPrompt: "Tú ___ muy bien la guitarra.",
    hyPrompt: "Դու շատ լավ ես կիթառ նվագում։",
    options: [
      { key: 'A', text: "tocas" },
      { key: 'B', text: "toca" },
      { key: 'C', text: "tocamos" },
      { key: 'D', text: "toco" }
    ],
    correctAnswer: 'A',
    fullSentenceEs: "Tú tocas muy bien la guitarra."
  },
  {
    id: 40,
    esPrompt: "Mis padres ___ verduras en el mercado.",
    hyPrompt: "Իմ ծնողները շուկայում բանջարեղեն են գնում։",
    options: [
      { key: 'A', text: "compra" },
      { key: 'B', text: "compras" },
      { key: 'C', text: "compran" },
      { key: 'D', text: "compramos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Mis padres compran verduras en el mercado."
  },
  {
    id: 41,
    esPrompt: "Yo ___ a mi abuela los domingos.",
    hyPrompt: "Ես կիրակի օրերին այցելում եմ տատիկիս։",
    options: [
      { key: 'A', text: "visita" },
      { key: 'B', text: "visitas" },
      { key: 'C', text: "visito" },
      { key: 'D', text: "visitamos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Yo visito a mi abuela los domingos."
  },
  {
    id: 42,
    esPrompt: "Pedro ___ temprano para ir al colegio.",
    hyPrompt: "Պեդրոն շուտ է արթնանում դպրոց գնալու համար։",
    options: [
      { key: 'A', text: "me levanto" },
      { key: 'B', text: "te levantas" },
      { key: 'C', text: "se levanta" },
      { key: 'D', text: "nos levantamos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Pedro se levanta temprano para ir al colegio."
  },
  {
    id: 43,
    esPrompt: "Nosotros ___ las manos antes de comer.",
    hyPrompt: "Մենք ուտելուց առաջ լվանում ենք մեր ձեռքերը։",
    options: [
      { key: 'A', text: "me lavo" },
      { key: 'B', text: "te lavas" },
      { key: 'C', text: "se lavan" },
      { key: 'D', text: "nos lavamos" }
    ],
    correctAnswer: 'D',
    fullSentenceEs: "Nosotros nos lavamos las manos antes de comer."
  },
  {
    id: 44,
    esPrompt: "Tú ___ muy tarde los fines de semana.",
    hyPrompt: "Դու հանգստյան օրերին շատ ուշ ես քնում։",
    options: [
      { key: 'A', text: "te acuestas" },
      { key: 'B', text: "me acuesto" },
      { key: 'C', text: "se acuesta" },
      { key: 'D', text: "nos acostamos" }
    ],
    correctAnswer: 'A',
    fullSentenceEs: "Tú te acuestas muy tarde los fines de semana."
  },
  {
    id: 45,
    esPrompt: "Yo ___ los dientes después de desayunar.",
    hyPrompt: "Ես նախաճաշից հետո մաքրում եմ ատամներս։",
    options: [
      { key: 'A', text: "te cepillas" },
      { key: 'B', text: "me cepillo" },
      { key: 'C', text: "se cepilla" },
      { key: 'D', text: "nos cepillamos" }
    ],
    correctAnswer: 'B',
    fullSentenceEs: "Yo me cepillo los dientes después de desayunar."
  },
  {
    id: 46,
    esPrompt: "Carolina ___ con sus amigas después de clase.",
    hyPrompt: "Կարոլինան դասից հետո խոսում է իր ընկերուհիների հետ։",
    options: [
      { key: 'A', text: "hablo" },
      { key: 'B', text: "hablas" },
      { key: 'C', text: "habla" },
      { key: 'D', text: "hablan" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Carolina habla con sus amigas después de clase."
  },
  {
    id: 47,
    esPrompt: "Nosotros ___ la tarea por la tarde.",
    hyPrompt: "Մենք կեսօրից հետո կատարում ենք տնային աշխատանքը։",
    options: [
      { key: 'A', text: "hacen" },
      { key: 'B', text: "hacemos" },
      { key: 'C', text: "hago" },
      { key: 'D', text: "haces" }
    ],
    correctAnswer: 'B',
    fullSentenceEs: "Nosotros hacemos la tarea por la tarde."
  },
  {
    id: 48,
    esPrompt: "Tú ___ el móvil muchas veces al día.",
    hyPrompt: "Դու օրվա ընթացքում շատ անգամ հեռախոս ես օգտագործում։",
    options: [
      { key: 'A', text: "uso" },
      { key: 'B', text: "usa" },
      { key: 'C', text: "usas" },
      { key: 'D', text: "usamos" }
    ],
    correctAnswer: 'C',
    fullSentenceEs: "Tú usas el móvil muchas veces al día."
  },
  {
    id: 49,
    esPrompt: "Los estudiantes ___ al profesor.",
    hyPrompt: "Աշակերտները լսում են ուսուցչին։",
    options: [
      { key: 'A', text: "escuchan" },
      { key: 'B', text: "escucha" },
      { key: 'C', text: "escuchamos" },
      { key: 'D', text: "escuchas" }
    ],
    correctAnswer: 'A',
    fullSentenceEs: "Los estudiantes escuchan al profesor."
  },
  {
    id: 50,
    esPrompt: "Yo ___ con mi familia por la noche.",
    hyPrompt: "Ես երեկոյան ընտանիքիս հետ ընթրում եմ։",
    options: [
      { key: 'A', text: "cenas" },
      { key: 'B', text: "cena" },
      { key: 'C', text: "cenamos" },
      { key: 'D', text: "ceno" }
    ],
    correctAnswer: 'D',
    fullSentenceEs: "Yo ceno con mi familia por la noche."
  }
];

export const FRUTAS_DATA: FruitItem[] = [
  {
    id: 1,
    esQuestion: "¿Qué fruta te gusta más?",
    hyQuestion: "Ո՞ր միրգն ես ամենաշատը սիրում։",
    esAnswer: "Me gustan más las manzanas.",
    hyAnswer: "Ես ամենաշատը խնձոր եմ սիրում։",
    fruitTag: "🍎 Manzana"
  },
  {
    id: 2,
    esQuestion: "¿Te gustan los plátanos?",
    hyQuestion: "Սիրո՞ւմ ես բանան։",
    esAnswer: "Sí, me gustan mucho.",
    hyAnswer: "Այո, շատ եմ սիրում։",
    fruitTag: "🍌 Plátano"
  },
  {
    id: 3,
    esQuestion: "¿Comes fruta todos los días?",
    hyQuestion: "Ամեն օր միրգ ուտո՞ւմ ես։",
    esAnswer: "Sí, como fruta todos los días.",
    hyAnswer: "Այո, ամեն օր միրգ եմ ուտում։",
    fruitTag: "🥗 Dieta sana"
  },
  {
    id: 4,
    esQuestion: "¿Qué fruta compras normalmente?",
    hyQuestion: "Սովորաբար ի՞նչ միրգ ես գնում։",
    esAnswer: "Normalmente compro manzanas y naranjas.",
    hyAnswer: "Սովորաբար խնձոր և նարինջ եմ գնում։",
    fruitTag: "🍊 Naranja & Manzana"
  },
  {
    id: 5,
    esQuestion: "¿De qué color es una naranja?",
    hyQuestion: "Ի՞նչ գույն ունի նարինջը։",
    esAnswer: "Es naranja.",
    hyAnswer: "Այն նարնջագույն է։",
    colorTag: "🟧 Naranja"
  },
  {
    id: 6,
    esQuestion: "¿De qué color puede ser una manzana?",
    hyQuestion: "Ի՞նչ գույն կարող է ունենալ խնձորը։",
    esAnswer: "Puede ser roja, verde o amarilla.",
    hyAnswer: "Այն կարող է լինել կարմիր, կանաչ կամ դեղին։",
    colorTag: "🔴 🟢 🟡 Colores"
  },
  {
    id: 7,
    esQuestion: "¿Qué fruta es amarilla?",
    hyQuestion: "Ո՞ր միրգն է դեղին։",
    esAnswer: "El plátano es amarillo.",
    hyAnswer: "Բանանը դեղին է։",
    colorTag: "🟨 Amarillo"
  },
  {
    id: 8,
    esQuestion: "¿Qué fruta es pequeña y roja?",
    hyQuestion: "Ո՞ր միրգն է փոքր և կարմիր։",
    esAnswer: "La fresa.",
    hyAnswer: "Ելակը։",
    fruitTag: "🍓 Fresa"
  },
  {
    id: 9,
    esQuestion: "¿Te gustan las fresas?",
    hyQuestion: "Սիրո՞ւմ ես ելակ։",
    esAnswer: "Sí, me encantan.",
    hyAnswer: "Այո, շատ եմ սիրում։",
    fruitTag: "🍓 Me encantan"
  },
  {
    id: 10,
    esQuestion: "¿Qué fruta comes en verano?",
    hyQuestion: "Ամռանը ի՞նչ միրգ ես ուտում։",
    esAnswer: "Como sandía y melón.",
    hyAnswer: "Ես ձմերուկ և սեխ եմ ուտում։",
    fruitTag: "🍉 Sandía & Melón"
  },
  {
    id: 11,
    esQuestion: "¿La sandía es grande o pequeña?",
    hyQuestion: "Ձմերուկը մե՞ծ է, թե՞ փոքր։",
    esAnswer: "Es grande.",
    hyAnswer: "Այն մեծ է։",
    fruitTag: "🍉 Grande"
  },
  {
    id: 12,
    esQuestion: "¿Qué fruta tiene muchas semillas?",
    hyQuestion: "Ո՞ր միրգն ունի շատ սերմեր։",
    esAnswer: "La sandía tiene muchas semillas.",
    hyAnswer: "Ձմերուկը շատ սերմեր ունի։",
    fruitTag: "🍉 Semillas"
  },
  {
    id: 13,
    esQuestion: "¿Prefieres manzana o pera?",
    hyQuestion: "Նախընտրո՞ւմ ես խնձոր, թե՞ տանձ։",
    esAnswer: "Prefiero la manzana.",
    hyAnswer: "Նախընտրում եմ խնձորը։",
    fruitTag: "🍐 Pera vs Manzana"
  },
  {
    id: 14,
    esQuestion: "¿Qué fruta usas para hacer zumo?",
    hyQuestion: "Ո՞ր միրգն ես օգտագործում հյութ պատրաստելու համար։",
    esAnswer: "Uso naranjas.",
    hyAnswer: "Նարինջ եմ օգտագործում։",
    fruitTag: "🧃 Zumo"
  },
  {
    id: 15,
    esQuestion: "¿Dónde compras fruta?",
    hyQuestion: "Որտե՞ղ ես միրգ գնում։",
    esAnswer: "Compro fruta en el supermercado o en el mercado.",
    hyAnswer: "Միրգ գնում եմ սուպերմարկետում կամ շուկայում։",
    fruitTag: "🏪 Mercado"
  }
];

export const DIAS_VOCAB: DayVocab[] = [
  { es: 'lunes', hy: 'երկուշաբթի', dayNumber: 1 },
  { es: 'martes', hy: 'երեքշաբթի', dayNumber: 2 },
  { es: 'miércoles', hy: 'չորեքշաբթի', dayNumber: 3 },
  { es: 'jueves', hy: 'հինգշաբթի', dayNumber: 4 },
  { es: 'viernes', hy: 'ուրբաթ', dayNumber: 5 },
  { es: 'sábado', hy: 'շաբաթ', dayNumber: 6 },
  { es: 'domingo', hy: 'կիրակի', dayNumber: 7 }
];

export const DIAS_DATA: DayItem[] = [
  {
    id: 1,
    esQuestion: "¿Qué día es hoy?",
    hyQuestion: "Այսօր շաբաթվա ո՞ր օրն է։",
    esAnswer: "Hoy es lunes.",
    hyAnswer: "Այսօր երկուշաբթի է։"
  },
  {
    id: 2,
    esQuestion: "¿Qué día es mañana?",
    hyQuestion: "Վաղը շաբաթվա ո՞ր օրն է։",
    esAnswer: "Mañana es martes.",
    hyAnswer: "Վաղը երեքշաբթի է։"
  },
  {
    id: 3,
    esQuestion: "¿Qué día fue ayer?",
    hyQuestion: "Երեկ շաբաթվա ո՞ր օրն էր։",
    esAnswer: "Ayer fue domingo.",
    hyAnswer: "Երեկ կիրակի էր։"
  },
  {
    id: 4,
    esQuestion: "¿Qué día viene después del lunes?",
    hyQuestion: "Ո՞ր օրն է գալիս երկուշաբթիից հետո։",
    esAnswer: "El martes.",
    hyAnswer: "Երեքշաբթին։"
  },
  {
    id: 5,
    esQuestion: "¿Qué día viene después del miércoles?",
    hyQuestion: "Ո՞ր օրն է գալիս չորեքշաբթիից հետո։",
    esAnswer: "El jueves.",
    hyAnswer: "Հինգշաբթին։"
  },
  {
    id: 6,
    esQuestion: "¿Qué día viene antes del viernes?",
    hyQuestion: "Ո՞ր օրն է ուրբաթից առաջ։",
    esAnswer: "El jueves.",
    hyAnswer: "Հինգշաբթին։"
  },
  {
    id: 7,
    esQuestion: "¿Qué día viene antes del lunes?",
    hyQuestion: "Ո՞ր օրն է երկուշաբթիից առաջ։",
    esAnswer: "El domingo.",
    hyAnswer: "Կիրակին։"
  },
  {
    id: 8,
    esQuestion: "¿Cuántos días tiene una semana?",
    hyQuestion: "Քանի՞ օր ունի շաբաթը։",
    esAnswer: "Tiene siete días.",
    hyAnswer: "Այն ունի յոթ օր։"
  },
  {
    id: 9,
    esQuestion: "¿Cuál es el primer día de la semana?",
    hyQuestion: "Ո՞րն է շաբաթվա առաջին օրը։",
    esAnswer: "El lunes.",
    hyAnswer: "Երկուշաբթին։"
  },
  {
    id: 10,
    esQuestion: "¿Qué días son el fin de semana?",
    hyQuestion: "Ո՞ր օրերն են հանգստյան օրերը։",
    esAnswer: "El sábado y el domingo.",
    hyAnswer: "Շաբաթը և կիրակին։"
  },
  {
    id: 11,
    esQuestion: "¿Qué haces los lunes?",
    hyQuestion: "Ի՞նչ ես անում երկուշաբթի օրերին։",
    esAnswer: "Los lunes voy al colegio.",
    hyAnswer: "Երկուշաբթի օրերին գնում եմ դպրոց։"
  },
  {
    id: 12,
    esQuestion: "¿Qué haces los sábados?",
    hyQuestion: "Ի՞նչ ես անում շաբաթ օրերին։",
    esAnswer: "Los sábados descanso y salgo con mis amigos.",
    hyAnswer: "Շաբաթ օրերին հանգստանում եմ և դուրս եմ գալիս ընկերներիս հետ։"
  },
  {
    id: 13,
    esQuestion: "¿Qué haces los domingos?",
    hyQuestion: "Ի՞նչ ես անում կիրակի օրերին։",
    esAnswer: "Los domingos paso tiempo con mi familia.",
    hyAnswer: "Կիրակի օրերին ժամանակ եմ անցկացնում ընտանիքիս հետ։"
  },
  {
    id: 14,
    esQuestion: "¿Qué día tienes más clases?",
    hyQuestion: "Ո՞ր օրն ես ամենաշատ դասերն ունենում։",
    esAnswer: "Tengo más clases el martes.",
    hyAnswer: "Երեքշաբթի օրը ամենաշատ դասերն ունեմ։"
  },
  {
    id: 15,
    esQuestion: "¿Cuál es tu día favorito de la semana?",
    hyQuestion: "Ո՞րն է քո սիրելի շաբաթվա օրը։",
    esAnswer: "Mi día favorito es el sábado.",
    hyAnswer: "Իմ սիրելի օրը շաբաթն է։"
  }
];

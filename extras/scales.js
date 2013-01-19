// ### TWELVE-TONES PER OCTAVE

// ### 5 note scales
sc.ScaleInfo.register(
    "minorPentatonic",
    new sc.Scale([0,3,5,7,10], 12, "Minor Pentatonic")
);

sc.ScaleInfo.register(
    "majorPentatonic",
    new sc.Scale([0,2,4,7,9], 12, "Major Pentatonic")
);

// ### another mode of major pentatonic
sc.ScaleInfo.register(
    "ritusen",
    new sc.Scale([0,2,5,7,9], 12, "Ritusen")
);

// ### another mode of major pentatonic
sc.ScaleInfo.register(
    "egyptian",
    new sc.Scale([0,2,5,7,10], 12, "Egyptian")
);

sc.ScaleInfo.register(
	"kumoi",
    new sc.Scale([0,2,3,7,9], 12, "Kumoi")
);

sc.ScaleInfo.register(
	"hirajoshi",
    new sc.Scale([0,2,3,7,8], 12, "Hirajoshi")
);

sc.ScaleInfo.register(
	"iwato",
    new sc.Scale([0,1,5,6,10], 12, "Iwato")
);

sc.ScaleInfo.register(
	"chinese",
    new sc.Scale([0,4,6,7,11], 12, "Chinese")
);

sc.ScaleInfo.register(
	"indian",
    new sc.Scale([0,4,5,7,10], 12, "Indian")
);

sc.ScaleInfo.register(
	"pelog",
    new sc.Scale([0,1,3,7,8], 12, "Pelog")
);

sc.ScaleInfo.register(
	"prometheus",
    new sc.Scale([0,2,4,6,11], 12, "Prometheus")
);

sc.ScaleInfo.register(
	"scriabin",
    new sc.Scale([0,1,4,7,9], 12, "Scriabin")
);

// ### han chinese pentatonic scales
sc.ScaleInfo.register(
	"gong",
    new sc.Scale([0,2,4,7,9], 12, "Gong")
);

sc.ScaleInfo.register(
	"shang",
    new sc.Scale([0,2,5,7,10], 12, "Shang")
);

sc.ScaleInfo.register(
    "jiao",
    new sc.Scale([0,3,5,8,10], 12, "Jiao")
);

sc.ScaleInfo.register(
    "zhi",
    new sc.Scale([0,2,5,7,9], 12, "Zhi")
);

sc.ScaleInfo.register(
    "yu",
    new sc.Scale([0,3,5,7,10], 12, "Yu")
);

// ### 6 note scales
sc.ScaleInfo.register(
    "whole",
    new sc.Scale([0,2,4,6,8,10], 12, "Whole Tone")
);

sc.ScaleInfo.register(
	"augmented",
    new sc.Scale([0,3,4,7,8,11], 12, "Augmented")
);

sc.ScaleInfo.register(
	"augmented2",
    new sc.Scale([0,1,4,5,8,9], 12, "Augmented 2")
);

// ### Partch's Otonalities and Utonalities
sc.ScaleInfo.register(
    "partch_o1",
    new sc.Scale([0,8,14,20,25,34], 43, "partch", "Partch Otonality 1")
);

sc.ScaleInfo.register(
	"partch_o2",
    new sc.Scale([0,7,13,18,27,35], 43, "partch", "Partch Otonality 2")
);

sc.ScaleInfo.register(
    "partch_o3",
    new sc.Scale([0,6,12,21,29,36], 43, "partch", "Partch Otonality 3")
);

sc.ScaleInfo.register(
    "partch_o4",
    new sc.Scale([0,5,15,23,30,37], 43, "partch", "Partch Otonality 4")
);

sc.ScaleInfo.register(
    "partch_o5",
    new sc.Scale([0,10,18,25,31,38], 43, "partch", "Partch Otonality 5")
);

sc.ScaleInfo.register(
    "partch_o6",
    new sc.Scale([0,9,16,22,28,33], 43, "partch", "Partch Otonality 6")
);

sc.ScaleInfo.register(
    "partch_u1",
    new sc.Scale([0,9,18,23,29,35], 43, "partch", "Partch Utonality 1")
);

sc.ScaleInfo.register(
    "partch_u2",
    new sc.Scale([0,8,16,25,30,36], 43, "partch", "Partch Utonality 2")
);

sc.ScaleInfo.register(
    "partch_u3",
    new sc.Scale([0,7,14,22,31,37], 43, "partch", "Partch Utonality 3")
);

sc.ScaleInfo.register(
    "partch_u4",
    new sc.Scale([0,6,13,20,28,38], 43, "partch", "Partch Utonality 4")
);

sc.ScaleInfo.register(
    "partch_u5",
    new sc.Scale([0,5,12,18,25,33], 43, "partch", "Partch Utonality 5")
);

sc.ScaleInfo.register(
    "partch_u6",
    new sc.Scale([0,10,15,21,27,34], 43, "partch", "Partch Utonality 6")
);

// ### hexatonic modes with no tritone
sc.ScaleInfo.register(
	"hexMajor7",
    new sc.Scale([0,2,4,7,9,11], 12, "Hex Major 7")
);

sc.ScaleInfo.register(
    "hexDorian",
    new sc.Scale([0,2,3,5,7,10], 12, "Hex Dorian")
);

sc.ScaleInfo.register(
    "hexPhrygian",
    new sc.Scale([0,1,3,5,8,10], 12, "Hex Phrygian")
);

sc.ScaleInfo.register(
    "hexSus",
    new sc.Scale([0,2,5,7,9,10], 12, "Hex Sus")
);

sc.ScaleInfo.register(
    "hexMajor6",
    new sc.Scale([0,2,4,5,7,9], 12, "Hex Major 6")
);

sc.ScaleInfo.register(
    "hexAeolian",
    new sc.Scale([0,3,5,7,8,10], 12, "Hex Aeolian")
);

// ### 7 note scales
sc.ScaleInfo.register(
	"ionian",
    new sc.Scale([0,2,4,5,7,9,11], 12, "Ionian")
);

sc.ScaleInfo.register(
	"dorian",
    new sc.Scale([0,2,3,5,7,9,10], 12, "Dorian")
);

sc.ScaleInfo.register(
	"phrygian",
    new sc.Scale([0,1,3,5,7,8,10], 12, "Phrygian")
);

sc.ScaleInfo.register(
	"lydian",
    new sc.Scale([0,2,4,6,7,9,11], 12, "Lydian")
);

sc.ScaleInfo.register(
	"mixolydian",
    new sc.Scale([0,2,4,5,7,9,10], 12, "Mixolydian")
);

sc.ScaleInfo.register(
	"aeolian",
    new sc.Scale([0,2,3,5,7,8,10], 12, "Aeolian")
);

sc.ScaleInfo.register(
    "locrian",
    new sc.Scale([0,1,3,5,6,8,10], 12, "Locrian")
);

sc.ScaleInfo.register(
	"harmonicMinor",
    new sc.Scale([0,2,3,5,7,8,11], 12, "Harmonic Minor")
);

sc.ScaleInfo.register(
	"harmonicMajor",
    new sc.Scale([0,2,4,5,7,8,11], 12, "Harmonic Major")
);

sc.ScaleInfo.register(
	"melodicMinor",
    new sc.Scale([0,2,3,5,7,9,11], 12, "Melodic Minor")
);

sc.ScaleInfo.register(
    "melodicMinorDesc",
    new sc.Scale([0,2,3,5,7,8,10], 12, "Melodic Minor Descending")
);

sc.ScaleInfo.register(
    "melodicMajor",
    new sc.Scale([0,2,4,5,7,8,10], 12, "Melodic Major")
);

sc.ScaleInfo.register(
	"bartok",
    new sc.Scale([0,2,4,5,7,8,10], 12, "Bartok")
);

sc.ScaleInfo.register(
	"hindu",
    new sc.Scale([0,2,4,5,7,8,10], 12, "Hindu")
);

// ### raga modes
sc.ScaleInfo.register(
    "todi",
    new sc.Scale([0,1,3,6,7,8,11], 12, "Todi")
);

sc.ScaleInfo.register(
    "purvi",
    new sc.Scale([0,1,4,6,7,8,11], 12, "Purvi")
);

sc.ScaleInfo.register(
    "marva",
    new sc.Scale([0,1,4,6,7,9,11], 12, "Marva")
);

sc.ScaleInfo.register(
    "bhairav",
    new sc.Scale([0,1,4,5,7,8,11], 12, "Bhairav")
);

sc.ScaleInfo.register(
    "ahirbhairav",
    new sc.Scale([0,1,4,5,7,9,10], 12, "Ahirbhairav")
);

sc.ScaleInfo.register(
	"superLocrian",
    new sc.Scale([0,1,3,4,6,8,10], 12, "Super Locrian")
);

sc.ScaleInfo.register(
    "romanianMinor",
    new sc.Scale([0,2,3,6,7,9,10], 12, "Romanian Minor")
);

sc.ScaleInfo.register(
    "hungarianMinor",
    new sc.Scale([0,2,3,6,7,8,11], 12, "Hungarian Minor")
);

sc.ScaleInfo.register(
    "neapolitanMinor",
    new sc.Scale([0,1,3,5,7,8,11], 12, "Neapolitan Minor")
);

sc.ScaleInfo.register(
    "enigmatic",
    new sc.Scale([0,1,4,6,8,10,11], 12, "Enigmatic")
);

sc.ScaleInfo.register(
    "spanish",
    new sc.Scale([0,1,4,5,7,8,10], 12, "Spanish")
);

// ### modes of whole tones with added note ->
sc.ScaleInfo.register(
	"leadingWhole",
    new sc.Scale([0,2,4,6,8,10,11], 12, "Leading Whole Tone")
);

sc.ScaleInfo.register(
    "lydianMinor",
    new sc.Scale([0,2,4,6,7,8,10], 12, "Lydian Minor")
);

sc.ScaleInfo.register(
    "neapolitanMajor",
    new sc.Scale([0,1,3,5,7,9,11], 12, "Neapolitan Major")
);

sc.ScaleInfo.register(
    "locrianMajor",
    new sc.Scale([0,2,4,5,6,8,10], 12, "Locrian Major")
);

// ### 8 note scales
sc.ScaleInfo.register(
    "diminished",
    new sc.Scale([0,1,3,4,6,7,9,10], 12, "Diminished")
);

sc.ScaleInfo.register(
    "diminished2",
    new sc.Scale([0,2,3,5,6,8,9,11], 12, "Diminished 2")
);

// ### 12 note scales
sc.ScaleInfo.register(
    "chromatic",
    new sc.Scale([0,1,2,3,4,5,6,7,8,9,10,11], 12, "Chromatic")
);

// ### TWENTY-FOUR TONES PER OCTAVE
sc.ScaleInfo.register(
    "chromatic24",
    new sc.Scale([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 24, "Chromatic 24")
);

// ### maqam ajam
sc.ScaleInfo.register(
    "ajam",
    new sc.Scale([0,4,8,10,14,18,22], 24, "Ajam")
);

sc.ScaleInfo.register(
    "jiharkah",
    new sc.Scale([0,4,8,10,14,18,21], 24, "Jiharkah")
);

sc.ScaleInfo.register(
    "shawqAfza",
    new sc.Scale([0,4,8,10,14,16,22], 24, "Shawq Afza")
);

// ### maqam sikah
sc.ScaleInfo.register(
    "sikah",
    new sc.Scale([0,3,7,11,14,17,21], 24, "Sikah")
);

sc.ScaleInfo.register(
    "sikahDesc",
    new sc.Scale([0,3,7,11,13,17,21], 24, "Sikah Descending")
);

sc.ScaleInfo.register(
    "huzam",
    new sc.Scale([0,3,7,9,15,17,21], 24, "Huzam")
);

sc.ScaleInfo.register(
    "iraq",
    new sc.Scale([0,3,7,10,13,17,21], 24, "Iraq")
);

sc.ScaleInfo.register(
    "bastanikar",
    new sc.Scale([0,3,7,10,13,15,21], 24, "Bastanikar")
);

sc.ScaleInfo.register(
    "mustar",
    new sc.Scale([0,5,7,11,13,17,21], 24, "Mustar")
);

// ### maqam bayati
sc.ScaleInfo.register(
    "bayati",
    new sc.Scale([0,3,6,10,14,16,20], 24, "Bayati")
);

sc.ScaleInfo.register(
    "karjighar",
    new sc.Scale([0,3,6,10,12,18,20], 24, "Karjighar")
);

sc.ScaleInfo.register(
    "husseini",
    new sc.Scale([0,3,6,10,14,17,21], 24, "Husseini")
);

// ### maqam nahawand
sc.ScaleInfo.register(
    "nahawand",
    new sc.Scale([0,4,6,10,14,16,22], 24, "Nahawand")
);

sc.ScaleInfo.register(
    "nahawandDesc",
    new sc.Scale([0,4,6,10,14,16,20], 24, "Nahawand Descending")
);

sc.ScaleInfo.register(
    "farahfaza",
    new sc.Scale([0,4,6,10,14,16,20], 24, "Farahfaza")
);

sc.ScaleInfo.register(
    "murassah",
    new sc.Scale([0,4,6,10,12,18,20], 24, "Murassah")
);

sc.ScaleInfo.register(
    "ushaqMashri",
    new sc.Scale([0,4,6,10,14,17,21], 24, "Ushaq Mashri")
);

// ### maqam rast
sc.ScaleInfo.register(
    "rast",
    new sc.Scale([0,4,7,10,14,18,21], 24, "Rast")
);

sc.ScaleInfo.register(
    "rastDesc",
    new sc.Scale([0,4,7,10,14,18,20], 24, "Rast Descending")
);

sc.ScaleInfo.register(
    "suznak",
    new sc.Scale([0,4,7,10,14,16,22], 24, "Suznak")
);

sc.ScaleInfo.register(
    "nairuz",
    new sc.Scale([0,4,7,10,14,17,20], 24, "Nairuz")
);

sc.ScaleInfo.register(
    "yakah",
    new sc.Scale([0,4,7,10,14,18,21], 24, "Yakah")
);

sc.ScaleInfo.register(
    "yakahDesc",
    new sc.Scale([0,4,7,10,14,18,20], 24, "Yakah Descending")
);

sc.ScaleInfo.register(
    "mahur",
    new sc.Scale([0,4,7,10,14,18,22], 24, "Mahur")
);

// ### maqam hijaz
sc.ScaleInfo.register(
    "hijaz",
    new sc.Scale([0,2,8,10,14,17,20], 24, "Hijaz")
);

sc.ScaleInfo.register(
    "hijazDesc",
    new sc.Scale([0,2,8,10,14,16,20], 24, "Hijaz Descending")
);

sc.ScaleInfo.register(
    "zanjaran",
    new sc.Scale([0,2,8,10,14,18,20], 24, "Zanjaran")
);

// ### maqam saba
sc.ScaleInfo.register(
	"saba",
    new sc.Scale([0,3,6,8,12,16,20], 24, "Saba")
);

sc.ScaleInfo.register(
    "zamzam",
    new sc.Scale([0,2,6,8,14,16,20], 24, "Zamzam")
);

// ### maqam kurd
sc.ScaleInfo.register(
    "kurd",
    new sc.Scale([0,2,6,10,14,16,20], 24, "Kurd")
);

sc.ScaleInfo.register(
    "kijazKarKurd",
    new sc.Scale([0,2,8,10,14,16,22], 24, "Kijaz Kar Kurd")
);

// ### maqam nawa Athar
sc.ScaleInfo.register(
    "nawaAthar",
    new sc.Scale([0,4,6,12,14,16,22], 24, "Nawa Athar")
);

sc.ScaleInfo.register(
    "nikriz",
    new sc.Scale([0,4,6,12,14,18,20], 24, "Nikriz")
);

sc.ScaleInfo.register(
    "atharKurd",
    new sc.Scale([0,2,6,12,14,16,22], 24, "Athar Kurd")
);

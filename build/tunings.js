// ### TWELVE-TONE TUNINGS
sc.TuningInfo.register(
    "pythagorean",
    new sc.Tuning(sc.ratiomidi([ 1, 256/243, 9/8, 32/27, 81/64, 4/3, 729/512, 3/2, 128/81, 27/16, 16/9, 243/128 ]), 2, "Pythagorean")
);

sc.TuningInfo.register(
    "sept1",
    new sc.Tuning(sc.ratiomidi([ 1, 16/15, 9/8, 6/5, 5/4, 4/3, 7/5, 3/2, 8/5, 5/3, 9/5, 15/8 ]), 2, "Septimal Tritone Just Intonation")
);

sc.TuningInfo.register(
    "sept2",
    new sc.Tuning(sc.ratiomidi([ 1, 16/15, 9/8, 6/5, 5/4, 4/3, 7/5, 3/2, 8/5, 5/3, 7/4, 15/8 ]), 2, "7-Limit Just Intonation")
);

sc.TuningInfo.register(
    "mean4",
    new sc.Tuning([ 0, 0.755, 1.93, 3.105, 3.86, 5.035, 5.79, 6.965, 7.72, 8.895, 10.07, 10.82 ], 2, "Meantone, 1/4 Syntonic Comma")
);

sc.TuningInfo.register(
    "mean5",
    new sc.Tuning([ 0, 0.804, 1.944, 3.084, 3.888, 5.028, 5.832, 6.972, 7.776, 8.916, 10.056, 10.86 ], 2, "Meantone, 1/5 Pythagorean Comma")
);

sc.TuningInfo.register(
    "mean6",
    new sc.Tuning([ 0, 0.86, 1.96, 3.06, 3.92, 5.02, 5.88, 6.98, 7.84, 8.94, 10.04, 10.9 ], 2, "Meantone, 1/6 Pythagorean Comma")
);

sc.TuningInfo.register(
    "kirnberger",
    new sc.Tuning(sc.ratiomidi([ 1, 256/243, Math.sqrt(5)/2, 32/27, 5/4, 4/3, 45/32, Math.pow(5, 0.25), 128/81, Math.pow(5, 0.75)/2, 16/9, 15/8 ]), 2, "Kirnberger III")
);

sc.TuningInfo.register(
    "werckmeister",
    new sc.Tuning([ 0, 0.92, 1.93, 2.94, 3.915, 4.98, 5.9, 6.965, 7.93, 8.895, 9.96, 10.935 ], 2, "Werckmeister III")
);

sc.TuningInfo.register(
    "vallotti",
    new sc.Tuning([ 0, 0.94135, 1.9609, 2.98045, 3.92180, 5.01955, 5.9218, 6.98045, 7.9609, 8.94135, 10, 10.90225 ], 2, "Vallotti")
);

sc.TuningInfo.register(
    "young",
    new sc.Tuning([ 0, 0.9, 1.96, 2.94, 3.92, 4.98, 5.88, 6.98, 7.92, 8.94, 9.96, 10.9 ], 2, "Young")
);

sc.TuningInfo.register(
    "reinhard",
    new sc.Tuning(sc.ratiomidi([ 1, 14/13, 13/12, 16/13, 13/10, 18/13, 13/9, 20/13, 13/8, 22/13, 13/7, 208/105 ]), 2, "Mayumi Reinhard")
);

sc.TuningInfo.register(
    "wcHarm",
    new sc.Tuning(sc.ratiomidi([ 1, 17/16, 9/8, 19/16, 5/4, 21/16, 11/8, 3/2, 13/8, 27/16, 7/4, 15/8 ]), 2, "Wendy Carlos Harmonic")
);

sc.TuningInfo.register(
    "wcSJ",
    new sc.Tuning(sc.ratiomidi([ 1, 17/16, 9/8, 6/5, 5/4, 4/3, 11/8, 3/2, 13/8, 5/3, 7/4, 15/8 ]), 2, "Wendy Carlos Super Just")
);

// ### MORE THAN TWELVE-TONE ET
sc.TuningInfo.register(
    "et19",
    new sc.Tuning((function() {
        for (var a = [], i = 0; i < 19; i++) a[i] = i * (12/19);
        return a;
    }()), 2, "ET19")
);

sc.TuningInfo.register(
    "et22",
    new sc.Tuning((function() {
            for (var a = [], i = 0; i < 22; i++) a[i] = i * (12/22);
            return a;
    }()), 2, "ET22")
);

sc.TuningInfo.register(
    "et24",
    new sc.Tuning((function() {
        for (var a = [], i = 0; i < 24; i++) a[i] = i * (12/24);
        return a;
    }()), 2, "ET24")
);

sc.TuningInfo.register(
    "et31",
    new sc.Tuning((function() {
            for (var a = [], i = 0; i < 31; i++) a[i] = i * (12/31);
            return a;
    }()), 2, "ET31")
);

sc.TuningInfo.register(
    "et41",
    new sc.Tuning((function() {
        for (var a = [], i = 0; i < 40; i++) a[i] = i * (12/41);
        return a;
    }()), 2, "ET41")
);

sc.TuningInfo.register(
    "et53",
    new sc.Tuning((function() {
        for (var a = [], i = 0; i < 53; i++) a[i] = i * (12/53);
        return a;
    }()), 2, "ET53")
);

// ### NON-TWELVE-TONE JI
sc.TuningInfo.register(
    "johnston",
    new sc.Tuning(sc.ratiomidi([ 1, 25/24, 135/128, 16/15, 10/9, 9/8, 75/64, 6/5, 5/4, 81/64, 32/25, 4/3, 27/20, 45/32, 36/25, 3/2, 25/16, 8/5, 5/3, 27/16, 225/128, 16/9, 9/5, 15/8, 48/25 ]), 2, "Ben Johnston")
);

sc.TuningInfo.register(
    "partch",
    new sc.Tuning(sc.ratiomidi([ 1, 81/80, 33/32, 21/20, 16/15, 12/11, 11/10, 10/9, 9/8, 8/7, 7/6, 32/27, 6/5, 11/9, 5/4, 14/11, 9/7, 21/16, 4/3, 27/20, 11/8, 7/5, 10/7, 16/11, 40/27, 3/2, 32/21, 14/9, 11/7, 8/5, 18/11, 5/3, 27/16, 12/7, 7/4, 16/9, 9/5, 20/11, 11/6, 15/8, 40/21, 64/33, 160/81 ]), 2, "Harry Partch")
);

sc.TuningInfo.register(
    "catler",
    new sc.Tuning(sc.ratiomidi([ 1, 33/32, 16/15, 9/8, 8/7, 7/6, 6/5, 128/105, 16/13, 5/4, 21/16, 4/3, 11/8, 45/32, 16/11, 3/2, 8/5, 13/8, 5/3, 27/16, 7/4, 16/9, 24/13, 15/8 ]), 2, "Jon Catler")
);

sc.TuningInfo.register(
    "chalmers",
    new sc.Tuning(sc.ratiomidi([ 1, 21/20, 16/15, 9/8, 7/6, 6/5, 5/4, 21/16, 4/3, 7/5, 35/24, 3/2, 63/40, 8/5, 5/3, 7/4, 9/5, 28/15, 63/32 ]), 2, "John Chalmers")
);

sc.TuningInfo.register(
    "harrison",
    new sc.Tuning(sc.ratiomidi([ 1, 16/15, 10/9, 8/7, 7/6, 6/5, 5/4, 4/3, 17/12, 3/2, 8/5, 5/3, 12/7, 7/4, 9/5, 15/8 ]), 2, "Lou Harrison")
);

sc.TuningInfo.register(
    "sruti",
    new sc.Tuning(sc.ratiomidi([ 1, 256/243, 16/15, 10/9, 9/8, 32/27, 6/5, 5/4, 81/64, 4/3, 27/20, 45/32, 729/512, 3/2, 128/81, 8/5, 5/3, 27/16, 16/9, 9/5, 15/8, 243/128 ]), 2, "Sruti")
);

// ### HARMONIC SERIES -- length arbitary
sc.TuningInfo.register(
    "harmonic",
    new sc.Tuning((function() {
        for (var a = [], i = 1; i <= 24; i++) a[i-1] = sc.ratiomidi(i);
        return a;
    }()), 2, "Harmonic Series 24")
);

// ### STRETCHED/SHRUNK OCTAVE
// ### Bohlen-Pierce
sc.TuningInfo.register(
    "bp",
    new sc.Tuning((function() {
        var k = sc.ratiomidi(3) / 13;
        for (var a = [], i = 0; i < 13; i++) a[i] = i * k;
        return a;
    }()), 3.0, "Bohlen-Pierce")
);

sc.TuningInfo.register(
    "wcAlpha",
    new sc.Tuning((function() {
        for (var a = [], i = 0; i < 15; i++) a[i] = i * 0.78;
        return a;
    }()), sc.midiratio(15 * 0.78), "Wendy Carlos Alpha")
);

sc.TuningInfo.register(
    "wcBeta",
    new sc.Tuning((function() {
        for (var a = [], i = 0; i < 19; i++) a[i] = i * 0.638;
        return a;
    }()), sc.midiratio(19 * 0.638), "Wendy Carlos Beta")
);

sc.TuningInfo.register(
    "wcGamma",
    new sc.Tuning((function() {
        for (var a = [], i = 0; i < 34; i++) a[i] = i * 0.351;
        return a;
    }()), sc.midiratio(34 * 0.351), "Wendy Carlos Gamma")
);

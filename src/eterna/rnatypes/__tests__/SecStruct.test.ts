import SecStruct from '../SecStruct'

test(`SecStruct:valid`, () => {
    const str = '..(((((.((....))..))))).(((..((((.(((((((((((....(((...(((((((...(((((((((((...))....)))).)).)))...)))...))))..)))...((((((((......................(((.......)))((((........)))).((((.((((........)))).))))(..((((..((((((..(..(((.......(((((((((.((.......))...))))))))))))....)))))))..))..))...)...(((((((....)))))))........(((((......)))))...((..(((((((((((((.(((((((..((.....))..))))))).))))))..).))))))))(((((((((.......)).)))))))................................((((((((((.....)))).))))))..((....))((((.((((((((((((.((((..(((((.(((((((....)))))))...)))))...)))).((((...........((((((........))))))......(((((((((((((((((.((((((.(((((((..................)))))))))))))(((((((......))).))))))).))))).))))))))).)))).....(((...)))...(((((((((((..((((..(((((((((..(((((....((((.((......))))))..)))))..))))))))).........((((((.((((((((((((((..........((((((......))))).(..((((((.((((.....))))))))).)....))...(((.(((((..(((.(((((((((....((.....))..).)))))))))))(...(((((...........)))))..)......((.((((....))))))((((((...((((((.(((((((((.((((...((....((((((.((((.....)))))))))).((((((..((.(.....((((((...((((..((((.((((((((((((((((((...)))))))))).)))).))))......)))))))).....((((((....)))).....)).((((.(((.((((.((((((((..(((((.(.((....))..).))))).)))))))..)))))))).)))).((((((.(.((((..(((((......)))))..)))))))))))...............))))))......).))..))))))))....)))).)))))))))...))))))..)))))).(((((((..)))))))((....((((((..(((((((((..((((((.....)))))).)))).((((....)))).(((((.(..))))))((((((.......))))).)..(((..........))))))))..)))))).(((((((.((((((((....))).))))).....)))))))))..((((.(((.(........).))).))))......))))).)))((.((((((.......)))))).))((((........))))((((((......((((.....)))).....))))))((.(......((((((((........(((((((((.............)))))))))...(((((((((........((((.(((...))).))))....................((((........)))))))))))))((....)).((.((((((...((((......))))...))))))......))................((((((((((((.......)))............((....((((((((((.....(((........))).....)))))))).)))).......)))))))))....(((((.((.(((((..)))))))))))).....((((((((......)))))))).....)))))))).......).))).))))))))))).((((((((..(((((((((....(((((.........(((((.(((((....((((((((......((((((............................)))))).(((((((((((...(((((..((((((.......))))))..))))).((((((.))))))))))))))))).))))))))((((((((....))))))))............((((..........((...(((...........))).))........))))((((.........))))))))))))))...............(..((((((((.........)))))))).)........(.(.(((((((((((...((((........(((((..(((((((.(((((((.....)))))))..))))))).))))).))))..(((.((((((.......))))))..)))))))))))))))..)...(((...(((((((((..((((.((..(((((.....))))).....).)))))..)))))))))........)))....((..(((((((((.....((((.((((((....)))))).)))).)))))))))))..............((((((((...))))))))....)))))...)))).))))))))))))).....((((((...))))))...........))))))))....))))....)))))))))))......))))))))))))))))...(((((..))))).......(((((((((((.(...........((((((.........))))))..(((.((((.((.(((....))).))......)))))))......)........)))))))))))..((((((.((((((((((...((((((..((((((((((.(((((((....))))))).......))))).))))).))))))((((((.(((((...((((...))))....))).)).))).))).((((((((((.((((((((.........(......)((((...((.((.((((((((......)).)))))).)).))))))(((((....)))))((((((((((((.(.(((....))).))))..))))..)).)))((..((((.(((((((((((((..........((((.((((((((.....))))))))))))....)))))))))......((((.(.....(((((((......((((........)))).((..(((((.(((....))))))))))(((((((.(((((((((....)))).))))).))))))).....))))))))))))(((((.......))))).)))).)))).))............((((((.(((((....))))))))))))))).))))))))))))))..))))))))))......(((((........(((.(.(((((...))))).).))).........)))))..((((((..(.((((((..)))))).)).)))))))))))((((((.....))))))..(((((.(((((..((((((((.((.(.((...(((((((.((((((((((...(((((((.((..((.....))..)))))))))....))))))))((....)))))))))))....))).)).)).)))))).)))..))((.....))...)))))......))..)))))).))))))))......)))..)))).)))..................';
    const pairs = SecStruct.fromParens(str, false);
    //console.log(pairs);
    for (let ii = 0; ii < str.length; ++ii) {
        if (str[ii] == '.') {
            expect(pairs.pairingPartner(ii)).toEqual(-1);
            expect(pairs.isPaired(ii)).toEqual(false);
        } else if (str[ii] == '(') {
            expect(pairs.pairingPartner(ii)).toBeGreaterThan(ii);
            expect(pairs.isPaired(ii)).toEqual(true);
        } else if (str[ii] == ')') {
            expect(pairs.pairingPartner(ii)).toBeLessThan(ii);
            expect(pairs.isPaired(ii)).toEqual(true);
        }
    }
});

test(`SecStruct:onlyPseudoknots`, () => {
    const str = '(((((...[[[)))))..]]]';
    const pairs = SecStruct.fromParens(str, true);
    expect(pairs.onlyPseudoknots().nonempty()).toEqual(true);
});

test(`SecStruct:setPairs (pseudoknotted)`, () => {
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const inputStrs = [
        '.........................',
        '((((((......))))))',
        '(((((({{{{......}}}}))))))',
        '((((((...{{{{...))))))}}}}',
        '((((((.[[[[..{{]]]]{{...))))))}}}}',
        '.(((((...{{{{...))))).}}}}....((((....))))',
        '((((((.[[..[[..{{.]]]]{.{...))))).)}}}.}',
        '((((((...{{[[{{...)))]])))}}}}',
        'aaaaaa......AAAAAA',
        'aaaaaabbbb......BBBBAAAAAA',
        'aaaaaa...bbbb...AAAAAABBBB',
        'aaaaaa.cccc..bbCCCCbb...AAAAAABBBB',
        '.aaaaa...bbbb...AAAAA.BBBB....aaaa....AAAA',
        'aaaaaa.cc..cc..bb.CCCCb.b...AAAAA.ABBB.B',
        'aaaaaa...bbccbb...AAACCAAABBBB',
        `([{<${alpha}....)]}>${alpha.toUpperCase()}`
    ];
    const outputStrs = [
      '.........................',
      '((((((......))))))',
      '((((((((((......))))))))))',
      '((((((...[[[[...))))))]]]]',
      '((((((.((((..[[))))[[...))))))]]]]',
      '.(((((...[[[[...))))).]]]]....((((....))))',
      '((((((.((..((..[[.))))[.[...))))).)]]].]',
      '((((((...[[[[{{...)))]])))}}]]',
      '((((((......))))))',
      '((((((((((......))))))))))',
      '((((((...[[[[...))))))]]]]',
      '((((((.((((..[[))))[[...))))))]]]]',
      '.(((((...[[[[...))))).]]]]....((((....))))',
      '((((((.((..((..[[.))))[.[...))))).)]]].]',
      '((((((...[[[[{{...)))]])))}}]]',
      '([{<abcdefghijklmnopqrstuvwxyz....)]}>ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    ];

    for (let i=0; i<inputStrs.length; i++) {
        const ss = new SecStruct();
        ss.setPairs(inputStrs[i], true);
        expect(ss.pairs).toMatchSnapshot(inputStrs[i]);
        const dbn = ss.getParenthesis({ pseudoknots: true });
        expect(dbn).toBe(outputStrs[i]);
        outputStrs.push(dbn);
    }
});

test(`SecStruct:getParenthesis (pseudoknotted)`, () => {
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const inputStrs = [
        '.........................',
        '((((((......))))))',
        '(((((({{{{......}}}}))))))',
        '((((((...{{{{...))))))}}}}',
        '((((((.[[[[..{{]]]]{{...))))))}}}}',
        '.(((((...{{{{...))))).}}}}....((((....))))',
        '((((((.[[..[[..{{.]]]]{.{...))))).)}}}.}',
        '((((((...{{[[{{...)))]])))}}}}',
        `([{<${alpha}....)]}>${alpha.toUpperCase()}`
    ];
    const outputStrs = [
        '.........................',
        '((((((......))))))',
        '((((((((((......))))))))))',
        '((((((...[[[[...))))))]]]]',
        '((((((.((((..[[))))[[...))))))]]]]',
        '.(((((...[[[[...))))).]]]]....((((....))))',
        '((((((.((..((..[[.))))[.[...))))).)]]].]',
        '((((((...[[[[{{...)))]])))}}]]',
        `([{<${alpha}....)]}>${alpha.toUpperCase()}`
    ];

    for (let i=0; i<inputStrs.length; i++) {
        const ss = SecStruct.fromParens(inputStrs[i], true);
        const dbn = ss.getParenthesis({ pseudoknots: true });
        expect(dbn).toBe(outputStrs[i]);
        expect(SecStruct.fromParens(dbn, true).pairs).toEqual(ss.pairs);
    }
});
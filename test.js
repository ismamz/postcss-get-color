import postcss from 'postcss';
import test    from 'ava';

import plugin from './';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.same(result.css, output);
            t.same(result.warnings().length, 0);
        });
}

function runWithWarn(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.same(result.css, output);
            t.same(result.warnings().length, 1);
        });
}

test('Always pass', t => {
    return run(t, 'a { }',
                  'a { }', { });
});

test('LightMuted twice', t => {
    return run(t, 'a { background: get-color("images/2.jpg", LightMuted); ' +
                  'color: get-color("images/white.jpg", LightMuted); }',
                  'a { background: #e1e1e1; color: #fcfcfc; }', { });
});

test('Vibrant by arg', t => {
    return run(t, 'a { background: get-color("images/girl.png", Vibrant); }',
                  'a { background: #e8ba3c; }', { });
});

var url = 'http://jariz.github.io/vibrant.js/examples/2.jpg';
test('Vibrant by Url', t => {
    return run(t, 'a { background: get-color("' + url + '", Vibrant); }',
                  'a { background: #b9911b; }', { });
});

test('Title color', t => {
    return run(t, 'a { background: get-color("images/2.jpg", Vibrant, title); }',
                  'a { background: #fff; }', { });
});

test('Body color with warning', t => {
    return runWithWarn(t, 'a { background: get-color("images/white.jpg", LightVibrant, body); }',
                  'a { background: #000; }', { });
});

test('Body color without warning', t => {
    return run(t, 'a { background: get-color("images/white.jpg", LightMuted, body); }',
                  'a { background: #000; }', { });
});

test('Vibrant by default', t => {
    return run(t, 'a { background: get-color("images/2.jpg"); }',
                  'a { background: #b9911b; }', { });
});

test('Works with single quotes', t => {
    return run(t, 'a { background: get-color(\'images/2.jpg\'); }',
                  'a { background: #b9911b; }', { });
});

test('White image take LighMuted by default', t => {
    return runWithWarn(t, 'a { background: get-color("images/white.jpg")' +
                       ' url(\'2.jpg\') no-repeat; }',
                  'a { background: #fcfcfc url(\'2.jpg\') no-repeat; }', { });
});

test('Multiple value', t => {
    return runWithWarn(t, 'a { background: get-color("images/white.jpg")' +
                       ' url(\'2.jpg\') no-repeat; }',
                  'a { background: #fcfcfc url(\'2.jpg\') no-repeat; }', { });
});


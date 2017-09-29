import postcss from 'postcss';
import test    from 'ava';
import fs      from 'fs';

import plugin from './';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

function runFile(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(fs.readFileSync(input), { from: input })
        .then( result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

function runWithWarn(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 1);
        });
}

test('Always pass', t => {
    return run(t, 'a { }',
                  'a { }', { });
});

test('LightMuted twice', t => {
    return run(t, 'a { background: get-color("test/car.jpg", LightMuted); ' +
                  'color: get-color("test/white.jpg", LightMuted); }',
                  'a { background: #e1e1e1; color: #fcfcfc; }', { });
});

test('Vibrant by arg', t => {
    return run(t, 'a { background: get-color("test/img/girl.png", Vibrant); }',
                  'a { background: #e8ba3c; }', { });
});

var url = 'http://jariz.github.io/vibrant.js/examples/2.jpg';
test('Vibrant by Url', t => {
    return run(t, 'a { background: get-color("' + url + '", Vibrant); }',
                  'a { background: #b9911b; }', { });
});

test('Title color', t => {
    return run(t, 'a { background: get-color("test/car.jpg", Vibrant, title); }',
                  'a { background: #fff; }', { });
});

test('Body color with warning', t => {
    return runWithWarn(t, 'a { background: get-color("test/white.jpg", LightVibrant, body); }',
                  'a { background: #000; }', { });
});

test('Body color without warning', t => {
    return run(t, 'a { background: get-color("test/white.jpg", LightMuted, body); }',
                  'a { background: #000; }', { });
});

test('Vibrant by default', t => {
    return run(t, 'a { background: get-color("test/car.jpg"); }',
                  'a { background: #b79022; }', { });
});

test('Works with single quotes', t => {
    return run(t, 'a { background: get-color(\'test/car.jpg\'); }',
                  'a { background: #b79022; }', { });
});

test('White image take LighMuted by default', t => {
    return runWithWarn(t, 'a { background: get-color("test/white.jpg")' +
                       ' url("car.jpg") no-repeat; }',
                  'a { background: #fcfcfc url("car.jpg") no-repeat; }', { });
});

test('Multiple value', t => {
    return runWithWarn(t, 'a { background: get-color("test/white.jpg")' +
                       ' url("car.jpg") no-repeat; }',
                  'a { background: #fcfcfc url("car.jpg") no-repeat; }', { });
});

test('Relative path in file', t => {
    return runFile(t, './test/css/sample.css',
                  '.bg { background: url("../img/girl.jpg") #e8ba3c; }\n', { });
});

test('Url in file', t => {
    return runFile(t, './test/css/url.css',
                  '.url { color: #b9911b; }\n', { });
});

test('Relative path for deep file', t => {
    return runFile(t, './test/css/deep/sample.css',
                  '.bg { background: url("../../img/girl.jpg") #e8ba3c; }\n', { });
});


var postcss = require('postcss');
var parser  = require('postcss-value-parser');
var vibrant = require('node-vibrant');

var colorNames = [
    'Vibrant',
    'Muted',
    'DarkVibrant',
    'DarkMuted',
    'LightVibrant',
    'LightMuted'
];

function getAvailable(palette) {
    var i = 0;
    var availableColors = [];
    while (i < colorNames.length) {
        if (palette[colorNames[i]] !== null) {
            availableColors.push({
                colorName: colorNames[i],
                colorValue: palette[colorNames[i]].getHex()
            });
        }
        i++;
    }
    return availableColors;
}

function formatColor(format, palette, name) {
    var color, colorRgb;
    switch (format) {
    case 'hex':
        color = palette[name].getHex();
        break;
    case 'rgb':
        colorRgb = palette[name].getRgb();
        color = 'rgb(' + colorRgb[0] + ', ' +
            colorRgb[1] + ', ' + colorRgb[2] + ')';
        break;
    case 'rgba':
        colorRgb = palette[name].getRgb();
        color = 'rgba(' + colorRgb[0] + ', ' +
            colorRgb[1] + ', ' + colorRgb[2] + ', 1)';
        break;
    default:
        color = palette[name].getHex();
        break;
    }
    return color;
}

function getTextColor(palette, name, text) {
    var color;
    switch (text) {
    case 'title':
        color = palette[name].getTitleTextColor();
        break;
    case 'body':
        color = palette[name].getBodyTextColor();
        break;
    default:
        return false;
    }
    return color;
}

function procDecl(image, name, decl, nodes, text, format, result) {
    return new Promise(function (resolve, reject) {
        vibrant.from(image).getPalette(function (err, palette) {
            var color;

            if (!err) {
                if (!(name in palette) || palette[name] !== null ) {

                    if (text === 'title' || text === 'body') {
                        color = getTextColor(palette, name, text);
                    } else {
                        color = formatColor(format, palette, name);
                    }

                } else {

                    var newName = getAvailable(palette)[0].colorName;

                    if (text === 'title' || text === 'body') {
                        color = getTextColor(palette, newName, text);
                    } else {
                        color = formatColor(format, palette, newName);
                    }

                    // Warning: color is not in the palette
                    decl.warn(
                        result, name + ' is not in the palette. We used ' +
                        getAvailable(palette)[0].colorName +
                         '.\nThese are the colors available:\n' +
                        JSON.stringify( getAvailable(palette) )
                    );
                }

                nodes.walk(function (node) {
                    if (node.type === 'function' &&
                        node.value === 'get-color') {
                        node.type = 'word';
                        node.value = color;
                        node.nodes = null;
                    }
                });

                decl.value = nodes.toString();
                resolve(color);
            } else {
                reject(err);
                throw decl.error('Problem with "' + image +
                                 '" file.', { plugin: 'postcss-get-color' });
            }
        });
    });
}

module.exports = postcss.plugin('postcss-get-color', function (opts) {
    return function (css, result) {
        opts = opts || {};

        var format = 'format' in opts ? opts.format : 'hex'; // rgb or rgba

        const promises = [];

        css.walkRules(function (rule) {
            rule.walkDecls(function (decl) {
                var value = decl.value;

                var name, image, text;

                var str = parser(value);
                str.walk(function (node) {
                    if (node.type === 'function' &&
                        node.value === 'get-color') {

                        // Get the image path
                        if (node.nodes[0].type === 'string') {
                            image = node.nodes[0].value;
                        } else {
                            throw decl.error('Missed quotes in first argument.');
                        }

                        // Check if has 2 args and get the nameColor
                        if (node.nodes.length > 2 &&
                            node.nodes[2].type === 'word') {
                            name = node.nodes[2].value;
                        } else {
                            name = 'Vibrant';
                        }

                        // Text Color as third arg
                        if (node.nodes.length === 5 &&
                            node.nodes[4].type === 'word') {

                            text = node.nodes[4].value;

                            if (text !== 'title' && text !== 'body') {
                                throw decl.error('Invalid text color ' + name);
                            }
                        } else {
                            text = false;
                        }

                        // Check if is a valid name color before process
                        if (colorNames.indexOf(name) > -1) {
                            promises.push(
                                procDecl(image, name, decl, str, text, format, result)
                            );
                        } else {
                            throw decl.error('Unknown name color: ' + name);
                        }

                    }
                });
            });
        });

        return Promise.all(promises).then(
            function () { // response
                console.log('PostCSS Get Color processed ' + promises.length + ' images.');
            },
            function (err) {
                throw err;
            }
        );

    };
});

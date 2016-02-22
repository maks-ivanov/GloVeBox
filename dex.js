var dex =
{
  'version' : "0.6"
};

dex.range = function(start, len)
{
	var i;
	var range = [];
	var end = start + len;

	for (i=start; i<end; i++)
	{
		range.push(i);
	}
	
	return range;
};
/**
 *
 * @module dex.config
 *
 * This module contains many support routines for configuring things.
 *
 */
dex.config = {};

/**
 * This routine will expand hiearchically delimited names such as
 * foo.bar into a structure { foo : { bar : value}}.  It will delete
 * the hierarchical name and overwrite the value into the proper
 * location leaving any previous object properties undisturbed.
 *
 * @param {Object} config The configuration which we will expand.
 *
 */
dex.config.expand = function (config) {
  var name,
    ci,
    expanded;

  // We have nothing, return nothing.
  if (!config) {
    return config;
  }

  // Make a clone of the previous configuration.
  expanded = dex.object.clone(config);

  // Iterate over the property names.
  for (name in config) {
    // If this is our property the process it, otherwise ignore.
    if (config.hasOwnProperty(name)) {
      // The property name is non-null.
      if (name) {
        // Determine character index.
        ci = name.indexOf('.');
      }
      else {
        // Default to -1
        ci = -1;
      }

      // if Character index is > -1, we have a hierarchical name.
      // Otherwise do nothing, copying was already handled in the
      // cloning activity.
      if (ci > -1) {
        // Set it...
        dex.object.setHierarchical(expanded, name,
          dex.object.clone(expanded[name]), '.');
        // Delete the old name.
        delete expanded[name];
      }
    }
  }

  //dex.console.log("CONFIG", config, "EXPANDED", expanded);
  return expanded;
};

/**
 *
 * This routine will take two hierarchies, top and bottom, and expand dot ('.')
 * delimited names such as: 'foo.bar.biz.baz' into a structure:
 * { 'foo' : { 'bar' : { 'biz' : 'baz' }}}
 * It will then overlay the top hierarchy onto the bottom one.  This is useful
 * for configuring objects based upon a default configuration while allowing
 * the client to conveniently override these defaults as needed.
 *
 * @param top The top object hierarchy.
 * @param bottom The bottom, base object hierarchy.
 * @returns {Object|*} A new object representing the expanded top object
 * hierarchy overlaid on top of the expanded bottom object hierarchy.
 *
 */
dex.config.expandAndOverlay = function (top, bottom) {
  return dex.object.overlay(dex.config.expand(top), dex.config.expand(bottom));
};

/**
 *
 * Return the configuration for a font given the defaults and user
 * customizations.
 *
 * @param custom The user customizations.
 * @returns {Object|*}
 */
dex.config.font = function (custom) {
  var defaults =
  {
    'family'        : 'sans-serif',
    'size'          : 18,
    'weight'        : 'normal',
    'style'         : 'normal',
    'decoration'    : 'none',
    'wordSpacing'   : 'normal',
    'letterSpacing' : 'normal',
    'variant'       : 'normal'
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

/**
 *
 * @param node The node to be configured.
 * @param config The configuration. (family, size, weight, style,
 * decoration, wordSpacing, letterSpacing, variant)
 * @returns {*} The newly configured node.
 *
 */
dex.config.configureFont = function (node, config) {
  dex.config.setAttr(node, 'font-family', config.family);
  dex.config.setAttr(node, 'font-size', config.size);
  dex.config.setAttr(node, 'font-weight', config.weight);
  dex.config.setAttr(node, 'font-style', config.style);
  dex.config.setAttr(node, 'text-decoration', config.decoration);

  dex.config.setAttr(node, 'word-spacing', config.wordSpacing);
  dex.config.setAttr(node, 'letter-spacing', config.letterSpacing);
  dex.config.setAttr(node, 'variant', config.variant);

  //dex.config.setStyle(node, 'stroke-width', config.width);
  return node;
};

/**
 *
 * @param custom An object containing the caller's customizations.  Valid
 * customizations include: font, x, y, textLength, lengthAdjust, transform,
 * glyphOrientationVertical, text, dx, dy, writingMode, textAnchor, fill.
 *
 * @returns {Object|*} A text node with certain base defaults as well
 * as the caller's customizations applied.
 *
 */
dex.config.text = function (custom) {
  var defaults =
  {
    'font'                     : dex.config.font(),
    'x'                        : 0,
    'y'                        : 0,
    'textLength'               : undefined,
    'lengthAdjust'             : undefined,
    'transform'                : '',
    'glyphOrientationVertical' : undefined,
    'text'                     : undefined,
    'dx'                       : 0,
    'dy'                       : 0,
    'writingMode'              : undefined,
    'textAnchor'               : 'start',
    'fill'                     : dex.config.fill(),
    'format'                   : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

/**
 *
 * This routine will dynamically configure an SVG text entity based upon the
 * supplied configuration.
 *
 * @param node The SVG text node to be configured.
 * @param config The configuration to be applied. (x, y, dx, dy, anchor,
 * font, textLength, lengthAdjust, transform, glyphOrientationVertical,
 * writingMode, text).
 *
 * @returns {*} The fully configured text node.
 */
dex.config.configureText = function (node, config) {
  dex.config.setAttr(node, "x", config.x);
  dex.config.setAttr(node, "y", config.y);
  dex.config.setAttr(node, "dx", config.dx);
  dex.config.setAttr(node, "dy", config.dy);
  dex.config.setStyle(node, "text-anchor", config.anchor);
  dex.config.configureFont(node, config.font);
  dex.config.setAttr(node, 'textLength', config.textLength);
  dex.config.setAttr(node, 'lengthAdjust', config.lengthAdjust);
  dex.config.setAttr(node, 'transform', config.transform);
  dex.config.setAttr(node, 'glyph-orientation-vertical',
    config.glyphOrientationVertical);
  dex.config.setAttr(node, 'writing-mode', config.writingMode);
  dex.config.callIfDefined(node, 'text', config.text);
  dex.config.configureFill(node, config.fill);

  return node;
};

/**
 *
 * Return the configuration for a stroke.
 *
 * @param custom User customization. (width, color, opacity, dasharray)
 * @returns The stroke configuration.
 *
 */
dex.config.stroke = function (custom) {
  var defaults =
  {
    'width'     : 1,
    'color'     : "black",
    'opacity'   : 1,
    'dasharray' : '',
    'transform' : ''
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

/**
 *
 * Apply a stroke configuration to a node.
 *
 * @param node The node to be configured.
 * @param config The stroke configuration (width, color, opacity,
 * dasharray).
 * @returns The newly configured node.
 */
dex.config.configureStroke = function (node, config) {
  dex.config.setStyle(node, 'stroke-width', config.width);
  dex.config.setStyle(node, 'stroke', config.color);
  dex.config.setStyle(node, 'stroke-opacity', config.opacity);
  dex.config.setStyle(node, 'stroke-dasharray', config.dasharray);
  dex.config.setAttr(node, 'transform', config.transform);

  return node;
};

dex.config.fill = function (custom) {
  var defaults =
  {
    'fillColor'   : "grey",
    'fillOpacity' : 1
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureFill = function (node, config) {
  //dex.console.log("configureFill", node, config);
  dex.config.setAttr(node, 'fill', config.fillColor);
  dex.config.setAttr(node, 'fill-opacity', config.fillOpacity)
    .style("fill-opacity", config.fillOpacity);
  return node;
};

dex.config.link = function (custom) {
  var defaults =
  {
    'fill'      : dex.config.fill(),
    'stroke'    : dex.config.stroke(),
    'transform' : '',
    'd'         : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureLink = function (node, config) {
  dex.config.configureStroke(node, config.stroke);
  dex.config.configureFill(node, config.fill);
  dex.config.setAttr(node, 'transform', config.transform);
  dex.config.setAttr(node, 'd', config.d);

  return node;
}

dex.config.rectangle = function (custom) {
  var config =
  {
    'width'     : 50,
    'height'    : 50,
    'x'         : 0,
    'y'         : 0,
    'rx'        : 0,
    'ry'        : 0,
    'stroke'    : dex.config.stroke(),
    'opacity'   : 1,
    'color'     : d3.scale.category20(),
    'transform' : ''
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.configureRectangle = function (node, config) {
  dex.config.setAttr(node, 'width', config.width);
  dex.config.setAttr(node, 'height', config.height);
  dex.config.setAttr(node, 'x', config.x);
  dex.config.setAttr(node, 'y', config.y);
  dex.config.setAttr(node, 'rx', config.rx);
  dex.config.setAttr(node, 'ry', config.ry);
  dex.config.setAttr(node, 'opacity', config.opacity);
  dex.config.setAttr(node, 'fill', config.color);
  dex.config.setAttr(node, 'transform', config.transform);

  return node.call(dex.config.configureStroke, config.stroke);
};

dex.config.line = function (custom) {
  var defaults =
  {
    'start'  : dex.config.point(),
    'end'    : dex.config.point(),
    'stroke' : dex.config.stroke()
  };
  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureLine = function (node, config) {

  dex.config.setAttr(node, 'x1', config.start.x);
  dex.config.setAttr(node, 'y1', config.start.y);
  dex.config.setAttr(node, 'x2', config.end.x);
  dex.config.setAttr(node, 'y2', config.end.y);
  dex.config.configureStroke(node, config.stroke);

  return node;
};

dex.config.setAttr = function (node, name, value) {
  if (typeof value != 'undefined') {
    //dex.console.log("Set Attr: '" + name + "'='" + value + "'");
    node.attr(name, dex.config.optionValue(value));
  }
  else {
    //dex.console.log("Undefined Attr: '" + name + "'='" + value + "'");
  }
  return node;
};

dex.config.setStyle = function (node, name, value) {
  if (typeof value !== 'undefined') {
    //dex.console.log("Set Style: '" + name + "'='" + dex.config.optionValue(value) + "'");
    node.style(name, dex.config.optionValue(value));
  }
  else {
    //dex.console.log("Undefined Style: '" + name + "'='" + value + "'");
  }
  return node;
};

dex.config.optionValue = function (option) {
  return function (d, i) {
    //dex.console.log("OPTION", option);
    if (dex.object.isFunction(option)) {
      return option(d, i);
    }
    else {
      return option;
    }
  };
};

dex.config.callIfDefined = function (node, fn, value) {
//dex.console.log("TYPE", typeof value);
  if (typeof value === 'undefined') {
    //dex.console.log("Skipping: " + fn + "()");
  }
  else {
    //dex.console.log("Calling: '" + fn + "(" + value + ")");
    return node[fn](dex.config.optionValue(value));
  }

  return node;
};

dex.config.point = function (custom) {
  var config =
  {
    'x' : undefined,
    'y' : undefined
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.configurePoint = function (node, config) {
  return node
    .attr('x', config.center.cx)
    .attr('y', config.center.cy);
};

// Configures: opacity, color, stroke.
dex.config.configureShapeStyle = function (node, config) {
  return node
    .call(dex.config.configureStroke, config.stroke)
    .attr('opacity', config.opacity)
    .style('fill', config.color);
};

dex.config.circle = function (custom) {
  var config =
  {
    'cx'        : 0,
    'cy'        : 0,
    'r'         : 10,
    'fill'      : dex.config.fill(),
    'stroke'    : dex.config.stroke(),
    'transform' : '',
    'title'     : ''
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.configureCircle = function (node, config) {
  dex.config.setAttr(node, "r", config.r);
  dex.config.setAttr(node, "cx", config.cx);
  dex.config.setAttr(node, "cy", config.cy);
  dex.config.setAttr(node, "transform", config.transform);
  dex.config.setAttr(node, "title", config.title);
  node.call(dex.config.configureStroke, config.stroke);
  node.call(dex.config.configureFill, config.fill);

  return node;
};

dex.config.configureAxis_deprecate = function (config) {
  var axis = d3.svg.axis()
    .ticks(config.tick.count)
    .tickSubdivide(config.tick.subdivide)
    .tickSize(config.tick.size.major, config.tick.size.minor,
      config.tick.size.end)
    .tickPadding(config.tick.padding);

  // REM: Horrible way of doing this.  Need a function which
  // is more generic and smarter to short circuit stuff like
  // this.  But...for now it does what I want.
  if (!dex.object.isFunction(config.tick.format)) {
    axis.tickFormat(config.tick.format);
  }

  axis
    .orient(config.orient)
    .scale(config.scale);

  //axis.scale = config.scale;
  return axis;
};

dex.config.tick_deprecate = function (custom) {
  var config =
  {
    'count'     : 5,
    //'tickValues'  : undefined,
    'subdivide' : 3,
    'size'      : {
      'major' : 5,
      'minor' : 3,
      'end'   : 5
    },
    'padding'   : 5,
    'format'    : d3.format(",d"),
    'label'     : dex.config.text()
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.xaxis_deprecate = function (custom) {
  var config =
  {
    'scale'  : d3.scale.linear(),
    'orient' : "bottom",
    'tick'   : this.tick(),
    'label'  : dex.config.text()
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.yaxis_deprecate = function (custom) {
  var config =
  {
    'scale'  : d3.scale.linear(),
    'orient' : 'left',
    'tick'   : this.tick(),
    'label'  : dex.config.text({'transform' : 'rotate(-90)'})
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.callConditionally = function (fn, value) {
  if (typeof value !== 'undefined') {
    //dex.console.log("- FN:" + fn);
    //dex.console.log("- VALUE:" + value);
    //dex.console.log("- CALLING...");
    fn(value);
  }
  else {
//    dex.console.log("- FN:" + fn);
//    dex.console.log("- VALUE:" + value);
//    dex.console.log("- NOT CALLING...");
  }
}

dex.config.axis = function (custom) {
  var defaults =
  {
    'scale'         : undefined,
    'orient'        : 'bottom',
    'ticks'         : undefined,
    'tickValues'    : undefined,
    'tickSize'      : undefined,
    'innerTickSize' : undefined,
    'outerTickSize' : undefined,
    'tickPadding'   : undefined,
    'tickFormat'    : undefined,
    'tickSubdivide' : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureAxis = function (axis, config) {
  [
    'scale',
    'orient',
    'ticks',
    'tickValues',
    'tickSize',
    'innerTickSize',
    'outerTickSize',
    'tickPadding',
    'tickFormat',
    'tickSubdivide'
  ].forEach(function (fn) {
      //dex.console.log("Calling: " + fn);
      dex.config.callConditionally(axis[fn], config[fn]);
    });

  return axis;
};

dex.config.scale = function (custom) {
  var fmap =
  {
    'linear'   : dex.config.linearScale,
    'sqrt'     : dex.config.sqrtScale,
    'pow'      : dex.config.powScale,
    'time'     : dex.config.timeScale,
    'log'      : dex.config.logScale,
    'ordinal'  : dex.config.ordinalScale,
    'quantile' : dex.config.quantileScale,
    'quantize' : dex.config.quantizeScale,
    'identity' : dex.config.identityScale,
    'ordinal'  : dex.config.ordinalScale
  };

  var defaults =
  {
    'type' : 'linear'
  };

  var config = dex.config.expandAndOverlay(custom, defaults);

  return fmap[config.type](config);
}

dex.config.createScale = function (config) {
  var scale;
  var fmap =
  {
    'linear'   : d3.scale.linear,
    'sqrt'     : d3.scale.sqrt,
    'pow'      : d3.scale.pow,
    'time'     : d3.time.scale,
    'log'      : d3.scale.log,
    'ordinal'  : d3.scale.ordinal,
    'quantile' : d3.scale.quantile,
    'quantize' : d3.scale.quantize,
    'identity' : d3.scale.identity,
    'ordinal'  : d3.scale.ordinal
  };

  scale = fmap[config.type]();

  dex.config.configureScale(scale, config);
  return scale;
}

dex.config.linearScale = function (custom) {
  var defaults =
  {
    'type'        : 'linear',
    'domain'      : [0, 100],
    'range'       : [0, 800],
    'rangeRound'  : undefined,
    'interpolate' : undefined,
    'clamp'       : undefined,
    'nice'        : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.powScale = function (custom) {
  var defaults =
  {
    'type'        : 'pow',
    'domain'      : [0, 100],
    'range'       : [0, 800],
    'rangeRound'  : undefined,
    'interpolate' : undefined,
    'clamp'       : undefined,
    'nice'        : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.sqrtScale = function (custom) {
  var defaults =
  {
    'type'        : 'sqrt',
    'domain'      : [0, 100],
    'range'       : [0, 800],
    'rangeRound'  : undefined,
    'interpolate' : undefined,
    'clamp'       : undefined,
    'nice'        : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.logScale = function (custom) {
  var defaults =
  {
    'type'        : 'log',
    'domain'      : [0, 100],
    'range'       : [0, 800],
    'rangeRound'  : undefined,
    'interpolate' : undefined,
    'clamp'       : undefined,
    'nice'        : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.ordinalScale = function (custom) {
  var defaults =
  {
    'type'            : 'ordinal',
    'domain'          : undefined,
    'range'           : undefined,
    'rangeRoundBands' : undefined,
    'rangePoints'     : undefined,
    'rangeBands'      : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.timeScale = function (custom) {
  var defaults =
  {
    'type'        : 'time',
    'domain'      : undefined,
    'range'       : undefined,
    'rangeRound'  : undefined,
    'interpolate' : undefined,
    'clamp'       : undefined,
    'ticks'       : undefined,
    'tickFormat'  : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.quantileScale = function (custom) {
  var defaults =
  {
    'type'   : 'quantile',
    'domain' : undefined,
    'range'  : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.quantizeScale = function (custom) {
  var defaults =
  {
    'type'   : 'quantize',
    'domain' : undefined,
    'range'  : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.identityScale = function (custom) {
  var defaults =
  {
    'type'   : 'identity',
    'domain' : undefined,
    'range'  : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.thresholdScale = function (custom) {
  var defaults =
  {
    'type'   : 'threshold',
    'domain' : undefined,
    'range'  : undefined
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureScale = function (scale, config) {
  for (var property in config) {
    if (config.hasOwnProperty(property) && property !== 'type') {
      //dex.console.log("Property: '" + property + "'");
      dex.config.callConditionally(scale[property], config[property]);
    }
  }

  return scale;
};dex.array = {};

/**
 *
 *  @module dex.array
 * 
 * This module provides routines for dealing with arrays.
 *  
 */

/**
 * 
 * Take a slice of an array.
 * 
 * @method dex.array.slice
 * @param (array) array
 * @param (array) rowRange
 * @param (integer) optLen
 * 
 */
dex.array.slice = function(array, rowRange, optLen)
{
	var slice = [];
  var range;
  var i;
  
  // Numeric.
  // Array.
  // Object.  Numeric with start and end.
  if (arguments.length < 2)
  {
  	return array;
  }
  else if (arguments.length == 2)
  {
  	if (Array.isArray(rowRange))
  	{
  		range = rowRange;
  	}
  	else
  	{
  		range = dex.range(rowRange, array.length - rowRange);
  	}
  }
  else if (arguments.length > 2)
  {
    if (Array.isArray(rowRange))
    {
  	  range = rowRange;
    }
    else
    {
  	  range = dex.range(rowRange, optLen);
    }
  }

	for (i = 0; i<range.length; i++)
	{
		slice.push(dex.object.clone(array[range[i]]));
	}

	return slice;
};

dex.array.indexOfById = function(array, id)
{
  var i;

  for (i = 0; i < array.length; i+=1)
  {
    if (array[i].id === id)
    {
      return i;
    }
  }
  
  return -1;
};


dex.array.indexBands = function(data, numValues)
{
  dex.console.log("BANDS");
  var interval, residual, tickIndices, last, i;

  if (numValues <= 0)
  {
    tickIndices = [];
  }
  else if (numValues == 1)
  {
    tickIndices = [ Math.floor(numValues/2) ];
  }
  else if (numValues == 2)
  {
    tickIndices = [ 0, data.length-1 ];
  }
  else
  {
    // We have at least 2 ticks to display.
    // Calculate the rough interval between ticks.
    interval = Math.max(1, Math.floor(data.length / (numValues-1)));
    
    // If it's not perfect, record it in the residual.
    residual = Math.floor(data.length % (numValues-1));

    // Always label our first datapoint.
    tickIndices = [0];

    // Set stop point on the interior ticks.
    last = data.length-interval;

    dex.console.log("TEST", data, numValues, interval, residual, last);

    // Figure out the interior ticks, gently drift to accommodate
    // the residual.
    for (i=interval; i<=last; i+=interval)
    {
      if (residual > 0)
      {
        i += 1;
        residual -= 1;
      }
      tickIndices.push(i);
    }
    // Always graph the last tick.
    tickIndices.push(data.length-1);
  }
  dex.console.log("BANDS");
  return tickIndices;
};

dex.array.unique = function(array)
{
  var uniqueMap =
  {
  };
  var unique = [];
  var i, l;
  
  for (i = 0, l = array.length; i < l; i+=1)
  {
    if (uniqueMap.hasOwnProperty(array[i]))
    {
      continue;
    }
    unique.push(array[i]);
    uniqueMap[array[i]] = 1;
  }
  return unique;
};


dex.array.extent = function(array, indices)
{
	var values = getArrayValues(array, indices);
	var max = Math.max.apply(null, values);
	var min = Math.min.apply(null, values);
	console.log("EXTENT:");
	console.dir(values);
	console.dir([min, max]);
	return [ min, max ];
};

dex.array.difference = function(a1, a2)
{
	var i, j;
  var a = [], diff = [];
  for (i = 0; i < a1.length; i++)
  {
  	a[a1[i]] = true;
  }
  for (i = 0; i < a2.length; i++)
  {
    if (a[a2[i]])
    {
      delete a[a2[i]];
    }
    else
    {
    	a[a2[i]] = true;
    }
  }
  for (j in a)
  {
    diff.push(j);
  }
  return diff;

};

dex.array.selectiveJoin = function(array, rows, delimiter)
{
	var delim = ':::';
	var key = "";
	if (arguments.length >= 3)
  {
  	delim = delimiter;
  }
  else if (arguments.length === 2)
  {
    return dex.array.slice(array, rows).join(delimiter);
  }
  throw "Invalid arguments.";
};
dex.color = {};

dex.color.toHex = function (color) {
  if (color.substr(0, 1) === '#') {
    return color;
  }
  //console.log("COLOR: " + color)
  var digits = /rgb\((\d+),(\d+),(\d+)\)/.exec(color);
  //console.log("DIGITS: " + digits);
  var red = parseInt(digits[1]);
  var green = parseInt(digits[2]);
  var blue = parseInt(digits[3]);

  var rgb = blue | (green << 8) | (red << 16);
  return '#' + rgb.toString(16);
};

dex.color.colorScheme = function (colorScheme, numColors) {
  if (colorScheme == "1") {
    return d3.scale.category10();
  }
  else if (colorScheme == "2") {
    return d3.scale.category20();
  }
  else if (colorScheme == "3") {
    return d3.scale.category20b();
  }
  else if (colorScheme == "4") {
    return d3.scale.category20c();
  }
  else if (colorScheme == "HiContrast") {
    return d3.scale.ordinal().range(colorbrewer[colorScheme][9]);
  }
  else if (colorScheme in colorbrewer) {
    //console.log("LENGTH: " + len);
    var c;
    var effColors = Math.pow(2, Math.ceil(Math.log(numColors) / Math.log(2)));
    //console.log("EFF LENGTH: " + len);

    // Find the best cmap:
    if (effColors > 128) {
      effColors = 256;
    }

    for (c = effColors; c >= 2; c--) {
      if (colorbrewer[colorScheme][c]) {
        return d3.scale.ordinal().range(colorbrewer[colorScheme][c]);
      }
    }
    for (c = effColors; c <= 256; c++) {
      if (colorbrewer[colorScheme][c]) {
        return d3.scale.ordinal().range(colorbrewer[colorScheme][c]);
      }
    }
    return d3.scale.category20();
  }
  else {
    return d3.scale.category20();
  }
};

dex.color.shadeColor = function (color, percent) {
  var R = parseInt(color.substring(1, 3), 16)
  var G = parseInt(color.substring(3, 5), 16)
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
  var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
  var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
};

dex.color.gradient = function (baseColor) {
  if (baseColor.charAt(0) == 'r') {
    baseColor = colorToHex(baseColor);
  }
  var gradientId;
  gradientId = "gradient" + baseColor.substring(1)
  console.log("GradientId: " + gradientId);
  console.log("BaseColor : " + baseColor);

  //var lightColor = shadeColor(baseColor, -10)
  var darkColor = shadeColor(baseColor, -20)

  var grad = d3.select("#gradients").selectAll("#" + gradientId)
    .data([ gradientId ])
    .enter()
    .append("radialGradient")
    .attr("class", "colorGradient")
    .attr("id", gradientId)
    .attr("gradientUnits", "objectBoundingBox")
    .attr("fx", "30%")
    .attr("fy", "30%")

  grad.append("stop")
    .attr("offset", "0%")
    .attr("style", "stop-color:#FFFFFF")

  // Middle
  grad.append("stop")
    .attr("offset", "40%")
    .attr("style", "stop-color:" + baseColor)

  // Outer Edges
  grad.append("stop")
    .attr("offset", "100%")
    .attr("style", "stop-color:" + darkColor)

  return "url(#" + gradientId + ")";
};
dex.console = {};

var logLevels = {
  'TRACE'  : 5,
  'DEBUG'  : 4,
  'NORMAL' : 3,
  'WARN'   : 2,
  'FATAL'  : 1,
  'NONE'   : 0
};

var logLevel = logLevels.NORMAL;

////
//
// dex.console : This module provides routines assisting with console output.
//
////

dex.console.logWithLevel = function (msgLevel, msg) {
//  console.log(dex.console.logLevel());
//  console.log(msgLevel);
//  console.dir(msg);
  if (dex.console.logLevel() >= msgLevel) {
    for (i = 0; i < msg.length; i++) {
      if (typeof msg[i] == 'object') {
        console.dir(msg[i]);
      }
      else {
        console.log(msg[i]);
      }
    }
  }
  return this;
}

dex.console.trace = function () {
  return dex.console.logWithLevel(logLevels.TRACE, arguments)
};

dex.console.debug = function () {
  return dex.console.logWithLevel(logLevels.DEBUG, arguments)
};

dex.console.log = function () {
  return dex.console.logWithLevel(logLevels.NORMAL, arguments)
};

dex.console.warn = function () {
  return dex.console.logWithLevel(logLevels.WARN, arguments)
};

dex.console.fatal = function () {
  return dex.console.logWithLevel(logLevels.FATAL, arguments)
};

dex.console.logLevel = function (_) {
  if (!arguments.length) return logLevel;
  logLevel = logLevels[_];
  return logLevel;
};dex.csv =
{
};

dex.csv.csv = function(header, data)
{
  var csv =
  {
    "header" : header,
    "data" : data
  };

  return csv;
};

/**
 *
 * Given a CSV, create a connection matrix suitable for feeding into a chord
 * diagram.  Ex, given CSV:
 * 
 */
dex.csv.getConnectionMatrix = function(csv)
{
	var matrix = [];
	var ri, ci;
	var row;
  var cid;
  var header = [];
  var nameToIndex = {};
  var connectionMatrix;
  var uniques;
  var nameIndices = [];
  var src, dest;

  // Create a list of unique values to relate to one another.
  uniques = dex.matrix.uniques(csv.data);
  // Flatten them into our header.
  header = dex.matrix.flatten(uniques);
  
  // Create a map of names to header index for each column.
  nameToIndex = new Array(uniques.length);
  for ( ri = 0, cid = 0; ri < uniques.length; ri++)
  {
    nameToIndex[ri] =
    {
    };
    for ( ci = 0; ci < uniques[ri].length; ci++)
    {
      nameToIndex[ri][header[cid]] = cid;
      cid += 1;
    }
  }

  // Create a N x N matrix of zero values.
  matrix = new Array(header.length);
  for ( ri = 0; ri < header.length; ri++)
  {
    row = new Array(header.length);
    for ( ci = 0; ci < header.length; ci++)
    {
      row[ci] = 0;
    }
    matrix[ri] = row;
  }
  //dex.console.log("nameToIndex", nameToIndex, "matrix", matrix);

  for ( ri = 0; ri < csv.data.length; ri++)
  {
    for ( ci = 1; ci < csv.header.length; ci++)
    {
      src = nameToIndex[ci-1][csv.data[ri][ci - 1]];
      dest = nameToIndex[ci][csv.data[ri][ci]];

      //dex.console.log(csv.data[ri][ci-1] + "<->" + csv.data[ri][ci], src + "<->" + dest);
      matrix[src][dest] = 1;
      matrix[dest][src] = 1;
    }
  }


	connectionMatrix = { "header" : header, "connections" : matrix };
  //dex.console.log("Connection Matrix", connectionMatrix);
	return connectionMatrix;
};

dex.csv.createMap = function(csv, keyIndex)
{
  var ri, ci, rowMap, map =
  {
  };

  for ( ri = 0; ri < csv.data.length; ri += 1)
  {
    if (csv.data[ri].length === csv.header.length)
    {
      rowMap =
      {
      };

      for ( ci = 0; ci < csv.header.length; ci += 1)
      {
        rowMap[csv.header[ci]] = csv.data[ri][ci];
      }
      map[csv.data[ri][keyIndex]] = rowMap;
    }
  }
  return map;
};

dex.csv.toJson = function(csv, rowIndex, columnIndex)
{
  var jsonData = [];
  var ri, ci, jsonRow;

  if (arguments.length >= 3)
  {
    jsonRow = {};
    jsonRow[csv.header[columnIndex]] = csv.data[rowIndex][columnIndex];
    return jsonRow;
  }
  else if (arguments.length === 2)
  {
    var jsonRow =
    {
    };
    for ( ci = 0; ci < csv.header.length; ci+=1)
    {
      jsonRow[csv.header[ci]] = csv.data[rowIndex][ci];
    }
    return jsonRow;
  }
  else if (arguments.length === 1)
  {
    for ( ri = 0; ri < csv.data.length; ri++)
    {
      var jsonRow =
      {
      };
      for ( ci = 0; ci < csv.header.length; ci++)
      {
        jsonRow[csv.header[ci]] = csv.data[ri][ci];
        //dex.console.log(csv.header[ci] + "=" + csv.data[ri][ci], jsonRow);
      }
      jsonData.push(jsonRow);
    }
  }
  return jsonData;
};

/**
 * Transforms:
 * csv =
 * {
 * 	 header : {C1,C2,C3},
 *   data   : [
 *     [A,B,C],
 *     [A,B,D]
 *   ]
 * }
 * into:
 * json =
 * {
 * 	"name"     : rootName,
 *  "category" : category,
 *  "children" :
 *  [
 *    "children" :
 *     [
 *       {
 *         "name"     : "A",
 *         "category" : "C1",
 *         "children" :
 *         [
 *           {
 * 	           "name" : "B",
 *             "category" : "C2",
 *             "children" :
 *             [
 *               {
 *                 "name"     : "C",
 *                 "category" : "C3",
 *                 "size"     : 1
 *               }
 *               {
 *                 "name"     : "D",
 *                 "category" : "C3",
 *                 "size"     : 1
 *               }
 *             ]
 *           }
 *         ]
 *       }
 *     ]
 *  ]
 * }
 *
 * @param {Object} csv
 */
dex.csv.toHierarchicalJson = function(csv)
{
  var connections = dex.csv.connections(csv);
  return getChildren(connections, 0);

  function getChildren(connections, depth)
  {
    //dex.console.log("connections:", connections, "depth="+depth);
    var kids = [], cname;

    if ( typeof connections === 'undefined')
    {
      return kids;
    }

    for (cname in connections)
    {
      //dex.console.log("CNAME", cname);
      if (connections.hasOwnProperty(cname))
      {
        kids.push(createChild(cname, csv.header[depth],
        	getChildren(connections[cname], depth + 1)));
      }
    }

    return kids;
  }
  
  function createChild(name, category, children)
  {
    var child =
    {
      "name" : name,
      "category" : category,
      "children" : children
    };
    return child;
  }

};

/**
 *
 * Transforms:
 * csv =
 * {
 * 	 header : {C1,C2,C3},
 *   data   : [
 *     [A,B,C],
 *     [A,B,D]
 *   ]
 * }
 * into:
 * connections =
 * { A:{B:{C:{},D:{}}}}
 *
 * @param {Object} csv
 *
 */
dex.csv.connections = function(csv)
{
  var connections =
  {
  };
  var ri;

  for ( ri = 0; ri < csv.data.length; ri++)
  {
    dex.object.connect(connections, csv.data[ri]);
  }

  //dex.console.log("connections:", connections);
  return connections;
};

dex.csv.createRowMap = function(csv, keyIndex)
{
  var map =
  {
  };
  var ri;

  for ( ri = 0; ri < csv.data.length; ri++)
  {
    if (csv.data[ri].length == csv.header.length)
    {
      map[csv.data[ri][keyIndex]] = csv.data[ri];
    }
  }
  return map;
};

dex.csv.columnSlice = function(csv, columns)
{
	csv.header = dex.array.slice(columns);
	csv.data   = dex.matrix.columnSlice(csv.data, columns);

	return csv;
};

dex.csv.getNumericColumnNames = function(csv)
{
  var possibleNumeric =
  {
  };
  var i, j, ri, ci;
  var numericColumns = [];

  for ( i = 0; i < csv.header.length; i++)
  {
    possibleNumeric[csv.header[i]] = true;
  }

  // Iterate thru the data, skip the header.
  for ( ri = 0; ri < csv.data.length; ri++)
  {
    for ( ci = 0; ci < csv.data[ri].length && ci < csv.header.length; ci++)
    {
      if (possibleNumeric[csv.header[ci]] && !dex.object.isNumeric(csv.data[ri][ci]))
      {
        possibleNumeric[csv.header[ci]] = false;
      }
    }
  }

  for ( ci = 0; ci < csv.header.length; ci++)
  {
    if (possibleNumeric[csv.header[ci]])
    {
      numericColumns.push(csv.header[ci]);
    }
  }

  return numericColumns;
};

dex.csv.getNumericIndices = function(csv)
{
  var possibleNumeric =
  {
  };
  var i, j;
  var numericIndices = [];

  for ( i = 0; i < csv.header.length; i++)
  {
    possibleNumeric[csv.header[i]] = true;
  }

  // Iterate thru the data, skip the header.
  for ( i = 1; i < csv.data.length; i++)
  {
    for ( j = 0; j < csv.data[i].length && j < csv.header.length; j++)
    {
      if (possibleNumeric[csv.header[j]] && !dex.object.isNumeric(csv.data[i][j]))
      {
        possibleNumeric[csv.header[j]] = false;
      }
    }
  }

  for ( i = 0; i < csv.header.length; i++)
  {
    if (possibleNumeric[csv.header[i]])
    {
      numericIndices.push(i);
    }
  }

  return numericIndices;
};

dex.csv.isColumnNumeric = function(csv, columnNum)
{
  var i;

  for ( i = 0; i < csv.data.length; i++)
  {
    if (!dex.object.isNumeric(csv.data[i][columnNum]))
    {
      return false;
    }
  }
  return true;
};

// Used to be toMapArray
dex.csv.group = function(csv, columns)
{
	var ri, ci;
	var groups = {};
	var returnGroups = [];
  var values;
  var key;
  var otherColumns;
  var otherHeaders;
  var groupName;
  
  if (arguments < 2)
  {
  	return csv;
  }

  function compare(a,b)
  {
  	var si, h;
  	
  	for (si=0; si<columns.length; si++)
  	{
  		h = csv.header[columns[si]]
  		if (a[h] < b[h])
  		{
  			return -1;
  		}
  		else if (a[h] > b[h])
  		{
  			return 1
  		}
  	}
  	
  	return 0;
  }

  //otherColumns = dex.array.difference(dex.range(0, csv.header.length), columns);
  //otherHeaders = dex.array.slice(csv.header, otherColumns);

	for (ri=0; ri<csv.data.length;ri+=1)
	{
		values = dex.array.slice(csv.data[ri], columns);
		key = values.join(':::');

		if (groups[key])
		{
			group = groups[key];
		}
		else
		{
			//group = { 'csv' : dex.csv.csv(otherHeaders, []) };
			group =
			{
			  'key'    : key,
			  'values' : [],
			  'csv'    : dex.csv.csv(csv.header, [])
			};
			for (ci=0; ci<values.length; ci++)
			{
				group.values.push({ 'name' : csv.header[columns[ci]], 'value' : values[ci]});
			}
			groups[key] = group;
		}
		//group.csv.data.push(dex.array.slice(csv.data[ri], otherColumns));
		group.csv.data.push(csv.data[ri]);
    //groups[key] = group;
	}

  for (groupName in groups)
  {
  	if (groups.hasOwnProperty(groupName))
  	{
  		returnGroups.push(groups[groupName]);
  	}
  }
  
  return returnGroups.sort(compare);
};

dex.csv.visitCells = function(csv, func)
{
	var ci, ri;

	for (ri=0; ri<csv.data.length; ri++)
	{
		for (ci=0; ci<csv.header.length; ci++)
		{
			func(ci, ri, csv.data[ri][ci]);
		}
	}
};
dex.datagen = {};

/**
 *
 * @param spec The specification for this matrix.
 * @returns {Array}
 */
dex.datagen.randomMatrix = function(spec)
{
	var ri, ci;
	
  //{"rows":10, "columns": 4, "min", 0, "max":100})
  var matrix = [];
  var range = spec.max - spec.min;
  for (ri = 0; ri<spec.rows; ri++)
  {
  	var row = [];

  	for (ci=0; ci<spec.columns;ci++)
  	{
      row.push(Math.random() * range + spec.min);
  	}
  	matrix.push(row);
  }
  
  return matrix;
};
dex.json = {};

////
//
// dex.json : This module provides routines dealing with json data.
//
////

/**
 * 
 * Take a slice of an array.
 * 
 * @method dex.array.slice
 * @param
 */
dex.json.toCsv = function(json, header)
{
	var csv;
	var ri, ci;
  var data = [];

	// Keys are provided.
	if (arguments.length == 2)
	{
    if (Array.isArray(json))
	  {
      for ( ri = 0; ri < json.length; ri++)
      {
        var row = [];
        for ( ci = 0; ci < header.length; ci++)
        {
          row.push(json[ri][header[ci]]);
        }
        data.push(row);
      }
	  }
    else
    {
      var row = [];
      for ( ci = 0; ci < header.length; ci++)
      {
        row.push(json[ri][header[ci]]);
      }
      data.push(row);
    }
	  return dex.csv.csv(header, data);
	}
	else
	{
		return dex.json.toCsv(json, dex.json.keys(json));
	}
};

dex.json.keys = function(json)
{
	var keyMap = {};
	var keys = [];
  var ri, key;
  
	if (Array.isArray(json))
	{
		for (ri=0; ri<json.length; ri++)
		{
			for (key in json[ri])
			{
				keyMap[key] = true;
			}
		}
	}
	else
	{
		for (key in json)
		{
			keyMap[key] = true;
		}
	}
	
  for (key in keyMap)
  {
  	keys.push(key);
  }
  
  return keys;
};
dex.matrix = {};

dex.matrix.slice = function(matrix, columns, rows)
{
	var slice = [];
	var ri;
	
	if (arguments.length === 3)
	{
    for (ri=0; ri < rows.length; ri++)
	  {
		  slice.push(dex.array.slice(matrix[rows[ri]]));
	  }
	}
	else
	{
		for (ri=0; ri < matrix.length; ri++)
	  {
	  	//console.log("RI: " + ri);
	  	//console.dir(dex.array.slice(matrix[ri], columns));
		  slice.push(dex.array.slice(matrix[ri], columns));
	  }
	}
	return slice;
};

dex.matrix.uniques = function(matrix)
{
	var ci;
	var uniques = [];
  var tmatrix = dex.matrix.transpose(matrix);
  var ncol = tmatrix.length;

	for (ci=0; ci<ncol;ci+=1)
	{
		uniques.push(dex.array.unique(tmatrix[ci]));
	}
	return uniques;
};

dex.matrix.transpose = function(matrix)
{
	var ci;
	var ncols;
	var transposedMatrix = [];

  if (!matrix || matrix.length <= 0 ||
    !matrix[0] || matrix[0].length <= 0)
  {
    return [];
  }

  ncols = matrix[0].length;
 
  for (ci=0; ci<ncols; ci++)
	{
		transposedMatrix.push(matrix.map(function(row) { return row[ci]; }));
	}

	return transposedMatrix;
};

dex.matrix.columnSlice = function(matrix, columns)
{
	var slice = [];
	var ri;
  var transposeMatrix;

	if (arguments.length != 2)
	{
		return matrix;
	}

  transposeMatrix = dex.matrix.transpose(matrix);
  //dex.console.log("transposing", matrix, "transpose", transposedMatrix);
  
  // Specific columns targetted:
  if (Array.isArray(columns))
  {
    for (ri=0; ri < columns.length; ri+=1)
    {
      slice.push(transposeMatrix[columns[ri]]);
    }
  }
  // Single column.
  else
  {
    slice.push(transposeMatrix[columns]);
  }

  // Back to row/column format.
	return dex.matrix.transpose(slice);
};

dex.matrix.flatten = function(matrix)
{
	var array = [];
	var ri, ci;
	
	for (ri=0; ri<matrix.length; ri++)
	{
		for (ci=0; ci<matrix[ri].length;ci++)
		{
			array.push(matrix[ri][ci]);
		}
	}
  return array;
};

dex.matrix.extent = function(data, indices)
{
	var values = data;
	if (arguments.length === 2)
	{
		values = dex.matrix.slice(data, indices);
		return d3.extent(dex.matrix.flatten(values));
	}
};

// Combine each column in matrix1 with each column in matrix2. 
dex.matrix.combine = function(matrix1, matrix2)
{
	var result = [];
  var ri, oci, ici;
	
	// Iterate over the rows in matrix1:
	for (ri=0; ri<matrix1.length; ri++)
	{
		// Iterate over the columns in matrix2:
		for (oci=0; oci<matrix1[ri].length; oci++)
		{
			// Iterate over the columns in matrix2:
			for (ici=0; ici<matrix2[ri].length; ici++)
			{
				result.push([matrix1[ri][oci], matrix2[ri][ici], oci, ici]);
			}
		}
	}
	return result;
};

dex.matrix.isColumnNumeric = function(data, columnNum)
{
	var i;
	
  for (i=1; i<data.length; i++)
  {
	  if (!dex.object.isNumeric(data[i][columnNum]))
	  {
	    return false;
	  }
  }
  return true;
};

dex.matrix.max = function(data, columnNum)
{
  var maxValue = data[0][columnNum];
  var i;
  
  if (dex.matrix.isColumnNumeric(data, columnNum))
  {
	  maxValue = parseFloat(data[0][columnNum]);
	  for (i=1; i<data.length; i++)
    {
      if (maxValue < parseFloat(data[i][columnNum]))
      {
        maxValue = parseFloat(data[i][columnNum]);
      }
    }
  }
  else
  {
    for (i=1; i<data.length; i++)
    {
      if (maxValue < data[i][columnNum])
      {
        maxValue = data[i][columnNum];
      }
    }
  }
  
  return maxValue;
};

dex.matrix.min = function(data, columnNum)
{
  var minValue = data[0][columnNum];
  var i;
  
  if (dex.matrix.isColumnNumeric(data, columnNum))
  {
	  minValue = parseFloat(data[0][columnNum]);
	  for (i=1; i<data.length; i++)
    {
      if (minValue > parseFloat(data[i][columnNum]))
      {
        minValue = parseFloat(data[i][columnNum]);
      }
    }
  }
  else
  {
    for (i=1; i<data.length; i++)
    {
      if (minValue > data[i][columnNum])
      {
        minValue = data[i][columnNum];
      }
    }
  }
  
  return minValue;
};dex.object = {};

////
//
// dex.object : This module provides routines dealing with basic javascript
//              objects.
//
////

dex.object.keys = function (obj) {
  var keys = [];

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }

  return keys;
};

dex.object.clone = function (obj) {
  var i, attr, len;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj)
    return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (i = 0, len = obj.length; i < len; i++) {
      copy[i] = dex.object.clone(obj[i]);
    }
    return copy;
  }

  // DOM Nodes are nothing but trouble.
  if (dex.object.isElement(obj) ||
    dex.object.isNode(obj)) {
    return obj;
  }

  // Handle Object
  if (obj instanceof Object) {
    var copy = {};
    //jQuery.extend(copy, obj);
    for (attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = dex.object.clone(obj[attr]);
        //copy[attr] = obj[attr];
      }
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};

/**
 *
 * Overlay the top object on top of the bottom.  This method will first clone
 * the bottom object.  Then it will drop the values within the top object
 * into the clone.
 *
 * @method dex.object.overlay
 * @param {Object} top The object who's properties will be on top.
 * @param {Object} bottom The object who's properties will be on bottom.
 * @return {Object} The overlaid object where the properties in top override
 *                  properties in bottom.  The return object is a clone or
 *                  copy.
 *
 */

dex.object.overlay = function (top, bottom) {
  // Make a clone of the bottom object.
  var overlay = dex.object.clone(bottom);
  var prop;

  // If we have parameters in the top object, overlay them on top
  // of the bottom object.
  if (top !== 'undefined') {
    // Iterate over the props in top.
    for (prop in top) {
      // Arrays are special cases. [A] on top of [A,B] should give [A], not [A,B]
      if (typeof top[prop] == 'object' && overlay[prop] != null && !(top[prop] instanceof Array)) {
        //console.log("PROP: " + prop + ", top=" + top + ", overlay=" + overlay);
        overlay[prop] = dex.object.overlay(top[prop], overlay[prop]);
      }
      // Simply overwrite for simple cases and arrays.
      else {
        overlay[prop] = top[prop];
      }
    }
  }

  //console.dir(config);
  return overlay;
};

//Returns true if it is a DOM node
dex.object.isNode = function (o) {
  return (
    typeof Node === "object" ? o instanceof Node :
      o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
    );
};

//Returns true if it is a DOM element    
dex.object.isElement = function (o) {
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string"
    );
};

/**
 *
 * This method returns a boolean representing whether obj is contained
 * within container.
 *
 * @param {Object} container
 * @param {Object} obj
 * @return True if container contains obj.  False otherwise.
 */
dex.object.contains = function (container, obj) {
  var i = container.length;
  while (i--) {
    if (container[i] === obj) {
      return true;
    }
  }
  return false;
};

dex.object.isFunction = function (functionToCheck) {
  return typeof functionToCheck === 'function';
}

dex.object.visit = function (obj, func) {
  var prop;
  func(obj);
  for (prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'object') {
        dex.object.visit(obj[prop], func);
      }
    }
  }
};

dex.object.connect = function (map, values) {
  //dex.console.log("  map:", map, "  values: ", values);
  if (!values || values.length <= 0) {
    return this;
  }
  if (!map[values[0]]) {
    map[values[0]] = {};
  }
  dex.object.connect(map[values[0]], values.slice(1));

  return this;
};

dex.object.isNumeric = function (obj) {
  return !isNaN(parseFloat(obj)) && isFinite(obj);
};

dex.object.setHierarchical = function (hierarchy, name, value, delimiter) {
  if (hierarchy == null) {
    hierarchy = {};
  }

  if (typeof hierarchy != 'object') {
    return hierarchy;
  }

  // Create an array of names by splitting delimiter, then call
  // this function in the 3 argument (Array of paths) context.
  if (arguments.length == 4) {
    return dex.object.setHierarchical(hierarchy,
      name.split(delimiter), value);
  }

  // Array of paths context.
  else {
    // This is the last variable name, just set the value.
    if (name.length === 1) {
      hierarchy[name[0]] = value;
    }
    // We still have to traverse.
    else {
      // Undefined container object, just create an empty.
      if (!(name[0] in hierarchy)) {
        hierarchy[name[0]] = {};
      }

      // Recursively traverse down the hierarchy.
      dex.object.setHierarchical(hierarchy[name[0]], name.splice(1), value);
    }
  }

  return hierarchy;
};function DexComponent(userConfig, defaultConfig)
{
  userConfig = userConfig || {};
  defaultConfig = defaultConfig || {};
  
  // This holds our event registry.
  this.registry = {};
  this.debug = false;

  if (userConfig.hasOwnProperty('config'))
  {
    this.config = dex.object.overlay(userConfig.config, defaultConfig);
  }
  else
  {
    this.config = dex.object.overlay(dex.config.expand(userConfig), dex.config.expand(defaultConfig));
  }

  //dex.console.log("HIERARCHY", this.config, userConfig, defaultConfig);

  this.attr = function(name, value)
  {
    if (arguments.length == 0)
    {
      return this.config;
    }
    else if (arguments.length == 1)
    {
      // REM: Need to getHierarchical
      return this.config[name];
    }
    else if (arguments.length == 2)
    {
      //console.log("Setting Hieararchical: " + name + "=" + value);
      //console.dir(this.config);

      // This will handle the setting of a single attribute
      dex.object.setHierarchical(this.config, name, value, '.');
    }
    return this;
  };

  this.addListener = function(eventType, target, method)
  {
    var targets;

    if (this.debug)
    {
      console.log("Registering Target: " + eventType + "=" + target);
    }
    if (!this.registry.hasOwnProperty(eventType))
    {
      this.registry[eventType] = [];
    }

    this.registry[eventType].push(
    {
      target : target,
      method : method
    });
    //console.log("this.registry");
    //console.dir(eventthis.registry);
  };

this.notify = function(event)
{
  var targets, i;

  if (this.debug)
  {
    console.log("notify: " + event.type);
  }

  if (!this.registry.hasOwnProperty(event.type))
  {
    return this;
  }

  event.source = this;
  targets = this.registry[event.type];
  //console.log("TARGETS: " + targets.length);
  //console.dir(targets);
  for ( i = 0; i < targets.length; i++)
  {
    //console.dir("Calling Target: " + targets[i]["target"]);
    targets[i]["method"](event, targets[i]["target"]);
  }
};

  this.render = function()
  {
    console.log("Unimplemented routine: render()");
  };

  this.update = function()
  {
    console.log("Unimplemented routine: update()");
  };

  return this;
};

(function() {
	var w = document.body.offsetWidth;
	var h = document.body.offsetHeight;

	var svg = d3.select("body").append("svg:svg")
		.attr("width", w)
		.attr("height", h)
		.append("svg:g")
})();


/***************** Namespaces *****************/
// dancevis global namespace
var dancevis = {}

// dancevis.Shapes namespace
dancevis.Shapes = {}

// dancevis.Util namespace
dancevis.Util = {}

// dancevis.Error namespace
dancevis.Error = {}


/***************** Implementation *****************/
dancevis.Util.defaultTo = function(value, defaultToThisValue) {
	if (value === undefined || value === null)
		return defaultToThisValue;
	return value;
}
dancevis.Util.isNum = function(value) {
	return (typeof(value) == 'number' && !isNaN(value));
}
dancevis.Util.defaultNum = function(value, defaultNumValue) {
	if (!dancevis.Util.isNum(defaultNumValue)) {
		throw new dancevis.Error.DanceVisError("default value for a numeric type must be a numeric type");
	}
	var num = dancevis.Util.defaultTo(value, defaultNumValue);
	// this must be a number
	if (!dancevis.Util.isNum(num)) {
		num = defaultNumValue;
	}
	return num;
}
dancevis.Util.floatsEqual = function(one, two) {
	return Math.abs(one - two) < 0.000001;
}
dancevis.Util.counter = function(startValue, incrementStep) {
	var count = dancevis.Util.defaultNum(startValue, 0);
	var step = dancevis.Util.defaultNum(incrementStep, 1);
	return function() {
		var returnValue = count;
		count += step;
		return returnValue;
	}
}
dancevis.Util.makeSGVGroup = function() {
	var svg = document.getElementsByTagName("svg")[0];
	var g = svg.firstChild;
	var newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")

	g.appendChild(newGroup);
	return newGroup;
}
dancevis.Util.makeSVGSquare = function(center, width, height, color, hollow) {
	var svg = document.getElementsByTagName("svg")[0];
	var g = svg.firstChild;
	var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "rect")

	if (hollow) svgElement.style.fill = "none";
	else svgElement.style.fill = color;
	svgElement.style.stroke = color;
	svgElement.style.strokeWidth = "1px";
	svgElement.width.baseVal.value = width;
	svgElement.height.baseVal.value = height;
	svgElement.x.baseVal.value = center.x;
	svgElement.y.baseVal.value = center.y;
	g.appendChild(svgElement);
	return svgElement;
}
dancevis.Util.makeSVGCircle = function(center, radius, color, hollow) {
	var svg = document.getElementsByTagName("svg")[0];
	var g = svg.firstChild;
	var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "circle")

	if (hollow) svgElement.style.fill = "none";
	else svgElement.style.fill = color;
	svgElement.style.stroke = color;
	svgElement.style.strokeWidth = "1px";
	svgElement.r.baseVal.value = radius;
	svgElement.cx.baseVal.value = center.x;
	svgElement.cy.baseVal.value = center.y;
	g.appendChild(svgElement);
	return svgElement;
}
dancevis.Util.removeSVG = function(element) {
	var parent = element.parentNode;
	parent.removeChild(element);
}

dancevis.Util.__enumUnique = dancevis.Util.counter(28374859, 1);

dancevis.Error.log = function(err) {
	if (!(err instanceof dancevis.Error.DanceVisError))
		return;
	console.log(err.name + ": '" + err.message + "'");
}
dancevis.Error.DanceVisError = function(message) {
	var defaultMessage = "'An error has occured inside dancevis library'";
	this.name = "DanceVisError";
	this.message = "function "+arguments.callee.caller.name+"(): '"+message+"'" || defaultMessage;
}
dancevis.Error.DanceVisError.prototype = new Error();
dancevis.Error.DanceVisError.prototype.constructor = dancevis.Error.DanceVisError;


//*** class Position
dancevis.Position = function(x, y) {
	this.__type = dancevis.Position.__type;
	this.x = null;
	this.y = null;
	if (!dancevis.Util.isNum(x) || !dancevis.Util.isNum(y)) {
		throw new dancevis.Error.DanceVisError("x, y for Position must be numeric values");
	}
	this.x = dancevis.Util.defaultTo(x, 0);
	this.y = dancevis.Util.defaultTo(y, 0);
}
// Static Variables for class Position
dancevis.Position.__type = "position";
dancevis.Position.screenOriginLeft = 0;
dancevis.Position.screenOriginTop = 0;
// Static Methods for class Position
dancevis.Position.screenOriginIs = function(left, top) {
	if (!dancevis.Util.isNum(left) || !dancevis.Util.isNum(top)) {
		throw new dancevis.Error.DanceVisError("screen origin must be numeric values");
	}
	if (left < 0 || top < 0) {
		throw new dancevis.Error.DanceVisError("screen origin must be >= 0");
	}
	if (left > document.body.offsetWidth || top > document.body.offsetHeight) {
		throw new dancevis.Error.DanceVisError("screen origin must be less than document.body width and height");
	}
	dancevis.Position.screenOriginLeft = left;
	dancevis.Position.screenOriginTop = top;
	DrawBackground(left, top);
}
dancevis.Position.screenToModelCoords = function(left, top) {
	return new dancevis.Position(left - dancevis.Position.screenOriginLeft, -1 * (top - dancevis.Position.screenOriginTop));
}
// Methods for class Position
dancevis.Position.prototype.distance = function(other) {
	if (!other || other.__type != dancevis.Position.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	return Math.sqrt(Math.pow(other.x - this.x, 2.0) + Math.pow(other.y - this.y, 2.0));
}
dancevis.Position.prototype.positionInDirection = function(distance, angle) {
	if (!angle || angle.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	var xPos = this.x + (distance * angle.cos());
	var yPos = this.y + (distance * angle.sin());
	return new dancevis.Position(xPos, yPos);
}
dancevis.Position.prototype.equals = function(other) {
	if (!other || other.__type != dancevis.Position.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	return (other.x == this.x && other.y == this.y);
}
dancevis.Position.prototype.copy = function() {
	return new dancevis.Position(this.x, this.y);
}
dancevis.Position.prototype.screenCoords = function() {
	var screenX = dancevis.Position.screenOriginLeft + this.x;
	var screenY = dancevis.Position.screenOriginTop - this.y;
	return new dancevis.Position(screenX, screenY);
}
dancevis.Position.prototype.toString = function() {
	var numDecimal = 2;
	var xStr = this.x.toFixed(numDecimal);
	var yStr = this.y.toFixed(numDecimal);
	return "("+xStr+","+yStr+")";
}

//*** class Orientation
dancevis.Orientation = function(angle, isRadians) {
	this.__type = dancevis.Orientation.__type;
	this.angle = null;
	if (!dancevis.Util.isNum(angle)) {
		throw new dancevis.Error.DanceVisError("an angle must be a numeric value");
	}

	var theta = dancevis.Util.defaultTo(angle, 0);

	if (isRadians != undefined && typeof isRadians == "boolean") {
		if (!isRadians) theta = dancevis.Orientation.degreesToRadians(theta);
	}
	this.angle = theta;
}
// Static Variables for class Orientation
dancevis.Orientation.__type = "orientation";
// Static Methods for class Orientation
dancevis.Orientation.radiansToDegrees = function(radians) {
	return radians * 360.0 / (2 * Math.PI);
}
dancevis.Orientation.degreesToRadians = function(degrees) {
	return degrees * 2 * Math.PI / 360.0;
}
// Methods for class Orientation
dancevis.Orientation.prototype.inRadians = function() {
	return this.angle;
}
dancevis.Orientation.prototype.inDegrees = function() {
	return dancevis.Orientation.radiansToDegrees(this.angle);
}
dancevis.Orientation.prototype.equals = function(other) {
	if (!other || other.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	return (other.angle == this.angle);
}
dancevis.Orientation.prototype.cos = function() {
	return Math.cos(this.angle);
}
dancevis.Orientation.prototype.sin = function() {
	return Math.sin(this.angle);
}
dancevis.Orientation.prototype.angleBetween = function(other) {
	if (!other || other.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	var diff1 = other.angle - this.angle;
	var diff2 = this.angle - other.angle;
	return diff1 > diff2 ? new dancevis.Orientation(diff2) : new dancevis.Orientation(diff1);
}
dancevis.Orientation.prototype.isBetween = function(angle1, angle2) {
	if (!angle1 || angle1.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");

	if (!angle2 || angle2.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");

	

	console.log("STILL NEED TO DO THIS");
	return true;
}
dancevis.Orientation.prototype.toString = function() {
	var numDecimal = 2;
	var rad = this.inRadians().toFixed(numDecimal);
	var dec = this.inDegrees().toFixed(numDecimal);
	return ("("+rad + " radians, " + dec + " degrees)");
}
dancevis.Orientation.prototype.copy = function() {
	return new dancevis.Orientation(this.angle);
}

//*** class Time
dancevis.Time = function(timeSet) {
	this.__type = dancevis.Time.__type;
	this.milliseconds = null;

	timeSet = dancevis.Util.defaultTo(timeSet, {});
	timeSet.milliseconds = dancevis.Util.defaultNum(timeSet.milliseconds, 0);
	timeSet.seconds = dancevis.Util.defaultNum(timeSet.seconds, 0);
	timeSet.minutes = dancevis.Util.defaultNum(timeSet.minutes, 0);
	timeSet.hours = dancevis.Util.defaultNum(timeSet.hours, 0);

	var totalMilliseconds =
		timeSet.milliseconds +
		(timeSet.seconds * 1000.0) +
		(timeSet.minutes * 1000.0 * 60.0) +
		(timeSet.hours * 1000.0 * 60.0 * 60.0);

	this.milliseconds = totalMilliseconds;
}
// Static Variables for class Time
dancevis.Time.__type = "time";
dancevis.Time.zeroTime = null;
// Static Methods for class Time
dancevis.Time.zeroTimeIsNow = function() {
	dancevis.Time.zeroTime = new Date();
}
dancevis.Time.now = function() {
	var nowTime = new Date();
	var zero = dancevis.Util.defaultTo(dancevis.Time.zeroTime, nowTime);
	var diff = nowTime.getTime() - zero.getTime();
	return new dancevis.Time({milliseconds:diff});
}
// Methods for class Time
dancevis.Time.prototype.inMilliseconds = function() {
	return this.milliseconds;
}
dancevis.Time.prototype.inSeconds = function() {
	return this.milliseconds / 1000.0;
}
dancevis.Time.prototype.inMinutes = function() {
	return this.milliseconds / (1000.0 * 60.0);
}
dancevis.Time.prototype.inHours = function() {
	return this.milliseconds / (1000.0 * 60.0 * 60.0);
}
dancevis.Time.prototype.inTimeUnits = function() {
	var millisecondsRemaining = this.milliseconds;
	var millisecondsPerSecond = (1000.0);
	var millisecondsPerMinute = (millisecondsPerSecond * 60.0);


	var minutes = 0,
		seconds = 0,
		milliseconds = 0;

	minutes = Math.floor(millisecondsRemaining / millisecondsPerMinute);
	millisecondsRemaining -= minutes * millisecondsPerMinute;

	if (millisecondsRemaining > 0) {
		seconds = Math.floor(millisecondsRemaining / millisecondsPerSecond)
		millisecondsRemaining -= seconds * millisecondsPerSecond;
	}

	if (millisecondsRemaining > 0) {
		milliseconds = millisecondsRemaining;
	}

	return {
		minutes: minutes,
		seconds: seconds,
		milliseconds: milliseconds
	}
}
dancevis.Time.prototype.isBetween = function(time1, time2) {
	var milli1 = time1.inMilliseconds();
	var milli2 = time2.inMilliseconds();
	var smaller = milli1 < milli2 ? milli1 : milli2;
	var larger  = milli1 > milli2 ? milli1 : milli2;
	return (this.milliseconds >= smaller && this.milliseconds <= larger);
}
dancevis.Time.prototype.equals = function(other) {
	if (other.__type != dancevis.Time.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	return (other.milliseconds == this.milliseconds);
}
dancevis.Time.prototype.toString = function() {
	var numDecimal = 2;
	var seconds = this.inSeconds().toFixed(numDecimal);
	return "("+seconds+" seconds)";
}
dancevis.Time.prototype.copy = function() {
	return new dancevis.Time({milliseconds:this.milliseconds});
}

//*** class Speed
dancevis.Speed = function(speedSet) {
	this.__type = dancevis.Speed.__type;
	this.pixelsPerSecond = null;

	this.setSpeed(speedSet);
}
// Static Variables for class Speed
dancevis.Speed.__type = "speed";
// Methods for class Speed
dancevis.Speed.prototype.speed = function() {
	return this.pixelsPerSecond;
}
dancevis.Speed.prototype.setSpeed = function(speedSet) {
	speedSet = dancevis.Util.defaultTo(speedSet, {speed:0});

	// prevent divide by zero
	speedSet.duration = dancevis.Util.defaultTo(speedSet.duration, new dancevis.Time({milliseconds:1}));

	if (dancevis.Util.isNum(speedSet.speed)) {
		this.pixelsPerSecond = speedSet.speed;
	}
	else if (speedSet.distance && speedSet.duration) {
		this.pixelsPerSecond = speedSet.distance / speedSet.duration.inMilliseconds();
	}
	else if (speedSet.startPosition && speedSet.endPosition && speedSet.duration) {
		var dist = speedSet.startPosition.distance(speedSet.endPosition);
		this.pixelsPerSecond = dist / speedSet.duration.inMilliseconds();
	}
	else {
		throw new dancevis.DanceVisError("(1) speed or (2) start/end position with duration or (3) distance and duration must be provided.");
	}
}
dancevis.Speed.prototype.equals = function(other) {
	if (!other || other.__type != dancevis.Speed.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	return (other.pixelsPerSecond == this.pixelsPerSecond);
}
dancevis.Speed.prototype.toString = function() {
	var numDecimal = 2;
	var speed = this.pixelsPerSecond.toFixed(numDecimal);
	return "("+speed+" ppms)";
}
dancevis.Speed.prototype.copy = function() {
	return new dancevis.Speed({speed:this.pixelsPerSecond});
}


//*** class PositionBounds
dancevis.PositionBounds = function(sw, ne) {
	this.__type = dancevis.PositionBounds.__type;

}
dancevis.PositionBounds.__type = "position_bounds";
// Methods for class PositionBounds
dancevis.PositionBounds.prototype.contains = function(position) {

}
dancevis.PositionBounds.prototype.equals = function(other) {

}
dancevis.PositionBounds.prototype.extend = function(position) {

}
dancevis.PositionBounds.prototype.getCenter = function() {

}
dancevis.PositionBounds.prototype.getNorthEast = function() {

}
dancevis.PositionBounds.prototype.getSouthWest = function() {

}
dancevis.PositionBounds.prototype.intersects = function(other) {

}
dancevis.PositionBounds.prototype.union = function(other) {

}
dancevis.PositionBounds.prototype.toString = function() {

}


/***************** Shapes *****************/
//*** class Shapes.ShapeTypeId
dancevis.Shapes.ShapeTypeId = {
	LINE: dancevis.Util.__enumUnique(),
	CIRCLE: dancevis.Util.__enumUnique(),
	POINT: dancevis.Util.__enumUnique(),
	GRID: dancevis.Util.__enumUnique(),
	COMPOSITE: dancevis.Util.__enumUnique(),
	toString: null,
	isValidShapeType: null
}
// Methods for class Shapes.ShapeTypeId
dancevis.Shapes.ShapeTypeId.toString = function(typeId) {

}
dancevis.Shapes.ShapeTypeId.isValidShapeType = function(shapeTypeId) {
	var validShape = false;
	for (var p in dancevis.Shapes.ShapeTypeId) {
		if (dancevis.Shapes.ShapeTypeId[p] == shapeTypeId) {
			validShape = true;
			break;
		}
	}
	return validShape;
}


//*** class Shapes.GeometricShape
dancevis.Shapes.GeometricShape = function(shapeTypeId) {
	this.__type = dancevis.Shapes.GeometricShape.__type;
	this.shapeId = null;
	this.shapeTypeId = null;
	this.positionBounds = null;

	if (!dancevis.Shapes.ShapeTypeId.isValidShapeType(shapeTypeId)) {
		throw new dancevis.Error.DanceVisError("invalid shapeTypeId");
	}

	this.shapeTypeId = shapeTypeId;
	this.shapeId = dancevis.Shapes.GeometricShape.__shapeIdUnique();
}
// Static Variables for class Shapes.GeometricShape
dancevis.Shapes.GeometricShape.__type = "geometric_shape";
// Static Methods for class Shapes.GeometricShape
dancevis.Shapes.GeometricShape.__shapeIdUnique = dancevis.Util.counter(0, 1);
// Methods for class Shapes.GeometricShape
dancevis.Shapes.GeometricShape.prototype.boundingBox = function() {
	return this.positionBounds;
}


//*** class Shapes.Line
dancevis.Shapes.Line = function(startPosition, length, angle) {
	// prototypical inheritance from GeometricShape
	this.temp = dancevis.Shapes.GeometricShape;
	this.temp(dancevis.Shapes.ShapeTypeId.LINE);
	delete this.temp;


    this.start_position = startPosition;
	this.length = length;
	this.angle = angle;
	this.__type = dancevis.Shapes.Line.__type;
}
// Static Variables for class Shapes.Line
dancevis.Shapes.Line.__type = "line";
// Methods for class Shapes.Line
dancevis.Shapes.Line.prototype.startPosition = function() {
    return this.start_position;
}
dancevis.Shapes.Line.prototype.endPosition = function() {
    var endX = this.start_position.x + this.length * this.angle.cos();
	var endY =  this.start_position.y + this.length * this.angle.sin();
    return new dancevis.Position(endX, endY);
}
dancevis.Shapes.Line.prototype.getOrientation = function() {
	return this.angle;
}
dancevis.Shapes.Line.prototype.setOrientation = function(orientation) {
	//if (this.element && this.svgGroup) {
		//var screenPos = this.center.screenCoords();
		//this.svgGroup.setAttribute("transform", "rotate("+orientation.inDegrees()+" "+screenPos.x+" "+screenPos.y+")");
	//}
	this.angle = orientation;
}
dancevis.Shapes.Line.prototype.getPosition = function() {
	return startPosition();
}
dancevis.Shapes.Line.prototype.setPosition = function(position) {
	this.start_position = position;
	if (this.element) {
		this.showShapeOnScreen(true);
	}
}
dancevis.Shapes.Line.prototype.nextPositionAndOrientation = function(startPosition, startOrientation, dt, speed) {
	if (!dt || dt.__type != dancevis.Time.__type ||
		!speed || speed.__type != dancevis.Speed.__type) {
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	}

	var nextX = startPosition.x + (speed.speed()*dt.inSeconds())*this.angle.cos();
	var nextY = startPosition.y + (speed.speed()*dt.inSeconds())*this.angle.sin();
	
	return {
		position: new dancevis.Position(nextX, nextY),
		orientation: this.getOrientation()
	}
}
dancevis.Shapes.Line.prototype.length = function() {
   return length;
}
dancevis.Shapes.Line.prototype.angle = function() {
   return angle;
}
dancevis.Shapes.Line.prototype.distanceToLine = function() {
     
}

dancevis.Shapes.Line.prototype.isOnShape = function(position, err) {
	err = err || .001;
   var endPoint = this.endPosition();
   var a = (endPoint.y - this.start_position.y) / (endPoint.x - this.start_position.x);
   var b = this.start_position.y - a * this.start_position.x;
   if ( Math.abs(position.y - (a*position.x+b)) < err){
	  return true;
      if(position.x >= this.start_position.x && position.x <= endPoint.x){
	       return true;
	  }
   }
   return false;
}
dancevis.Shapes.Line.prototype.copy = function() {
	return new dancevis.Shapes.Line(this.start_position.copy(), this.length, this.angle.copy());
}
dancevis.Shapes.Line.prototype.showShapeOnScreen = function(bool) {
	if (this.element) {
		dancevis.Util.removeSVG(this.element);
		delete this.element;
	}
	if (bool) {
		var startPoint = this.start_position.screenCoords();
		var endPoint = this.endPosition().screenCoords();
		var d3elem = d3.select("g").append("svg:line")
					.attr("x1", startPoint.x)
					.attr("y1", startPoint.y)
					.attr("x2", endPoint.x)
					.attr("y2", endPoint.y)
					.style("stroke", "rgb(6,120,155)");
		this.element = d3elem[0][0];
	}
}

//*** class Shapes.Circle
dancevis.Shapes.Circle = function(center, radius, startAngle, stopAngle) {
	// prototypical inheritance from GeometricShape
	this.temp = dancevis.Shapes.GeometricShape;
	this.temp(dancevis.Shapes.ShapeTypeId.CIRCLE);
	delete this.temp;

	this.__type = dancevis.Shapes.Circle.__type;
	this.radius = null;
	this.center = null;
	this.startAngle = null;
	this.stopAngle = null;
	this.clockwise = null;
	this.orientation = null;

	this.radius = dancevis.Util.defaultNum(radius, 10);
	startAngle = dancevis.Util.defaultTo(startAngle, new dancevis.Orientation(0));
	stopAngle = dancevis.Util.defaultTo(stopAngle, new dancevis.Orientation(Math.PI *2));
	if (center.__type != dancevis.Position.__type ||
		startAngle.__type != dancevis.Orientation.__type ||
		stopAngle.__type != dancevis.Orientation.__type) {
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	}

	this.center = center;
	this.startAngle = startAngle;
	this.stopAngle = stopAngle;
	this.orientation = new dancevis.Orientation(0);
}
// Static Variables for class Shapes.Circle
dancevis.Shapes.Circle.__type = "circle";
// Methods for class Shapes.Circle
dancevis.Shapes.Circle.prototype.startPosition = function() {

}
dancevis.Shapes.Circle.prototype.getOrientation = function() {
	return this.orientation;
}
dancevis.Shapes.Circle.prototype.setOrientation = function(orientation) {
	if (this.element && this.svgGroup) {
		var screenPos = this.center.screenCoords();
		//this.svgGroup.setAttribute("transform", "rotate("+orientation.inDegrees()+" "+screenPos.x+" "+screenPos.y+")");
	}
	this.orientation = orientation;
}
dancevis.Shapes.Circle.prototype.getPosition = function() {
	return this.center;
}
dancevis.Shapes.Circle.prototype.setPosition = function(position) {
	this.center = position;
	if (this.element) {
		var screenPos = this.center.screenCoords();
		this.element.cx.baseVal.value = screenPos.x;
		this.element.cy.baseVal.value = screenPos.y;
	}
}
dancevis.Shapes.Circle.prototype.nextPositionAndOrientation = function(startPosition, startOrientation, dt, speed) {
	if (startPosition === null) {
		if (startOrientation === null)
			throw new dancevis.Error.DanceVisError("either startPosition or startOrientation must be non-null");
		startPosition = this.positionAtAngle(startOrientation);
	}
	if (startOrientation === null && startPosition === null) {
		throw new dancevis.Error.DanceVisError("either startPosition or startOrientation must be non-null");
	}
	if (!dt || dt.__type != dancevis.Time.__type ||
		!speed || speed.__type != dancevis.Speed.__type) {
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	}

	startOrientation = startOrientation || null;
	var dist = dt.inSeconds() * speed.speed();
	var radiansCovered = dist / this.radius;
	var positionAngle = this.angleFromPosition(startPosition);

	if (this.clockwise) {
		var newAngle =  new dancevis.Orientation(positionAngle.inRadians() - radiansCovered);
		var nextPos = this.center.positionInDirection(this.radius, newAngle);
		var nextOri = startOrientation === null ? newAngle : new dancevis.Orientation(startOrientation.inRadians() - radiansCovered);
	}
	else {
		var newAngle = new dancevis.Orientation(positionAngle.inRadians() + radiansCovered);
		var nextPos = this.center.positionInDirection(this.radius, newAngle);
		var nextOri = startOrientation === null ? newAngle : new dancevis.Orientation(startOrientation.inRadians() + radiansCovered);
	}

	return {
		position: nextPos,
		orientation: nextOri
	}
}
dancevis.Shapes.Circle.prototype.positionAtAngle = function(angle) {
	if (!angle || angle.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	return this.center.positionInDirection(this.radius, angle);
}
dancevis.Shapes.Circle.prototype.angleFromPosition = function(position) {
	if (!position || position.__type != dancevis.Position.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");

	if (this.center.equals(position))
		return new dancevis.Orientation(0);

	var x = position.x - this.center.x;
	var y = position.y - this.center.y;
	var atan = Math.atan(y / x);

	if (x < 0) atan += Math.PI;
	return new dancevis.Orientation(atan);
}
dancevis.Shapes.Circle.prototype.arcLength = function(angle) {
	if (!angle || angle.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	return angle.inRadians() * this.radius;
}
dancevis.Shapes.Circle.prototype.setStartAngle = function(angle) {
	if (!angle || angle.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	this.startAngle = angle;
}
dancevis.Shapes.Circle.prototype.setStopAngle = function(angle) {
	if (!angle || angle.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	this.stopAngle = angle;
}
dancevis.Shapes.Circle.prototype.startAngle = function() {
	return this.startAngle;
}
dancevis.Shapes.Circle.prototype.stopAngle = function() {
	return this.stopAngle;
}
dancevis.Shapes.Circle.prototype.isOnShape = function(position, err) {
	if (!position || position.__type != dancevis.Position.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");

	err = err || 0;

	var distFromCenter = this.center.distance(position);
	if (Math.abs(distFromCenter - this.radius) > err) {
		return false;
	}
	var positionAngle = this.angleFromPosition(position);
	var stopIsBigger = this.startAngle.inRadians() < this.stopAngle.inRadians();
	var big = stopIsBigger ? this.stopAngle : this.startAngle;
	var small = stopIsBigger ? this.startAngle : this.stopAngle;
	if (!positionAngle.isBetween(this.startAngle, this.stopAngle)) {
		return false;
	}
	return true;
}
dancevis.Shapes.Circle.prototype.showShapeOnScreen = function(bool) {
	if (this.element) {
		dancevis.Util.removeSVG(this.element);
		dancevis.Util.removeSVG(this.svgGroup);
		delete this.element;
		delete this.svgGroup;
	}
	if (bool) {
		this.svgGroup = dancevis.Util.makeSGVGroup();
		this.element = dancevis.Util.makeSVGCircle(this.center.screenCoords(), this.radius, "black", true);
		this.svgGroup.appendChild(this.element);
	}
}
dancevis.Shapes.Circle.prototype.copy = function() {
	return new dancevis.Shapes.Circle(this.center.copy(), this.radius, this.startAngle.copy(), this.stopAngle.copy());
}

//*** class Shapes.Point
dancevis.Shapes.Point = function(pointOptions) {
	this.positionBounds = null;
	this.__type = dancevis.Shapes.Point.__type;

}
// Static Variables for class Shapes.Point
dancevis.Shapes.Point.__type = "point";
// Methods for Shapes.Point
dancevis.Shapes.Point.prototype.startPosition = function() {

}
dancevis.Shapes.Point.prototype.endPosition = function() {

}
dancevis.Shapes.Point.prototype.nextPosition = function(startPosition, dt, speed) {

}
dancevis.Shapes.Point.prototype.point = function() {

}
dancevis.Shapes.Point.prototype.setRadius = function(radius) {

}
dancevis.Shapes.Point.prototype.isOnShape = function(position) {

}


//*** class Shapes.Grid
dancevis.Shapes.Grid = function(numRows, numCols, width, height, center) {
	this.positionBounds = null;
	this.__type = dancevis.Shapes.Grid.__type;
	this.numRows = numRows;
	this.numCols = numCols;
	this.width = width;
	this.height = height;
	this.center = center;
	var upperLeftX = center.x - width/2;
	var upperLeftY = center.y - height/2;
	this.upperLeft = new dancevis.Position(upperLeftX, upperLeftY);
	this.cellWidth = width / numCols;
	this.cellHeight = height / numRows;
}
// Static Variables for class Shapes.Grid
dancevis.Shapes.Grid.__type = "grid";
// Methods for class Shapes.Grid

dancevis.Shapes.Grid.prototype.nextPositionAndOrientation = function(startPosition, dt, speed, startOrientation) {
 return startPosition;
}
dancevis.Shapes.Grid.prototype.positionAt = function(row, col) {
   if(row >= this.numRows || row < 0) throw new dancevis.Error.DanceVisError("row is outside grid bounds");
   if(col >= this.numCols || col < 0) throw new dancevis.Error.DanceVisError("col is outside grid bounds");
   var x = this.upperLeft.x + col * this.cellWidth;
   var y = this.upperLeft.y + row * this.cellHeight;
   return new dancevis.Position(x,y);
}
dancevis.Shapes.Grid.prototype.numRows = function() {
   return this.numRows;
}
dancevis.Shapes.Grid.prototype.numCols = function() {
   return this.numCols;
}

dancevis.Shapes.Grid.prototype.setCenter = function(center) {
   this.center = center;
}

dancevis.Shapes.Grid.prototype.isOnShape = function(position) {

}


//*** class Shapes.Composite
dancevis.Shapes.Composite = function(options) {
	this.positionBounds = null;
	this.__type = dancevis.Shapes.Composite.__type;
}
// Static Variables for class Shapes.Composite
dancevis.Shapes.Composite.__type = "composite";
// Methods for class Shapes.Composite
dancevis.Shapes.Composite.prototype.startPosition = function() {

}
dancevis.Shapes.Composite.prototype.endPosition = function() {

}
dancevis.Shapes.Composite.prototype.nextPosition = function(startPosition, dt, speed) {

}
dancevis.Shapes.Composite.prototype.addShape = function(shape, index) {

}
dancevis.Shapes.Composite.prototype.numShapesOfType = function(type) {

}
dancevis.Shapes.Composite.prototype.shapeAt = function(position) {

}
dancevis.Shapes.Composite.prototype.isOnShape = function(position) {

}


/***************** Group *****************/
//*** class GroupInitialPlacementControl
dancevis.GroupInitialPlacementControl = {
	EVENLY_SPACED: dancevis.Util.__enumUnique(),
	ALL_AT_START: dancevis.Util.__enumUnique(),
	MANUAL: dancevis.Util.__enumUnique()
}


//*** class Group
dancevis.Group = function(groupOptions) {
	this.__type = dancevis.Group.__type;
	this.children = null;
	this.parentGroup = null;
	this.shape = null;
	this.speed = null;
	this.startTime = null;
	this.endTime = null;
	this.lastTime = null;
	this.active = false;
	this.onChildAddition = null;
	this.onChildRemoval = null;
	this.endCondition = null;
	this.clientUpdateFunctions = null;
	this.groupId = null;
	this.updateChildren = true;
	this.myChildrenUpdate = true;
	this.exitPoints = {};
	this.initialPlacementControl = null;

	groupOptions = dancevis.Util.defaultTo(groupOptions, {});
	if (!groupOptions.shape) 
		throw new dancevis.Error.DanceVisError("invalid parameters to construct a group");

	if (!groupOptions.startTime || groupOptions.startTime.__type != dancevis.Time.__type)
		throw new dancevis.Error.DanceVisError("invalid parameters to construct a group");

	if (!groupOptions.endTime || groupOptions.endTime.__type != dancevis.Time.__type)
		throw new dancevis.Error.DanceVisError("invalid parameters to construct a group");

	if (!groupOptions.speed || groupOptions.speed.__type != dancevis.Speed.__type)
		throw new dancevis.Error.DanceVisError("invalid parameters to construct a group");

	//if (!groupOptions.position || groupOptions.position.__type != dancevis.Position.__type) 
	//	throw new dancevis.Error.DanceVisError("invalid parameters to construct a group");
	
	if (!groupOptions.orientation || groupOptions.orientation.__type != dancevis.Orientation.__type) 
		throw new dancevis.Error.DanceVisError("invalid parameters to construct a group");

	if (groupOptions.startTime.inMilliseconds() >= groupOptions.endTime.inMilliseconds()) {
		throw new dancevis.Error.DanceVisError("startTime must be earlier than endTime");
	}

	

	this.children = [];

	this.shape = groupOptions.shape.copy();
	this.showShapeOnScreen(true);

	
	this.speed = groupOptions.speed.copy();
	this.startTime = groupOptions.startTime.copy();
	this.endTime = groupOptions.endTime.copy();
	this.lastTime = this.startTime.copy();

	if (groupOptions.position) this.setPosition(groupOptions.position.copy());
	this.setOrientation(groupOptions.orientation.copy());

	this.clientUpdateFunctions = {};
	this.groupId = dancevis.Group.__groupIdUnique();

	var parent = dancevis.Util.defaultTo(groupOptions.parentGroup, null);
	if (parent) this.setParent(parent);
}
// Static Variables for class Group
dancevis.Group.__type = "group";
// Static Methods for class Shapes.GeometricShape
dancevis.Group.__groupIdUnique = dancevis.Util.counter(1847, 1);

// Methods for class Group
dancevis.Group.prototype.updateChildrenBasedOnMyShape = function(currentTime) {
	if (!currentTime || currentTime.__type != dancevis.Time.__type) {
		throw new dancevis.Error.DanceVisError("currentTime is not of type time");
	}
	var curr = currentTime.inMilliseconds();
	if (curr < this.lastTime.inMilliseconds())
		return;

	var dt = new dancevis.Time({milliseconds:(curr - this.lastTime.inMilliseconds())});
	
	this.updateChildren = true;
	for (var fname in this.clientUpdateFunctions) {
		var fobj = this.clientUpdateFunctions[fname];
		if ((fobj.start === null && fobj.stop === null) || currentTime.isBetween(fobj.start, fobj.stop)) {
			fobj.func.call(this);
		}
	}
	if (this.updateChildren) {
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];

			// check for exit points
			for (var epObjName in this.exitPoints) {
				var ep = this.exitPoints[epObjName];
				var validTime = (ep.startTime === null && ep.endTime === null) || currentTime.isBetween(ep.startTime, ep.endTime);
				var validDist = child.getPosition().distance(ep.position) <= 1;
				if (validTime && validDist) {
					child.setParent(ep.nextGroup);
				}
			}

			// check for end conditions
			var isEnd = false;
			if (this.endCondition) {
				isEnd = this.endCondition.call(this, child, i);
			}

			if (!isEnd) {
				// calculate new child position based on shape
				var update = this.shape.nextPositionAndOrientation(child.getPosition(), child.getOrientation(), dt, this.speed);
				
				// set child position to the new one
				child.setMyPositionAndModifyChildren(update.position, update.orientation);
			}
		}
	}

	// let all children update themselves
	this.childrenTimeIs(currentTime);
}
dancevis.Group.prototype.childrenTimeIs = function(currentTime) {
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if (child.__type == dancevis.Group.__type)
			child.timeIs(currentTime);
	}
}
dancevis.Group.prototype.setMyPositionAndModifyChildren = function(newPosition, newOrientation) {
	if (!newPosition || newPosition.__type != dancevis.Position.__type)
		throw new dancevis.Error.DanceVisError("newPosition is not of type position");

	if (!newOrientation || newOrientation.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("newOrientation is not of type orientation");


	var dx = newPosition.x - this.getPosition().x;
	var dy = newPosition.y - this.getPosition().y;
	var dtheta = new dancevis.Orientation(newOrientation.inRadians() - this.getOrientation().inRadians());

	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		var childPos = child.getPosition();
		//var newChildPosition = new dancevis.Position(childPos.x + (dx * dtheta.cos()), childPos.y + (dy * dtheta.sin()));
		var newChildPosition = new dancevis.Position(childPos.x + dx, childPos.y + dy);
		var newChildOrientation = new dancevis.Orientation(child.getOrientation().inRadians() + dtheta.inRadians());

		child.setMyPositionAndModifyChildren(newChildPosition, newChildOrientation);
	}
	this.setPosition(newPosition);
	this.setOrientation(newOrientation);
}
dancevis.Group.prototype.getOrientation = function() {
	return this.shape.getOrientation();
}
dancevis.Group.prototype.setOrientation = function(orientation) {
	this.shape.setOrientation(orientation);
}
dancevis.Group.prototype.getPosition = function() {
	return this.shape.getPosition();
}
dancevis.Group.prototype.setPosition = function(position) {
	this.shape.setPosition(position);
}
dancevis.Group.prototype.timeIs = function(currentTime) {
	if (!currentTime || currentTime.__type != dancevis.Time.__type) {
		throw new dancevis.Error.DanceVisError("currentTime is not of type time");
	}

	var curr = currentTime.inMilliseconds();
	if (curr < this.lastTime.inMilliseconds())
		return;
	else if (currentTime.isBetween(this.startTime, this.endTime)) {
		this.active = true;
	}
	else if (curr >= this.endTime.inMilliseconds()) {
		this.active = false;
	}

	if (this.active) {
		this.updateChildrenBasedOnMyShape(currentTime);
		this.lastTime = currentTime;
	}
}
dancevis.Group.prototype.insertChild = function(child, index) {
	if (!child || (child.__type != dancevis.Group.__type && child.__type != dancevis.Dancer.__type)) {
		throw new dancevis.Error.DanceVisError("child is neither a group nor a dancer");
	}
	index = dancevis.Util.defaultNum(index, this.children.length);

	if (this.shape.__type == dancevis.Shapes.Circle.__type) {
		var childPos = this.shape.isOnShape(child.getPosition(), 2) ? child.getPosition() : null;
		var childOri = childPos === null ? child.getOrientation() : null;
	}
	else {
		var childPos = child.getPosition();
		var childOri = child.getOrientation();
	}

	var update = this.shape.nextPositionAndOrientation(childPos, childOri, new dancevis.Time(), this.speed);
	child.setMyPositionAndModifyChildren(update.position, update.orientation);

	if (index >= this.children.length) {
		this.children.push(child);
		index = this.children.length - 1;
	}
	else this.children.splice(index, 0, child);
	
	if (this.onChildAddition) {
		this.onChildAddition.call(this, child, index);
	}
}
dancevis.Group.prototype.removeChildById = function(groupId) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].__type == dancevis.Group.__type && this.children[i].groupId == groupId) {
			this.removeChildByIndex(i);
			break;
		}
	}
}
dancevis.Group.prototype.addExitPoint = function(groupEPObj) {
	if (!groupEPObj)
		throw new dancevis.Error.DanceVisError("no parameter provided");

	if (!groupEPObj.nextGroup || groupEPObj.nextGroup.__type != dancevis.Group.__type)
		throw new dancevis.Error.DanceVisError("nextGroup is not of type group");

	if (!groupEPObj.position || groupEPObj.position.__type != dancevis.Position.__type) 
		throw new dancevis.Error.DanceVisError("position is not of type position");		

	if (groupEPObj.startTime !== null) {
		if (!groupEPObj.startTime || groupEPObj.startTime.__type != dancevis.Time.__type) 
			throw new dancevis.Error.DanceVisError("startTime is not of type time");		
	}
	if (groupEPObj.endTime !== null) {
		if (!groupEPObj.endTime || groupEPObj.endTime.__type != dancevis.Time.__type) 
			throw new dancevis.Error.DanceVisError("endTime is not of type time");		
	}
	if (!this.shape.isOnShape(groupEPObj.position, 3))
		throw new dancevis.Error.DanceVisError("position is not on the this group's shape");

	if (!groupEPObj.nextGroup.shape.isOnShape(groupEPObj.position, 3))
		throw new dancevis.Error.DanceVisError("exit position is not on the next group's shape");

	if (groupEPObj.endTime && groupEPObj.endTime &&
		groupEPObj.endTime.inMilliseconds() < groupEPObj.startTime.inMilliseconds())
		throw new dancevis.Error.DanceVisError("endTime is earlier than startTime");

	groupEPObj.element = null;
	if (groupEPObj.showOnScreen)
		groupEPObj.element = dancevis.Util.makeSVGCircle(groupEPObj.position.screenCoords(), 5, "blue", false);

	var name = groupEPObj.name || groupEPObj.position.toString();
	this.exitPoints[name] = groupEPObj;
}
dancevis.Group.prototype.removeChildByIndex = function(index) {
	if (!dancevis.Util.isNum(index)) {
		throw new dancevis.Error.DanceVisError("index must be a numeric value");
	}
	if (index > this.children.length)
		return;

	var child = this.children.splice(index, 1)[0];
	if (this.onChildRemoval) {
		this.onChildRemoval.call(this, child, index);
	}
}
dancevis.Group.prototype.setOptions = function(options) {

}
dancevis.Group.prototype.setShape = function(shape) {
	if (dancevis.Shapes.ShapeTypeId.isValidShapeType(shape.shapeTypeId)) {
		throw new dancevis.Error.DanceVisError("shape is not valid");
	}
	this.shape = shape;
}
dancevis.Group.prototype.setParent = function(parent) {
	if (!parent || parent.__type != dancevis.Group.__type) {
		throw new dancevis.Error.DanceVisError("trying to set a parent that is not a group");
	}
	if (this.parentGroup) {
		this.parentGroup.removeChildById(this.groupId);
	}
	this.parentGroup = parent;
	this.parentGroup.insertChild(this);
}
dancevis.Group.prototype.setOnChildAddition = function(func) {
	this.onChildAddition = func;
}
dancevis.Group.prototype.setOnChildRemoval = function(func) {
	this.onChildRemoval = func;
}
dancevis.Group.prototype.setEndCondition = function(func) {
	this.endCondition = func;
}
dancevis.Group.prototype.showShapeOnScreen = function(bool) {
	if (bool) this.showShape = true;
	else this.showShape = false;
	this.shape.showShapeOnScreen(bool);
}
dancevis.Group.prototype.setUpdateFunction = function(fname, start, stop, func) {
	this.clientUpdateFunctions[fname] = {
		start: start,
		stop: stop,
		func: func
	}
}


/***************** Dancer *****************/
//*** class DancerTypeId
dancevis.DancerTypeId = {
	FOLLOW: dancevis.Util.__enumUnique(),
	LEAD: dancevis.Util.__enumUnique()
}

//*** class DancerShape
dancevis.DancerShape = {//need to make this correspond to svg shapes
	SQUARE: dancevis.Util.__enumUnique(),
	CIRCLE: dancevis.Util.__enumUnique(),
	TRIANGLE: dancevis.Util.__enumUnique()
}

//*** class DancerShapeSize
dancevis.DancerShapeSize = {//need to make this correspond to actual pixel sizes
	SMALL: dancevis.Util.__enumUnique(),
	MEDIUM: dancevis.Util.__enumUnique(),
	LARGE: dancevis.Util.__enumUnique()
}



//*** Class Dancer
dancevis.Dancer = function(dancerOptions) {
	this.__type = dancevis.Dancer.__type;
	this.dancerId = null;
	this.dancerTypeId = null;
	this.dancerShape = null;
	this.dancerSize = null;
	this.dancerName = null;
	this.parent = null;
	this.dancerColor = null;
	this.position = null;
	this.orientation = null;
	this.element = null;

	dancerOptions = dancevis.Util.defaultTo(dancerOptions, {});

	this.dancerTypeId = dancevis.Util.defaultTo(dancerOptions.dancerTypeId, dancevis.DancerTypeId.FOLLOW);
	this.dancerShape = dancevis.Util.defaultTo(dancerOptions.dancerShape, dancevis.DancerShape.CIRCLE);
	this.dancerSize = dancevis.Util.defaultTo(dancerOptions.dancerSize, dancevis.DancerShapeSize.MEDIUM);
	this.dancerName = dancevis.Util.defaultTo(dancerOptions.dancerName, "");
	this.dancerColor = dancevis.Util.defaultTo(dancerOptions.dancerColor, "black");
	this.position = dancevis.Util.defaultTo(dancerOptions.position, new dancevis.Position(0,0));
	this.orientation = dancevis.Util.defaultTo(dancerOptions.orientation, new dancevis.Orientation(0));

	this.dancerId = dancevis.Dancer.__idUnique();
	this.groupId = dancevis.Group.__groupIdUnique();

	var radius = 7;
	if (this.dancerSize == dancevis.DancerShapeSize.SMALL) radius = 6;
	else if (this.dancerSize == dancevis.DancerShapeSize.LARGE) radius = 10;
	this.element = dancevis.Util.makeSVGCircle(this.position, radius, this.dancerColor, false);
}
// Static Variables for class Dancer
dancevis.Dancer.__type = "dancer";
// Static Methods for class Dancer
dancevis.Dancer.__idUnique = dancevis.Util.counter(555, 1);

// Methods for class Dancer
dancevis.Dancer.prototype.getPosition = function() {
	return this.position;
}
dancevis.Dancer.prototype.setPosition = function(position) {
	this.position = position;
}
dancevis.Dancer.prototype.getOrientation = function() {
	return this.orientation;
}
dancevis.Dancer.prototype.setOrientation = function(orientation) {
	this.orientation = orientation;
}
dancevis.Dancer.prototype.updateChildrenBasedOnMyShape = function(currentTime) {
	//do nothing
}
dancevis.Dancer.prototype.setMyPositionAndModifyChildren = function(position, newOrientation) {
	this.position = position;
	this.orientation = newOrientation;

	position = position.screenCoords();
	var elementType = this.element.tagName;
	if (elementType == "circle") {
		//console.log(this.element.tagName);
		this.element.cx.baseVal.value = position.x;
		this.element.cy.baseVal.value = position.y;
	}
	else if (elementType == "div") {
		this.element.style.left = position.x;
		this.element.style.top = position.y;
	}
}

dancevis.TimeManager = function() {
	this.numMillisecondsPerInterval = 10;
	this.intervalId = null;
	this.groups = [];
	this.currentTime = null;
	this.veryFirstTime = true;
	this.reachedEnd = false;
	this.timerDiv = null;
	this.annotations = [];
	this.annotationPosition = new dancevis.Position(400, 100);
}
dancevis.TimeManager.prototype.timer = function(position) {
	if (!this.timerDiv) {
		this.timerDiv = document.createElement("div");
		this.timerDiv.className = "timerDiv";
		this.timerDiv.innerHTML = "00:00:00";
		document.body.appendChild(this.timerDiv);
	}
	else this.timerDiv.parentNode.removeChild(this.timerDiv);

	var screenCoords = position.screenCoords();
	this.timerDiv.style.left = screenCoords.x - (this.timerDiv.offsetWidth / 2) + "px";
	this.timerDiv.style.top = screenCoords.y - (this.timerDiv.offsetHeight / 2) + "px";
	
	return this;
}
dancevis.TimeManager.prototype.scheduleGroup = function(group) {
	if (!group || group.__type != dancevis.Group.__type)
		throw new dancevis.Error.DanceVisError("group is not of type group");

	this.groups.push(group);
	return this;
}
dancevis.TimeManager.prototype.annotateAt = function(position) {
	if (!position || position.__type != dancevis.Position.__type)
		throw new dancevis.Error.DanceVisError("invalid position for annotations");

	this.annotationPosition = position;
	return this;
}
dancevis.TimeManager.prototype.annotate = function(str, startTime, endTime) {
	if (!startTime || startTime.__type != dancevis.Time.__type)
		throw new dancevis.Error.DanceVisError("invalid startTime for annotation");

	if (!endTime || endTime.__type != dancevis.Time.__type) 
		throw new dancevis.Error.DanceVisError("invalid endTime for annotation");

	if (!this.annotationDiv) {
		this.annotationDiv = document.createElement("div");
		this.annotationDiv.className = "annotationDiv";

		var screenCoords = this.annotationPosition.screenCoords();
		this.annotationDiv.style.left = screenCoords.x + "px";
		this.annotationDiv.style.top = screenCoords.y + "px";
		document.body.appendChild(this.annotationDiv);
	}

	var obj = {
		annotation: str,
		startTime: startTime,
		endTime: endTime,
		element: document.createElement("p"),
		shown: false
	}
	obj.element.innerHTML = str;

	this.annotations.push(obj);

	return this;
}
dancevis.TimeManager.prototype.formatedTimeStr = function(currentTime) {
	var toLength = function(num, x) {
		var str = num + "";
		var len = str.length;
		if (len >= x) return str;

		str = "";
		for (var i = 0; i < x - len; i++) str += "0";
		return str + num;
	}

	var tunits = currentTime.inTimeUnits();
	return toLength(tunits.minutes, 2) + ":" + toLength(tunits.seconds, 2) + ":" + toLength(Math.floor(tunits.milliseconds / 10), 2);	
}
dancevis.TimeManager.prototype.onTimeStep = function() {
	var time = new dancevis.Time({milliseconds: (this.currentTime.inMilliseconds() + this.numMillisecondsPerInterval)});

	var stopUpdate = true;
	for (var i = 0; i < this.groups.length; i++) {
		this.groups[i].timeIs(time);
		if (time.isBetween(this.groups[i].startTime, this.groups[i].endTime))
			stopUpdate = false;
	}
	for (var i = 0; i < this.annotations.length; i++) {
		var obj = this.annotations[i];
		var validTime = time.isBetween(this.annotations[i].startTime, this.annotations[i].endTime);
		if (!obj.shown && validTime) {
			this.annotationDiv.appendChild(obj.element);
			obj.shown = true;
		}
		else if (obj.shown && !validTime) {
			obj.element.parentNode.removeChild(obj.element);
			obj.shown = false;
			//this.annotations.splice(i, 1);
		}
	}

	if (stopUpdate) {
		this.reachedEnd = true;
		this.pause();
	}
	else if (this.timerDiv) {
		var frmtime = this.formatedTimeStr(time);
		this.timerDiv.innerHTML = frmtime;
	}
	this.currentTime = time;
}

dancevis.TimeManager.prototype.play = function() {
	if (this.reachedEnd) return;

	if (this.veryFirstTime) {
		dancevis.Time.zeroTimeIsNow();
		this.currentTime = dancevis.Time.now();
		this.veryFirstTime = false;
	}
	
	if (this.intervalId !== null) this.pause();

	var obj = this;
	this.intervalId = setInterval(function() { obj.onTimeStep(); }, this.numMillisecondsPerInterval);
}
dancevis.TimeManager.prototype.pause = function() {
	clearInterval(this.intervalId);
	this.intervalId = null;
}
dancevis.TimeManager.prototype.reset = function() {
	window.location.reload();
}



function DrawBackground(left, top){
	var g = d3.select("g").append("g")
				.attr("class", "lines")
	var i = left, 
		k = left;
	var j = top,
		m = top;

	var w = document.body.offsetWidth;
	var h = document.body.offsetHeight;

	var color = "rgb(212,230,242)";
	var boxsize = 36;

	var originline = g.append("svg:line")
		    .attr("x1", left)
		    .attr("y1", 0)
		    .attr("x2", left)
		    .attr("y2", h)
		    .style("stroke", color)
			.style("stroke-width","2px");
	var originline = g.append("svg:line")
		    .attr("x1", 0)
		    .attr("y1", top)
		    .attr("x2", w)
		    .attr("y2", top)
		    .style("stroke", color)
			.style("stroke-width","2px");

	while(i > 0){
		var myLine = g.append("svg:line")
		    .attr("x1", i)
		    .attr("y1", 0)
		    .attr("x2", i)
		    .attr("y2", h)
		    .style("stroke", color)
			.style("stroke-width","0.75px");
			i -= boxsize;
	}
	while(j > 0){
		var myLine = g.append("svg:line")
		    .attr("x1", 0)
		    .attr("y1", j)
		    .attr("x2", w)
		    .attr("y2", j)
		    .style("stroke", color)
			.style("stroke-width","0.75px");
			j -= boxsize;
	}
	while(k < w){
		var myLine = g.append("svg:line")
		    .attr("x1", k)
		    .attr("y1", 0)
		    .attr("x2", k)
		    .attr("y2", h)
		    .style("stroke", color)
			.style("stroke-width","0.75px");
			k += boxsize;
	}

	while(m < h){
		var myLine = g.append("svg:line")
		    .attr("x1", 0)
		    .attr("y1", m)
		    .attr("x2", w)
		    .attr("y2", m)
		    .style("stroke", color)
			.style("stroke-width","0.75px");
			m += boxsize;
	}
}


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
dancevis.Orientation.prototype.toString = function() {
	var numDecimal = 2;
	var rad = this.radians().toFixed(numDecimal);
	var dec = this.degrees().toFixed(numDecimal);
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
	speedSet = dancevis.Util.defaultTo(speedSet, {});

	// prevent divide by zero
	speedSet.duration = dancevis.Util.defaultTo(speedSet.duration, new dancevis.Time({milliseconds:1}));

	if (speedSet.speed) {
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
    this.startPosition = startPosition;
	this.length = length;
	this.angle = angle;
	this.__type = dancevis.Shapes.Line.__type;
}
// Static Variables for class Shapes.Line
dancevis.Shapes.Line.__type = "line";
// Methods for class Shapes.Line
dancevis.Shapes.Line.prototype.startPosition = function() {
    return startPosition;
}
dancevis.Shapes.Line.prototype.endPosition = function() {
    var endX = this.startPosition.x + this.length * Math.cos(this.angle.inRadians());
	var endY =  this.startPosition.y + this.length * Math.sin(this.angle.inRadians());
    var endPosition = new dancevis.Position(endX, endY);
    return endPosition;
}
dancevis.Shapes.Line.prototype.nextPosition = function(startPosition, dt, speed) {
	var nextX = this.startPosition + (speed*dt)*Math.cos(this.angle.inRadians());
	var nextY = this.startPosition + (speed*dt)*Math.sin(this.angle.inRadians());
	var nextPosition = new dancevis.Position(nextX, nextY);
    return nextPosition;
}
dancevis.Shapes.Line.prototype.length = function() {
   return length;
}
dancevis.Shapes.Line.prototype.angle = function() {
   return angle;
}
dancevis.Shapes.Line.prototype.distanceToLine = function() {
     
}

dancevis.Shapes.Line.prototype.isOnShape = function(position) {
   var endPoint = this.endPosition();
   var a = (endPoint.y - this.startPosition.y) / (endPoint.x - this.startPosition.x);
   var b = this.startPosition.y - a * this.startPosition.x;
   if ( Math.abs(position.y - (a*position.x+b)) < .001){
      console.log(position.y);
	  console.log(a*position.x +b);
	  return true;
      if(position.x >= this.startPosition.x && position.x <= endPoint.x){
	       return true;
	  }
   }
   return false;
}

dancevis.Shapes.Line.prototype.drawLine = function(){
   var endPoint = this.endPosition();
 var myLine = d3.select("g").append("svg:line")
    .attr("x1", this.startPosition.x)
    .attr("y1", this.startPosition.y)
    .attr("x2", endPoint.x)
    .attr("y2", endPoint.y)
    .style("stroke", "rgb(6,120,155)");
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
}
// Static Variables for class Shapes.Circle
dancevis.Shapes.Circle.__type = "circle";
// Methods for class Shapes.Circle
dancevis.Shapes.Circle.prototype.startPosition = function() {

}
dancevis.Shapes.Circle.prototype.referencePoint = function(position) {
	return this.center;
}
dancevis.Shapes.Circle.prototype.referencePointIs = function(position) {
	this.center = position;
	if (this.element) {
		var screenPos = this.center.screenCoords();
		this.element.cx.baseVal.value = screenPos.x;
		this.element.cy.baseVal.value = screenPos.y;
	}
}
dancevis.Shapes.Circle.prototype.nextPosition = function(startPosition, dt, speed) {
	if (!startPosition || startPosition.__type != dancevis.Position.__type ||
		!dt || dt.__type != dancevis.Time.__type ||
		!speed || speed.__type != dancevis.Speed.__type) {
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	}
	var dist = dt.inSeconds() * speed.speed();
	var radiansCovered = dist / this.radius;
	var positionAngle = this.angleFromPosition(startPosition);
	if (this.clockwise) {
		var newAngle =  new dancevis.Orientation(positionAngle.inRadians() - radiansCovered);
		return this.center.positionInDirection(this.radius, newAngle);
	}
	else {
		var nextPos = this.center.positionInDirection(this.radius,
				new dancevis.Orientation(positionAngle.inRadians() + radiansCovered));
		return nextPos;
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
dancevis.Shapes.Circle.prototype.isOnShape = function(position) {
	if (!position || position.__type != dancevis.Position.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	var distFromCenter = this.center.distance(position);
	if (!dancevis.Util.floatsEqual(distFromCenter, this.radius))
		return false;
	var positionAngle = this.angleFromPosition(position);
	var stopIsBigger = this.startAngle.inRadians() < this.stopAngle.inRadians();
	var big = stopIsBigger ? this.stopAngle : this.startAngle;
	var small = stopIsBigger ? this.startAngle : this.stopAngle;
	if (positionAngle.inRadians() < small.inRadians() || positionAngle.inRadians() > big.inRadians()) {
		return false;
	}
	return true;
}
dancevis.Shapes.Circle.prototype.showShapeOnScreen = function(bool) {
	if (bool) {
		if (this.element) {
			dancevis.Util.removeSVG(this.element);
			delete this.element;
		}
		this.element = dancevis.Util.makeSVGCircle(this.center.screenCoords(), this.radius, "black", true);
	}
	else {
		dancevis.Util.removeSVG(this.element);
		delete this.element;
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
dancevis.Shapes.Grid = function(gridOptions) {
	this.positionBounds = null;
	this.__type = dancevis.Shapes.Grid.__type;
}
// Static Variables for class Shapes.Grid
dancevis.Shapes.Grid.__type = "grid";
// Methods for class Shapes.Grid
dancevis.Shapes.Grid.prototype.startPosition = function() {

}
dancevis.Shapes.Grid.prototype.endPosition = function() {

}
dancevis.Shapes.Grid.prototype.nextPosition = function(startPosition, dt, speed) {

}
dancevis.Shapes.Grid.prototype.positionAt = function(row, col) {

}
dancevis.Shapes.Grid.prototype.numRows = function() {

}
dancevis.Shapes.Grid.prototype.numCols = function() {

}
dancevis.Shapes.Grid.prototype.angle = function() {

}
dancevis.Shapes.Grid.prototype.setCenter = function(center) {

}
dancevis.Shapes.Grid.prototype.setGridSpacing = function(spacing) {

}
dancevis.Shapes.Grid.prototype.gridSpacing = function() {

}
dancevis.Shapes.Grid.prototype.setOptions = function(gridOptions) {

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
	this.position = null;
	this.beginAction = null;
	this.endAction = null;
	this.endCondition = null;
	this.clientUpdateFunctions = null;
	this.groupId = null;

	groupOptions = dancevis.Util.defaultTo(groupOptions, {});
	if (!groupOptions.shape) 
		throw new dancevis.Error.DanceVisError("invalid parameters to construct a group");

	if (!groupOptions.startTime || groupOptions.startTime.__type != dancevis.Time.__type)
		throw new dancevis.Error.DanceVisError("invalid parameters to construct a group");

	if (!groupOptions.endTime || groupOptions.endTime.__type != dancevis.Time.__type)
		throw new dancevis.Error.DanceVisError("invalid parameters to construct a group");

	if (!groupOptions.speed || groupOptions.speed.__type != dancevis.Speed.__type)
		throw new dancevis.Error.DanceVisError("invalid parameters to construct a group");

	if (!groupOptions.position || groupOptions.position.__type != dancevis.Position.__type) 
		throw new dancevis.Error.DanceVisError("invalid parameters to construct a group");
	
	if (groupOptions.startTime.inMilliseconds() >= groupOptions.endTime.inMilliseconds()) {
		throw new dancevis.Error.DanceVisError("startTime must be earlier than endTime");
	}

	this.children = [];
	this.shape = groupOptions.shape.copy();
	this.speed = groupOptions.speed.copy();
	this.startTime = groupOptions.startTime.copy();
	this.endTime = groupOptions.endTime.copy();
	this.lastTime = this.startTime.copy();

	this.referencePointIs(groupOptions.position.copy());

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
	
	for (var fname in this.clientUpdateFunctions) {
		var fobj = this.clientUpdateFunctions[fname];
		if (curr >= fobj.start.inMilliseconds() && curr <= fobj.stop.inMilliseconds()) {
			fobj.func.call(this);
		}
	}
	
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
			
		// calculate new child position based on shape
		var newPosition = this.shape.nextPosition(child.position, dt, this.speed);
		
		// set child position to the new one
		child.setMyPositionAndModifyChildren(newPosition);
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
dancevis.Group.prototype.setMyPositionAndModifyChildren = function(newPosition) {
	if (!newPosition || newPosition.__type != dancevis.Position.__type) {
		throw new dancevis.Error.DanceVisError("newPosition is not of type position");
	}

	var dx = newPosition.x - this.position.x;
	var dy = newPosition.y - this.position.y;
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		var childPos = child.position;
		var newChildPosition = new dancevis.Position(childPos.x + dx, childPos.y + dy);
		//console.log(newPosition.toString());
		child.setMyPositionAndModifyChildren(newChildPosition);
	}
	this.referencePointIs(newPosition);
}
dancevis.Group.prototype.referencePoint = function(position) {
	return this.shape.referencePoint();
}
dancevis.Group.prototype.referencePointIs = function(position) {
	this.position = position;
	this.shape.referencePointIs(position);
}
dancevis.Group.prototype.forwardChild = function(child, toGroup) {

}
dancevis.Group.prototype.timeIs = function(currentTime) {
	if (!currentTime || currentTime.__type != dancevis.Time.__type) {
		throw new dancevis.Error.DanceVisError("currentTime is not of type time");
	}

	var curr = currentTime.inMilliseconds();
	if (curr < this.lastTime.inMilliseconds())
		return;
	else if (curr >= this.startTime.inMilliseconds() && curr <= this.endTime.inMilliseconds()) {
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
	var newPosition = this.shape.nextPosition(child.position, new dancevis.Time(), this.speed);
	//console.log(child.position.toString() + " => " + newPosition.toString());
	if (index >= this.children.length) {
		child.setMyPositionAndModifyChildren(newPosition);
		this.children.push(child);
	}
	else {
		child.setMyPositionAndModifyChildren(newPosition);
		this.children.splice(index, 0, child);
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
dancevis.Group.prototype.removeChildByIndex = function(index) {
	if (!dancevis.Util.isNum(index)) {
		throw new dancevis.Error.DanceVisError("index must be a numeric value");
	}
	if (index > this.children.length)
		return;
	this.children.splice(index, 1);
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
dancevis.Group.prototype.setBeginAction = function(func) {
	this.beginAction = func;
}
dancevis.Group.prototype.setEndAction = function(func) {
	this.endAction = func;
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
	this.dancerSize = dancevis.Util.defaultTo(dancerOptions.dancerSize, dancevis.DancerShapeSize.SMALL);
	this.dancerName = dancevis.Util.defaultTo(dancerOptions.dancerName, "");
	this.dancerColor = dancevis.Util.defaultTo(dancerOptions.dancerColor, "black");
	this.position = dancevis.Util.defaultTo(dancerOptions.position, new dancevis.Position(0,0));
	this.orientation = dancevis.Util.defaultTo(dancerOptions.orientation, new dancevis.Orientation(0));

	this.dancerId = dancevis.Dancer.__idUnique();
	//this.parent = 
	
	/*
	var selection = d3.select("g").append("svg:circle")
					.attr("r", 4)
	         		.attr("fill", this.dancerColor)
	         		.attr("stroke", this.dancerColor)
		    		.attr("transform", "translate("+ 0 +"," + 0 + ")");
	
	this.element = selection[0][0];
	*/

	var svg = document.getElementsByTagName("svg")[0];
	var g = svg.firstChild;
	var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "circle")

	svgElement.style.fill = this.dancerColor;
	svgElement.r.baseVal.value = 5;
	svgElement.cx.baseVal.value = this.position.x;
	svgElement.cy.baseVal.value = this.position.y;
	g.appendChild(svgElement);
	this.element = svgElement;
	
	//this.element = document.getElementById("divvy");
	//don't have dancerId, parent, element

}
// Static Variables for class Dancer
dancevis.Dancer.__type = "dancer";
// Static Methods for class Dancer
dancevis.Dancer.__idUnique = dancevis.Util.counter(555, 1);

// Methods for class Dancer
dancevis.Dancer.prototype.position = function() {
	return this.position;
}
dancevis.Dancer.prototype.orientation = function() {
	return this.orientation;
}
dancevis.Dancer.prototype.updateChildrenBasedOnMyShape = function(currentTime) {
	//do nothing
}
dancevis.Dancer.prototype.setMyPositionAndModifyChildren = function(position) {
	this.position = position;
	position = position.screenCoords();
	var elementType = this.element.tagName;
	if (elementType == "circle") {
		//console.log(this.element.tagName);
		this.element.cx.baseVal.value = position.x;
		this.element.cy.baseVal.value = position.y;
	}
	else if (elementType == "html:div") {
		this.element.style.left = position.x;
		this.element.style.top = position.y;
	}
}






dancevis.Position.screenOriginIs(400, 200);
var origin = new dancevis.Position(0, 0)
dancevis.Time.zeroTimeIsNow();




var outercircle = new dancevis.Shapes.Circle(origin, 100);
var innercircle = new dancevis.Shapes.Circle(origin, 20);

var bottom1 = outercircle.positionAtAngle(new dancevis.Orientation(200, false));
var bottomAngle = outercircle.angleFromPosition(bottom1);
dancevis.Util.makeSVGCircle(bottom1.screenCoords(), 10, "green");

var outerOptions = {
	shape: outercircle,
	startTime: dancevis.Time.now(),
	endTime: new dancevis.Time({seconds:20}),
	speed: new dancevis.Speed({speed:outercircle.radius*3}),
	position: outercircle.center
}
var outer = new dancevis.Group(outerOptions);
//outer.shape.clockwise = true;
outer.showShapeOnScreen(true);

outerOptions.startTime = new dancevis.Time({seconds:3}),
outerOptions.endTime = new dancevis.Time({seconds:30});
outerOptions.position = bottom1;
var outer2 = new dancevis.Group(outerOptions);
outer2.showShapeOnScreen(true);



var innerOptions = {
	shape: innercircle,
	startTime: dancevis.Time.now(),
	endTime: new dancevis.Time({seconds:30}),
	//parentGroup: outer,
	speed: new dancevis.Speed({speed:(innercircle.radius*3.7)})
}

innerOptions.position = origin.positionInDirection(200, new dancevis.Orientation(60, false));
var inner1 = new dancevis.Group(innerOptions);
inner1.showShapeOnScreen(true);
inner1.setParent(outer);

innerOptions.position = origin.positionInDirection(200, new dancevis.Orientation(120, false));
var inner2 = new dancevis.Group(innerOptions);
inner2.showShapeOnScreen(true);
inner2.setParent(outer);

innerOptions.position = origin.positionInDirection(200, new dancevis.Orientation(200, false));
var inner3 = new dancevis.Group(innerOptions);
inner3.showShapeOnScreen(true);
inner3.setParent(outer);



var pos1 = outer.referencePoint().positionInDirection(10, new dancevis.Orientation(60));
var pos2 = outer.referencePoint().positionInDirection(10, new dancevis.Orientation(120));
var pos3 = outer.referencePoint().positionInDirection(10, new dancevis.Orientation(200));

var dancer1 = new dancevis.Dancer({position:pos1});
var dancer2 = new dancevis.Dancer({position:pos2});
var dancer3 = new dancevis.Dancer({position:pos3});
/*
var dancer1 = new dancevis.Dancer({position:new dancevis.Position(300, 100)});
var dancer2 = new dancevis.Dancer({position:new dancevis.Position(600, 100)});
var dancer3 = new dancevis.Dancer({position:new dancevis.Position(500, 300)});
*/
inner1.insertChild(dancer1);
inner2.insertChild(dancer2);
inner3.insertChild(dancer3);


outer.setUpdateFunction("reverse", new dancevis.Time({seconds:5}), outer.endTime, function() {
	this.shape.clockwise = true;
});

var nMili = 10;
var interval = setInterval(function() {
	var time = dancevis.Time.now();
	outer.timeIs(time);
	var sec = time.inSeconds();
	if (sec > 3 && sec < 5) {
		inner1.setParent(outer2);
		inner2.setParent(outer2);
	}
	else if (sec >5) {
		inner1.setParent(outer);


	}

	outer2.timeIs(time);
}, nMili);


setTimeout(function() {
	clearInterval(interval);
}, 10000);


/*
var div = document.getElementById("divvy");
var divPos = new dancevis.Position(div.offsetLeft, div.offsetTop);
var nMili = 10;
var interval = setInterval(function() {
	var startPosition = dancevis.Position.screenToModelCoords(divPos.x, divPos.y);
	var dt = new dancevis.Time({milliseconds:nMili});
	var next = circle.nextPosition(startPosition, dt, speed);
	next = next.screenCoords();
	divPos.x = next.x;
	divPos.y = next.y;
	div.style.left = divPos.x;
	div.style.top = divPos.y;
}, nMili);

setTimeout(function() {
	clearInterval(interval);
}, 7000);
*/














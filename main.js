
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
	if (other.__type != dancevis.Position.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	return Math.sqrt(Math.pow(other.x - this.x, 2.0) + Math.pow(other.y - this.y, 2.0));
}
dancevis.Position.prototype.positionInDirection = function(distance, angle) {
	if (angle.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	var xPos = this.x + (distance * angle.cos());
	var yPos = this.y + (distance * angle.sin());
	return new dancevis.Position(xPos, yPos);
}
dancevis.Position.prototype.equals = function(other) {
	if (other.__type != dancevis.Position.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	return (other.x == this.x && other.y == this.y);
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
	if (other.__type != dancevis.Orientation.__type)
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
	if (other.__type != dancevis.Orientation.__type)
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
	if (other.__type != dancevis.Speed.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	return (other.pixelsPerSecond == this.pixelsPerSecond);
}
dancevis.Speed.prototype.toString = function() {
	var numDecimal = 2;
	var speed = this.pixelsPerSecond.toFixed(numDecimal);
	return "("+speed+" ppms)";
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
	toString: null
}
// Methods for class Shapes.ShapeTypeId
dancevis.Shapes.ShapeTypeId.toString = function(typeId) {

}


//*** class Shapes.GeometricShape
dancevis.Shapes.GeometricShape = function(shapeTypeId) {
	this.__type = dancevis.Shapes.GeometricShape.__type;
	this.shapeId = null;
	this.shapeTypeId = null;
	this.positionBounds = null;

	var validShape = false;
	for (var p in dancevis.Shapes.ShapeTypeId) {
		if (dancevis.Shapes.ShapeTypeId[p] == shapeTypeId) {
			validShape = true;
			break;
		}
	}
	if (!validShape) {
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
	this.__type = dancevis.Shapes.Line.__type;
}
// Static Variables for class Shapes.Line
dancevis.Shapes.Line.__type = "line";
// Methods for class Shapes.Line
dancevis.Shapes.Line.prototype.startPosition = function() {

}
dancevis.Shapes.Line.prototype.endPosition = function() {

}
dancevis.Shapes.Line.prototype.nextPosition = function(startPosition, dt, speed) {

}
dancevis.Shapes.Line.prototype.length = function() {

}
dancevis.Shapes.Line.prototype.angle = function() {

}
dancevis.Shapes.Line.prototype.distanceToLine = function() {

}
dancevis.Shapes.Line.prototype.isOnShape = function(position) {

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
dancevis.Shapes.Circle.prototype.nextPosition = function(startPosition, dt, speed) {
	if (startPosition.__type != dancevis.Position.__type ||
		dt.__type != dancevis.Time.__type ||
		speed.__type != dancevis.Speed.__type) {
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
	if (angle.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	return this.center.positionInDirection(this.radius, angle);
}
dancevis.Shapes.Circle.prototype.angleFromPosition = function(position) {
	if (position.__type != dancevis.Position.__type)
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
	if (angle.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	return angle.inRadians() * this.radius;
}
dancevis.Shapes.Circle.prototype.setStartAngle = function(angle) {
	if (angle.__type != dancevis.Orientation.__type)
		throw new dancevis.Error.DanceVisError("wrong type supplied");
	this.startAngle = angle;
}
dancevis.Shapes.Circle.prototype.setStopAngle = function(angle) {
	if (angle.__type != dancevis.Orientation.__type)
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
	if (position.__type != dancevis.Position.__type)
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
	this.startTime = null;
	this.endTime = null;
	this.lastTime = null;

	groupOptions = dancevis.Util.defaultTo(groupOptions, {});
	if (!groupOptions.shape ||
		!groupOptions.startTime || groupOptions.startTime.__type != dancevis.Time.__type ||
		!groupOptions.endTime || groupOptions.endTime.__type != dancevis.Time.__type) {
		throw new dancevis.Error.DanceVisError("invalid parameters to construct a group");
	}
	this.children = [];
	this.parentGroup = dancevis.Util.defaultTo(groupOptions.parentGroup, null);
	this.shape = groupOptions.shape;
	this.startTime = groupOptions.startTime;
	this.endTime = groupOptions.endTime;
}
// Static Variables for class Group
dancevis.Group.__type = "group";
// Methods for class Group
dancevis.Group.prototype.updateChildrenBasedOnMyShape = function(currentTime) {
	if (currentTime.__type != dancevis.Time.__type) {
		throw new dancevis.Error.DanceVisError("currentTime is not of type time");
	}
	var timeDiff = new dancevis.Time({milliseconds:(currentTime.inMilliseconds - this.lastTime.inMilliseconds)});
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		// update my children based on my shape
		child.setMyPositionAndModifyChildren();
	}
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.updateChildrenBasedOnMyShape(currentTime);
	}
	this.lastTime = currentTime;
}
dancevis.Group.prototype.setMyPositionAndModifyChildren = function(position) {

}
dancevis.Group.prototype.forwardChild = function(child, toGroup) {

}
dancevis.Group.prototype.timeIs = function(currentTime) {

}
dancevis.Group.prototype.insertChild = function(child, index) {

}
dancevis.Group.prototype.removeChild = function(index) {

}
dancevis.Group.prototype.setOptions = function(options) {

}
dancevis.Group.prototype.setShape = function(shape) {

}
dancevis.Group.prototype.setParent = function(parent) {

}
dancevis.Group.prototype.setBeginAction = function(func) {

}
dancevis.Group.prototype.setEndAction = function(func) {

}
dancevis.Group.prototype.setEndCondition = function(func) {

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

	var defaultOptions = {
		dancerShape: dancevis.DancerShape.CIRCLE,
		dancerSize: dancevis.DancerShapeSize.SMALL,
		dancerColor: "black",
		position: new dancevis.Position(0,0),
		orientation: new dancevis.Orientation(0)
	}

	dancerOptions = dancevis.Util.defaultTo(dancerOptions, defaultOptions);

	this.dancerTypeId = dancevis.Util.defaultTo(dancerOptions.dancerTypeId, dancevis.DancerTypeId.FOLLOW);
	this.dancerShape = dancerOptions.dancerShape;
	this.dancerSize = dancerOptions.dancerSize;
	this.dancerName = dancerOptions.dancerName;
	this.dancerColor = dancerOptions.dancerColor;
	this.position = dancerOptions.position;
	this.orientation = dancerOptions.orientation;

	this.dancerId = dancevis.Dancer.__idUnique();
	//this.parent = 
	this.element = d3.select("g").append("svg:square");
	d3.select("g").append("svg:circle")
	         		.attr("r", 4)
	         		.attr("fill", this.dancerColor)
	         		.attr("stroke", this.dancerColor)
		    		.attr("transform", "translate("+ 0 +"," + 0 + ")");

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
}


dancevis.Position.screenOriginIs(400, 200);
var origin = new dancevis.Position(0, 0)
var circle = new dancevis.Shapes.Circle(origin, 200.0);
var div = document.getElementById("divvy");
var speed = new dancevis.Speed({speed:200});
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















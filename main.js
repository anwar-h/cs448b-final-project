
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
dancevis.Util.defaultTo = function(value, defaultToThisValue){
	if (value == undefined)
		return defaultToThisValue;
	return value;
}
dancevis.Util.isNum = function(value) {
	return (typeof(value) == 'number' && !isNaN(value));
}

dancevis.Util.__enumUnique = (function() {
	var counter = 28374859;
	return function() {
		return (counter += 1);
	}
})();


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
	this.x = null;
	this.y = null;
	if (!dancevis.Util.isNum(x) || !dancevis.Util.isNum(y)) {
		throw new dancevis.Error.DanceVisError("x, y for Position must be numeric values");
	}
	this.x = dancevis.Util.defaultTo(x, 0);
	this.y = dancevis.Util.defaultTo(y, 0);
}
// Static Variables for class Position
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
// Methods for class Position
dancevis.Position.prototype.distance = function(other) {
	return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
}
dancevis.Position.prototype.equals = function(other) {
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
	return "("+xStr+", "+yStr+")";
}

//*** class Orientation
dancevis.Orientation = function(angle, isRadians) {
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
// Static Methods for class Orientation
dancevis.Orientation.radiansToDegrees = function(radians) {
	return radians * 360.0 / (2 * Math.PI);
}
dancevis.Orientation.degreesToRadians = function(degrees) {
	return degrees * 2 * Math.PI / 360.0;
}
// Methods for class Orientation
dancevis.Orientation.prototype.radians = function() {
	return this.angle;
}
dancevis.Orientation.prototype.degrees = function() {
	return dancevis.Orientation.radiansToDegrees(this.angle);
}
dancevis.Orientation.prototype.equals = function(other) {
	return (other.angle == this.angle);
}
dancevis.Orientation.prototype.cos = function() {
	return Math.cos(this.angle);
}
dancevis.Orientation.prototype.sin = function() {
	return Math.sin(this.angle);
}
dancevis.Orientation.prototype.angleBetween = function(other) {
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

}
// Static Methods for class Time
dancevis.Time.zeroTimeIsNow = function() {

}
dancevis.Time.now = function() {

}
// Methods for class Time
dancevis.Time.prototype.milliseconds = function() {

}
dancevis.Time.prototype.seconds = function() {

}
dancevis.Time.prototype.minutes = function() {

}
dancevis.Time.prototype.hours = function() {

}
dancevis.Time.prototype.equals = function(other) {

}
dancevis.Time.prototype.toString = function() {

}

//*** class Speed
dancevis.Speed = function(speedSet) {

}
// Methods for class Speed
dancevis.Speed.prototype.speed = function() {

}
dancevis.Speed.prototype.speedSet = function(speedSet) {

}
dancevis.Speed.prototype.equals = function(other) {

}
dancevis.Speed.prototype.toString = function() {

}


//*** class PositionBounds
dancevis.PositionBounds = function(sw, ne) {

}
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

}
// Methods for class Shapes.GeometricShape
dancevis.Shapes.GeometricShape.prototype.boundingBox = function() {

}


//*** class Shapes.Line
dancevis.Shapes.Line = function(startPosition, length, angle) {

}
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

}
// Methods for class Shapes.Circle
dancevis.Shapes.Circle.prototype.startPosition = function() {

}
dancevis.Shapes.Circle.prototype.nextPosition = function(startPosition, dt, speed) {

}
dancevis.Shapes.Circle.prototype.arcLength = function(angle) {

}
dancevis.Shapes.Circle.prototype.setStartAngle = function(angle) {

}
dancevis.Shapes.Circle.prototype.setStopAngle = function(angle) {

}
dancevis.Shapes.Circle.prototype.startAngle = function() {

}
dancevis.Shapes.Circle.prototype.stopAngle = function() {

}
dancevis.Shapes.Circle.prototype.isOnShape = function(position) {

}


//*** class Shapes.Point
dancevis.Shapes.Point = function(pointOptions) {

}
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

}
//Methods for class Shapes.Grid
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

}
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

}
// Methods for class Group
dancevis.Group.prototype.updateChildrenBasedOnMyShape = function(currentTime) {

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

	if(dancerOptions === undefined){
		dancerOptions = defaultOptions;
	}

	this.dancerTypeId = dancevis.Util.defaultTo(dancerOptions.dancerTypeId, dancevis.DancerTypeId.FOLLOW);
	this.dancerShape = dancerOptions.dancerShape;
	this.dancerSize = dancerOptions.dancerSize;
	this.dancerName = dancerOptions.dancerName;
	this.dancerColor = dancerOptions.dancerColor; 
	this.position = dancerOptions.position;
	this.orientation = dancerOptions.orientation;

	this.dancerId = dancevis.Dancer.__idUnique();
	//this.parent = 


	if (this.dancerShape == dancevis.DancerShape.CIRCLE){
		this.element = d3.select("g").append("svg:circle")
						.attr("r", 2)
						.attr("cx", this.position.x)
						.attr("cy", this.position.y)
						.attr("fill", this.dancerColor)
						.attr("stroke", this.dancerColor)

						//.attr("transform", "translate("+ this.position.x +"," + this.position.y + ")");
	}
	if (this.dancerShape == dancevis.DancerShape.SQUARE){
		this.element = d3.select("g").append("svg:rect")
						.attr("width", 2)
						.attr("height", 2)
						.attr("x", this.position.x)
						.attr("y", this.position.y)
						.attr("fill", this.dancerColor)
						.attr("stroke", this.dancerColor)
						//.attr("transform", "translate("+ this.position.x +"," + this.position.y + ")");
	}
	if (this.dancerShape == dancevis.DancerShape.TRIANGLE){
		var top = new dancevis.Position(this.position.x, this.position.y - 20);
		var left = new dancevis.Position(this.position.x - 20, this.position.y + 10);
		var right = new dancevis.Position(this.position.x + 20, this.position.y + 10);
		var points = (top + " " + left + " " + right).replace(/\(/g, "").replace(/\)/g, "");
		console.log(points);
		this.element = d3.select("g").append("svg:polygon")
						.attr("points", points)
						.attr("fill", this.dancerColor)
						.attr("stroke", this.dancerColor)
						.attr("transform", "translate("+ this.position.x +"," + this.position.y + ")");
	}
	//don't have dancerId, parent, element

}
//Static Methods for class Dancer
dancevis.Dancer.__idUnique = (function() {
	var counter = 555;
	return function() {
		return (counter += 1);
	}
})();
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

//console.log("enumUnique=" + dancevis.Util.__enumUnique());

























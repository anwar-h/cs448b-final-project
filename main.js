
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
	this.message = "'"+message+"'" || defaultMessage;
}
dancevis.Error.DanceVisError.prototype = new Error();
dancevis.Error.DanceVisError.prototype.constructor = dancevis.Error.DanceVisError;


//*** class Position
dancevis.Position = function(x, y) {

}
// Static Methods for class Position
dancevis.Position.screenOriginIs = function(left, top) {

}
// Methods for class Position
dancevis.Position.prototype.distance = function(other) {

}
dancevis.Position.prototype.equals = function(other) {

}
dancevis.Position.prototype.screenCoords = function() {

}
dancevis.Position.prototype.toString = function() {

}

//*** class Orientation
dancevis.Orientation = function(angle, isRadians) {

}
// Static Methods for class Orientation
dancevis.Orientation.radiansToDegrees = function(radians) {

}
dancevis.Orientation.degreesToRadians = function(degrees) {

}
// Methods for class Orientation
dancevis.Orientation.prototype.angle = function(inRadians) {

}
dancevis.Orientation.prototype.equals = function(other) {

}
dancevis.Orientation.prototype.cos = function() {

}
dancevis.Orientation.prototype.sin = function() {

}
dancevis.Orientation.prototype.angleBetween = function(other) {

}
dancevis.Orientation.prototype.toString = function() {

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
	this.element = d3.select("svg").append("svg:circle")
	         		.attr("r", 2)
	         		.attr("fill", this.dancerColor)
	         		.attr("stroke", this.dancerColor)
		    		.attr("transform", "translate("+ (w/2) +"," + (h/2) + ")");

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


















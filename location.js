function Point(x, y, description){
    this.x = x;
    this.y = y;
    this.description = description;
    this.size = 30;
    this.colour = color(189,52,10);

    this.show = function(){
        push();
        stroke(this.colour);
        strokeWeight(this.size);
        point(this.x, this.y);
        pop();
    }

    this.move = function(posX, posY){
        this.x = posX;
        this.y = posY;
    }

    this.distance = function(otherPoint){
        return dist(this.x, this.y, otherPoint.x, otherPoint.y);
    }
}

function Line(point1, point2){

    this.give = 0.3;

    this.colour = color(145,145,145);

    this.point1 = point1;
    this.point2 = point2;

    // Define the limits of the lines
    if(this.point1.x > this.point2.x){
        this.xUpperLimit = this.point1.x;
        this.xLowerLimit = this.point2.x;
    } else{
        this.xUpperLimit = this.point2.x;
        this.xLowerLimit = this.point1.x;
    }

    if(this.point1.y > this.point2.y){
        this.yUpperLimit = this.point1.y;
        this.yLowerLimit = this.point2.y;
    } else{
        this.yUpperLimit = this.point2.y;
        this.yLowerLimit = this.point1.y;
    }
    

    this.gradient = (-1)*(this.point2.y - this.point1.y) / (this.point2.x - this.point1.x); // Mathematical gradient of a straight line, adjusted for p5
    this.intercept = (height - this.point1.y) - (this.gradient * this.point1.x); // y-intercept needed to define a line
    this.distance = point1.distance(point2);

    this.update = function(newPoint1, newPoint2){
        this.point1 = newPoint1;
        this.point2 = newPoint2;
    }

    this.show = function(){
        push();
        stroke(this.colour);
        strokeWeight(5);
        line(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
        pop();
    }

    // Have to come up with my own way to do a dotted line
    this.showDotted = function(){
        let totalDist = dist(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
        let iterations = Math.floor(totalDist/3);
        let dashLength = 5;
        let spaceLength = 2;

        let currentY = this.point1.x,
            currentX = this.point1.y;
        for (i = 0; i < iterations; i++){
            line(currentX, currentY, currentX + dashLength, currentY + dashLength);
            currentX += dashLength+spaceLength;
            currentY += dashLength+spaceLength;
        }
    }

    this.intersection = function(otherLine){

        // Gives x-coordinate of the intersection between the lines.
        let xValue = (otherLine.intercept - this.intercept) / (this.gradient - otherLine.gradient);
        // Computes respective y-coordinate
        let yValue = height - ((this.gradient * xValue) + this.intercept);

        // Point must be on the line to be rendered.
        if (this.isOutOfBounds(xValue, yValue) || otherLine.isOutOfBounds(xValue, yValue)){
            this.colour = color(145,145,145);
            otherLine.colour = color(145,145,145);
            return null;
        }else{
            this.colour = color(0,0,0);
            otherLine.colour = color(0,0,0);
            return new Point(xValue, yValue);
        }
    }

    // Checks for boundary conditions, ensuring a point drawn on a line is on the relevant part of the line.
    this.isOutOfBounds = function(xVal, yVal){
        return xVal > this.xUpperLimit-this.give || xVal < this.xLowerLimit+this.give || 
            yVal > this.yUpperLimit-this.give || yVal < this.yLowerLimit+this.give;
    }
}
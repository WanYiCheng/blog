/**
 * Created by xiaowan on 2016/4/5.
 */
/**
 * Created by xiaowan on 2016/1/16.
 */
//海藻对象
var aneObj = function(){
    this.rootx = [];
    this.headx = [];
    this.heady = [];
    this.amp = [];
    this.alpha = 0;
}
aneObj.prototype.num = 50;
aneObj.prototype.init = function(){
    for(var i=0; i<this.num;i++){
        this.rootx[i] = i*25 + Math.random()*20;
        this.headx[i] = this.rootx[i];
        this.heady[i] = canHeight - 220 + Math.random()*50;
        this.amp[i] = Math.random()*50 + 50;

    }


};
aneObj.prototype.draw = function(){
    this.alpha += deltaTime*0.0007;
    var l = Math.sin(this.alpha);
    ctx2.save();
    ctx2.globalAlpha = 0.6;
    ctx2.lineWidth = 20;
    ctx2.lineCap = "round";
    ctx2.strokeStyle = "#2b133d";
    for(var i =0; i<this.num; i++){
        ctx2.beginPath();
        ctx2.moveTo(this.rootx[i], canHeight);
        this.headx[i] = this.rootx[i] + l*this.amp[i];
        ctx2.quadraticCurveTo(this.rootx[i], canHeight - 100, this.headx[i], this.heady[i]);

        ctx2.stroke();
    }
    ctx2.restore();

};

//气泡果实

/**
 * Created by xiaowan on 2016/1/16.
 */
var fruitObj = function(){

    this.alive = [];
    this.orange = new Image();
    this.blue = new Image();
    this.aneNo = [];
    this.x = [];
    this.y = [];
    this.l = [];
    this.fruitType = [];
    this.spd = [];

};

fruitObj.prototype.num =  30;
fruitObj.prototype.init = function(){
    for(var i=0;i<this.num;i++){
        this.alive[i]=false;
        this.x[i] = 0;
        this.y[i] = 0;
        this.spd[i] = Math.random()*0.017 + 0.003;
        this.fruitType[i] = "";
        this.aneNo[i] = 0;

    }
    this.orange.src = "./src/fruit.png";
    this.blue.src = "./src/blue.png";
}
fruitObj.prototype.draw = function() {

    for (var i = 0; i < this.num; i++) {
        if (this.alive[i]) {
            var pic;
            if( this.fruitType[i] == "blue"){
                pic = this.blue;
            }else{
                pic = this.orange;
            }
            if (this.l[i] <= 14) {
                var NO = this.aneNo[i];
                this.x[i] = ane.headx[NO];
                this.y[i] = ane.heady[NO];
                this.l[i] += this.spd[i] * deltaTime;
                //ctx2.drawImage(pic, this.x[i] - this.l[i] * 0.5, this.y[i] - this.l[i] * 0.5, this.l[i], this.l[i]);

            } else {
                this.y[i] -= this.spd[i] * 7 * deltaTime;
                //ctx2.drawImage(pic, this.x[i] - this.l[i] * 0.5, this.y[i] - this.l[i] * 0.5, this.l[i], this.l[i]);

            }
            ctx2.drawImage(pic, this.x[i] - this.l[i] * 0.5, this.y[i] - this.l[i] * 0.5, this.l[i], this.l[i]);

            if (this.y[i] < 10) {
                this.alive[i] = false;
            }
        }
    }
}
fruitObj.prototype.born = function(i){
    this.aneNo[i] = Math.floor(Math.random()*ane.num);
    this.l[i] = 0;
    this.alive[i] = true;
    var ran = Math.random();
    if(ran < 0.2){
        this.fruitType[i] = "blue";
    }else{
        this.fruitType[i] = "orange";
    }

}

function fruitMonitor(){
    var num = 0;
    for (var i =0; i< fruit.num; i++){
        if (fruit.alive[i]) num++;
    }
    if(num<15){
        sendFruit();

    }


}

fruitObj.prototype.dead = function(i){
    this.alive[i] = false;
}

function sendFruit(){
    for (var i=0;i<fruit.num;i++){
        if(!fruit.alive[i]){
            fruit.born(i);
            return;
        }
    }
}

//大鱼妈妈

/**
 * Created by xiaowan on 2016/1/16.
 */
var momObj = function(){
    this.x = [];
    this.y = [];
    this.angle = [];


    this.momTailTimer = 0;
    this.momTailCount = 0;
    this.momEyeTimer = 0;
    this.momEyeInterval = 1000;
    this.momEyeCount = 0;
    this.momBodyCount = 0;
}

momObj.prototype.init = function(){
    this.x = canWidth * 0.5;
    this.y = canHeight * 0.5 ;
    this.angle = 0;


}

momObj.prototype.draw = function(){
    this.x = lerpDistance(mx, this.x, 0.95);
    this.y = lerpDistance(my, this.y, 0.95);
    var deltaY = my -this.y;
    var deltaX= mx - this.x;
    var beta = Math.atan2(deltaY, deltaX) + Math.PI;
    this.angle = lerpAngle(beta, this.angle, 0.6);

    this.momTailTimer += deltaTime;
    if(this.momTailTimer > 50){
        this.momTailCount = (this.momTailCount + 1)%8;
        this.momTailTimer %= 50;
    }
    this.momEyeTimer += deltaTime;
    if(this.momEyeTimer > this.momEyeInterval){
        this.momEyeCount = (this.momEyeCount + 1)%2;
        this.momEyeTimer %= this.momEyeInterval;
        if(this.momEyeCount == 0){
            this.momEyeInterval = Math.random()*1500 + 2000;
        }else{
            this.momEyeInterval = 200;
        }
    }

    ctx1.save();
    ctx1.translate(this.x, this.y);
    ctx1.rotate(this.angle);
    var momTailCount = this.momTailCount;
    ctx1.drawImage(momTail[momTailCount], -momTail[momTailCount].width*0.5+30, -momTail[momTailCount].height*0.5);
    var momBodyCount = this.momBodyCount;
    if (data.double == 1){
        ctx1.drawImage(momBodyOra[momBodyCount], -momBodyOra[momBodyCount].width*0.5, -momBodyOra[momBodyCount].height*0.5);
    }else{
        ctx1.drawImage(momBodyBlue[momBodyCount], -momBodyBlue[momBodyCount].width*0.5, -momBodyBlue[momBodyCount].height*0.5);

    }



    var momEyeCount = this.momEyeCount;
    ctx1.drawImage(momEye[momEyeCount], -momEye[momEyeCount].width*0.5, -momEye[momEyeCount].height*0.5);


    ctx1.restore();
}


//小鱼宝宝

var babyObj = function(){
    this.x = [];
    this.y = [];
    this.angle = [];

    this.babyTailTimer = 0;
    this.babyTailCount = 0;

    this.babyEyeTimer = 0;
    this.babyEyeCount = 0;
    this.babyEyeInterval = 1000;

    this.babyBodyTimer = 0;
    this.babyBodyCount = 0;
}

babyObj.prototype.init = function(){
    this.x = canWidth*0.5 - 50;
    this.y = canHeight*0.5 +50;
    this.angle = 0;

}
babyObj.prototype.draw = function(){


    this.x = lerpDistance(mom.x, this.x, 0.98);
    this.y = lerpDistance(mom.y, this.y, 0.98);
    var deltaY = mom.y -this.y;
    var deltaX= mom.x - this.x;
    var beta = Math.atan2(deltaY, deltaX) + Math.PI;
    this.angle = lerpAngle(beta, this.angle, 0.6);
    this.babyTailTimer += deltaTime;
    if(this.babyTailTimer > 50){
        this.babyTailCount = (this.babyTailCount + 1)%8;
        this.babyTailTimer = this.babyTailTimer%50;
    }
    this.babyEyeTimer += deltaTime;
    if(this.babyEyeTimer > this.babyEyeInterval){
        this.babyEyeCount = (this.babyEyeCount + 1)%2;
        this.babyEyeTimer = this.babyEyeTimer%this.babyEyeInterval;

        if(this.babyEyeCount == 0){
            this.babyEyeInterval = Math.random()*1500 + 2000;
        }else{
            this.babyEyeInterval = 200;
        }
    }
    this.babyBodyTimer += deltaTime;

    if(this.babyBodyTimer > 300){
        this.babyBodyCount = this.babyBodyCount + 1;
        this.babyBodyTimer %= 300;
        if(this.babyBodyCount > 19){
            this.babyBodyCount = 19;
            data.gameOver = true;
        }
    }
    ctx1.save();
    ctx1.translate(this.x, this.y);
    ctx1.rotate(this.angle);

    var babyTailCount = this.babyTailCount;
    ctx1.drawImage(babyTail[babyTailCount], -babyTail[babyTailCount].width*0.5+20, -babyTail[babyTailCount].height*0.5);
    var babyBodyCount = this.babyBodyCount;
    ctx1.drawImage(babyBody[babyBodyCount], -babyBody[babyBodyCount].width*0.5, -babyBody[babyBodyCount].height*0.5);
    var babyEyeCount = this.babyEyeCount;
    ctx1.drawImage(babyEye[babyEyeCount], -babyEye[babyEyeCount].width*0.5, -babyEye[babyEyeCount].height*0.5);

    ctx1.restore();
}

//背景绘制

function drawBackground(){
    ctx2.drawImage( bgPic, 0, 0, canWidth, canHeight);
}

//碰撞检测函数


/**
 * Created by xiaowan on 2016/1/16.
 */
function momFruitCollision(){
    if(data.gameOver){
        for (var i=0;i<fruit.num;i++){
            if(fruit.alive[i]){
                var l =  calLength2(fruit.x[i], fruit.y[i], mom.x, mom.y);
                if(l<900){

                    fruit.dead(i);
                    data.fruitNum++;
                    mom.momBodyCount++;
                    if(mom.momBodyCount > 7){
                        mom.momBodyCount = 7;
                    }
                    if(fruit.fruitType[i] == "blue"){
                        data.double = 2;
                    }
                    wave.born(fruit.x[i],fruit.y[i]);
                }
            }
        }
    }
}

function momBabyCollision(){
    if(data.gameOver){
        if(data.fruitNum > 1){
            var l = calLength2(mom.x, mom.y, baby.x, baby.y);
            if(l < 900){
                baby.babyBodyCount = 0;
                mom.momBodyCount = 0;
                data.addScore();
                halo.born(baby.x, baby.y);
            }
        }
    }
}


//位移函数等相关

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();


function calLength2(x1, y1, x2, y2) {
    return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}


function randomColor() {
    var col = [0, 1, 2];
    col[0] = Math.random() * 100 + 155;
    col[0] = col[0].toFixed();
    col[1] = Math.random() * 100 + 155;
    col[1] = col[1].toFixed();
    col[2] = Math.random() * 100 + 155;
    col[2] = col[2].toFixed();
    var num = Math.floor(Math.random() * 3);
    col[num] = 0;
    return "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",";
}


function lerpAngle(a, b, t) {
    var d = b - a;
    if (d > Math.PI) d = d - 2 * Math.PI;
    if (d < -Math.PI) d = d + 2 * Math.PI;
    return a + d * t;
}

function lerpDistance(aim, cur, ratio) {
    var delta = cur - aim;
    return aim + delta * ratio;
}

function inOboundary(arrX, arrY, l, r, t, b) { //在l r t b范围内的检测
    return arrX > l && arrX < r && arrY > t && arrY < b;
}

function rgbColor(r, g, b) {
    r = Math.round(r * 256);
    g = Math.round(g * 256);
    b = Math.round(b * 256);
    return "rgba(" + r + "," + g + "," + b + ",1)";
}

function rgbNum(r, g, b) {
    r = Math.round(r * 256);
    g = Math.round(g * 256);
    b = Math.round(b * 256);
    return "rgba(" + r + "," + g + "," + b;
}

function rnd(m) {
    var n = m || 1;
    return Math.random() * n;
}

function rateRandom(m, n) {
    var sum = 0;
    for (var i = 1; i < (n - m); i++) {
        sum += i;

    }

    var ran = Math.random() * sum;

    for (var i = 1; i < (n - m); i++) {
        ran -= i;
        if (ran < 0) {
            return i - 1 + m;
        }
    }
}

function distance(x1, y1, x2, y2, l) {
    var x = Math.abs(x1 - x2);
    var y = Math.abs(y1 - y2);
    if (x < l && y < l) {
        return true;
    }
    return false;
}

function AABBbox(object1, w1, h1, object2, w2, h2, overlap) {
    A1 = object1.x + overlap;
    B1 = object1.x + w1 - overlap;
    C1 = object1.y + overlap;
    D1 = object1.y + h1 - overlap;

    A2 = object2.x + overlap;
    B2 = object2.x + w2 - overlap;
    C2 = object2.y + overlap;
    D2 = object2.y + h2 - overlap;

    if (A1 > B2 || B1 < A2 || C1 > D2 || D1 < C2) return false;
    else return true;
}


function dis2(x, y, x0, y0) {
    var dx = x - x0;
    var dy = y - y0;
    return dx * dx + dy * dy;
}

function rndi2(m, n) {
    var a = Math.random() * (n - m) + m;
    return Math.floor(a);
}


//分数计算函数

/**
 * Created by xiaowan on 2016/1/17.
 */
var dataObj = function(){
    this.fruitNum = 0;
    this.double = 1;
    this.score = 0;
    this.gameOver = true;
    this.alpha = 0;

}


dataObj.prototype.draw = function(){
    var w = can1.width;
    var h = can1.height;
    ctx1.save();
    ctx1.shadowBlur = 10;
    ctx1.shadowColor = "white";
    ctx1.fillStyle = "white";
    ctx1.fillText("SCORE:"+this.score, w*0.5, h-20);
    if(data.gameOver){
        this.alpha += deltaTime*0.0005;
        if(this.alpha > 1){
            this.alpha =1;
        }
        ctx1.fillStyle = "rgba(255, 255, 255," + this.alpha +")";
        //ctx1.fillText("GAMEOVER", w*0.5, h*0.5);
    }
    ctx1.restore();
}

dataObj.prototype.addScore = function(){
    this.score += this.fruitNum*100*this.double;
    this.fruitNum = 0;
    this.double = 1;
}


//背景灰尘


/**
 * Created by xiaowan on 2016/1/17.
 */
var dustObj = function(){
    this.x = [];
    this.y = [];
    this.amp = [];
    this.NO = [];
    this.alpha = [];
}
dustObj.prototype.num = 30;
dustObj.prototype.init = function(){
    for(var i=0; i<this.num;i++){
        this.x[i] = Math.random()*canWidth;
        this.y[i] = Math.random()*canHeight;
        this.amp[i] = 20 + Math.random()*25;
        this.NO[i] = Math.floor(Math.random()*7);
    }
    this.alpha = 0;
}
dustObj.prototype.draw = function(){

    this.alpha += deltaTime*0.0007;
    var l = Math.sin(this.alpha);
    for(var i=0;i<this.num;i++){
        var NO = this.NO[i];
        ctx1.drawImage(dustPic[NO], this.x[i] + this.amp[i]*l, this.y[i]);
    }
}


//大鱼吃果实产生的涟漪

/**
 * Created by xiaowan on 2016/1/17.
 */
var waveObj = function(){
    this.x = [];
    this.y = [];
    this.alive = [];
    this.r = [];
}
waveObj.prototype.num = 10;
waveObj.prototype.init = function(){
    for(var i=0;i<this.num;i++){
        this.alive[i] = false;
        this.r[i] = 0;
    }
}
waveObj.prototype.draw = function(){
    ctx1.save();
    ctx1.lineWidth = 2;
    ctx1.shadowBlur = 10;
    ctx1.shadowColor = "white";
    for(var i=0;i<this.num;i++){
        if(this.alive[i]){
            this.r[i] += deltaTime*0.04;
            if(this.r[i]>50){
                this.alive[i] = false;
                break;
            }
            var alpha = 1 - this.r[i]/50;
            ctx1.beginPath();
            ctx1.arc(this.x[i], this.y[i], this.r[i], 0, Math.PI*2);
            ctx1.closePath();
            ctx1.strokeStyle = "rgba(255, 255, 255, "+ alpha +")";
            ctx1.stroke();


        }
    }
    ctx1.restore();
}
waveObj.prototype.born = function(x, y){
    for(var i=0;i<this.num;i++){
        if(!this.alive[i]){
            this.alive[i]=true;
            this.r[i] = 10;
            this.x[i] = x;
            this.y[i] = y;
            return;
        }
    }
}

//大鱼碰小鱼产生的涟漪

/**
 * Created by xiaowan on 2016/1/17.
 */
var haloObj = function(){
    this.x = [];
    this.y = [];
    this.alive = [];
    this.r = [];
}
haloObj.prototype.num = 5;
haloObj.prototype.init = function(){
    for(var i=0;i<this.num;i++){
        this.x[i] =0;
        this.y[i] =0;
        this.alive[i] = false;
        this.r[i] = 0;
    }
}
haloObj.prototype.draw = function(){

    ctx1.save();
    ctx1.lineWidth = 1;
    ctx1.shadowBlur = 10;
    ctx1.shadowColor = "rgba(203, 91, 0, 1)";
    for(var i=0;i<this.num;i++){
        if(this.alive[i]){
            this.r[i] += deltaTime*0.05;
            if(this.r[i]>50){
                this.alive[i] = false;
                break;
            }
            var alpha = 1 - this.r[i]/50;
            ctx1.beginPath();
            ctx1.arc(this.x[i], this.y[i], this.r[i], 0, Math.PI*2);
            ctx1.closePath();
            ctx1.strokeStyle = "rgba(203, 91, 0, "+ alpha +")";
            ctx1.stroke();


        }
    }
    ctx1.restore();
}
haloObj.prototype.born = function(x, y){

    for(var i=0;i< this.num;i++){
        if(!this.alive[i]){
            this.x[i] = x;
            this.y[i] = y;
            this.r[i] = 10;
            this.alive[i] = true;
        }
    }
}
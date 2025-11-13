var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  },
  container = select('.heart-container'),
  pContainer = select('.pContainer'),
    heartPool = 600,
    heartPoolArray = [],
    numHearts = 25,
    heartCount = 0,
    step = 360/numHearts,
    isDevice = (/android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent.toLowerCase())),
    destParticle,
    strokeColors = ['#db3434', '#E0A3FF', '#F5BB30', '#9ECA98', '#db3434', '#BADAB0', '#33B6E9']


//center the container cos it's pretty an' that
TweenMax.set(container, {
  position: 'absolute',
  top: '50%',
  left: '50%',
  xPercent: -50,
  yPercent: -50
})
TweenMax.set('svg', {
  visibility:'visible'
})

function createHeartPool() {
//console.log('createHeartPool');
  
  var i = heartPool, p;
  while (--i > -1) {

    p = document.createElementNS(xmlns, 'use');
    pContainer.appendChild(p);
    
    //console.log(i % 2)
     destParticle = (i % 2) ? '#heart' : '#dot';
    p.setAttributeNS(xlinkns, "xlink:href", destParticle);
    p.setAttributeNS(null, 'fill', "#db3434")
    p.setAttributeNS(null, 'stroke', strokeColors[randomBetween(0, 6)])

    //heartArr.push(p);
    resetParticle(p);

  heartPoolArray.push(p);
  }
  //tl.play()

}

function createExplosion(x,y){

  var max = heartCount + numHearts, p;
  
  for(var i = heartCount; i < max; i++){
    p = heartPoolArray[i], localCount = i % numHearts;
    var radians = (step * localCount) * (Math.PI/180);
    var deg = radians * (180/Math.PI);
    //var px = Math.atan2(e.offsetY - 300, e.offsetX - 300)
   //console.log(radians,deg)
    TweenMax.set(p, {
      x:x,
      y:y,
      rotation:deg -90
    })    
    //console.log(i)
     var tl = new TimelineMax({paused:false});
  tl.to(p, 2, {
    //cycle:{
      physics2D: {
        gravity:0,
        //velocity:randomBetween(60, 200),
        velocity:300,
        angle:deg
      },
    //rotation:randomBetween(0, 360),
    fill:"hsl(="+ 360/(step * (localCount+1)) +", +=0%, +=100%)",
    alpha:0.6,
    ease:Expo.easeInOut,
    scale:0,
    onComplete:resetParticle,
    onCompleteParams:[p]
  }) 
  
  heartCount++;
}
  
  //if(heartCount)
  //console.log('heartCount: ' + heartCount);
  if(heartCount + numHearts >=heartPool){
    heartCount = 0;
  }
  

  
}

function createHeartRing(x, y){
  
    var h = document.createElementNS(xmlns, 'use');
    var d = document.createElementNS(xmlns, 'use');
    pContainer.appendChild(h);
    pContainer.appendChild(d);

    h.setAttributeNS(xlinkns, "xlink:href", '#heart');
    h.setAttributeNS(null, 'fill', "#FFF"),
    d.setAttributeNS(xlinkns, "xlink:href", '#ring');
    d.setAttributeNS(null, 'stroke', strokeColors[randomBetween(0, 6)]);
    d.setAttributeNS(null, 'stroke-width', 2)
    
    
    
    TweenMax.set([h,d], {
      scale:.7,
      transformOrigin:'50% 50%',
      x:x,
      y:y,
      fill:'#db3434'
    })
    //heartArr.push(p);
    TweenMax.to(h, 4, {
    
      alpha:0,
      fill:'#000',
      scale:10,
      //ease:Back.easeIn.config(5),
      ease:Back.easeOut,
      onComplete:function(){
        pContainer.removeChild(h)
      }
    })    
    TweenMax.to(d, 0.5, {
    
      alpha:0,
      //fill:'#FFF',
      scale:0,
      //rotation:-720,
      stroke:'#ef2341',
      strokeWidth:1,
      ease:Back.easeIn.config(3),
      //ease:Circ.easeOut,
      onComplete:function(){
        pContainer.removeChild(d);
         createExplosion(x, y);
          
      }
    })  
}


function resetParticle(p){
  
    TweenMax.set(p, {
      scale:2,
      transformOrigin:'50% 50%',
      x:-100,
      y:-100,
      alpha:1,
      fill:'#db3434'
    })
}
//createHeartPool(-100, -100);



function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

container.onclick =  function(e){
  var x = (isDevice) ? e.touches[0].pageX : e.offsetX;
  var y = (isDevice) ? e.touches[0].pageY+48 : e.offsetY;
  createHeartRing(x, y);
  //console.log(x, y)
  
}

container.addEventListener('touchstart', container.onclick);
createHeartPool();
/* TweenMax.staggerTo([{l:0},{l:0},{l:0}], 0.1, {
  onComplete:function(){
    createExplosion(400,400)
  }
},0.1) */
function autoExplosion(){
    
  createHeartRing(randomBetween(10,window.innerWidth), randomBetween(10,window.innerHeight))
  TweenMax.delayedCall(0.1666, autoExplosion)

}






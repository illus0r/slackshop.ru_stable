function birdsInit() {
  function RandomRect(maxX, maxY) {
    return [Math.floor(Math.random() * maxX), Math.floor(Math.random() * maxY)];
  }

  function flight(g){
      var rect = RandomRect(300, 30);
      var duration = 10000 + Math.floor(Math.random() * 8000);
      g.animate({ transform:'translate('+rect[0]+','+rect[1]+')'}, duration, mina.easeinout, flight.bind(null, g));
      return g;
  }
   
  var birdsDiv = Snap("#birds-div");
  Snap.load("/img/course/birds.svg", function (f) {
      var birds = f.selectAll("path");
      birds.forEach(function(bird){
          var rect = RandomRect(300, 100);
          bird.attr('transform','translate('+rect[0]+','+rect[1]+') scale('+Math.random()+')');
          flight(bird);
        });
      var g = f.select("#site");
      birdsDiv.append(g);
  });
}

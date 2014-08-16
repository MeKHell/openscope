
function game_init_pre() {
  prop.game={};

  prop.game.paused=true;
  prop.game.focused=true;

  prop.game.speedup=1;

  prop.game.time=time();
  prop.game.delta=0;

  prop.game.timeouts=[];

  $(window).blur(function() {
//    prop.game.focused=false;
  });

  $(window).focus(function() {
//    prop.game.focused=true;
  });

}

function game_paused() {
  return !prop.game.focused || prop.game.paused;
}

function game_time() {
  return prop.game.time;
}

function game_delta() {
  return prop.game.delta;
}

function game_speedup() {
  if(game_paused()) return 0;
  return prop.game.speedup;
}

function game_timeout(func, delay, that, data) {
  prop.game.timeouts.push([func, game_time()+delay, data, delay, false, that]);
}

function game_interval(func, delay, that, data) {
  prop.game.timeouts.push([func, game_time()+delay, data, delay, true, that]);
}

function game_update_pre() {
  prop.game.delta=Math.min(delta()*prop.game.speedup, 100);
  if(game_paused()) {
    prop.game.delta=0;
  }
  prop.game.time+=prop.game.delta;
  for(var i=prop.game.timeouts.length-1;i>=0;i--) {
    var remove  = false;
    var timeout = prop.game.timeouts[i];
    if(game_time() > timeout[1]) {
      timeout[0].call(timeout[5], timeout[2]);
      if(timeout[4]) {
        timeout[1] += timeout[3]; 
      } else {
        remove=true;
      }
    }
    if(remove) {
      prop.game.timeouts.splice(i, 1);
      i-=1;
    }
  }
}

function game_complete() {
  prop.game.paused=false;
}

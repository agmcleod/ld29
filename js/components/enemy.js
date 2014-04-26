game.enemy = {
  onCollision: function(enemy, res, obj) {
    if (enemy.alive && obj.dashing) {
      obj.renderable.flicker(300, function() {
        me.game.world.removeChild(enemy);
      });
    }
  }
}
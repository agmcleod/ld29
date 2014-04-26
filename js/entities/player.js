game.Player = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    this._super(me.ObjectEntity, "init", [x, y, settings]);
    this.setVelocity(3, 20);
    this.getShape().resize(28, 32);
    this.getShape().translate(2, 0);
    this.renderable.addAnimation('dash', [0], 1);
    this.renderable.addAnimation('run', [1,2,3,4,5,6,7,8,9], 20);
    this.renderable.setCurrentAnimation('run');
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    this.health = 3;
    this.dashing = false;
  },

  damagedCallback: function() {
    this.damaged = false;
  },

  update: function(time) {
    if (me.input.isKeyPressed('left')) {
      this.flipX(true);
      this.vel.x -= this.accel.x * me.timer.tick;
    }
    else if (me.input.isKeyPressed('right')) {
      this.flipX(false);
      this.vel.x += this.accel.x * me.timer.tick;
    }
    else {
      this.vel.x = 0;
    }

    if (me.input.isKeyPressed('jump') && !this.jumping && !this.falling) {
      // set current vel to the maximum defined value
      // gravity will then do the rest
      this.vel.y = -this.maxVel.y * me.timer.tick;
      // set the jumping flag
      this.jumping = true;
    }


    var res = me.game.world.collide(this);

    if(res && res.obj.type === me.game.ENEMY_OBJECT) {
      if(this.dashing) {

      }
      else if(!this.damaged) {
        this.damaged = true;
        this.health -= 1;
        if(this.health <= 0) {
          me.levelDirector.reloadLevel.defer();
        }
        else {
          this.renderable.flicker(400, this.damagedCallback.bind(this));
        }
      }
    }

    this.updateMovement();
    if(this.vel.x !== 0 || this.vel.y !== 0) {
      this._super(me.ObjectEntity, 'update', [time]);
      return true;
    }
    else {
      return false;
    }
  }
});
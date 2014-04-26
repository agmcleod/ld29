game.Player = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    this._super(me.ObjectEntity, "init", [x, y, settings]);
    this.setVel();
    this.getShape().resize(28, 32);
    this.getShape().translate(2, 0);
    this.renderable.addAnimation('dash', [0], 1);
    this.renderable.addAnimation('run', [1,2,3,4,5,6,7,8,9], 20);
    this.renderable.setCurrentAnimation('run');
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    this.health = 3;
    this.dashing = false;
    this.direction = new me.Vector2d();
    this.dashVel = new me.Vector2d(30, 30);
    this.setFriction(2, 0);
  },

  damagedCallback: function() {
    this.damaged = false;
  },

  handleInput: function() {
    if (me.input.isKeyPressed('left')) {
      this.flipX(true);
      this.vel.x -= this.accel.x * me.timer.tick;
      this.movementSetup();
    }
    else if (me.input.isKeyPressed('right')) {
      this.flipX(false);
      this.vel.x += this.accel.x * me.timer.tick;
      this.movementSetup();
    }

    if (me.input.isKeyPressed('jump') && !this.jumping && !this.falling) {
      this.vel.y = -this.maxVel.y * me.timer.tick;
      this.jumping = true;
    }

    if (me.input.isKeyPressed('dash') && !this.dashing && !this.falling) {
      game.dash.dash(this);
      this.setMaxVelocity(100, 50);
      if(this.direction.x < 0) {
        this.flipX(true);
      }
      else {
        this.flipX(false);
      }
    }
  },

  movementSetup: function() {
    this.setVel();
    if(!this.renderable.isCurrentAnimation('run')) {
      this.renderable.setCurrentAnimation('run');
    }
  },

  setDefaultAnimation: function() {
    this.renderable.setCurrentAnimation('run');
  },

  setVel: function() {
    this.setVelocity(3, 20);
  },

  update: function(time) {
    this.handleInput();

    var res = me.game.world.collide(this);

    if (res) {
      if (res.obj.type === me.game.ENEMY_OBJECT) {
        if (!this.dashing && !this.damaged) {
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
      else {
        this.dashing = false;
        this.setDefaultAnimation();
      }  
    }

    this.updateMovement();
    
    if (this.vel.x !== 0 || this.vel.y !== 0) {
      this._super(me.ObjectEntity, 'update', [time]);
      return true;
    }
    else {
      this.dashing = false;
      return false;
    }
  }
});
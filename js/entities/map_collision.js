game.MapCollision = me.Entity.extend({
  init: function (x, y, settings) {
    this._super(me.Entity, "init", [x, y, settings]);
    this.body.addShape(new me.PolyShape(0, 0, [
      new me.Vector2d(0, 0), new me.Vector2d(this.width, 0),
      new me.Vector2d(this.width, this.height), new me.Vector2d(0, this.height)
    ]));
    this.body.collisionType = me.collision.types.WORLD_SHAPE;
  }
});
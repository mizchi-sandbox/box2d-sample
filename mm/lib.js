(function() {
  var PhysicsWorld;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();
  PhysicsWorld = (function() {
    function PhysicsWorld() {}
    PhysicsWorld.prototype.start = function() {
      var f;
      return (f = __bind(function() {
        this.world.Step(1 / 60, 1);
        this.enter();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.render_before();
        this.render();
        return requestAnimationFrame(f);
      }, this))();
    };
    PhysicsWorld.prototype.enter = function() {};
    PhysicsWorld.prototype.draw_over = function() {};
    PhysicsWorld.prototype.init_world = function(p) {
      var doSleep, gravity, world, worldAABB;
      worldAABB = new b2AABB();
      worldAABB.minVertex.Set(0, 0);
      worldAABB.maxVertex.Set(p.area, p.area);
      gravity = new b2Vec2(0, p.gravity);
      doSleep = true;
      return world = new b2World(worldAABB, gravity, doSleep);
    };
    PhysicsWorld.prototype.add_box = function(x, y, width, height, fixed) {
      var boxBd, boxSd;
      if (typeof fixed === "undefined") {
        fixed = true;
      }
      boxSd = new b2BoxDef();
      if (!fixed) {
        boxSd.density = 1.0;
      }
      boxSd.extents.Set(width, height);
      boxBd = new b2BodyDef();
      boxBd.AddShape(boxSd);
      boxBd.position.Set(x, y);
      return this.world.CreateBody(boxBd);
    };
    PhysicsWorld.prototype.add_wall = function() {
      var st, wall;
      st = 5;
      return wall = {
        ground: this.add_box(0, 600, 800, st),
        left: this.add_box(0, 600 - st, st, 600 - st),
        right: this.add_box(800 - st, 600 - st, st, 600 - st)
      };
    };
    PhysicsWorld.prototype.add_ball = function(x, y) {
      var ballBd, ballSd;
      ballSd = new b2CircleDef();
      ballSd.density = 1.0;
      ballSd.radius = 20;
      ballSd.restitution = 1.0;
      ballSd.friction = 0;
      ballBd = new b2BodyDef();
      ballBd.AddShape(ballSd);
      ballBd.position.Set(x, y);
      return this.world.CreateBody(ballBd);
    };
    PhysicsWorld.prototype.render = function() {
      var b, j, s;
      j = this.world.m_jointList;
      while (j) {
        this.draw_joint(j, this.ctx);
        j = j.m_next;
      }
      b = this.world.m_bodyList;
      while (b) {
        s = b.GetShapeList();
        while (s != null) {
          this.draw_shape(s, this.ctx);
          s = s.GetNext();
        }
        b = b.m_next;
      }
      return this.draw_over();
    };
    PhysicsWorld.prototype.draw_joint = function(joint) {
      var b1, b2, p1, p2, x1, x2;
      b1 = joint.m_body1;
      b2 = joint.m_body2;
      x1 = b1.m_position;
      x2 = b2.m_position;
      p1 = joint.GetAnchor1();
      p2 = joint.GetAnchor2();
      this.ctx.strokeStyle = "#00eeee";
      this.ctx.beginPath();
      switch (joint.m_type) {
        case b2Joint.e_distanceJoint:
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          break;
        case b2Joint.e_pulleyJoint:
          break;
        default:
          if (b1 === world.m_groundBody) {
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(x2.x, x2.y);
          } else if (b2 === world.m_groundBody) {
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(x1.x, x1.y);
          } else {
            this.ctx.moveTo(x1.x, x1.y);
            this.ctx.lineTo(p1.x, p1.y);
            this.ctx.lineTo(x2.x, x2.y);
            this.ctx.lineTo(p2.x, p2.y);
          }
      }
      return this.ctx.stroke();
    };
    PhysicsWorld.prototype.draw_shape = function(shape) {
      var ax, circle, d, dtheta, i, poly, pos, pos2, r, segments, tV, theta, v;
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.beginPath();
      switch (shape.m_type) {
        case b2Shape.e_circleShape:
          circle = shape;
          pos = circle.m_position;
          r = circle.m_radius;
          segments = 16.0;
          theta = 0.0;
          dtheta = 2.0 * Math.PI / segments;
          this.ctx.moveTo(pos.x + r, pos.y);
          i = 0;
          while (i < segments) {
            d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
            v = b2Math.AddVV(pos, d);
            this.ctx.lineTo(v.x, v.y);
            theta += dtheta;
            i++;
          }
          this.ctx.lineTo(pos.x + r, pos.y);
          this.ctx.moveTo(pos.x, pos.y);
          ax = circle.m_R.col1;
          pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
          this.ctx.lineTo(pos2.x, pos2.y);
          break;
        case b2Shape.e_polyShape:
          poly = shape;
          tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
          this.ctx.moveTo(tV.x, tV.y);
          i = 0;
          while (i < poly.m_vertexCount) {
            v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
            this.ctx.lineTo(v.x, v.y);
            i++;
          }
          this.ctx.lineTo(tV.x, tV.y);
      }
      return this.ctx.stroke();
    };
    return PhysicsWorld;
  })();
  window.PhysicsWorld = PhysicsWorld;
}).call(this);

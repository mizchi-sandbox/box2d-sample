(function() {
  var MyWorld;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  MyWorld = (function() {
    __extends(MyWorld, PhysicsWorld);
    function MyWorld() {
      this.canvas = document.getElementById("canvas");
      this.ctx = canvas.getContext("2d");
      this.canvas.width = 800;
      this.canvas.height = 600;
      this.world = this.init_world({
        gravity: 1000,
        area: 1000
      });
      this.cnt = 0;
      this.add_wall();
      this.box = this.add_box(250, 200, 10, 10, true);
      this.triangle = this.add_triangle(250, 100);
    }
    MyWorld.prototype.enter = function() {
      var c, obj, v, _ref, _ref2;
      this.cnt++;
      obj = this.world.m_bodyList;
      while (obj) {
        if ((100 < (_ref = obj.m_position.x) && _ref < 700)) {
          if ((400 < (_ref2 = obj.m_position.y) && _ref2 < 410)) {
            console.log('obj in area');
            obj.WakeUp();
            v = obj.m_linearVelocity;
            obj.SetLinearVelocity(new b2Vec2(v.x + 90, v.y - 5));
          }
        }
        obj = obj.m_next;
      }
      if (this.cnt % 60 === 0) {
        this.add_triangle(800 * Math.random(), 0);
        console.log([this.triangle.m_position.x, this.triangle.m_position.y]);
      }
      if (c = this.box.GetContactList()) {
        return console.log(c);
      }
    };
    MyWorld.prototype.render_before = function() {
      this.ctx.fillStyle = "#00eeee";
      return this.ctx.fillRect(100, 400, 600, 10);
    };
    MyWorld.prototype.add_triangle = function(x, y) {
      var ballBd, ballSd, i, radius, v;
      ballSd = new b2PolyDef();
      ballSd.density = 1.0;
      ballSd.restitution = 0.8;
      v = 3;
      radius = 5;
      ballSd.vertexCount = v;
      i = 0;
      while (i < v) {
        ballSd.vertices[i].Set(radius * Math.cos(Math.PI * 2 / v * i), radius * Math.sin(Math.PI * 2 / v * i));
        i++;
      }
      ballBd = new b2BodyDef();
      ballBd.AddShape(ballSd);
      ballBd.position.Set(x, y);
      return this.world.CreateBody(ballBd);
    };
    return MyWorld;
  })();
  window.onload = function() {
    window.mywld = new MyWorld();
    mywld.start();
    return document.body.onclick = function(e) {
      mywld.triangle.WakeUp();
      return mywld.triangle.SetLinearVelocity(new b2Vec2(-600 * Math.random() + 300, -300));
    };
  };
}).call(this);

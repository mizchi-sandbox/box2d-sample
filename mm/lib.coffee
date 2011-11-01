window.requestAnimationFrame = (->
  window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback, element) ->
    window.setTimeout callback, 1000 / 60
)()

# init region
class PhysicsWorld

  start : ->
    (f = =>
      @world.Step 1 / 60, 1
      @enter()
      @ctx.clearRect 0, 0, @canvas.width, @canvas.height
      @render_before()
      @render()
      requestAnimationFrame f
    )()

  enter : ->
  draw_over : ->

  init_world : (p)->
    worldAABB = new b2AABB()
    # worldAABB.minVertex.Set -p.area, -p.area
    worldAABB.minVertex.Set 0, 0
    worldAABB.maxVertex.Set p.area, p.area
    gravity = new b2Vec2(0, p.gravity)
    doSleep = true
    world = new b2World(worldAABB, gravity, doSleep)

  add_box : ( x, y, width, height, fixed) ->
    fixed = true  if typeof (fixed) == "undefined"
    boxSd = new b2BoxDef()
    boxSd.density = 1.0  unless fixed
    boxSd.extents.Set width, height
    boxBd = new b2BodyDef()
    boxBd.AddShape boxSd
    boxBd.position.Set x, y
    @world.CreateBody boxBd

  add_wall : ->
    st = 5
    wall =
      ground: @add_box 0,600,800,st
      left : @add_box 0,600 -st ,st,600 - st
      right : @add_box 800 - st ,600 - st ,st,600-st

  add_ball : (x, y) ->
    ballSd = new b2CircleDef()
    ballSd.density = 1.0
    ballSd.radius = 20
    ballSd.restitution = 1.0
    ballSd.friction = 0
    ballBd = new b2BodyDef()
    ballBd.AddShape ballSd
    ballBd.position.Set x, y
    @world.CreateBody ballBd

  render : ->
    j = @world.m_jointList
    while j
      @draw_joint j, @ctx
      j = j.m_next

    b = @world.m_bodyList
    while b
      s = b.GetShapeList()
      while s?
        @draw_shape s, @ctx
        s = s.GetNext()
      b = b.m_next
    @draw_over()

  draw_joint : (joint) ->
    b1 = joint.m_body1
    b2 = joint.m_body2
    x1 = b1.m_position
    x2 = b2.m_position
    p1 = joint.GetAnchor1()
    p2 = joint.GetAnchor2()
    @ctx.strokeStyle = "#00eeee"
    @ctx.beginPath()
    switch joint.m_type
      when b2Joint.e_distanceJoint
        @ctx.moveTo p1.x, p1.y
        @ctx.lineTo p2.x, p2.y
      when b2Joint.e_pulleyJoint
      else
        if b1 == world.m_groundBody
          @ctx.moveTo p1.x, p1.y
          @ctx.lineTo x2.x, x2.y
        else if b2 == world.m_groundBody
          @ctx.moveTo p1.x, p1.y
          @ctx.lineTo x1.x, x1.y
        else
          @ctx.moveTo x1.x, x1.y
          @ctx.lineTo p1.x, p1.y
          @ctx.lineTo x2.x, x2.y
          @ctx.lineTo p2.x, p2.y
    @ctx.stroke()

  draw_shape : (shape) ->
    @ctx.strokeStyle = "#ffffff"
    @ctx.beginPath()
    switch shape.m_type
      when b2Shape.e_circleShape
        circle = shape
        pos = circle.m_position
        r = circle.m_radius
        segments = 16.0
        theta = 0.0
        dtheta = 2.0 * Math.PI / segments
        @ctx.moveTo pos.x + r, pos.y
        i = 0

        while i < segments
          d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta))
          v = b2Math.AddVV(pos, d)
          @ctx.lineTo v.x, v.y
          theta += dtheta
          i++
        @ctx.lineTo pos.x + r, pos.y
        @ctx.moveTo pos.x, pos.y
        ax = circle.m_R.col1
        pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y)
        @ctx.lineTo pos2.x, pos2.y
      when b2Shape.e_polyShape
        poly = shape
        tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]))
        @ctx.moveTo tV.x, tV.y
        i = 0

        while i < poly.m_vertexCount
          v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]))
          @ctx.lineTo v.x, v.y
          i++
        @ctx.lineTo tV.x, tV.y
    @ctx.stroke()

window.PhysicsWorld = PhysicsWorld

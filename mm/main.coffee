class MyWorld extends PhysicsWorld
  constructor:->
    @canvas = document.getElementById("canvas")
    @ctx = canvas.getContext("2d")

    @canvas.width  = 800
    @canvas.height = 600

    @world = @init_world
      gravity: 1000
      area: 1000

    @cnt = 0

    @add_wall()

    @box = @add_box(250, 200, 10, 10,true)
    @triangle = @add_triangle(250, 100)

  enter :->
    @cnt++
    # j = @world.m_jointList
    obj = @world.m_bodyList
    while obj
      if 100 < obj.m_position.x < 700
        if 400 < obj.m_position.y < 410
          console.log 'obj in area'
          obj.WakeUp()
          v = obj.m_linearVelocity
          obj.SetLinearVelocity new b2Vec2( v.x+90, v.y-5)
      obj = obj.m_next

    if @cnt%60 is 0
      @add_triangle(800*Math.random(), 0)
      console.log [@triangle.m_position.x,  @triangle.m_position.y]

    if c = @box.GetContactList()
      console.log c

  render_before:->
    # console.log "draw_over"
    @ctx.fillStyle = "#00eeee"
    @ctx.fillRect 100,400,600,10


  add_triangle : (x, y) ->
    ballSd = new b2PolyDef()
    ballSd.density = 1.0
    ballSd.restitution = 0.8
    v = 3
    radius = 5
    ballSd.vertexCount = v
    i = 0

    while i < v
      ballSd.vertices[i].Set radius * Math.cos(Math.PI * 2 / v * i), radius * Math.sin(Math.PI * 2 / v * i)
      i++
    ballBd = new b2BodyDef()
    ballBd.AddShape ballSd
    ballBd.position.Set x, y
    @world.CreateBody ballBd

window.onload = ->
  window.mywld = new MyWorld()
  mywld.start()

  document.body.onclick = (e) ->
    mywld.triangle.WakeUp()
    mywld.triangle.SetLinearVelocity new b2Vec2(-600 * Math.random() + 300, -300)


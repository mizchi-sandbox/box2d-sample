doctype 5
html ->
  head ->
    meta charset:"utf-8"
    title 'Box2DJS - Physics Engine for JavaScript'
    script src: 'lib/prototype-1.6.0.2.js'
    script src: 'box2d.min.js'
    script src: 'mm/lib.js'
    script src: 'mm/main.js'

    # script src: 'mm/main.js'

  body ->
    canvas {
      id: 'canvas'
      width: '500'
      height: '300'
      style: 'top:260px; left:125px;'
    }

  style -> """
    #canvas {
      padding:0;
      margin:0;
      border:1px solid white;
      background-color:#333388;
    }
  """

class Boat{
    constructor(x,y,w,h,boatPos,boatAnimation){
        this.w= w
        this.h= h
        this.boatPos= boatPos
        this.boatAnimation = boatAnimation
        this.speed = 0.05
        this.isBroken= false
        var options= {
            isStatic: false
        }
        this.image= loadImage("./assets/boat.png")
        this.body = Bodies.rectangle(x,y,w,h,options)
        World.add(world,this.body)
    }
    
    animate(){
        this.speed+= 0.05
    }

    remove(index){
        this.boatAnimation=brokenBoatAnimation 
        this.speed= 2
        this.w= 300
        this.h= 300
        this.isBroken= true
        setTimeout(()=>{
         Matter.World.remove(world,boats[index].body)
         delete boats[index]
        },1000)
    }

    display(){
        var angle= this.body.angle
        var pos= this.body.position
        var index = floor(this.speed%this.boatAnimation.length)
        push()
        translate(pos.x,pos.y)
        rotate(angle)
        imageMode(CENTER)
        image(this.boatAnimation[index],0,this.boatPos,this.w,this.h)
        pop()
    }
}
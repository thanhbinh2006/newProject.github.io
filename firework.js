window.addEventListener('load',function(){
    const canvas=document.getElementById('mycanvas');
    const ctx=canvas.getContext('2d',{
        willReadFrequently:true
    });
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    ctx.font='100px Bungee Shade'
    const numberFirework=document.getElementById('numberFirework');
    const inpImage=document.getElementById('inpImage');
    const butImage=document.getElementById('butImage');
    const inpText=document.getElementById('inpText');
    const butText=document.getElementById('butText');
    const buttonStart=document.getElementById('start');
    const inpX=document.getElementById('inpX');
    const inpY=document.getElementById('inpY');
    inpX.disabled=true;
    inpY.disabled=true;
//    let image=document.getElementById('image');
    
    class particle{
        constructor(Beffect,x,y,color,OX,OY){
            this.effect=Beffect;
            this.textX=x;
            this.textY=y;
            this.color=color;
            this.x=OX;
            this.y=OY;
            this.size=this.effect.gap-1;
            this.ease=Math.random()*0.1+0.005;
        }
        draw(){
            this.effect.context.fillStyle=this.color;
            this.effect.context.fillRect(this.x,this.y,this.size,this.size);
        }
        update(){
            this.x+=(this.textX-this.x)*this.ease;
            this.y+=(this.textY-this.y)*this.ease;
        }
    }
    class particle_start{
        constructor(effect,x,y,colornumber){
            this.effect=effect;
            this.textY=y;
            this.color='hsl('+colornumber+',100%,50%)'
            this.x=x;
            this.y=this.effect.canvasHeight+10;
            this.size=3;
            //this.ease=Math.random()*0.1+0.005;
        }
        draw(){
            this.effect.context.fillStyle=this.color;
            this.effect.context.beginPath();
            this.effect.context.arc(this.x,this.y,this.size,0,Math.PI*2);
            this.effect.context.fill(); 
        }
        update(){
            //this.x+=(this.textX-this.x)*0.01;
            this.y-=5;
        }
    }
    class effect1{
        constructor(context,canvasHeight,canvasWidth,x,y){
            this.context=context;
            this.canvasHeight=canvasHeight;
            this.canvasWidth=canvasWidth;
            this.x=x;
            this.y=y;
            this.maxLineWidth=this.canvasWidth/2;
            this.size=100;
            this.particleArray=[];
            this.gap=3;
            this.lineCenterY=0;
            this.Particle_start=
            new particle_start(this,this.x,
            this.y,Math.random()*360);
        }
        wrapText(text){
            const Gradient=this.context.createLinearGradient(0,0,this.canvasWidth,this.canvasHeight);
            Gradient.addColorStop(0.3,'blue');
            Gradient.addColorStop(0.5,'purple');
            Gradient.addColorStop(0.7,'white');
            this.context.fillStyle=Gradient;
            this.context.font=this.size+'px Bungee Shade';
            this.context.textAlign='center';
            this.context.textBaseline='bottom';
            let lineArray=[];lineArray[0]='';
            let j=0;
            let words=text.split(' ');
            for (let i = 0; i < words.length; i++) {
                if((this.context.measureText(words[i]+lineArray[j]).width<=this.maxLineWidth)||(i==0)){
                    lineArray[j]+=words[i]+' '
                }else{
                    j++;
                    lineArray[j]=words[i]+' ';
                }
            }
           this.y-=(lineArray.length-1)*(this.size+5)/2;
           this.lineCenterY=this.y+(lineArray.length)*(this.size+5)/2;
           this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
            for (let i = 0; i < lineArray.length; i++) {
                this.context.fillText(lineArray[i],this.x,this.y+(this.size+5)*i);  
            }
            this.Createdata();
        }
        Createdata(){
            this.particleArray=[];
            const picels=this.context.getImageData(0,0,this.canvasWidth,this.canvasHeight).data;
            for (let y = 0; y < this.canvasHeight; y+=this.gap) {
                for (let x = 0; x < this.canvasWidth; x+=this.gap) {
                    const index=(y*this.canvasWidth+x)*4;
                    const alpha=picels[index+3];
                    if (alpha>0){
                      const red=picels[index];
                      const green=picels[index+1];
                      const blue=picels[index+2];
                      const color='rgb('+red+','+green+','+blue+')';
                      this.particleArray.push(new particle(this,x,y,color,this.x,this.lineCenterY));
                    }
                }
            }this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
            
        }
        solve(){
           
            for (let i = 0; i < this.particleArray.length; i++) {
                this.particleArray[i].update();
                this.particleArray[i].draw();     
                if(this.particleArray[i].size>=0.02){
                    this.particleArray[i].size-=0.005;  
                }else{ this.particleArray.splice(i,1)}            
            }
        }
        solve_start(){
           this.context.fillStyle='rgba(0,0,0,0.1)';
           this.context.fillRect(0,0,this.canvasWidth,this.canvasHeight);
           this.Particle_start.update();
           this.Particle_start.draw(); 
        }
        
    }
    class effect2{
        constructor(context,canvasHeight,canvasWidth,x,y){
            this.context=context;
            this.canvasHeight=canvasHeight;
            this.canvasWidth=canvasWidth;
            this.x=x;
            this.y=y;
            this.particleArray=[];
            this.gap=5;
            this.Particle_start='';
            this.imageHeight=0;
            this.imageWidth=0;
        }
        DrawImage(image){
            let i=1;

           if ((image.height>this.canvasHeight)||(image.width>this.canvasWidth)){
            while(((image.height/i>this.canvasHeight)&&
            ((image.width/i>this.context.canvasWidth)))){
                i++;
            };
            this.imageHeight=image.height/i;
            this.imageWidth=image.width/i;}else{
                console.log(image.height,image.width,
                    this.canvasHeight,this.canvasWidth);
            while(((image.height*i<this.canvasHeight)&&
            ((image.width*i<this.canvasWidth)))){
                i++;
            };this.imageHeight=image.height*i;
            this.imageWidth=image.width*i;}
            this.imageHeight=image.height;
            this.imageWidth=image.width;
            console.log(i);
            this.context.drawImage(image,this.x,this.y,
            this.imageWidth,this.imageHeight);
            
            this.Particle_start=new particle_start(this,this.x+this.imageWidth/2,this.y+this.imageHeight/2,Math.random()*360);
            this.Createdata();
        }
        Createdata(){
            this.particleArray=[];
           console.log(this.canvasWidth,this.canvasHeight);
            console.log(this.context.
            getImageData(0,0,100,100));
            const picels=this.context.getImageData(0,0,this.canvasWidth,this.canvasHeight).data;
            for (let y = 0; y < this.canvasHeight; y+=this.gap) {
                for (let x = 0; x < this.canvasWidth; x+=this.gap) {
                    const index=(y*this.canvasWidth+x)*4;
                    const alpha=picels[index+3];
                    if (alpha>0){
                      const red=picels[index];
                      const green=picels[index+1];
                      const blue=picels[index+2];
                      const color='rgb('+red+','+green+','+blue+')';
                      this.particleArray.
                      push(new particle(this,x,y,color,
                      this.x+this.imageWidth/2,this.y+this.imageHeight/2));
                    }
                }
            }this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
      
        }
        solve(){
           
            for (let i = 0; i < this.particleArray.length; i++) {
                this.particleArray[i].update();
                this.particleArray[i].draw();     
                if(this.particleArray[i].size>=0.02){
                    this.particleArray[i].size-=0.013;  
                }else{ this.particleArray.splice(i,1)}            
            }
        }
        solve_start(){
           this.context.fillStyle='rgba(0,0,0,0.1)';
           this.context.fillRect(0,0,this.canvasWidth,this.canvasHeight);
           this.Particle_start.update();
           this.Particle_start.draw(); 
        }
    }
    let startArray=[];
    let link=[];
    let value_fire=parseInt(numberFirework.value);
    let dem=-1;
    let EffectArray=[];
    let EffectArray1=[];
    let startI=0;
    function solve_Start_ph(){
        for (let i = 0; i < EffectArray1.length; i++) {
            if(EffectArray1[i].Particle_start.y-25>EffectArray1[i].Particle_start.textY){
            EffectArray1[i].solve_start();}
        }
    }
    function solve_ph(){
        for (let i = 0; i < EffectArray1.length; i++) {
            if(EffectArray1[i].particleArray.length!=0){
            if(EffectArray1[i].Particle_start.y-25
            <EffectArray1[i].Particle_start.textY){
              EffectArray1[i].solve();  
            }}else{EffectArray1.splice(i,1);i--;}
            
        }
    }
    function animation(){
        ctx.fillStyle='rgba(0,0,0,0.1)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        solve_Start_ph();
        solve_ph();  
       if (dem==startArray.length){
        buttonStart.disabled=false;
        numberFirework.disabled=false;
        inpImage.disabled=false;
        inpText.disabled=false;
        butImage.disabled=false;
        butText.disabled=false;
        canvas.disabled=false;
        cancelAnimationFrame(animation)}
       else{
        if ((EffectArray1.length==0) ){start()} 
        requestAnimationFrame(animation)
       };
    }
    function start(){
        dem++;        
        for (let j = startI; j < startI+startArray[dem]; j++) {
            if(typeof(link[j].inp)=='string'){
            EffectArray[j].wrapText(link[j].inp);   
            EffectArray1.push(EffectArray[j]);   
            }else{
            EffectArray[j].DrawImage(link[j].inp);
            EffectArray1.push(EffectArray[j]);
            }
        }
        startI+=startArray[dem];
    }
    numberFirework.addEventListener('change',(e)=>{
        value_fire=parseInt(numberFirework.value);
        console.log(value_fire);
        startArray.push(value_fire);
      })
    butImage.addEventListener('click',function(){
        if((inpImage.value=='')||(inpX.value=='')||
        (inpY.value=='')||(value_fire==0)){
            alert('Must update enough data');
        }else{
            const image=new Image();
            image.src=inpImage.value;
            const x1=parseInt(inpX.value);
            const y1=parseInt(inpY.value);
            value_fire--;numberFirework.value=value_fire;
            link.push({inp:image,x:x1,y:y1});
            inpImage.value='';
            inpX.value='';
            inpY.value='';
        }
    })
    butText.addEventListener('click',function(){
        if((inpText.value=='')||(inpX.value=='')||
        (inpY.value=='')||(value_fire==0)){
            alert('Must update enough data');
        }else{
            let text=inpText.value;
            const x1=parseInt(inpX.value);
            const y1=parseInt(inpY.value);
            value_fire--;numberFirework.value=value_fire;
            link.push({inp:text,x:x1,y:y1});
            inpText.value='';
            inpX.value='';
            inpY.value='';
        }
    })
    canvas.addEventListener('click',(e)=>{
      inpX.value=e.x;
      inpY.value=e.y;
    })
    buttonStart.addEventListener('click',function(){
        if (value_fire=='0'){
        EffectArray=[];
        for (let i = 0; i <link.length; i++) {
            if(typeof(link[i].inp)=='string'){
                EffectArray.push(new effect1(ctx,canvas.height,
                canvas.width,link[i].x,link[i].y))               
                }
            else{
                EffectArray.push(new effect2(ctx,canvas.height,
                canvas.width,link[i].x,link[i].y));                     
            }}
        if(EffectArray.length!=0){
            buttonStart.disabled=true;
            numberFirework.disabled=true;
            inpImage.disabled=true;
            inpText.disabled=true;
            butImage.disabled=true;
            butText.disabled=true;
            canvas.disabled=true;
            
        };
        dem=-1;
        startI=0;
        animation();}else{alert('Ê phải sài tới số không, không được bỏ mứa')}     
    })
      
})
var t={d:(e,i)=>{for(var r in i)t.o(i,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:i[r]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};function i(t,e,i){let r=t.createShader(i);return t.shaderSource(r,e),t.compileShader(r),t.getShaderParameter(r,t.COMPILE_STATUS)?r:(n("Error compiling shader '"+r+"':"+t.getShaderInfoLog(r)),t.deleteShader(r),null)}function r(t,e){t.activeTexture(t["TEXTURE"+e])}function a(t,e){t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e)}function n(t){console.error(t)}function o(t,e,i,r){this.init(t,e,i,r)}t.d(e,{i8:()=>u,qJ:()=>x,vL:()=>l,lL:()=>R}),o.prototype={canvas:null,gl:null,program:null,width:0,height:0,init(t,e,i,r){this.canvas=t,this.width=t.width,this.height=t.height,this.gl=function(t,e={}){let i=null;return["webgl","experimental-webgl"].some((r=>{try{i=t.getContext(r,e)}catch(t){}return null!=i})),null==i&&document.body.classList.add("no-webgl"),i}(t,e),this.program=this.createProgram(i,r),this.useProgram(this.program)},createProgram(t,e){return function(t,e,r){let a=i(t,e,t.VERTEX_SHADER),o=i(t,r,t.FRAGMENT_SHADER),s=t.createProgram();if(t.attachShader(s,a),t.attachShader(s,o),t.linkProgram(s),!t.getProgramParameter(s,t.LINK_STATUS))return n("Error in program linking: "+t.getProgramInfoLog(s)),t.deleteProgram(s),null;var l=t.getAttribLocation(s,"a_position"),h=t.getAttribLocation(s,"a_texCoord"),p=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,p),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(h),t.vertexAttribPointer(h,2,t.FLOAT,!1,0,0);var u=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,u),t.enableVertexAttribArray(l),t.vertexAttribPointer(l,2,t.FLOAT,!1,0,0),s}(this.gl,t,e)},useProgram(t){this.program=t,this.gl.useProgram(t)},createTexture(t,e){return function(t,e,i){var n=t.createTexture();return r(t,i),t.bindTexture(t.TEXTURE_2D,n),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),null==e||a(t,e),n}(this.gl,t,e)},createUniform(t,e,...i){!function(t,e,i,r,...a){let n=t.getUniformLocation(e,"u_"+r);t["uniform"+i](n,...a)}(this.gl,this.program,t,e,...i)},activeTexture(t){r(this.gl,t)},updateTexture(t){a(this.gl,t)},draw(){var t,e,i;e=-1,i=-1,(t=this.gl).bufferData(t.ARRAY_BUFFER,new Float32Array([e,i,1,i,e,1,e,1,1,i,1,1]),t.STATIC_DRAW),this.gl.drawArrays(this.gl.TRIANGLES,0,6)}};const s=o;function l(t,e){let i=document.createElement("canvas");return i.width=t,i.height=e,i}const h={renderShadow:!1,minRefraction:256,maxRefraction:512,brightness:1,alphaMultiply:20,alphaSubtract:5,parallaxBg:5,parallaxFg:20};function p(t,e,i,r,a=null,n={}){this.canvas=t,this.canvasLiquid=e,this.imageShine=a,this.imageFg=i,this.imageBg=r,this.options=Object.assign({},h,n),this.init()}p.prototype={canvas:null,gl:null,canvasLiquid:null,width:0,height:0,imageShine:"",imageFg:"",imageBg:"",textures:null,programWater:null,programBlurX:null,programBlurY:null,parallaxX:0,parallaxY:0,renderShadow:!1,options:null,init(){this.width=this.canvas.width,this.height=this.canvas.height,this.gl=new s(this.canvas,{alpha:!1},"precision mediump float;\n\nattribute vec2 a_position;\n\nvoid main() {\n   gl_Position = vec4(a_position,0.0,1.0);\n}\n",'precision mediump float;\n\n// textures\nuniform sampler2D u_waterMap;\nuniform sampler2D u_textureShine;\nuniform sampler2D u_textureFg;\nuniform sampler2D u_textureBg;\n\n// the texCoords passed in from the vertex shader.\nvarying vec2 v_texCoord;\nuniform vec2 u_resolution;\nuniform vec2 u_parallax;\nuniform float u_parallaxFg;\nuniform float u_parallaxBg;\nuniform float u_textureRatio;\nuniform bool u_renderShine;\nuniform bool u_renderShadow;\nuniform float u_minRefraction;\nuniform float u_refractionDelta;\nuniform float u_brightness;\nuniform float u_alphaMultiply;\nuniform float u_alphaSubtract;\n\n// alpha-blends two colors\nvec4 blend(vec4 bg,vec4 fg){\n  vec3 bgm=bg.rgb*bg.a;\n  vec3 fgm=fg.rgb*fg.a;\n  float ia=1.0-fg.a;\n  float a=(fg.a + bg.a * ia);\n  vec3 rgb;\n  if(a!=0.0){\n    rgb=(fgm + bgm * ia) / a;\n  }else{\n    rgb=vec3(0.0,0.0,0.0);\n  }\n  return vec4(rgb,a);\n}\n\nvec2 pixel(){\n  return vec2(1.0,1.0)/u_resolution;\n}\n\nvec2 parallax(float v){\n  return u_parallax*pixel()*v;\n}\n\nvec2 texCoord(){\n  return vec2(gl_FragCoord.x, u_resolution.y-gl_FragCoord.y)/u_resolution;\n}\n\n// scales the bg up and proportionally to fill the container\nvec2 scaledTexCoord(){\n  float ratio=u_resolution.x/u_resolution.y;\n  vec2 scale=vec2(1.0,1.0);\n  vec2 offset=vec2(0.0,0.0);\n  float ratioDelta=ratio-u_textureRatio;\n  if(ratioDelta>=0.0){\n    scale.y=(1.0+ratioDelta);\n    offset.y=ratioDelta/2.0;\n  }else{\n    scale.x=(1.0-ratioDelta);\n    offset.x=-ratioDelta/2.0;\n  }\n  return (texCoord()+offset)/scale;\n}\n\n// get color from fg\nvec4 fgColor(float x, float y){\n  float p2=u_parallaxFg*2.0;\n  vec2 scale=vec2(\n    (u_resolution.x+p2)/u_resolution.x,\n    (u_resolution.y+p2)/u_resolution.y\n  );\n\n  vec2 scaledTexCoord=texCoord()/scale;\n  vec2 offset=vec2(\n    (1.0-(1.0/scale.x))/2.0,\n    (1.0-(1.0/scale.y))/2.0\n  );\n\n  return texture2D(u_waterMap,\n    (scaledTexCoord+offset)+(pixel()*vec2(x,y))+parallax(u_parallaxFg)\n  );\n}\n\nvoid main() {\n  vec4 bg=texture2D(u_textureBg,scaledTexCoord()+parallax(u_parallaxBg));\n\n  vec4 cur = fgColor(0.0,0.0);\n\n  float d=cur.b; // "thickness"\n  float x=cur.g;\n  float y=cur.r;\n\n  float a=clamp(cur.a*u_alphaMultiply-u_alphaSubtract, 0.0,1.0);\n\n  vec2 refraction = (vec2(x,y)-0.5)*2.0;\n  vec2 refractionParallax=parallax(u_parallaxBg-u_parallaxFg);\n  vec2 refractionPos = scaledTexCoord()\n    + (pixel()*refraction*(u_minRefraction+(d*u_refractionDelta)))\n    + refractionParallax;\n\n  vec4 tex=texture2D(u_textureFg,refractionPos);\n\n  if(u_renderShine){\n    float maxShine=490.0;\n    float minShine=maxShine*0.18;\n    vec2 shinePos=vec2(0.5,0.5) + ((1.0/512.0)*refraction)* -(minShine+((maxShine-minShine)*d));\n    vec4 shine=texture2D(u_textureShine,shinePos);\n    tex=blend(tex,shine);\n  }\n\n  vec4 fg=vec4(tex.rgb*u_brightness,a);\n\n  if(u_renderShadow){\n    float borderAlpha = fgColor(0.,0.-(d*6.0)).a;\n    borderAlpha=borderAlpha*u_alphaMultiply-(u_alphaSubtract+0.5);\n    borderAlpha=clamp(borderAlpha,0.,1.);\n    borderAlpha*=0.2;\n    vec4 border=vec4(0.,0.,0.,borderAlpha);\n    fg=blend(border,fg);\n  }\n\n  gl_FragColor = blend(bg,fg);\n}\n');let t=this.gl;this.programWater=t.program,t.createUniform("2f","resolution",this.width,this.height),t.createUniform("1f","textureRatio",this.imageBg.width/this.imageBg.height),t.createUniform("1i","renderShine",null!=this.imageShine),t.createUniform("1i","renderShadow",this.options.renderShadow),t.createUniform("1f","minRefraction",this.options.minRefraction),t.createUniform("1f","refractionDelta",this.options.maxRefraction-this.options.minRefraction),t.createUniform("1f","brightness",this.options.brightness),t.createUniform("1f","alphaMultiply",this.options.alphaMultiply),t.createUniform("1f","alphaSubtract",this.options.alphaSubtract),t.createUniform("1f","parallaxBg",this.options.parallaxBg),t.createUniform("1f","parallaxFg",this.options.parallaxFg),t.createTexture(null,0),this.textures=[{name:"textureShine",img:null==this.imageShine?l(2,2):this.imageShine},{name:"textureFg",img:this.imageFg},{name:"textureBg",img:this.imageBg}],this.textures.forEach(((e,i)=>{t.createTexture(e.img,i+1),t.createUniform("1i",e.name,i+1)})),this.draw()},draw(){this.gl.useProgram(this.programWater),this.gl.createUniform("2f","parallax",this.parallaxX,this.parallaxY),this.updateTexture(),this.gl.draw(),requestAnimationFrame(this.draw.bind(this))},updateTextures(){this.textures.forEach(((t,e)=>{this.gl.activeTexture(e+1),this.gl.updateTexture(t.img)}))},updateTexture(){this.gl.activeTexture(0),this.gl.updateTexture(this.canvasLiquid)},resize(){},get overlayTexture(){},set overlayTexture(t){}};const u=p;function c(t=null,e=null,i=null){null==t?(t=0,e=1):null!=t&&null==e&&(e=t,t=0);const r=e-t;return null==i&&(i=t=>t),t+i(Math.random())*r}function d(t){return c()<=t}const m={x:0,y:0,r:0,spreadX:0,spreadY:0,momentum:0,momentumX:0,lastSpawn:0,nextSpawn:0,parent:null,isNew:!0,killed:!1,shrink:0},g={minR:10,maxR:40,maxDrops:900,rainChance:.3,rainLimit:3,dropletsRate:50,dropletsSize:[2,4],dropletsCleaningRadiusMultiplier:.43,raining:!0,globalTimeScale:1,trailRate:1,autoShrink:!0,spawnArea:[-.1,.95],trailScaleRange:[.2,.5],collisionRadius:.65,collisionRadiusIncrease:.01,dropFallMultiplier:1,collisionBoostMultiplier:.05,collisionBoost:1};function f(t,e,i,r,a,n={}){this.width=t,this.height=e,this.scale=i,this.dropAlpha=r,this.dropColor=a,this.options=Object.assign({},g,n),this.init()}f.prototype={dropColor:null,dropAlpha:null,canvas:null,ctx:null,width:0,height:0,scale:0,dropletsPixelDensity:1,droplets:null,dropletsCtx:null,dropletsCounter:0,drops:null,dropsGfx:null,clearDropletsGfx:null,textureCleaningIterations:0,lastRender:null,options:null,init(){this.canvas=l(this.width,this.height),this.ctx=this.canvas.getContext("2d"),this.droplets=l(this.width*this.dropletsPixelDensity,this.height*this.dropletsPixelDensity),this.dropletsCtx=this.droplets.getContext("2d"),this.drops=[],this.dropsGfx=[],this.renderDropsGfx(),this.update()},get deltaR(){return this.options.maxR-this.options.minR},get area(){return this.width*this.height/this.scale},get areaMultiplier(){return Math.sqrt(this.area/786432)},drawDroplet(t,e,i){this.drawDrop(this.dropletsCtx,Object.assign(Object.create(m),{x:t*this.dropletsPixelDensity,y:e*this.dropletsPixelDensity,r:i*this.dropletsPixelDensity}))},renderDropsGfx(){let t=l(64,64),e=t.getContext("2d");this.dropsGfx=Array.apply(null,Array(255)).map(((i,r)=>{let a=l(64,64),n=a.getContext("2d");return e.clearRect(0,0,64,64),e.globalCompositeOperation="source-over",e.drawImage(this.dropColor,0,0,64,64),e.globalCompositeOperation="screen",e.fillStyle="rgba(0,0,"+r+",1)",e.fillRect(0,0,64,64),n.globalCompositeOperation="source-over",n.drawImage(this.dropAlpha,0,0,64,64),n.globalCompositeOperation="source-in",n.drawImage(t,0,0,64,64),a})),this.clearDropletsGfx=l(128,128);let i=this.clearDropletsGfx.getContext("2d");i.fillStyle="#000",i.beginPath(),i.arc(64,64,64,0,2*Math.PI),i.fill()},drawDrop(t,e){if(this.dropsGfx.length>0){let i=e.x,r=e.y,a=e.r,n=e.spreadX,o=e.spreadY,s=1,l=1.5,h=Math.max(0,Math.min(1,(a-this.options.minR)/this.deltaR*.9));h*=1/(.5*(e.spreadX+e.spreadY)+1),t.globalAlpha=1,t.globalCompositeOperation="source-over",h=Math.floor(h*(this.dropsGfx.length-1)),t.drawImage(this.dropsGfx[h],(i-a*s*(n+1))*this.scale,(r-a*l*(o+1))*this.scale,2*a*s*(n+1)*this.scale,2*a*l*(o+1)*this.scale)}},clearDroplets(t,e,i=30){let r=this.dropletsCtx;r.globalCompositeOperation="destination-out",r.drawImage(this.clearDropletsGfx,(t-i)*this.dropletsPixelDensity*this.scale,(e-i)*this.dropletsPixelDensity*this.scale,2*i*this.dropletsPixelDensity*this.scale,2*i*this.dropletsPixelDensity*this.scale*1.5)},clearCanvas(){this.ctx.clearRect(0,0,this.width,this.height)},createDrop(t){return this.drops.length>=this.options.maxDrops*this.areaMultiplier?null:Object.assign(Object.create(m),t)},addDrop(t){return!(this.drops.length>=this.options.maxDrops*this.areaMultiplier||null==t||(this.drops.push(t),0))},updateRain(t){let e=[];if(this.options.raining){let i=this.options.rainLimit*t*this.areaMultiplier,r=0;for(;d(this.options.rainChance*t*this.areaMultiplier)&&r<i;){r++;let t=c(this.options.minR,this.options.maxR,(t=>Math.pow(t,3))),i=this.createDrop({x:c(this.width/this.scale),y:c(this.height/this.scale*this.options.spawnArea[0],this.height/this.scale*this.options.spawnArea[1]),r:t,momentum:1+.1*(t-this.options.minR)+c(2),spreadX:1.5,spreadY:1.5});null!=i&&e.push(i)}}return e},clearDrops(){this.drops.forEach((t=>{setTimeout((()=>{t.shrink=.1+c(.5)}),c(1200))})),this.clearTexture()},clearTexture(){this.textureCleaningIterations=50},updateDroplets(t){this.textureCleaningIterations>0&&(this.textureCleaningIterations-=1*t,this.dropletsCtx.globalCompositeOperation="destination-out",this.dropletsCtx.fillStyle="rgba(0,0,0,"+.05*t+")",this.dropletsCtx.fillRect(0,0,this.width*this.dropletsPixelDensity,this.height*this.dropletsPixelDensity)),this.options.raining&&(this.dropletsCounter+=this.options.dropletsRate*t*this.areaMultiplier,function(t,e){for(let i=0;i<t;i++)e.call(this,i)}(this.dropletsCounter,(t=>{this.dropletsCounter--,this.drawDroplet(c(this.width/this.scale),c(this.height/this.scale),c(...this.options.dropletsSize,(t=>t*t)))}))),this.ctx.drawImage(this.droplets,0,0,this.width,this.height)},updateDrops(t){let e=[];this.updateDroplets(t);let i=this.updateRain(t);e=e.concat(i),this.drops.sort(((t,e)=>{let i=t.y*(this.width/this.scale)+t.x,r=e.y*(this.width/this.scale)+e.x;return i>r?1:i==r?0:-1})),this.drops.forEach((function(i,r){if(!i.killed){if(d((i.r-this.options.minR*this.options.dropFallMultiplier)*(.1/this.deltaR)*t)&&(i.momentum+=c(i.r/this.options.maxR*4)),this.options.autoShrink&&i.r<=this.options.minR&&d(.05*t)&&(i.shrink+=.01),i.r-=i.shrink*t,i.r<=0&&(i.killed=!0),this.options.raining&&(i.lastSpawn+=i.momentum*t*this.options.trailRate,i.lastSpawn>i.nextSpawn)){let r=this.createDrop({x:i.x+.1*c(-i.r,i.r),y:i.y-.01*i.r,r:i.r*c(...this.options.trailScaleRange),spreadY:.1*i.momentum,parent:i});null!=r&&(e.push(r),i.r*=Math.pow(.97,t),i.lastSpawn=0,i.nextSpawn=c(this.options.minR,this.options.maxR)-2*i.momentum*this.options.trailRate+(this.options.maxR-i.r))}i.spreadX*=Math.pow(.4,t),i.spreadY*=Math.pow(.7,t);let a=i.momentum>0;a&&!i.killed&&(i.y+=i.momentum*this.options.globalTimeScale,i.x+=i.momentumX*this.options.globalTimeScale,i.y>this.height/this.scale+i.r&&(i.killed=!0));let n=(a||i.isNew)&&!i.killed;i.isNew=!1,n&&this.drops.slice(r+1,r+70).forEach((e=>{if(i!=e&&i.r>e.r&&i.parent!=e&&e.parent!=i&&!e.killed){let r=e.x-i.x,a=e.y-i.y;if(Math.sqrt(r*r+a*a)<(i.r+e.r)*(this.options.collisionRadius+i.momentum*this.options.collisionRadiusIncrease*t)){let t=Math.PI,a=i.r,n=e.r,o=t*(a*a),s=t*(n*n),l=Math.sqrt((o+.8*s)/t);l>this.maxR&&(l=this.maxR),i.r=l,i.momentumX+=.1*r,i.spreadX=0,i.spreadY=0,e.killed=!0,i.momentum=Math.max(e.momentum,Math.min(40,i.momentum+l*this.options.collisionBoostMultiplier+this.options.collisionBoost))}}})),i.momentum-=.1*Math.max(1,.5*this.options.minR-i.momentum)*t,i.momentum<0&&(i.momentum=0),i.momentumX*=Math.pow(.7,t),i.killed||(e.push(i),a&&this.options.dropletsRate>0&&this.clearDroplets(i.x,i.y,i.r*this.options.dropletsCleaningRadiusMultiplier),this.drawDrop(this.ctx,i))}}),this),this.drops=e},update(){this.clearCanvas();let t=Date.now();null==this.lastRender&&(this.lastRender=t);let e=(t-this.lastRender)/(1/60*1e3);e>1.1&&(e=1.1),e*=this.options.globalTimeScale,this.lastRender=t,this.updateDrops(e),requestAnimationFrame(this.update.bind(this))}};const x=f;function R(t,e){return new Promise(((i,r)=>{(function(t,e){return Promise.all(t.map(((t,i)=>function(t,e,i){return new Promise(((r,a)=>{"string"==typeof t&&(t={name:"image"+e,src:t});let n=new Image;t.img=n,n.addEventListener("load",(a=>{"function"==typeof i&&i.call(null,n,e),r(t)})),n.src=t.src}))}(t,i,e))))})(t,e).then((t=>{let e={};t.forEach((t=>{e[t.name]={img:t.img,src:t.src}})),i(e)}))}))}var v=e.i8,b=e.qJ,_=e.vL,w=e.lL;export{v as RainRenderer,b as Raindrops,_ as createCanvas,w as loadImages};
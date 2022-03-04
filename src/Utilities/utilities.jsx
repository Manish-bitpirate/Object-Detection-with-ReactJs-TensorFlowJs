export const drawRect = (detections, ctx) =>{
  //to loop through each detectObj
  detections.forEach(detectObj => {

    //to extract boxes and classes
    const [x, y, width, height] = detectObj['bbox']; 
    const text = detectObj['class']; 

    //to set styling
    const color = 'Yellow'
    ctx.strokeStyle = color
    ctx.font = '18px Arial';
    ctx.fillStyle =  color

    //to draw rectangles and text
    ctx.beginPath();   
    ctx.fillText(text, x, y);
    ctx.rect(x, y, width, height); 
    ctx.stroke();
  });
}
// export const throttleWheelEvent = function(event, start, delay, handleWheel) {
//   const end = Date.now();
//   console.log(end - start);
//   debugger
//   if (end - start > delay) { // only handle the event that's fired after a specified delay.
//     handleWheel(event); // pass in event object to handler callback
//     return;
//   }
//   return; //otherwise, specified delay hasn't completely elapsed so do nothing.
//   // const start = Date.now(); // get the time when user first touch the mousepad.
//   // return function(e) { // need argument to capture event objects.
// };

export const throttleWheelEvent = function(start, delay, handleWheel) {
  
}
